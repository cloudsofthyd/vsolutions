// Lightweight signed-cookie sessions for Phase 2 dashboards.
// Two completely separate session domains: admin (User table) and client (ClientUser table).
// Replaced by Auth.js v5 in Phase 8.

import "server-only";
import { cookies, headers } from "next/headers";
import crypto from "node:crypto";
import { prisma } from "@vsi/db";
import { verifyArgon2, hashPassword, verifyWpPassword, detectAlgo } from "@vsi/auth";

const ADMIN_COOKIE = "vsi_admin_sid";
const CLIENT_COOKIE = "vsi_client_sid";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function secret(): string {
  return process.env.SESSION_SECRET || "dev-secret-change-in-prod-min-32-chars-please";
}

function sign(value: string): string {
  return crypto.createHmac("sha256", secret()).update(value).digest("base64url");
}

function pack(userId: string, role: string): string {
  const payload = `${userId}.${role}.${Date.now()}`;
  const sig = sign(payload);
  return `${payload}.${sig}`;
}

function unpack(cookieValue: string): { userId: string; role: string; issuedAt: number } | null {
  const parts = cookieValue.split(".");
  if (parts.length !== 4) return null;
  const [userId, role, issuedAtStr, sig] = parts;
  const expected = sign(`${userId}.${role}.${issuedAtStr}`);
  if (sig !== expected) return null;
  const issuedAt = Number(issuedAtStr);
  if (!issuedAt || Date.now() - issuedAt > COOKIE_MAX_AGE * 1000) return null;
  return { userId, role, issuedAt };
}

// ─────────────────────────────────────────────
// ADMIN
// ─────────────────────────────────────────────

export type AdminSession = {
  id: string;
  email: string;
  displayName: string;
  role: string;
};

export async function setAdminCookie(userId: string, role: string) {
  const jar = await cookies();
  jar.set(ADMIN_COOKIE, pack(userId, role), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
}

export async function clearAdminCookie() {
  const jar = await cookies();
  jar.delete(ADMIN_COOKIE);
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const jar = await cookies();
  const raw = jar.get(ADMIN_COOKIE)?.value;
  if (!raw) return null;
  const parsed = unpack(raw);
  if (!parsed) return null;
  const user = await prisma.user.findUnique({
    where: { id: parsed.userId },
    select: { id: true, email: true, displayName: true, role: true, suspendedAt: true, deletedAt: true },
  });
  if (!user || user.suspendedAt || user.deletedAt) return null;
  return { id: user.id, email: user.email, displayName: user.displayName, role: user.role };
}

export async function loginAdmin(
  email: string,
  password: string,
): Promise<{ ok: true; session: AdminSession } | { ok: false; error: string }> {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    select: {
      id: true,
      email: true,
      displayName: true,
      role: true,
      passwordHash: true,
      passwordHashLegacy: true,
      passwordAlgo: true,
      suspendedAt: true,
      deletedAt: true,
    },
  });
  if (!user || user.suspendedAt || user.deletedAt) {
    return { ok: false, error: "Invalid email or password." };
  }

  // Try modern argon2 first
  let ok = false;
  let upgraded = false;
  if (user.passwordHash) {
    ok = await verifyArgon2(password, user.passwordHash);
  }

  // Fall back to legacy WP hash (phpass / wp_bcrypt / bare bcrypt) and upgrade silently
  if (!ok && user.passwordHashLegacy) {
    ok = await verifyWpPassword(password, user.passwordHashLegacy);
    if (ok) {
      const newHash = await hashPassword(password);
      await prisma.user.update({
        where: { id: user.id },
        data: {
          passwordHash: newHash,
          passwordHashLegacy: null,
          passwordAlgo: "argon2id",
          passwordSetAt: new Date(),
        },
      });
      await prisma.authEvent.create({
        data: {
          type: detectAlgo(user.passwordHashLegacy) === "phpass" ? "phpass_upgrade" : "wp_bcrypt_upgrade",
          userId: user.id,
          metadata: { fromAlgo: user.passwordAlgo },
        },
      });
      upgraded = true;
    }
  }

  if (!ok) return { ok: false, error: "Invalid email or password." };

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0] ?? null;
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date(), lastLoginIp: ip, failedLoginCount: 0 },
  });
  await prisma.authEvent.create({
    data: {
      type: "login_ok",
      userId: user.id,
      ip,
      metadata: { upgraded },
    },
  });
  await setAdminCookie(user.id, user.role);
  return {
    ok: true,
    session: { id: user.id, email: user.email, displayName: user.displayName, role: user.role },
  };
}

