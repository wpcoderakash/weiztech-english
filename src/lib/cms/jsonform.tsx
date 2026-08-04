import type { ReactNode } from "react";

import { ImageField, RepeaterField, RichBlocksField, RichTextField } from "@/components/admin";
import type { PostBlock } from "@/types/content";

import { isBlockArray } from "./blocks";
import { isImagePath } from "./imagePath";
import { isRunArray } from "./runs";

/**
 * C5 — schema-less section editor engine (clean rewrite; the patched
 * original had landed a renderer branch inside the REBUILDER — a JSX return
 * in rebuildFromForm — caught before any data was damaged).
 *
 * Sections hold arbitrary JSON mirroring the TS content shapes. The renderer
 * walks a value and emits fields whose NAMES are the JSON path; the rebuilder
 * walks the ORIGINAL value and replaces leaves from the submitted form. The
 * two functions must stay branch-for-branch symmetric:
 *
 *   string (image-ish) → ImageField          → string
 *   string (long)      → RichTextField       → string | TextRun[] ($runs)
 *   string (short)     → <input>             → string
 *   number / boolean   → typed inputs        → number / boolean
 *   TextRun[]          → RichTextField       → string | TextRun[]
 *   PostBlock[]        → RichBlocksField     → PostBlock[] (JSON)
 *   string[]           → lines textarea      → string[]
 *   object[]           → RepeaterField       → object[] (JSON, wholesale)
 *   object             → labelled recursion  → object
 */

const posix = (path: string, key: string | number) => (path ? `${path}.${key}` : String(key));

/**
 * Does this value render as a single NATIVE control (input / select /
 * textarea)? Only then may its wrapper be a <label>.
 *
 * A <label> forwards every click inside it to its first labelable descendant.
 * The rich-text, blocks, repeater and image widgets each carry their own
 * buttons and inputs, so wrapping them meant that clicking the editor text
 * focused the widget's first button (the "B" in the rich-text toolbar) instead
 * of placing the caret — typing then went nowhere. Those get a plain <div>.
 * Nested objects also get a <div>: a <label> inside a <label> is invalid.
 *
 * Must stay in step with the branches in renderFields below.
 */
function rendersNativeControl(value: unknown, key: string): boolean {
  if (typeof value === "string") {
    if (isImagePath(value, key)) return false; // ImageField
    return !(value.length > 70 || value.includes("\n")); // long → RichTextField
  }
  if (typeof value === "number" || typeof value === "boolean") return true;
  if (Array.isArray(value)) {
    if (isRunArray(value) || isBlockArray(value)) return false;
    return value.every((v) => typeof v === "string"); // lines textarea
  }
  return false;
}

/* A field at the section ROOT would get name="" — and browsers drop
   empty-named fields from submissions entirely (a whole top-level-array
   section silently never saved). Every input name and every FormData read
   goes through this sentinel. */
const fieldName = (path: string) => (path === "" ? "$root" : path);

export function renderFields(value: unknown, path: string, fieldCls: string): ReactNode {
  if (typeof value === "string") {
    if (isImagePath(value, path.split(".").pop() ?? "")) {
      return <ImageField key={path} name={fieldName(path)} defaultValue={value} />;
    }
    const long = value.length > 70 || value.includes("\n");
    return long ? (
      <RichTextField key={path} name={fieldName(path)} defaultValue={value} />
    ) : (
      <input
        key={path}
        className={fieldCls}
        name={fieldName(path)}
        defaultValue={value}
        type="text"
      />
    );
  }
  if (typeof value === "number") {
    return (
      <input
        key={path}
        className={fieldCls}
        name={fieldName(path)}
        defaultValue={value}
        type="number"
        step="any"
      />
    );
  }
  if (typeof value === "boolean") {
    return (
      <select key={path} className={fieldCls} name={fieldName(path)} defaultValue={String(value)}>
        <option value="true">yes</option>
        <option value="false">no</option>
      </select>
    );
  }
  if (Array.isArray(value)) {
    if (isRunArray(value)) {
      return <RichTextField key={path} name={fieldName(path)} defaultValue={value} />;
    }
    if (isBlockArray(value)) {
      return <RichBlocksField key={path} name={fieldName(path)} blocks={value} />;
    }
    if (value.every((v) => typeof v === "string")) {
      return (
        <textarea
          key={path}
          className={fieldCls}
          name={`${fieldName(path)}__lines`}
          defaultValue={(value as string[]).join("\n")}
          rows={Math.min(12, value.length + 1)}
        />
      );
    }
    /* C8: object arrays edit in a client repeater — reorder, add, duplicate,
       remove — serialised wholesale to a hidden input. */
    return (
      <RepeaterField key={path} name={fieldName(path)} items={value as Record<string, unknown>[]} />
    );
  }
  if (value !== null && typeof value === "object") {
    return Object.entries(value).map(([k, v]) => {
      const inner = (
        <>
          <span className="jf-key">{labelize(k)}</span>
          {renderFields(v, posix(path, k), fieldCls)}
        </>
      );
      /* Same class either way — identical styling, different click semantics. */
      return rendersNativeControl(v, k) ? (
        <label key={posix(path, k)} className="jf-label">
          {inner}
        </label>
      ) : (
        <div key={posix(path, k)} className="jf-label">
          {inner}
        </div>
      );
    });
  }
  return null;
}

export function rebuildFromForm(value: unknown, path: string, form: FormData): unknown {
  if (typeof value === "string") {
    const v = form.get(fieldName(path));
    if (v === null) return value;
    return unwrapRuns(String(v));
  }
  if (typeof value === "number") {
    const v = form.get(fieldName(path));
    if (v === null) return value;
    const n = Number(v);
    return Number.isFinite(n) ? n : value;
  }
  if (typeof value === "boolean") {
    const v = form.get(fieldName(path));
    return v === null ? value : v === "true";
  }
  if (Array.isArray(value)) {
    if (isRunArray(value)) {
      const v = form.get(fieldName(path));
      if (v === null) return value;
      return unwrapRuns(String(v));
    }
    if (isBlockArray(value)) {
      const v = form.get(fieldName(path));
      if (v === null) return value;
      try {
        const parsed = JSON.parse(String(v)) as unknown;
        if (Array.isArray(parsed) && (isBlockArray(parsed) || parsed.length === 0)) {
          return parsed as PostBlock[];
        }
        return value;
      } catch {
        return value;
      }
    }
    if (value.every((v) => typeof v === "string")) {
      const v = form.get(`${fieldName(path)}__lines`);
      if (v === null) return value;
      return String(v)
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);
    }
    {
      const v = form.get(fieldName(path));
      if (v === null) return value.map((item, i) => rebuildFromForm(item, posix(path, i), form));
      try {
        const parsed = JSON.parse(String(v)) as unknown;
        if (Array.isArray(parsed) && parsed.every((x) => x !== null && typeof x === "object")) {
          return parsed;
        }
        return value;
      } catch {
        return value;
      }
    }
  }
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, rebuildFromForm(v, posix(path, k), form)]),
    );
  }
  return value;
}

/* RichTextField envelope: plain string, or {"$runs":[...]} once formatted. */
function unwrapRuns(v: string): unknown {
  if (v.startsWith('{"$runs":')) {
    try {
      const parsed = JSON.parse(v) as { $runs?: unknown };
      if (isRunArray(parsed.$runs)) return parsed.$runs;
    } catch {
      /* fall through to the raw string */
    }
  }
  return v;
}

function labelize(key: string): string {
  return key.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[_-]/g, " ");
}
