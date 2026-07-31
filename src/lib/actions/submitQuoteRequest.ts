"use server";

import { headers } from "next/headers";

import { formatQuoteSubmission, parseQuoteSubmission } from "@/lib/forms/quote-schema";
import {
  QUOTE_FAILURE_MESSAGE as FAILURE,
  QUOTE_SUCCESS_MESSAGE as SUCCESS,
} from "@/lib/forms/quote-state";
import type { QuoteFormState } from "@/lib/forms/quote-state";
import { verifyTurnstile } from "@/lib/forms/turnstile";
import { getMailAdapter, getQuoteRecipient } from "@/lib/mail";

/**
 * The Get a Quote request — the third and last runtime data path.
 *
 * Same order and the same limits as the contact action: cheap checks, then
 * the challenge, then the network call. Text only, so there is no reason to
 * be stricter than the contact form here.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);

  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
    }
  }

  return recent.length > MAX_PER_WINDOW;
}

export async function submitQuoteRequest(
  _previous: QuoteFormState,
  formData: FormData,
): Promise<QuoteFormState> {
  const parsed = parseQuoteSubmission(formData);
  if (!parsed.ok) {
    return {
      status: "error",
      message: "Please check the highlighted fields.",
      errors: parsed.errors,
    };
  }

  /* Honeypot. Bricks has none; bots fill every field they can see. */
  if (typeof formData.get("website") === "string" && formData.get("website") !== "") {
    return { status: "success", message: SUCCESS };
  }

  const headerList = await headers();
  const ip =
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headerList.get("x-real-ip") ??
    "unknown";

  if (rateLimited(ip)) {
    return { status: "error", message: FAILURE };
  }

  const turnstile = await verifyTurnstile(
    formData.get("cf-turnstile-response") as string | null,
    ip,
  );
  if (!turnstile.ok) {
    console.warn(`[quote] Turnstile rejected a submission: ${turnstile.error}`);
    return { status: "error", message: FAILURE };
  }
  if (turnstile.skipped && process.env.NODE_ENV === "production") {
    console.warn("[quote] TURNSTILE_SECRET_KEY is not set — the form is unprotected.");
  }

  const mail = getMailAdapter();

  const result = await mail.send({
    to: getQuoteRecipient(),
    /*
     * Bricks' own `emailSubject` is "Contact form request" — the same subject
     * the contact form sends, so quote requests are indistinguishable from
     * contact messages in the inbox. Left as the source has it; changing it
     * is a one-line call flagged in the phase report.
     */
    subject: "Contact form request",
    text: formatQuoteSubmission(parsed.value),
    replyTo: parsed.value.email,
    /* The source's `fromName` is "טופס הצעת מחיר" on an English form —
       the CHANGE #28 pattern again. */
    fromName: "WeizTech",
  });

  if (!result.ok) {
    console.error(`[quote] ${mail.name} failed: ${result.error}`);
    return { status: "error", message: FAILURE };
  }

  return { status: "success", message: SUCCESS };
}
