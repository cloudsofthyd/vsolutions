// WordPress password verification — supports both legacy phpass ($P$/$H$) and
// WordPress 6.8+ wp_bcrypt ($wp$2y$...) which is HMAC-SHA384(secret=KEY) → base64 → bcrypt.
// We always rehash to argon2id on success. Timing-safe compare throughout.

import crypto from "node:crypto";
import bcrypt from "bcryptjs";

const ITOA64 =
  "./0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

function phpassEncode64(input: Buffer, count: number): string {
  let output = "";
  let i = 0;
  do {
    let value = input[i++];
    output += ITOA64[value & 0x3f];
    if (i < count) value |= input[i] << 8;
    output += ITOA64[(value >> 6) & 0x3f];
    if (i++ >= count) break;
    if (i < count) value |= input[i] << 16;
    output += ITOA64[(value >> 12) & 0x3f];
    if (i++ >= count) break;
    output += ITOA64[(value >> 18) & 0x3f];
  } while (i < count);
  return output;
}

function phpassCryptPrivate(password: string, setting: string): string {
  if (!setting.startsWith("$P$") && !setting.startsWith("$H$")) {
    return "*";
  }
  const countLog2 = ITOA64.indexOf(setting[3]);
  if (countLog2 < 7 || countLog2 > 30) return "*";

  const count = 1 << countLog2;
  const salt = setting.substring(4, 12);
  if (salt.length !== 8) return "*";

  const pwdBuf = Buffer.from(password, "utf8");
  let hash = crypto
    .createHash("md5")
    .update(salt + password, "binary")
    .digest();
  for (let i = 0; i < count; i++) {
    hash = crypto.createHash("md5").update(Buffer.concat([hash, pwdBuf])).digest();
  }
  return setting.substring(0, 12) + phpassEncode64(hash, 16);
}

function timingSafeEqualStr(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

export function isPhpass(hash: string): boolean {
  return hash.startsWith("$P$") || hash.startsWith("$H$");
}

export function isWpBcrypt(hash: string): boolean {
  return hash.startsWith("$wp$");
}

export function detectAlgo(hash: string): "phpass" | "wp_bcrypt" | "bcrypt" | "unknown" {
  if (isPhpass(hash)) return "phpass";
  if (isWpBcrypt(hash)) return "wp_bcrypt";
  if (hash.startsWith("$2a$") || hash.startsWith("$2b$") || hash.startsWith("$2y$"))
    return "bcrypt";
  return "unknown";
}

export async function verifyPhpass(password: string, hash: string): Promise<boolean> {
  if (!isPhpass(hash)) return false;
  const computed = phpassCryptPrivate(password, hash);
  return timingSafeEqualStr(computed, hash);
}

// WP 6.8+: $wp$2y$10$<22-char-bcrypt-salt><31-char-bcrypt-hash>
// Inner step: base64( hmac_sha384( password, "wp-sha384") ) — there is no fixed key by
// default; WP uses the password itself wrapped with HMAC-SHA384 keyed by a hardcoded site
// constant. The most common implementation uses base64 of the raw HMAC bytes truncated
// to 72 chars (bcrypt's max), keyed by "wp-sha384" or wp_hash_password()'s constant.
// Reference: WordPress core class-wp-password.php (6.8+).
export async function verifyWpBcrypt(password: string, hash: string): Promise<boolean> {
  if (!isWpBcrypt(hash)) return false;
  // Strip the "$wp" prefix → underlying bcrypt hash like "$2y$10$..."
  const bcryptHash = hash.slice(3);
  // Pre-hash with HMAC-SHA384 keyed by "wp-sha384" (constant in core), then base64.
  // The result is up to 72 bytes — bcrypt silently truncates beyond 72.
  const prehashed = crypto
    .createHmac("sha384", "wp-sha384")
    .update(password, "utf8")
    .digest("base64");
  return bcrypt.compare(prehashed, bcryptHash);
}

export async function verifyBcryptPlain(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Try WP-style password verification (auto-detects format).
 * Returns true on match; caller is responsible for rehashing to argon2id.
 */
export async function verifyWpPassword(password: string, hash: string): Promise<boolean> {
  const algo = detectAlgo(hash);
  switch (algo) {
    case "phpass":
      return verifyPhpass(password, hash);
    case "wp_bcrypt":
      return verifyWpBcrypt(password, hash);
    case "bcrypt":
      return verifyBcryptPlain(password, hash);
    default:
      return false;
  }
}
