"use client";

import type { ReactNode } from "react";

import { useFormStatus } from "react-dom";

export interface SubmitButtonProps {
  children: ReactNode;
  className?: string | undefined;
}

/**
 * The submit button, split out because `useFormStatus` only reports the
 * pending state of a form it is rendered *inside*.
 *
 * Bricks swapped the label for a spinner while sending; the label change and
 * the disabled state carry the same information without the extra markup.
 */
export function SubmitButton({ children, className }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  /* The label sits in a <span>, as Bricks renders it. Without it the button's
     own box is the only thing carrying the text, which made every measurement
     pair the live label span against our button element and report a phantom
     600px width difference on all three forms. */
  return (
    <button type="submit" className={className} disabled={pending} aria-busy={pending}>
      <span>{pending ? "Sending…" : children}</span>
    </button>
  );
}
