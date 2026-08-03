"use client";

import { useActionState, useId } from "react";

import { submitQuoteRequest } from "@/lib/actions/submitQuoteRequest";
import { QUOTE_SERVICES } from "@/lib/forms/quote-schema";
import type { QuoteFieldError, QuoteFieldName } from "@/lib/forms/quote-schema";
import { QUOTE_FORM_INITIAL_STATE } from "@/lib/forms/quote-state";

import { SubmitButton } from "../ContactForm/SubmitButton";
import { TurnstileWidget } from "../TurnstileWidget";

import styles from "./QuoteForm.module.css";

/**
 * QuoteForm — the eight-field form on /quote/ (Bricks #brxe-epoghv).
 *
 * The widths are the source's and they do not tile evenly: three fields at
 * 33.3%, four at 50% and the textarea at 100%, in a wrapping flex row. That
 * leaves the second 50% row half empty by design.
 *
 * Only the select, full name and company are optional — the other five are
 * required, per the Bricks field definitions. Validation is server-side with
 * `noValidate`, so the browser does not pre-empt it with its own bubbles.
 */
export function QuoteForm() {
  const [state, formAction] = useActionState(submitQuoteRequest, QUOTE_FORM_INITIAL_STATE);
  const id = useId();

  const errorFor = (field: QuoteFieldName) =>
    state.errors?.find((e: QuoteFieldError) => e.field === field)?.message;

  const describedBy = (field: QuoteFieldName) =>
    errorFor(field) ? `${id}-${field}-error` : undefined;

  const fieldError = (field: QuoteFieldName) =>
    errorFor(field) ? (
      <span id={`${id}-${field}-error`} className={styles.fieldError}>
        {errorFor(field)}
      </span>
    ) : null;

  return (
    <>
      <form action={formAction} className={styles.form} noValidate data-anim="form">
      {state.status === "error" && state.message ? (
        <p className={styles.formError} role="alert">
          {state.message}
        </p>
      ) : null}

      {/* Honeypot — hidden from people, irresistible to bots. */}
      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor={`${id}-website`}>Website</label>
        <input id={`${id}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className={`${styles.field} ${styles.third}`}>
        {/* The source's label is the literal string "Input " — a builder
            default nobody renamed. "Required service" is the placeholder and
            the only text a user ever sees, so it is the accessible name too. */}
        <label className="visually-hidden" htmlFor={`${id}-service`}>
          Required service
        </label>
        <select
          id={`${id}-service`}
          name="service"
          className={styles.select}
          defaultValue=""
          aria-invalid={errorFor("service") ? true : undefined}
          aria-describedby={describedBy("service")}
        >
          <option value="">Required service</option>
          {QUOTE_SERVICES.map((service) => (
            <option key={service} value={service}>
              {service}
            </option>
          ))}
        </select>
        {fieldError("service")}
      </div>

      <div className={`${styles.field} ${styles.third}`}>
        <label className="visually-hidden" htmlFor={`${id}-fullName`}>
          Full Name
        </label>
        <input
          id={`${id}-fullName`}
          name="fullName"
          type="text"
          autoComplete="name"
          placeholder="Full Name"
          className={styles.input}
          aria-describedby={describedBy("fullName")}
        />
        {fieldError("fullName")}
      </div>

      <div className={`${styles.field} ${styles.third}`}>
        <label className="visually-hidden" htmlFor={`${id}-company`}>
          Company
        </label>
        <input
          id={`${id}-company`}
          name="company"
          type="text"
          autoComplete="organization"
          placeholder="Company"
          className={styles.input}
          aria-describedby={describedBy("company")}
        />
        {fieldError("company")}
      </div>

      <div className={`${styles.field} ${styles.half}`}>
        <label className="visually-hidden" htmlFor={`${id}-email`}>
          Email
        </label>
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="Email"
          className={styles.input}
          aria-invalid={errorFor("email") ? true : undefined}
          aria-describedby={describedBy("email")}
        />
        {fieldError("email")}
      </div>

      <div className={`${styles.field} ${styles.half}`}>
        <label className="visually-hidden" htmlFor={`${id}-phone`}>
          Phone
        </label>
        <input
          id={`${id}-phone`}
          name="phone"
          type="tel"
          required
          autoComplete="tel"
          placeholder="Phone"
          className={styles.input}
          aria-invalid={errorFor("phone") ? true : undefined}
          aria-describedby={describedBy("phone")}
        />
        {fieldError("phone")}
      </div>

      <div className={`${styles.field} ${styles.half}`}>
        <label className="visually-hidden" htmlFor={`${id}-product`}>
          Product / Service
        </label>
        <input
          id={`${id}-product`}
          name="product"
          type="text"
          required
          placeholder="Product / Service"
          className={styles.input}
          aria-invalid={errorFor("product") ? true : undefined}
          aria-describedby={describedBy("product")}
        />
        {fieldError("product")}
      </div>

      <div className={`${styles.field} ${styles.half}`}>
        <label className="visually-hidden" htmlFor={`${id}-amount`}>
          Amount
        </label>
        <input
          id={`${id}-amount`}
          name="amount"
          type="text"
          required
          placeholder="The requested product / service"
          className={styles.input}
          aria-invalid={errorFor("amount") ? true : undefined}
          aria-describedby={describedBy("amount")}
        />
        {fieldError("amount")}
      </div>

      <div className={styles.field}>
        <label className="visually-hidden" htmlFor={`${id}-message`}>
          Message
        </label>
        <textarea
          id={`${id}-message`}
          name="message"
          required
          placeholder="How can we help?"
          className={styles.textarea}
          aria-invalid={errorFor("message") ? true : undefined}
          aria-describedby={describedBy("message")}
        />
        {fieldError("message")}
      </div>

      {/*
        Turnstile mounts here once NEXT_PUBLIC_TURNSTILE_SITE_KEY is set —
        the source has `enableTurnstile: true` with a dark theme.
      */}

      <TurnstileWidget />

      <div className={styles.submitWrapper}>
        <SubmitButton className={styles.submit}>Send Message</SubmitButton>
      </div>
    </form>

      {state.status === "success" && state.message ? (
        <p className={styles.success} role="status" style={{ marginBlockStart: 16 }}>
          {state.message}
        </p>
      ) : null}

      {state.status === "error" && state.message ? (
        <p className={styles.formError} role="alert" style={{ marginBlockStart: 16 }}>
          {state.message}
        </p>
      ) : null}
    </>
  );
}
