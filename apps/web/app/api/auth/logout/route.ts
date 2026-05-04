import { NextRequest, NextResponse } from "next/server";
import { clearAdminCookie, clearClientCookie } from "@/lib/session";

function originFor(req: NextRequest): string {
  const fwdHost = req.headers.get("x-forwarded-host");
  const host = fwdHost || req.headers.get("host") || new URL(req.url).host;
  const fwdProto = req.headers.get("x-forwarded-proto");
  const proto = fwdProto || new URL(req.url).protocol.replace(":", "");
  return `${proto}://${host}`;
}

export async function POST(req: NextRequest) {
  await clearAdminCookie();
  await clearClientCookie();
  return NextResponse.redirect(`${originFor(req)}/portal/login/`, 303);
}

export const GET = POST;
