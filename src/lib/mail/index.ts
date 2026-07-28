import { devLoggerAdapter } from "./dev-logger";
import type { MailAdapter } from "./types";

export type { MailAdapter, MailMessage, MailResult } from "./types";

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
