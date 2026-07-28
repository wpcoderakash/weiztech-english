import type { MailAdapter, MailMessage, MailResult } from "./types";

/**
 * The adapter used until a provider is chosen.
 *
 * It writes the message to the server log and reports success, so the whole
 * path — validation, Turnstile, the action, the success state — behaves
 * exactly as it will in production. Nothing is delivered.
 *
 * This is deliberately loud: a submission that is not being emailed anywhere
 * should be obvious in the logs, not silent.
 */
export const devLoggerAdapter: MailAdapter = {
  name: "dev-logger",

  async send(message: MailMessage): Promise<MailResult> {
    console.warn(
      [
        "",
        "┌─ CONTACT FORM SUBMISSION — NOT DELIVERED ─────────────────",
        "│ No mail provider is configured. Set MAIL_PROVIDER and the",
        "│ matching credentials to send this for real.",
        "├───────────────────────────────────────────────────────────",
        `│ to:       ${message.to}`,
        `│ subject:  ${message.subject}`,
        `│ reply-to: ${message.replyTo ?? "(none)"}`,
        "├───────────────────────────────────────────────────────────",
        message.text
          .split("\n")
          .map((line) => `│ ${line}`)
          .join("\n"),
        "└───────────────────────────────────────────────────────────",
        "",
      ].join("\n"),
    );

    return { ok: true, id: "dev-logger" };
  },
};
