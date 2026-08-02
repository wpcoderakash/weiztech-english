"use client";

import { useRef, useState } from "react";

interface LibraryItem {
  url: string;
  alt: string;
}

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
  const [library, setLibrary] = useState<LibraryItem[] | null>(null);
  const [showLibrary, setShowLibrary] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const openLibrary = async () => {
    setShowLibrary((v) => !v);
    if (library === null) {
      try {
        const res = await fetch("/admin/api/media-list");
        const json = (await res.json()) as { items?: LibraryItem[] };
        setLibrary(json.items ?? []);
      } catch {
        setLibrary([]);
      }
    }
  };

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
          <button type="button" className="rp-add" onClick={() => void openLibrary()}>
            {showLibrary ? "close library" : "📁 library"}
          </button>
          {error ? <span className="img-error">{error}</span> : null}
        </div>
        {showLibrary ? (
          <div className="img-library">
            {(library ?? []).map((item) => (
              <button
                key={item.url}
                type="button"
                className="img-library-item"
                title={item.alt || item.url.split("/").pop()}
                onClick={() => {
                  onChange(item.url);
                  setShowLibrary(false);
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- picker thumbs */}
                <img src={item.url} alt={item.alt} loading="lazy" />
              </button>
            ))}
            {library !== null && library.length === 0 ? (
              <span style={{ opacity: 0.5, fontSize: 12 }}>
                Library is empty — upload something first.
              </span>
            ) : null}
          </div>
        ) : null}
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
