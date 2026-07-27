import type { CSSProperties } from "react";

import styles from "./ContactForm.module.css";

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
 * PRESENTATION ONLY for now. Phase 10 adds the Server Action, Zod validation
 * derived from these field definitions, server-side Turnstile verification,
 * the mail adapter and the success/error states. The markup and styling here
 * are final, transcribed from the `.contact-form` global class and measured
 * against the live site:
 *   fields  rgba(0,0,0,0.6) fill, 1px #2f2f6a border, 8px radius, 14px/500,
 *           var(--base-ultra-light) text, 12px inline padding, 8px group gutter
 *   layout  a wrapping flex row — Phone and Email are 50% wide and share a
 *           line, which this component previously stacked
 *   submit  100% width, var(--primary) -> hover var(--secondary), 8px radius,
 *           14px/500 white, line-height 2, 18px top margin
 */
export function ContactForm({
  submitLabel = "Send Message",
  nameLabel = "Name",
  phonePlaceholder = "Phone",
  fieldPaddingBlock,
}: ContactFormProps) {
  return (
    <form
      className={styles.form}
      noValidate
      style={
        fieldPaddingBlock
          ? ({ "--field-padding-block": fieldPaddingBlock } as CSSProperties)
          : undefined
      }
    >
      <div className={styles.field}>
        <label className="visually-hidden" htmlFor="cf-name">
          {nameLabel}
        </label>
        <input
          id="cf-name"
          name="name"
          type="text"
          placeholder="Full name"
          className={styles.input}
        />
      </div>

      <div className={`${styles.field} ${styles.fieldHalf}`}>
        <label className="visually-hidden" htmlFor="cf-phone">
          Phone
        </label>
        <input
          id="cf-phone"
          name="phone"
          type="tel"
          required
          placeholder={phonePlaceholder}
          className={styles.input}
        />
      </div>

      <div className={`${styles.field} ${styles.fieldHalf}`}>
        <label className="visually-hidden" htmlFor="cf-email">
          Email
        </label>
        <input
          id="cf-email"
          name="email"
          type="email"
          required
          placeholder="Email address"
          className={styles.input}
        />
      </div>

      <div className={styles.field}>
        <label className="visually-hidden" htmlFor="cf-message">
          Message
        </label>
        <textarea
          id="cf-message"
          name="message"
          required
          placeholder="How can we help you?"
          className={styles.textarea}
        />
      </div>

      {/* Cloudflare Turnstile widget mounts here in Phase 10. */}

      <div className={styles.submitWrapper}>
        <button type="submit" className={styles.submit}>
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
