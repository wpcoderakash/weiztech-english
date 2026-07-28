/**
 * Cloudflare Turnstile — server-side verification.
 *
 * The Bricks forms all set `enableTurnstile: true` with a dark theme, so the
 * challenge is reproduced rather than dropped. PHASE-1 R3 flagged that the
 * existing secret key is exposed in the export and MUST be rotated before
 * this goes live.
 *
 * With no keys configured the check is skipped and says so, which keeps local
 * development working without a Cloudflare account. In production, a missing
 * key means the form is unprotected — the action logs that loudly.
 */
const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export interface TurnstileResult {
  ok: boolean;
  /** True when no secret is configured and the check did not run. */
  skipped: boolean;
  error?: string;
}

export async function verifyTurnstile(
  token: string | null,
  remoteIp?: string,
): Promise<TurnstileResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!secret) {
    return { ok: true, skipped: true };
  }

  if (!token) {
    return { ok: false, skipped: false, error: "missing-input-response" };
  }

  const body = new URLSearchParams({ secret, response: token });
  if (remoteIp) body.set("remoteip", remoteIp);

  try {
    const res = await fetch(VERIFY_URL, {
      method: "POST",
      body,
      headers: { "content-type": "application/x-www-form-urlencoded" },
      cache: "no-store",
    });
    const json = (await res.json()) as { success?: boolean; "error-codes"?: string[] };
    return json.success
      ? { ok: true, skipped: false }
      : { ok: false, skipped: false, error: (json["error-codes"] ?? []).join(", ") };
  } catch (cause) {
    /* A Cloudflare outage should not silently let submissions through. */
    return { ok: false, skipped: false, error: `verification-unreachable: ${String(cause)}` };
  }
}
