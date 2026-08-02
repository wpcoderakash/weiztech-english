"use client";

import { useRef, useState } from "react";

/** Preview + URL + inline upload; controlled by the parent via onChange. */
export function InlineImageControl({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const upload = async (file: File) => {
    setBusy(true);
    setError(null);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/admin/api/upload", { method: "POST", body });
      const json = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !json.url) throw new Error(json.error ?? "upload failed");
      onChange(json.url);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "upload failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="img-field">
      <div className="img-preview">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element -- raw preview of arbitrary paths
          <img src={value} alt="" loading="lazy" />
        ) : (
          <span>no image</span>
        )}
      </div>
      <div className="img-controls">
        <input
          className="rp-field"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/images/… or https://…"
        />
        <div className="img-actions">
          <button
            type="button"
            className="rp-add"
            disabled={busy}
            onClick={() => fileRef.current?.click()}
          >
            {busy ? "Uploading…" : "⬆ Upload image"}
          </button>
          {error ? <span className="img-error">{error}</span> : null}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void upload(f);
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
}