// ─────────────────────────────────────────────
// CLIENT (portal users)
// ─────────────────────────────────────────────

export type ClientSession = {
  id: string;
  email: string;
  firstName: string;
  lastName: string | null;
  role: string;
  clientId: string;
  clientName: string;
  clientSlug: string;
  brandColor: string | null;
};

export async function setClientCookie(clientUserId: string, role: string) {
  const jar = await cookies();
  jar.set(CLIENT_COOKIE, pack(clientUserId, role), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
}

export async function clearClientCookie() {
  const jar = await cookies();
  jar.delete(CLIENT_COOKIE);
}

export async function getClientSession(): Promise<ClientSession | null> {
  const jar = await cookies();
  const raw = jar.get(CLIENT_COOKIE)?.value;
  if (!raw) return null;
  const parsed = unpack(raw);
  if (!parsed) return null;
  const cu = await prisma.clientUser.findUnique({
    where: { id: parsed.userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      suspendedAt: true,
      deletedAt: true,
      client: { select: { id: true, companyName: true, slug: true, brandColor: true, status: true } },
    },
  });
  if (!cu || cu.suspendedAt || cu.deletedAt) return null;
  if (cu.client.status === "ARCHIVED") return null;
  return {
    id: cu.id,
    email: cu.email,
    firstName: cu.firstName,
    lastName: cu.lastName,
    role: cu.role,
    clientId: cu.client.id,
    clientName: cu.client.companyName,
    clientSlug: cu.client.slug,
    brandColor: cu.client.brandColor,
  };
}

export async function loginClient(
  email: string,
  password: string,
): Promise<{ ok: true; session: ClientSession } | { ok: false; error: string }> {
  const cu = await prisma.clientUser.findUnique({
    where: { email: email.toLowerCase() },
    include: { client: true },
  });
  if (!cu || cu.suspendedAt || cu.deletedAt || cu.client.status === "ARCHIVED") {
    return { ok: false, error: "Invalid email or password." };
  }
  if (!cu.passwordHash) {
    // Pending invitation acceptance
    return { ok: false, error: "Please check your email for the invitation link." };
  }
  const ok = await verifyArgon2(password, cu.passwordHash);
  if (!ok) return { ok: false, error: "Invalid email or password." };
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0] ?? null;
  await prisma.clientUser.update({
    where: { id: cu.id },
    data: { lastLoginAt: new Date(), lastLoginIp: ip, failedLoginCount: 0 },
  });
  await setClientCookie(cu.id, cu.role);
  return {
    ok: true,
    session: {
      id: cu.id,
      email: cu.email,
      firstName: cu.firstName,
      lastName: cu.lastName,
      role: cu.role,
      clientId: cu.client.id,
      clientName: cu.client.companyName,
      clientSlug: cu.client.slug,
      brandColor: cu.client.brandColor,
    },
  };
}

// ─────────────────────────────────────────────
// Guards (use in Server Components / route handlers)
// ─────────────────────────────────────────────

import { redirect } from "next/navigation";

export async function requireAdmin(nextUrl?: string): Promise<AdminSession> {
  const s = await getAdminSession();
  if (!s) {
    const next = nextUrl ? `?next=${encodeURIComponent(nextUrl)}` : "";
    redirect(`/portal/login/${next}${next ? "&" : "?"}admin=1`);
  }
  return s;
}

export async function requireClient(nextUrl?: string): Promise<ClientSession> {
  const s = await getClientSession();
  if (!s) {
    const next = nextUrl ? `?next=${encodeURIComponent(nextUrl)}` : "";
    redirect(`/portal/login/${next}`);
  }
  return s;
}
