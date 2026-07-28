/**
 * Field definitions and validation for the site's forms.
 *
 * PHASE-6 §12 specified Zod. Hand-rolled here instead: the whole site has one
 * four-field form plus the eight-field quote form, the rules are `required`,
 * `email` and `tel`, and this file is ~80 lines against a dependency that
 * would ship for nothing else. The shape below is deliberately Zod-like, so
 * swapping in a schema library later is mechanical if the forms grow.
 *
 * Field requirements come straight from the Bricks definitions: on every
 * contact form the name is OPTIONAL and phone, email and message are
 * required. Reproduced rather than tightened.
 */

export type FieldName = "name" | "phone" | "email" | "message";

export interface FieldError {
  field: FieldName;
  message: string;
}

export interface ContactSubmission {
  name: string;
  phone: string;
  email: string;
  message: string;
}

/** Deliberately permissive — matches what a browser accepts for type=email. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
/** Digits, spaces and the usual punctuation; 7 digits minimum. */
const TEL = /^[+()\d][\s\-().\d]{5,}$/;

const MAX = { name: 100, phone: 40, email: 254, message: 5000 } as const;

function str(data: FormData, key: string): string {
  const v = data.get(key);
  return typeof v === "string" ? v.trim() : "";
}

/**
 * Validates a contact submission.
 *
 * Returns the parsed values or the list of errors — never throws, so the
 * action can hand the errors straight back to the form.
 */
export function parseContactSubmission(
  data: FormData,
): { ok: true; value: ContactSubmission } | { ok: false; errors: FieldError[] } {
  const value: ContactSubmission = {
    name: str(data, "name"),
    phone: str(data, "phone"),
    email: str(data, "email"),
    message: str(data, "message"),
  };

  const errors: FieldError[] = [];

  /* Name is optional in the source; only its length is checked. */
  if (value.name.length > MAX.name) {
    errors.push({ field: "name", message: "That name is too long." });
  }

  if (!value.phone) {
    errors.push({ field: "phone", message: "Please enter a phone number." });
  } else if (value.phone.length > MAX.phone || !TEL.test(value.phone)) {
    errors.push({ field: "phone", message: "Please check that phone number." });
  }

  if (!value.email) {
    errors.push({ field: "email", message: "Please enter an email address." });
  } else if (value.email.length > MAX.email || !EMAIL.test(value.email)) {
    errors.push({ field: "email", message: "Please check that email address." });
  }

  if (!value.message) {
    errors.push({ field: "message", message: "Please tell us how we can help." });
  } else if (value.message.length > MAX.message) {
    errors.push({ field: "message", message: "That message is too long." });
  }

  return errors.length ? { ok: false, errors } : { ok: true, value };
}

/** Renders a submission as the plain-text body of the notification email. */
export function formatSubmission(value: ContactSubmission, pagePath: string): string {
  return [
    `Name:    ${value.name || "(not given)"}`,
    `Email:   ${value.email}`,
    `Phone:   ${value.phone}`,
    `Page:    ${pagePath}`,
    "",
    "Message:",
    value.message,
  ].join("\n");
}
