"use client";

import { useState } from "react";

import { InlineImageControl } from "./InlineImageControl";

/** Standalone image field for server-rendered forms — controlled hidden input. */
export function ImageField({ name, defaultValue }: { name: string; defaultValue: string }) {
  const [url, setUrl] = useState(defaultValue);
  return (
    <div>
      <InlineImageControl value={url} onChange={setUrl} />
      <input type="hidden" name={name} value={url} readOnly />
    </div>
  );
}
