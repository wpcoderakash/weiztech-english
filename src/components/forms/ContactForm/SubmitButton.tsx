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

  return (
    <button type="submit" className={className} disabled={pending} aria-busy={pending}>
      {pending ? "Sending…" : children}
    </button>
  );
}
