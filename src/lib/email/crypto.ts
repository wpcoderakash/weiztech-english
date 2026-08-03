import "server-only";

import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "node:crypto";

/**
 * AES-256-GCM for the Graph client secret at rest.
 *
 * The key derives from EMAIL_ENCRYPTION_KEY (any length; scrypt-stretched with
 * a fixed app salt). Ciphertext format: iv.tag.data, all base64url — one
 * column, self-describing, tamper-evident (GCM auth tag).
 */
const SALT = "weiztech-email-v1";

function key(): Buffer {
  const secret = process.env.EMAIL_ENCRYPTION_KEY;
  if (!secret) throw new Error("EMAIL_ENCRYPTION_KEY is not set");
  return scryptSync(secret, SALT, 32);
}

export function encryptSecret(plain: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const data = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [iv.toString("base64url"), tag.toString("base64url"), data.toString("base64url")].join(
    ".",
  );
}

export function decryptSecret(payload: string): string {
  const [ivB64, tagB64, dataB64] = payload.split(".");
  if (!ivB64 || !tagB64 || !dataB64) throw new Error("malformed ciphertext");
  const decipher = createDecipheriv("aes-256-gcm", key(), Buffer.from(ivB64, "base64url"));
  decipher.setAuthTag(Buffer.from(tagB64, "base64url"));
  return Buffer.concat([
    decipher.update(Buffer.from(dataB64, "base64url")),
    decipher.final(),
  ]).toString("utf8");
}

/** Masked form for display: keeps the shape, reveals nothing. */
export function maskSecret(plain: string): string {
  if (plain.length <= 6) return "••••••";
  return `${plain.slice(0, 3)}${"•".repeat(Math.min(24, plain.length - 6))}${plain.slice(-3)}`;
}
