import type { FieldError } from "./schema";

/**
 * The action's return shape, kept out of the action file: a `"use server"`
 * module may only export async functions, so the type and the initial value
 * live here and the action file exports nothing but `submitContactForm`.
 */
export interface ContactFormState {
  status: "idle" | "success" | "error";
  /** Shown above the form. Wording matches the Bricks originals. */
  message: string;
  errors?: FieldError[];
}

export const CONTACT_FORM_INITIAL_STATE: ContactFormState = { status: "idle", message: "" };

/* Bricks' own strings, so the page reads the same as it does today. */
export const CONTACT_SUCCESS_MESSAGE =
  "Message successfully sent. We will get back to you as soon as possible.";
export const CONTACT_FAILURE_MESSAGE =
  "Submission failed. Please reload the page and try to submit the form again.";
