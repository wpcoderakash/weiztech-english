"use client";

import { useState } from "react";

export function CopyUrl({ url, className }: { url: string; className: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        void navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      }}
    >
      {copied ? "copied!" : "copy URL"}
    </button>
  );
}
