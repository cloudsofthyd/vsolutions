// Contact form endpoint.
//   1. Validate + sanitize input (zod)
//   2. Persist to DB (always)
//   3. Send notification email to info@vsolutionsinc.com via Resend (if RESEND_API_KEY set)
//   4. Send autoresponder to the submitter (if RESEND_API_KEY set)
// If no email provider is configured, submissions still land in the DB and
// show up in the admin /admin/contact-submissions/ inbox (M2). EmailLog records
// every send attempt for traceability.

import { NextResponse } from "next/server";
import { prisma } from "@vsi/db";
import { z } from "zod";

const Schema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(160),
  // Message is optional — keep length cap for spam/DB safety.
  message: z.string().max(5000).optional().or(z.literal("")),
  // Optional contact details
  phone: z.string().max(40).optional().or(z.literal("")),
  company: z.string().max(160).optional().or(z.literal("")),
  service: z.string().max(80).optional().or(z.literal("")),
  // Honeypot — bots fill any "website" field, humans don't see it.
  website: z.string().max(200).optional().or(z.literal("")),
});

// Contact submissions notify both the general inbox and the admin inbox.
// Resend's `to` array supports up to 50 recipients in a single send.
const NOTIFY_TO = ["info@vsolutionsinc.com", "admin@vsolutionsinc.com"];
const FROM_DEFAULT = "V Solutions Inc <hello@vsolutionsinc.com>";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

interface NotificationContext {
  name: string;
  email: string;
  message: string;
  phone?: string;
  company?: string;
  service?: string;
  ip: string | null;
}

function buildAdminEmail(c: NotificationContext) {
  const subject = `New contact from ${c.name}${c.company ? ` (${c.company})` : ""}`;
  const text = [
    `New message from the V Solutions website contact form.`,
    ``,
    `Name:    ${c.name}`,
    `Email:   ${c.email}`,
    c.phone ? `Phone:   ${c.phone}` : null,
    c.company ? `Company: ${c.company}` : null,
    c.service ? `Service: ${c.service}` : null,
    ``,
    `Message:`,
    c.message,
    ``,
    `---`,
    `IP: ${c.ip ?? "unknown"}`,
  ]
    .filter(Boolean)
    .join("\n");

  const html = `<!doctype html><html><body style="font-family:system-ui,-apple-system,sans-serif;background:#F4F8FF;padding:24px;color:#0E1B3A">
<div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;padding:32px;box-shadow:0 4px 16px rgba(14,27,58,.06)">
  <h2 style="margin:0 0 8px;color:#F2295B;font-size:14px;letter-spacing:.05em;text-transform:uppercase">— New contact submission</h2>
  <h1 style="margin:0 0 24px;font-size:22px">${escapeHtml(c.name)} just sent a message</h1>
  <table style="width:100%;border-collapse:collapse;font-size:14px;line-height:1.6">
    <tr><td style="padding:6px 0;width:96px;color:#64748B">Name</td><td style="padding:6px 0"><strong>${escapeHtml(c.name)}</strong></td></tr>
    <tr><td style="padding:6px 0;color:#64748B">Email</td><td style="padding:6px 0"><a href="mailto:${escapeHtml(c.email)}" style="color:#D11947">${escapeHtml(c.email)}</a></td></tr>
    ${c.phone ? `<tr><td style="padding:6px 0;color:#64748B">Phone</td><td style="padding:6px 0">${escapeHtml(c.phone)}</td></tr>` : ""}
    ${c.company ? `<tr><td style="padding:6px 0;color:#64748B">Company</td><td style="padding:6px 0">${escapeHtml(c.company)}</td></tr>` : ""}
    ${c.service ? `<tr><td style="padding:6px 0;color:#64748B">Service</td><td style="padding:6px 0">${escapeHtml(c.service)}</td></tr>` : ""}
  </table>
  <hr style="border:none;border-top:1px solid #E2E8F0;margin:24px 0">
  <p style="white-space:pre-wrap;margin:0;line-height:1.7">${escapeHtml(c.message)}</p>
  <hr style="border:none;border-top:1px solid #E2E8F0;margin:24px 0">
  <p style="font-size:12px;color:#94A3B8;margin:0">IP: ${escapeHtml(c.ip ?? "unknown")} · Submitted via /contact/</p>
</div>
</body></html>`;

  return { subject, text, html };
}

