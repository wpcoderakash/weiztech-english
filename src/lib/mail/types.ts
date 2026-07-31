/**
 * Mail adapter — the single seam between the form action and whatever
 * actually delivers the message.
 *
 * PHASE-1 §6 left the provider open and it is still open: the client will
 * choose one later. Everything upstream of this interface is finished, so
 * binding a provider means writing one file and setting its env vars —
 * no changes to the action, the schema or the form.
 */
/**
 * A file travelling with the message. Added for the careers form's CV, which
 * Bricks stored as a WordPress attachment — there is no media library here,
 * so the PDF goes out with the notification instead.
 *
 * Every provider worth binding takes this shape almost verbatim; Resend and
 * SendGrid both want base64 content plus a filename.
 */
export interface MailAttachment {
  filename: string;
  contentType: string;
  content: Uint8Array;
}

export interface MailMessage {
  to: string;
  subject: string;
  /** Plain-text body. Always present; providers that want HTML get `html`. */
  text: string;
  html?: string;
  /** The submitter's address, for Reply-To. Never used as the envelope From. */
  replyTo?: string;
  fromName: string;
  attachments?: MailAttachment[];
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
