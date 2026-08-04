"use server";

import { headers } from "next/headers";

import { recordSubmission } from "@/lib/actions/recordSubmission";
import { sendFormEmail } from "@/lib/email/send";
import {
  CONTACT_FAILURE_MESSAGE as FAILURE,
  CONTACT_SUCCESS_MESSAGE as SUCCESS,
} from "@/lib/forms/contact-state";
import type { ContactFormState } from "@/lib/forms/contact-state";
import { parseContactSubmission } from "@/lib/forms/schema";
import { verifyTurnstile } from "@/lib/forms/turnstile";

/**
 * The site's only runtime data path (PHASE-5 §9).
 *
 * Order matters: cheap checks first, then the challenge, then the network
 * call. A bot that fails validation never costs a Turnstile round-trip.
 */
/**
 * In-memory rate limit — 5 submissions per IP per 10 minutes.
 *
 * PHASE-6 §12 called for this as defence in depth behind Turnstile. It is
 * per-instance and resets on deploy, which is the right trade for a site
 * with no database: it stops the obvious floods without adding a dependency.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);

  /* Keep the map from growing without bound on a long-lived instance. */
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
    }
  }

  return recent.length > MAX_PER_WINDOW;
}

export async function submitContactForm(
  _previous: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const parsed = parseContactSubmission(formData);
  if (!parsed.ok) {
    return {
      status: "error",
      message: "Please check the highlighted fields.",
      errors: parsed.errors,
    };
  }

  /* Honeypot. Bricks has none; bots fill every field they can see. */
  if (typeof formData.get("company") === "string" && formData.get("company") !== "") {
    /* Report success so the bot does not learn it was caught. */
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
    console.warn(`[contact] Turnstile rejected a submission: ${turnstile.error}`);
    return { status: "error", message: FAILURE };
  }
  if (turnstile.skipped && process.env.NODE_ENV === "production") {
    console.warn("[contact] TURNSTILE_SECRET_KEY is not set — the form is unprotected.");
  }

  /* Client-supplied and unbounded otherwise: it is stored on the submission
     and echoed into the notification email. */
  const pagePath = ((formData.get("pagePath") as string | null) ?? "(unknown)").slice(0, 200);

  await recordSubmission({
    form: "contact",
    payload: parsed.value,
    pageSource: pagePath,
    ip,
    turnstileOk: !turnstile.skipped,
  });

  /* Microsoft Graph via the dashboard-managed email system. */
  const graphOutcome = await sendFormEmail({
    formKey: "contact",
    label: "Contact Form",
    payload: parsed.value as unknown as Record<string, unknown>,
    submitterEmail: parsed.value.email,
    submitterName: parsed.value.name,
  });

  if (
    graphOutcome.failed > 0 ||
    (graphOutcome.skipped && graphOutcome.reason !== "graph-not-configured")
  ) {
    console.warn(
      `[contact] graph mail: sent=${graphOutcome.sent} failed=${graphOutcome.failed} ${graphOutcome.reason ?? ""}`,
    );
  }

  return { status: "success", message: SUCCESS };
}
