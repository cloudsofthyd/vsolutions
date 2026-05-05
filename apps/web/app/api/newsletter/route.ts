// Newsletter signup endpoint.
//   1. Validate email
//   2. Upsert subscriber (idempotent — re-subscribing succeeds quietly)
//   3. Send confirmation email to subscriber via Resend (if RESEND_API_KEY set)
//   4. Notify admin@vsolutionsinc.com of the new subscriber
// Submissions always land in the DB; emails are best-effort.

import { NextResponse } from "next/server";
import { prisma } from "@vsi/db";
import { z } from "zod";

const Schema = z.object({
  email: z.string().email().max(160),
  name: z.string().max(120).optional().or(z.literal("")),
  source: z.string().max(40).optional().or(z.literal("")),
  // Honeypot
  website: z.string().max(200).optional().or(z.literal("")),
});

const NOTIFY_ADMIN = ["admin@vsolutionsinc.com", "info@vsolutionsinc.com"];
const FROM_DEFAULT = "V Solutions Inc <hello@vsolutionsinc.com>";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function sendViaResend(
  to: string | string[],
  subject: string,
  html: string,
  text: string,
) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { sent: false, providerId: null, error: "no_api_key" as const };
  const from = process.env.EMAIL_FROM || FROM_DEFAULT;
  const recipients = Array.isArray(to) ? to : [to];

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to: recipients, subject, html, text }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    return { sent: false, providerId: null, error: detail.slice(0, 400) };
  }
  const j = (await res.json()) as { id?: string };
  return { sent: true, providerId: j.id ?? null, error: null };
}

function welcomeEmail(email: string, name?: string) {
  const greeting = name ? `Hi ${name},` : "Hi there,";
  return {
    subject: "Welcome to V Solutions Inc",
    text: `${greeting}\n\nThanks for subscribing to V Solutions Inc updates. You'll get monthly insights on AI, cloud, DevOps, and digital growth — no spam, no fluff.\n\nMeanwhile, browse our latest case studies: https://vsolutionsinc.com/case-study/\n\n— The V Solutions Team\n100 West Big Beaver Rd, Troy, MI 48084 · 248-232-8488\n\nTo stop receiving these, reply with "unsubscribe".`,
    html: `<!doctype html><html><body style="font-family:system-ui,-apple-system,sans-serif;background:#F4F8FF;padding:24px;color:#0E1B3A;margin:0">
<div style="max-width:560px;margin:0 auto;background:#fff;border-radius:18px;padding:36px 32px;box-shadow:0 4px 20px rgba(14,27,58,.07),0 0 0 1px rgba(63,184,212,.12)">
  <p style="margin:0 0 12px;color:#1A4D8C;font-size:13px;letter-spacing:.14em;text-transform:uppercase;font-weight:700">— Welcome aboard</p>
  <h1 style="margin:0 0 18px;font-size:26px;letter-spacing:-.018em;color:#0E2C66">${escapeHtml(greeting)}</h1>
  <p style="margin:0 0 16px;line-height:1.7">Thanks for subscribing to <strong>V Solutions Inc</strong> updates. You'll get monthly insights on AI, cloud, DevOps, cybersecurity, and digital growth — no spam, no fluff, ~10 minutes to read.</p>
  <p style="margin:0 0 28px;line-height:1.7">In the meantime, dive into our most recent <a href="https://vsolutionsinc.com/case-study/" style="color:#1A4D8C;font-weight:600;text-decoration:underline">case studies</a> or browse the <a href="https://vsolutionsinc.com/blog-insights/" style="color:#1A4D8C;font-weight:600;text-decoration:underline">blog</a>.</p>
  <a href="https://vsolutionsinc.com/" style="display:inline-block;padding:12px 22px;background:linear-gradient(135deg,#0E2C66,#1A4D8C 55%,#3FB8D4);color:#fff;text-decoration:none;border-radius:10px;font-weight:600;font-size:14px;letter-spacing:.01em;box-shadow:0 8px 24px -8px rgba(30,136,184,.5)">Visit vsolutionsinc.com →</a>
  <hr style="border:none;border-top:1px solid #E2E8F0;margin:32px 0 20px">
  <p style="margin:0;color:#64748B;font-size:12px;line-height:1.6">— The V Solutions Team<br>100 West Big Beaver Rd, Troy, MI 48084 · 248-232-8488<br>To stop receiving these, simply reply with "unsubscribe".</p>
</div>
</body></html>`,
  };
}

