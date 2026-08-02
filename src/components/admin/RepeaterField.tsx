"use client";

import { useState } from "react";

import { isImagePath } from "@/lib/cms/imagePath";
import { isRunArray } from "@/lib/cms/runs";

import { InlineImageControl } from "./InlineImageControl";
import { InlineRichText } from "./InlineRichText";

/**
 * C8 — repeater editing for arrays of objects inside a section: reorder
 * (up/down), duplicate, remove, and add (cloning the first item's shape with
 * emptied strings). The whole array serialises to a hidden input as JSON;
 * the server rebuilder swaps it wholesale after a shape check. Items keep
 * the exact key structure of the seeded content, so components can't
 * receive a shape they don't know.
 */

type Item = Record<string, unknown>;

function cloneEmptied(item: Item): Item {
  const walk = (v: unknown): unknown => {
    if (typeof v === "string") return "";
    if (typeof v === "number") return 0;
    if (typeof v === "boolean") return v;
    if (Array.isArray(v)) return v.length > 0 && typeof v[0] === "object" ? [walk(v[0])] : [];
    if (v !== null && typeof v === "object") {
      return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, walk(x)]));
    }
    return v;
  };
  return walk(item) as Item;
}

function labelize(key: string): string {
  return key.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[_-]/g, " ");
}

function ItemFields({
  value,
  onChange,
  fieldKey,
}: {
  value: unknown;
  onChange: (next: unknown) => void;
  fieldKey?: string;
}) {
  if (typeof value === "string") {
    if (isImagePath(value, fieldKey)) {
      return <InlineImageControl value={value} onChange={(url) => onChange(url)} />;
    }
    const long = value.length > 70 || value.includes("\n");
    return long ? (
      <InlineRichText value={value} onChange={(next) => onChange(next)} />
    ) : (
      <input className="rp-field" value={value} onChange={(e) => onChange(e.target.value)} />
    );
  }
  if (typeof value === "number") {
    return (
      <input
        className="rp-field"
        type="number"
        step="any"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    );
  }
  if (typeof value === "boolean") {
    return (
      <select
        className="rp-field"
        value={String(value)}
        onChange={(e) => onChange(e.target.value === "true")}
      >
        <option value="true">yes</option>
        <option value="false">no</option>
      </select>
    );
  }
  if (Array.isArray(value)) {
    if (isRunArray(value)) {
      return <InlineRichText value={value} onChange={(next) => onChange(next)} />;
    }
    if (value.every((v) => typeof v === "string")) {
      return (
        <textarea
          className="rp-field"
          value={(value as string[]).join("\n")}
          rows={Math.min(10, value.length + 1)}
          onChange={(e) =>
            onChange(
              e.target.value
                .split("\n")
                .map((l) => l.trim())
                .filter((l) => l.length > 0),
            )
          }
        />
      );
    }
    return <InnerRepeater items={value as Item[]} onChange={(items) => onChange(items)} />;
  }
  if (value !== null && typeof value === "object") {
    return (
      <div className="rp-object">
        {Object.entries(value).map(([k, v]) => (
          <label key={k} className="jf-label">
            <span className="jf-key">{labelize(k)}</span>
            <ItemFields
              value={v}
              fieldKey={k}
              onChange={(next) => onChange({ ...(value as Item), [k]: next })}
            />
          </label>
        ))}
      </div>
    );
  }
  return null;
}

function InnerRepeater({ items, onChange }: { items: Item[]; onChange: (items: Item[]) => void }) {
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    const a = next[i]!;
    next[i] = next[j]!;
    next[j] = a;
    onChange(next);
  };

  return (
    <div className="rp-list">
      {items.map((item, i) => (
        <fieldset key={i} className="jf-group">
          <legend>
            #{i + 1}
            <span className="rp-controls">
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0} title="Move up">
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === items.length - 1}
                title="Move down"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() =>
                  onChange([...items.slice(0, i + 1), structuredClone(item), ...items.slice(i + 1)])
                }
                title="Duplicate"
              >
                ⧉
              </button>
              <button
                type="button"
                className="rp-danger"
                onClick={() => items.length > 1 && onChange(items.filter((_, k) => k !== i))}
                disabled={items.length <= 1}
                title="Remove"
              >
                ✕
              </button>
            </span>
          </legend>
          <ItemFields
            value={item}
            onChange={(next) => onChange(items.map((x, k) => (k === i ? (next as Item) : x)))}
          />
        </fieldset>
      ))}
      <button
        type="button"
        className="rp-add"
        onClick={() => onChange([...items, cloneEmptied(items[0] ?? {})])}
      >
        + Add item
      </button>
    </div>
  );
}

export function RepeaterField({ name, items: initial }: { name: string; items: Item[] }) {
  const [items, setItems] = useState<Item[]>(initial);

  /* CONTROLLED hidden input — an uncontrolled one was observed reverting to
     its defaultValue on a later React pass, silently discarding reorders. */
  return (
    <div>
      <InnerRepeater items={items} onChange={setItems} />
      <input type="hidden" name={name} value={JSON.stringify(items)} readOnly />
    </div>
  );
}
