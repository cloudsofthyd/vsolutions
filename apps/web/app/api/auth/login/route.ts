import { NextRequest, NextResponse } from "next/server";
import { loginAdmin, loginClient } from "@/lib/session";

/**
 * Build a request-origin URL for redirects. We derive the host from the
 * incoming `Host` / `X-Forwarded-*` headers rather than `req.url`, because
 * Next.js normalizes `req.url` to the server's bind hostname (e.g. localhost)
 * even when the client connected via a public hostname/IP. Without this,
 * redirects after login would send the browser to localhost.
 */
function originFor(req: NextRequest): string {
  const fwdHost = req.headers.get("x-forwarded-host");
  const host = fwdHost || req.headers.get("host") || new URL(req.url).host;
  const fwdProto = req.headers.get("x-forwarded-proto");
  const proto = fwdProto || new URL(req.url).protocol.replace(":", "");
  return `${proto}://${host}`;
}

export async function POST(req: NextRequest) {
  let email: string | null = null;
  let password: string | null = null;
  let mode: "admin" | "client" = "client";
  let next = "/portal/dashboard/";

  const ct = req.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    const body = await req.json();
    email = body.email;
    password = body.password;
    mode = body.mode === "admin" ? "admin" : "client";
    next = typeof body.next === "string" ? body.next : "/portal/dashboard/";
  } else {
    const fd = await req.formData();
    email = String(fd.get("email") || "");
    password = String(fd.get("password") || "");
    mode = fd.get("mode") === "admin" ? "admin" : "client";
    next = String(fd.get("next") || "/portal/dashboard/");
  }

  if (!email || !password) {
    return redirectBack(req, "Email and password are required.", mode, next);
  }

  const result = mode === "admin" ? await loginAdmin(email, password) : await loginClient(email, password);

  if (!result.ok) {
    return redirectBack(req, result.error, mode, next);
  }

  const safeNext =
    next.startsWith("/") && !next.startsWith("//")
      ? next
      : mode === "admin"
        ? "/admin/"
        : "/portal/dashboard/";
  return NextResponse.redirect(`${originFor(req)}${safeNext}`, 303);
}

function redirectBack(req: NextRequest, msg: string, mode: "admin" | "client", next: string) {
  const u = new URL("/portal/login/", originFor(req));
  u.searchParams.set("error", msg);
  if (mode === "admin") u.searchParams.set("admin", "1");
  if (next) u.searchParams.set("next", next);
  return NextResponse.redirect(u, 303);
}
