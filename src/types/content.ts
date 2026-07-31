/**
 * BLOG CONTENT TYPES
 *
 * Post bodies are modelled as a discriminated block array rather than raw
 * HTML. Two reasons: nothing reaches the DOM through
 * `dangerouslySetInnerHTML`, and this is the shape PHASE-5 §7.2 called the
 * "CMS-ready seam" — a portable-text field from Sanity or Payload maps onto
 * it directly, so adopting a CMS later means rewriting one loader, not the
 * renderer or the pages.
 */

/** An inline run of text, optionally bold, italic or a link. */
export interface TextRun {
  t: string;
  b?: boolean;
  i?: boolean;
  href?: string;
  /**
   * A hard line break FOLLOWS this run. The legal page uses `<br />` inside a
   * paragraph twice, both times to put a bare contact URL on its own line
   * without opening a new paragraph — which would change the spacing.
   */
  br?: boolean;
}

export type PostBlock =
  | { type: "heading"; level: 2 | 3; runs: TextRun[] }
  | { type: "paragraph"; runs: TextRun[] }
  | { type: "list"; ordered: boolean; items: TextRun[][] };

export interface PostCategory {
  slug: string;
  /** English label. The source names are Hebrew — see CHANGE #26. */
  label: string;
  /** The Hebrew name as it appears in WordPress, kept for reference. */
  sourceLabel: string;
}

export interface Post {
  slug: string;
  title: string;
  /** ISO date, publication. */
  date: string;
  /** Full WordPress timestamp — what the index sorts on. */
  publishedAt: string;
  modified: string;
  category: PostCategory;
  excerpt: string;
  blocks: PostBlock[];
}
