/**
 * GET A QUOTE PAGE CONTENT — route /quote/
 *
 * Transcribed from the Bricks export ("Get a Quote.json", page ID 3725).
 * The page is a single section: a centred heading and body, then the
 * eight-field form. The form's own definition lives in
 * `lib/forms/quote-schema.ts`.
 */

export const QUOTE_HERO = {
  heading: "Get a Quote",
  /**
   * The source's text ends with two trailing newlines
   * ("…contact you soon.\n\n"), which render as nothing. Trimmed.
   */
  body: "Want a quote? Fill out this form, and we'll contact you soon.",
} as const;
