/**
 * Field definitions and validation for the careers application form.
 *
 * Requirements come straight from the Bricks form in template 4521: first
 * name, last name, email, message and the CV are ALL required — unlike the
 * contact form, where the name is optional.
 *
 * The CV is the one piece Phase 10 did not build. Bricks accepted `pdf` only
 * (`fileUploadAllowedTypes: "pdf"`) and stored it as a WordPress attachment;
 * there is no media library here, so the file rides along as a mail
 * attachment instead — see `MailAttachment`.
 */

export type CareersFieldName = "firstName" | "lastName" | "email" | "message" | "cv";

export interface CareersFieldError {
  field: CareersFieldName;
  message: string;
}

export interface CareersSubmission {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
  cv: { filename: string; contentType: string; bytes: Uint8Array };
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const MAX = { name: 100, email: 254, message: 5000 } as const;

/**
 * 8 MB. Bricks set no limit of its own, so this is ours: PHP's stock
 * `upload_max_filesize` is 2 MB and the live form would have failed above it,
 * but a CV is a document and 8 MB is generous without being a memory risk on
 * a serverless instance.
 */
export const MAX_CV_BYTES = 8 * 1024 * 1024;

/** `fileUploadAllowedTypes: "pdf"` — PDFs and nothing else. */
const PDF_MIME = "application/pdf";

function str(data: FormData, key: string): string {
  const v = data.get(key);
  return typeof v === "string" ? v.trim() : "";
}

/**
 * Validates an application. Async because reading the upload's bytes is.
 *
 * Returns the parsed values or the list of errors — never throws, so the
 * action can hand the errors straight back to the form.
 */
export async function parseCareersSubmission(
  data: FormData,
): Promise<{ ok: true; value: CareersSubmission } | { ok: false; errors: CareersFieldError[] }> {
  const firstName = str(data, "firstName");
  const lastName = str(data, "lastName");
  const email = str(data, "email");
  const message = str(data, "message");

  const errors: CareersFieldError[] = [];

  if (!firstName) {
    errors.push({ field: "firstName", message: "Please enter your first name." });
  } else if (firstName.length > MAX.name) {
    errors.push({ field: "firstName", message: "That name is too long." });
  }

  if (!lastName) {
    errors.push({ field: "lastName", message: "Please enter your last name." });
  } else if (lastName.length > MAX.name) {
    errors.push({ field: "lastName", message: "That name is too long." });
  }

  if (!email) {
    errors.push({ field: "email", message: "Please enter an email address." });
  } else if (email.length > MAX.email || !EMAIL.test(email)) {
    errors.push({ field: "email", message: "Please check that email address." });
  }

  if (!message) {
    errors.push({ field: "message", message: "Please tell us about yourself." });
  } else if (message.length > MAX.message) {
    errors.push({ field: "message", message: "That message is too long." });
  }

  const upload = data.get("cv");
  let cv: CareersSubmission["cv"] | null = null;

  if (!(upload instanceof File) || upload.size === 0) {
    errors.push({ field: "cv", message: "Please attach your CV as a PDF." });
  } else if (upload.size > MAX_CV_BYTES) {
    errors.push({ field: "cv", message: "That file is larger than 8 MB." });
  } else {
    const bytes = new Uint8Array(await upload.arrayBuffer());
    /* Trust the bytes, not the browser's Content-Type: every PDF starts
       "%PDF-". A renamed .exe fails here even if the extension looks right. */
    const isPdf =
      bytes.length > 4 &&
      bytes[0] === 0x25 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x44 &&
      bytes[3] === 0x46;

    if (!isPdf) {
      errors.push({ field: "cv", message: "That file is not a PDF." });
    } else {
      cv = { filename: safeFilename(upload.name), contentType: PDF_MIME, bytes };
    }
  }

  if (errors.length || !cv) return { ok: false, errors };
  return { ok: true, value: { firstName, lastName, email, message, cv } };
}

/**
 * Strips everything but a plain basename before the file is named in an
 * email. The upload's name is attacker-controlled: path separators, control
 * characters and CR/LF (which would let a crafted name inject its own MIME
 * headers) all come out.
 */
function safeFilename(name: string): string {
  const base = name.split(/[\\/]/).pop() ?? "cv.pdf";

  const cleaned = base.replace(/[\u0000-\u001f\u007f"']/g, "").trim();
  const trimmed = cleaned.slice(0, 120);
  return trimmed.toLowerCase().endsWith(".pdf") ? trimmed : `${trimmed || "cv"}.pdf`;
}

/** Renders an application as the plain-text body of the notification email. */
export function formatCareersSubmission(value: CareersSubmission): string {
  return [
    `Name:  ${value.firstName} ${value.lastName}`,
    `Email: ${value.email}`,
    `CV:    ${value.cv.filename} (${Math.round(value.cv.bytes.length / 1024)} KB, attached)`,
    "",
    "Message:",
    value.message,
  ].join("\n");
}
