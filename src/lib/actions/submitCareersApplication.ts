"use server";

import { headers } from "next/headers";

import { recordApplication } from "@/lib/actions/recordSubmission";
import { sendFormEmail } from "@/lib/email/send";
import { formatCareersSubmission, parseCareersSubmission } from "@/lib/forms/careers-schema";
import {
  CAREERS_FAILURE_MESSAGE as FAILURE,
  CAREERS_SUCCESS_MESSAGE as SUCCESS,
} from "@/lib/forms/careers-state";
import type { CareersFormState } from "@/lib/forms/careers-state";
import { verifyTurnstile } from "@/lib/forms/turnstile";
import { getCareersRecipient, getMailAdapter } from "@/lib/mail";

/**
 * The careers application — the site's second runtime data path, and the only
 * one that carries a file.
 *
 * Same order as the contact action: cheap checks first, then the challenge,
 * then the network call. The rate limit is TIGHTER here (3 per hour rather
 * than 5 per 10 minutes) because every accepted submission pushes up to 8 MB
 * of PDF through the mail provider, so the cost of abuse is much higher than
 * on a text-only form.
 */
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 3;
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

export async function submitCareersApplication(
  _previous: CareersFormState,
  formData: FormData,
): Promise<CareersFormState> {
  /* Honeypot first — before the upload is read into memory, so a bot never
     costs us the 8 MB. Bricks had none; bots fill every field they can see. */
  if (typeof formData.get("company") === "string" && formData.get("company") !== "") {
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

  const parsed = await parseCareersSubmission(formData);
  if (!parsed.ok) {
    return {
      status: "error",
      message: "Please check the highlighted fields.",
      errors: parsed.errors,
    };
  }

  const turnstile = await verifyTurnstile(
    formData.get("cf-turnstile-response") as string | null,
    ip,
  );
  if (!turnstile.ok) {
    console.warn(`[careers] Turnstile rejected a submission: ${turnstile.error}`);
    return { status: "error", message: FAILURE };
  }
  if (turnstile.skipped && process.env.NODE_ENV === "production") {
    console.warn("[careers] TURNSTILE_SECRET_KEY is not set — the form is unprotected.");
  }

  const { value } = parsed;

  await recordApplication(value, ip, !turnstile.skipped);

  const { cv, ...careersPayload } = value as unknown as Record<string, unknown> & {
    cv?: { filename: string; contentType: string; bytes: Uint8Array };
  };
  const graphOutcome = await sendFormEmail({
    formKey: "careers",
    label: "Career Application",
    payload: { ...careersPayload, cvFilename: cv?.filename ?? "" },
    submitterEmail: (value as { email?: string }).email,
    submitterName: (value as { fullName?: string }).fullName,
    ...(cv
      ? {
          attachments: [{ filename: cv.filename, contentType: cv.contentType, content: cv.bytes }],
        }
      : {}),
  });

  if (
    graphOutcome.failed > 0 ||
    (graphOutcome.skipped && graphOutcome.reason !== "graph-not-configured")
  ) {
    console.warn(
      `[careers] graph mail: sent=${graphOutcome.sent} failed=${graphOutcome.failed} ${graphOutcome.reason ?? ""}`,
    );
  }

  const mail = getMailAdapter();

  const result = await mail.send({
    to: getCareersRecipient(),
    /* Bricks' own `emailSubject`. */
    subject: "Career Form Request",
    text: formatCareersSubmission(value),
    replyTo: value.email,
    /* The source's `fromName` is "קורות חיים" (Hebrew for "CV") on an English
       form — CHANGE #28, same as the failure message. */
    fromName: "WeizTech Careers",
    attachments: [
      {
        filename: value.cv.filename,
        contentType: value.cv.contentType,
        content: value.cv.bytes,
      },
    ],
  });

  if (!result.ok) {
    console.error(`[careers] ${mail.name} failed: ${result.error}`);
    return { status: "error", message: FAILURE };
  }

  return { status: "success", message: SUCCESS };
}
