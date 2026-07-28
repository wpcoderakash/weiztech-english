/**
 * Mail adapter — the single seam between the form action and whatever
 * actually delivers the message.
 *
 * PHASE-1 §6 left the provider open and it is still open: the client will
 * choose one later. Everything upstream of this interface is finished, so
 * binding a provider means writing one file and setting its env vars —
 * no changes to the action, the schema or the form.
 */
export interface MailMessage {
  to: string;
  subject: string;
  /** Plain-text body. Always present; providers that want HTML get `html`. */
  text: string;
  html?: string;
  /** The submitter's address, for Reply-To. Never used as the envelope From. */
  replyTo?: string;
  fromName: string;
}

export interface MailResult {
  ok: boolean;
  /** Provider-side id, when there is one. Useful in logs. */
  id?: string;
  error?: string;
}

export interface MailAdapter {
  readonly name: string;
  send(message: MailMessage): Promise<MailResult>;
}
