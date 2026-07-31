import type { CareersFieldError } from "./careers-schema";

/**
 * The careers action's return shape. Kept out of the action file for the same
 * reason as `contact-state.ts`: a `"use server"` module may only export async
 * functions, and exporting the initial state alongside the action fails at
 * runtime only — it passes typecheck, lint and build (PHASE-10 §2.2).
 */
export interface CareersFormState {
  status: "idle" | "success" | "error";
  message: string;
  errors?: CareersFieldError[];
}

export const CAREERS_FORM_INITIAL_STATE: CareersFormState = { status: "idle", message: "" };

/* Bricks' own strings from template 4521. */
export const CAREERS_SUCCESS_MESSAGE =
  "Message sent successfully. We will get back to you as soon as possible.";

/**
 * The source's failure message is Hebrew on an English form —
 * "ההגשה נכשלה. נסו לטעון את העמווד מחדש ולשלוח שוב את הטופס." (which also
 * misspells העמוד). Same class of issue as CHANGE #26; the English wording
 * from the contact form is used instead. CHANGE #28.
 */
export const CAREERS_FAILURE_MESSAGE =
  "Submission failed. Please reload the page and try to submit the form again.";
