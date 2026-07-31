/**
 * Field definitions and validation for the Get a Quote form.
 *
 * Eight fields, transcribed from the Bricks form (#brxe-epoghv, page 3725).
 * Requirements are the source's, not tightened: the service select, the full
 * name and the company are all OPTIONAL; email, phone, product, amount and
 * message are required.
 */

export type QuoteFieldName =
  "service" | "fullName" | "company" | "email" | "phone" | "product" | "amount" | "message";

export interface QuoteFieldError {
  field: QuoteFieldName;
  message: string;
}

export interface QuoteSubmission {
  service: string;
  fullName: string;
  company: string;
  email: string;
  phone: string;
  product: string;
  amount: string;
  message: string;
}

/** The select's two options, verbatim from `options: "Software\nHardware"`. */
export const QUOTE_SERVICES = ["Software", "Hardware"] as const;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const TEL = /^[+()\d][\s\-().\d]{5,}$/;

const MAX = {
  service: 40,
  fullName: 100,
  company: 120,
  email: 254,
  phone: 40,
  product: 200,
  amount: 100,
  message: 5000,
} as const;

function str(data: FormData, key: string): string {
  const v = data.get(key);
  return typeof v === "string" ? v.trim() : "";
}

export function parseQuoteSubmission(
  data: FormData,
): { ok: true; value: QuoteSubmission } | { ok: false; errors: QuoteFieldError[] } {
  const value: QuoteSubmission = {
    service: str(data, "service"),
    fullName: str(data, "fullName"),
    company: str(data, "company"),
    email: str(data, "email"),
    phone: str(data, "phone"),
    product: str(data, "product"),
    amount: str(data, "amount"),
    message: str(data, "message"),
  };

  const errors: QuoteFieldError[] = [];

  /* The select is optional, but if something came back it has to be one of
     the two options — a hand-crafted POST cannot smuggle arbitrary text into
     the notification email. */
  if (value.service && !QUOTE_SERVICES.includes(value.service as (typeof QUOTE_SERVICES)[number])) {
    errors.push({ field: "service", message: "Please choose one of the listed services." });
  }

  /* Optional fields — length only. */
  if (value.fullName.length > MAX.fullName) {
    errors.push({ field: "fullName", message: "That name is too long." });
  }
  if (value.company.length > MAX.company) {
    errors.push({ field: "company", message: "That company name is too long." });
  }

  if (!value.email) {
    errors.push({ field: "email", message: "Please enter an email address." });
  } else if (value.email.length > MAX.email || !EMAIL.test(value.email)) {
    errors.push({ field: "email", message: "Please check that email address." });
  }

  if (!value.phone) {
    errors.push({ field: "phone", message: "Please enter a phone number." });
  } else if (value.phone.length > MAX.phone || !TEL.test(value.phone)) {
    errors.push({ field: "phone", message: "Please check that phone number." });
  }

  if (!value.product) {
    errors.push({ field: "product", message: "Please name the product or service." });
  } else if (value.product.length > MAX.product) {
    errors.push({ field: "product", message: "That is too long." });
  }

  if (!value.amount) {
    errors.push({ field: "amount", message: "Please give the requested amount." });
  } else if (value.amount.length > MAX.amount) {
    errors.push({ field: "amount", message: "That is too long." });
  }

  if (!value.message) {
    errors.push({ field: "message", message: "Please tell us how we can help." });
  } else if (value.message.length > MAX.message) {
    errors.push({ field: "message", message: "That message is too long." });
  }

  return errors.length ? { ok: false, errors } : { ok: true, value };
}

/** Renders a quote request as the plain-text body of the notification email. */
export function formatQuoteSubmission(value: QuoteSubmission): string {
  return [
    `Service:  ${value.service || "(not chosen)"}`,
    `Name:     ${value.fullName || "(not given)"}`,
    `Company:  ${value.company || "(not given)"}`,
    `Email:    ${value.email}`,
    `Phone:    ${value.phone}`,
    `Product:  ${value.product}`,
    `Amount:   ${value.amount}`,
    "",
    "Message:",
    value.message,
  ].join("\n");
}
