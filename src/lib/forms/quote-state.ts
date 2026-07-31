import type { QuoteFieldError } from "./quote-schema";

/**
 * The quote action's return shape. Kept out of the action file — a
 * `"use server"` module may only export async functions (PHASE-10 §2.2).
 */
export interface QuoteFormState {
  status: "idle" | "success" | "error";
  message: string;
  errors?: QuoteFieldError[];
}

export const QUOTE_FORM_INITIAL_STATE: QuoteFormState = { status: "idle", message: "" };

/* Bricks' own strings from the form on page 3725. Unlike the careers form,
   both of this one's messages are already in English. */
export const QUOTE_SUCCESS_MESSAGE =
  "Message successfully sent. We will get back to you as soon as possible.";
export const QUOTE_FAILURE_MESSAGE =
  "Submission failed. Please reload the page and try to submit the form again.";
