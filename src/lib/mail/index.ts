import { devLoggerAdapter } from "./dev-logger";
import type { MailAdapter } from "./types";

export type { MailAdapter, MailAttachment, MailMessage, MailResult } from "./types";

/**
 * Resolves the mail adapter from the environment.
 *
 * Adding a provider is a three-line change here plus one new file:
 *
 *   case "resend": return resendAdapter;   // lib/mail/resend.ts
 *   case "smtp":   return smtpAdapter;     // lib/mail/smtp.ts
 *
 * Until MAIL_PROVIDER is set, submissions are logged and not delivered.
 */
export function getMailAdapter(): MailAdapter {
  switch (process.env.MAIL_PROVIDER) {
    default:
      return devLoggerAdapter;
  }
}

/** Where submissions go. The Bricks forms used the WordPress admin address. */
export function getRecipient(): string {
  return process.env.CONTACT_EMAIL_TO ?? "office@weiztech.com";
}

/**
 * Where applications go. The careers form is the one form on the site that
 * overrode the default recipient: `emailTo: "custom"` with
 * `emailToCustom: "matan@weiz.co.il,dev@weiz.co.il"`. Both addresses are
 * carried over, and both are on the `@weiz.co.il` domain rather than the
 * `@weiztech.com` the contact form defaults to — the same split flagged in
 * PHASE-10 §6.
 */
export function getCareersRecipient(): string {
  return process.env.CAREERS_EMAIL_TO ?? "matan@weiz.co.il,dev@weiz.co.il";
}

/**
 * Where quote requests go. Also an `emailTo: "custom"` override —
 * `emailToCustom: "matan@weiz.co.il"`, a single address on the `@weiz.co.il`
 * domain. Two of the site's three forms bypass the default recipient.
 */
export function getQuoteRecipient(): string {
  return process.env.QUOTE_EMAIL_TO ?? "matan@weiz.co.il";
}
