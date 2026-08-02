import type { TextRun } from "@/types/content";

/**
 * Rich page copy: a CMS text field is either a plain string (today's
 * default) or a TextRun[] once an editor applies bold/italic/link. These
 * helpers are client-safe and shared by the Text primitive and the admin
 * editors.
 */
export type RichString = string | readonly TextRun[];

export function isRunArray(value: unknown): value is TextRun[] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every(
      (r) =>
        r !== null && typeof r === "object" && "t" in r && typeof (r as TextRun).t === "string",
    )
  );
}

/** Plain-text projection (fallbacks, lengths, metadata safety). */
export function runsToText(runs: readonly TextRun[]): string {
  return runs.map((r) => r.t + (r.br ? "\n" : "")).join("");
}
