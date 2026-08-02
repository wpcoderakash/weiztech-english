"use client";

import { useState } from "react";

import { InlineRichText, type RichValue } from "./InlineRichText";

/**
 * Server-form wrapper around InlineRichText: the hidden CONTROLLED input
 * carries either the plain string or a {"$runs":[...]} JSON envelope that
 * the server rebuilder unwraps into TextRun[].
 */
export function RichTextField({ name, defaultValue }: { name: string; defaultValue: RichValue }) {
  const [value, setValue] = useState<RichValue>(defaultValue);
  const serialized = typeof value === "string" ? value : JSON.stringify({ $runs: value });

  return (
    <div>
      <InlineRichText value={value} onChange={setValue} />
      <input type="hidden" name={name} value={serialized} readOnly />
    </div>
  );
}