function buildAutoresponder(c: NotificationContext) {
  return {
    subject: "We got your message — V Solutions Inc",
    text: `Hi ${c.name},\n\nThanks for reaching out to V Solutions Inc. We've received your message and a real human from our team will get back to you within one business day.\n\nIn the meantime, feel free to explore our work at https://vsolutionsinc.com/case-study/.\n\n— The V Solutions Team\n\n100 West Big Beaver Rd, Troy, MI 48084 · 248-232-8488\nReliance Cyber Ville, Madhapur, Hyderabad 500081`,
    html: `<!doctype html><html><body style="font-family:system-ui,-apple-system,sans-serif;background:#F4F8FF;padding:24px;color:#0E1B3A">
<div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;padding:32px;box-shadow:0 4px 16px rgba(14,27,58,.06)">
  <p style="margin:0 0 12px;color:#64748B;font-size:14px;letter-spacing:.04em;text-transform:uppercase">— V Solutions Inc</p>
  <h1 style="margin:0 0 16px;font-size:22px">Thanks, ${escapeHtml(c.name)}.</h1>
  <p style="margin:0 0 16px;line-height:1.7">We've received your message and a real human from our team will get back to you within <strong>one business day</strong>.</p>
  <p style="margin:0 0 24px;line-height:1.7">In the meantime, feel free to explore our recent <a href="https://vsolutionsinc.com/case-study/" style="color:#D11947">case studies</a>.</p>
  <p style="margin:0;color:#64748B;font-size:13px;line-height:1.6">— The V Solutions Team<br>100 West Big Beaver Rd, Troy, MI 48084 · 248-232-8488<br>Reliance Cyber Ville, Madhapur, Hyderabad 500081</p>
</div>
</body></html>`,
  };
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
  return { sent: true, providerId: j.id ?? null, error: null as string | null };
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
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }
  // Honeypot: silently accept but do nothing visible. Don't tip off the bot.
  if (parsed.data.website && parsed.data.website.trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    null;
  const userAgent = req.headers.get("user-agent") || null;

  const messageText = (parsed.data.message || "").trim();
  const sub = await prisma.contactSubmission.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      company: parsed.data.company || null,
      service: parsed.data.service || null,
      // DB column is non-null; store empty string when omitted.
      message: messageText,
      ip,
      userAgent,
    },
  });

  // Fire-and-log emails. We don't await sequentially in a way that delays the
  // user response unreasonably — Resend typically <1s, so it's worth waiting
  // so the success state in the UI is honest.
  const ctx: NotificationContext = {
    name: parsed.data.name,
    email: parsed.data.email,
    message: messageText || "(no message provided)",
    phone: parsed.data.phone || undefined,
    company: parsed.data.company || undefined,
    service: parsed.data.service || undefined,
    ip,
  };
  const adminMail = buildAdminEmail(ctx);
  const autoMail = buildAutoresponder(ctx);

  const [adminResult, autoResult] = await Promise.all([
    sendViaResend(NOTIFY_TO, adminMail.subject, adminMail.html, adminMail.text),
    sendViaResend(parsed.data.email, autoMail.subject, autoMail.html, autoMail.text),
  ]);

  const from = process.env.EMAIL_FROM || FROM_DEFAULT;
  await prisma.emailLog.createMany({
    data: [
      {
        // EmailLog.to is a single string column — record the joined recipient list.
        to: NOTIFY_TO.join(", "),
        from,
        subject: adminMail.subject,
        templateName: "contact_admin_notify",
        status: adminResult.sent ? "SENT" : adminResult.error === "no_api_key" ? "QUEUED" : "FAILED",
        providerId: adminResult.providerId,
        errorMessage: adminResult.error === "no_api_key" ? "RESEND_API_KEY not set — submission stored only" : adminResult.error,
        metadata: { submissionId: sub.id },
        sentAt: adminResult.sent ? new Date() : null,
      },
      {
        to: parsed.data.email,
        from,
        subject: autoMail.subject,
        templateName: "contact_autoresponder",
        status: autoResult.sent ? "SENT" : autoResult.error === "no_api_key" ? "QUEUED" : "FAILED",
        providerId: autoResult.providerId,
        errorMessage: autoResult.error === "no_api_key" ? "RESEND_API_KEY not set — submission stored only" : autoResult.error,
        metadata: { submissionId: sub.id },
        sentAt: autoResult.sent ? new Date() : null,
      },
    ],
  });

  return NextResponse.json({
    ok: true,
    id: sub.id,
    emailDispatched: adminResult.sent,
  });
}
