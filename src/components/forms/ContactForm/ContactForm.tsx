"use client";

import { useActionState, useId } from "react";
import type { CSSProperties } from "react";

import { usePathname } from "next/navigation";

import { submitContactForm } from "@/lib/actions/submitContactForm";
import { CONTACT_FORM_INITIAL_STATE } from "@/lib/forms/contact-state";
import type { FieldError, FieldName } from "@/lib/forms/schema";

import styles from "./ContactForm.module.css";
import { TurnstileWidget } from "../TurnstileWidget";

import { SubmitButton } from "./SubmitButton";

export interface ContactFormProps {
  submitLabel?: string | undefined;
  /**
   * The first field's label. "Full name" on Home, "Name" on Hardware and
   * Software. Visually hidden either way, but it is what a screen reader
   * announces.
   */
  nameLabel?: string | undefined;
  /** "Phone number" on Home, "Phone" on Hardware and Software. */
  phonePlaceholder?: string | undefined;
  /**
   * Bricks' `fieldPadding` — 8px on Home and Software, unset on Hardware,
   * where ACSS's defaults stand (0 for inputs, 10px for the textarea).
   */
  fieldPaddingBlock?: string | undefined;
}

/**
 * ContactForm — the standard four-field contact form used on six pages.
 *
 * Markup and styling are transcribed from the `.contact-form` global class
 * and measured against the live site; the layout is a wrapping flex row, so
 * Phone and Email share a line at 50% each.
 *
 * Phase 10 wires it to the Server Action: `useActionState` holds the result,
 * the fields stay uncontrolled and submit as FormData, and the status renders
 * inline with no redirect — which is what Bricks did. Field requirements come
 * from the source: name is optional, the other three are required. Validation
 * is server-side, with `noValidate` so the browser does not pre-empt it and
 * show its own inconsistent bubbles.
 */
export function ContactForm({
  submitLabel = "Send Message",
  nameLabel = "Name",
  phonePlaceholder = "Phone",
  fieldPaddingBlock,
}: ContactFormProps) {
  const [state, formAction] = useActionState(submitContactForm, CONTACT_FORM_INITIAL_STATE);
  const pathname = usePathname();
  const id = useId();

  const errorFor = (field: FieldName) =>
    state.errors?.find((e: FieldError) => e.field === field)?.message;

  const describedBy = (field: FieldName) => (errorFor(field) ? `${id}-${field}-error` : undefined);

  /* A successful submission replaces the form, as the original did. */
  if (state.status === "success") {
    return (
      <p className={styles.success} role="status">
        {state.message}
      </p>
    );
  }

  return (
    <form
      action={formAction}
      data-anim="form"
      className={styles.form}
      noValidate
      style={
        fieldPaddingBlock
          ? ({ "--field-padding-block": fieldPaddingBlock } as CSSProperties)
          : undefined
      }
    >
      {state.status === "error" && state.message ? (
        <p className={styles.formError} role="alert">
          {state.message}
        </p>
      ) : null}

      <input type="hidden" name="pagePath" value={pathname} />

      {/* Honeypot — hidden from people, irresistible to bots. */}
      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor={`${id}-company`}>Company</label>
        <input id={`${id}-company`} name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className={styles.field}>
        <label className="visually-hidden" htmlFor={`${id}-name`}>
          {nameLabel}
        </label>
        <input
          id={`${id}-name`}
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Full name"
          className={styles.input}
          aria-describedby={describedBy("name")}
        />
        {errorFor("name") ? (
          <span id={`${id}-name-error`} className={styles.fieldError}>
            {errorFor("name")}
          </span>
        ) : null}
      </div>

      <div className={`${styles.field} ${styles.fieldHalf}`}>
        <label className="visually-hidden" htmlFor={`${id}-phone`}>
          Phone
        </label>
        <input
          id={`${id}-phone`}
          name="phone"
          type="tel"
          required
          autoComplete="tel"
          placeholder={phonePlaceholder}
          className={styles.input}
          aria-invalid={errorFor("phone") ? true : undefined}
          aria-describedby={describedBy("phone")}
        />
        {errorFor("phone") ? (
          <span id={`${id}-phone-error`} className={styles.fieldError}>
            {errorFor("phone")}
          </span>
        ) : null}
      </div>

      <div className={`${styles.field} ${styles.fieldHalf}`}>
        <label className="visually-hidden" htmlFor={`${id}-email`}>
          Email
        </label>
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="Email address"
          className={styles.input}
          aria-invalid={errorFor("email") ? true : undefined}
          aria-describedby={describedBy("email")}
        />
        {errorFor("email") ? (
          <span id={`${id}-email-error`} className={styles.fieldError}>
            {errorFor("email")}
          </span>
        ) : null}
      </div>

      <div className={styles.field}>
        <label className="visually-hidden" htmlFor={`${id}-message`}>
          Message
        </label>
        <textarea
          id={`${id}-message`}
          name="message"
          required
          placeholder="How can we help you?"
          className={styles.textarea}
          aria-invalid={errorFor("message") ? true : undefined}
          aria-describedby={describedBy("message")}
        />
        {errorFor("message") ? (
          <span id={`${id}-message-error`} className={styles.fieldError}>
            {errorFor("message")}
          </span>
        ) : null}
      </div>

      <TurnstileWidget />

      <div className={styles.submitWrapper}>
        <SubmitButton className={styles.submit}>{submitLabel}</SubmitButton>
      </div>
    </form>
  );
}