function adminNotifyEmail(email: string, name: string | null, source: string | null, ip: string | null) {
  return {
    subject: `New newsletter signup: ${email}`,
    text: `New subscriber on vsolutionsinc.com\n\nEmail:  ${email}\nName:   ${name ?? "(not provided)"}\nSource: ${source ?? "unknown"}\nIP:     ${ip ?? "unknown"}\nTime:   ${new Date().toISOString()}`,
    html: `<!doctype html><html><body style="font-family:system-ui,-apple-system,sans-serif;background:#F4F8FF;padding:24px;color:#0E1B3A;margin:0">
<div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;padding:30px;box-shadow:0 4px 16px rgba(14,27,58,.06),0 0 0 1px rgba(63,184,212,.12)">
  <p style="margin:0 0 8px;color:#1A4D8C;font-size:13px;letter-spacing:.14em;text-transform:uppercase;font-weight:700">— New subscriber</p>
  <h1 style="margin:0 0 22px;font-size:20px;color:#0E2C66">${escapeHtml(email)} just subscribed</h1>
  <table style="width:100%;border-collapse:collapse;font-size:14px;line-height:1.6">
    <tr><td style="padding:6px 0;width:90px;color:#64748B">Email</td><td><a href="mailto:${escapeHtml(email)}" style="color:#1A4D8C;text-decoration:underline">${escapeHtml(email)}</a></td></tr>
    ${name ? `<tr><td style="padding:6px 0;color:#64748B">Name</td><td><strong>${escapeHtml(name)}</strong></td></tr>` : ""}
    <tr><td style="padding:6px 0;color:#64748B">Source</td><td>${escapeHtml(source ?? "unknown")}</td></tr>
    <tr><td style="padding:6px 0;color:#64748B">IP</td><td style="font-family:monospace;font-size:13px;color:#64748B">${escapeHtml(ip ?? "unknown")}</td></tr>
  </table>
</div>
</body></html>`,
  };
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.flatten() }, { status: 400 });
  }
  // Honeypot — silently accept
  if (parsed.data.website && parsed.data.website.trim().length > 0) {
    return NextResponse.json({ ok: true, alreadySubscribed: true });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    null;
  const userAgent = req.headers.get("user-agent") || null;
  const email = parsed.data.email.toLowerCase().trim();
  const name = parsed.data.name?.trim() || null;
  const source = parsed.data.source?.trim() || "footer";

  // Idempotent upsert — re-subscribing flips status back to CONFIRMED.
  const existing = await prisma.newsletterSubscriber.findUnique({ where: { email } });
  const alreadySubscribed = existing?.status === "CONFIRMED";

  await prisma.newsletterSubscriber.upsert({
    where: { email },
    create: { email, name, source, ip, userAgent, status: "CONFIRMED" },
    update: { name: name ?? existing?.name, status: "CONFIRMED", unsubscribedAt: null },
  });

  // Skip emails on duplicate confirmed signup — still return success to user
  if (!alreadySubscribed) {
    const welcome = welcomeEmail(email, name ?? undefined);
    const notify = adminNotifyEmail(email, name, source, ip);
    const [welcomeRes, notifyRes] = await Promise.all([
      sendViaResend(email, welcome.subject, welcome.html, welcome.text),
      sendViaResend(NOTIFY_ADMIN, notify.subject, notify.html, notify.text),
    ]);
    const from = process.env.EMAIL_FROM || FROM_DEFAULT;
    await prisma.emailLog.createMany({
      data: [
        {
          to: email,
          from,
          subject: welcome.subject,
          templateName: "newsletter_welcome",
          status: welcomeRes.sent ? "SENT" : welcomeRes.error === "no_api_key" ? "QUEUED" : "FAILED",
          providerId: welcomeRes.providerId,
          errorMessage: welcomeRes.error === "no_api_key" ? "RESEND_API_KEY not set" : welcomeRes.error,
          metadata: { email, source },
          sentAt: welcomeRes.sent ? new Date() : null,
        },
        {
          to: NOTIFY_ADMIN.join(", "),
          from,
          subject: notify.subject,
          templateName: "newsletter_admin_notify",
          status: notifyRes.sent ? "SENT" : notifyRes.error === "no_api_key" ? "QUEUED" : "FAILED",
          providerId: notifyRes.providerId,
          errorMessage: notifyRes.error === "no_api_key" ? "RESEND_API_KEY not set" : notifyRes.error,
          metadata: { email, source },
          sentAt: notifyRes.sent ? new Date() : null,
        },
      ],
    });
  }

  return NextResponse.json({ ok: true, alreadySubscribed });
}
