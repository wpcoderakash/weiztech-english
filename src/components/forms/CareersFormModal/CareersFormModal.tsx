"use client";

import { useActionState, useEffect, useId, useRef, useState } from "react";

import Image from "next/image";

import { useOverlay } from "@/components/overlays";
import { Heading, Icon } from "@/components/primitives";
import { submitCareersApplication } from "@/lib/actions/submitCareersApplication";
import type { CareersFieldError, CareersFieldName } from "@/lib/forms/careers-schema";
import { CAREERS_FORM_INITIAL_STATE } from "@/lib/forms/careers-state";

import { SubmitButton } from "../ContactForm/SubmitButton";
import { TurnstileWidget } from "../TurnstileWidget";

import styles from "./CareersFormModal.module.css";

/**
 * CareersFormModal — Bricks popup template 4521, "Careers Form".
 *
 * Opened by any of the six Apply Now buttons on /careers/ (fadeIn in the
 * source). templateSettings transcribed: backdrop rgba(27,27,67,0.48),
 * content #1b1b43 at 8px radius, 60% wide (90% at mobile_landscape), 15px
 * padding, centred both ways.
 *
 * Five fields, all required: first and last name at 50% each, then email,
 * message and the CV. The CV is the only file input on the site — PDF only,
 * which the server re-checks against the file's magic bytes rather than
 * trusting the browser's Content-Type.
 *
 * Adds a focus trap, Escape-to-close and a labelled dialog role, none of
 * which the Bricks popup had. `popupDisableAutoFocus` is deliberately NOT
 * reproduced: leaving focus behind the backdrop strands keyboard users.
 */
export function CareersFormModal() {
  const { isOpen, close } = useOverlay();
  const open = isOpen("careersForm");

  const [state, formAction] = useActionState(submitCareersApplication, CAREERS_FORM_INITIAL_STATE);
  const id = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  /* The chosen file's name, shown next to the upload button. A file input
     cannot be given a value programmatically, so this mirrors it for display
     only — the input itself is still what submits. */
  const [fileName, setFileName] = useState<string | null>(null);

  useEffect(() => {
    if (open) closeButtonRef.current?.focus();
  }, [open]);

  /* Focus trap — same implementation as MobileMenuDrawer. */
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  if (!open) return null;

  const errorFor = (field: CareersFieldName) =>
    state.errors?.find((e: CareersFieldError) => e.field === field)?.message;

  const describedBy = (field: CareersFieldName) =>
    errorFor(field) ? `${id}-${field}-error` : undefined;

  const fieldError = (field: CareersFieldName) =>
    errorFor(field) ? (
      <span id={`${id}-${field}-error`} className={styles.fieldError}>
        {errorFor(field)}
      </span>
    ) : null;

  return (
    <div className={styles.backdrop} onClick={close} role="presentation">
      <div
        ref={panelRef}
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${id}-title`}
        onClick={(event) => event.stopPropagation()}
      >
        {/* div#jpxfsw — row-reverse, so the logo sits right of the title. */}
        <div className={styles.header}>
          <Image
            /* The source points at Weiz-Logo-3.webp, which is not in the
               export; this is the same lockup the header already ships. */
            src="/images/Weiz-Logo.svg"
            alt="Weiz Technologies"
            width={92}
            height={48}
            className={styles.logo}
          />
          <Heading as="h4" id={`${id}-title`} className={styles.title}>
            Job Application
          </Heading>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={close}
            aria-label="Close the application form"
            className={styles.closeButton}
          >
            <Icon name="ion-ios-close" size="28px" color="var(--white)" />
          </button>
        </div>

        {/* divider#couemk — 0.5px #4747b3. */}
        <hr className={styles.divider} />

        <form action={formAction} className={styles.form} noValidate>
          {state.status === "error" && state.message ? (
            <p className={styles.formError} role="alert">
              {state.message}
            </p>
          ) : null}

          {/* Honeypot — checked before the upload is read. */}
          <div className={styles.honeypot} aria-hidden="true">
            <label htmlFor={`${id}-company`}>Company</label>
            <input
              id={`${id}-company`}
              name="company"
              type="text"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <div className={styles.fieldHalf}>
            <label className={styles.label} htmlFor={`${id}-firstName`}>
              First name <span aria-hidden="true">*</span>
            </label>
            <input
              id={`${id}-firstName`}
              name="firstName"
              type="text"
              required
              autoComplete="given-name"
              placeholder="First name"
              className={styles.input}
              aria-invalid={errorFor("firstName") ? true : undefined}
              aria-describedby={describedBy("firstName")}
            />
            {fieldError("firstName")}
          </div>

          <div className={styles.fieldHalf}>
            <label className={styles.label} htmlFor={`${id}-lastName`}>
              Last name <span aria-hidden="true">*</span>
            </label>
            <input
              id={`${id}-lastName`}
              name="lastName"
              type="text"
              required
              autoComplete="family-name"
              placeholder="Last name"
              className={styles.input}
              aria-invalid={errorFor("lastName") ? true : undefined}
              aria-describedby={describedBy("lastName")}
            />
            {fieldError("lastName")}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor={`${id}-email`}>
              Email <span aria-hidden="true">*</span>
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
            {fieldError("email")}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor={`${id}-message`}>
              Message <span aria-hidden="true">*</span>
            </label>
            <textarea
              id={`${id}-message`}
              name="message"
              required
              placeholder="Message"
              className={styles.textarea}
              aria-invalid={errorFor("message") ? true : undefined}
              aria-describedby={describedBy("message")}
            />
            {fieldError("message")}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor={`${id}-cv`}>
              CV <span aria-hidden="true">*</span>
            </label>
            {/*
                The input is visually hidden rather than `display: none` so it
                stays focusable and keyboard-operable; the styled label is its
                control. `fileUploadButtonText` is the source's own wording.
              */}
            <input
              id={`${id}-cv`}
              name="cv"
              type="file"
              required
              accept="application/pdf,.pdf"
              className={styles.fileInput}
              aria-invalid={errorFor("cv") ? true : undefined}
              aria-describedby={describedBy("cv")}
              onChange={(event) => setFileName(event.target.files?.[0]?.name ?? null)}
            />
            <label htmlFor={`${id}-cv`} className={styles.fileButton}>
              Upload your CV (PDF Only)
            </label>
            <span className={styles.fileName}>{fileName ?? "No file chosen"}</span>
            {fieldError("cv")}
          </div>

          {/*
              Turnstile mounts here once NEXT_PUBLIC_TURNSTILE_SITE_KEY is
              set — the source has `enableTurnstile: true` with a dark theme.
              The server verifies the token and skips the check when no secret
              is configured, so the form works either way.
            */}

          <TurnstileWidget />
          <SubmitButton className={styles.submit}>Submit</SubmitButton>
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
      </div>
    </div>
  );
}
