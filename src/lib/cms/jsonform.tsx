import type { ReactNode } from "react";

import { RepeaterField, RichBlocksField, RichTextField } from "@/components/admin";
import type { PostBlock } from "@/types/content";

import { isBlockArray } from "./blocks";

/**
 * C5 — schema-less section editor engine.
 *
 * Sections hold arbitrary JSON mirroring the TS content shapes. The renderer
 * walks a value and emits fields whose NAMES are the JSON path; the rebuilder
 * walks the ORIGINAL value again and replaces leaves from the submitted form.
 * Structure (keys, array lengths, types) is therefore immutable in v1 — an
 * editor can change any text/number/flag but cannot break a component's
 * shape. Array add/remove arrives with the page-builder phase.
 */

const posix = (path: string, key: string | number) => (path ? `${path}.${key}` : String(key));

export function renderFields(value: unknown, path: string, fieldCls: string): ReactNode {
  if (typeof value === "string") {
    const long = value.length > 70 || value.includes("\n");
    return long ? (
      <RichTextField key={path} name={path} defaultValue={value} />
    ) : (
      <input key={path} className={fieldCls} name={path} defaultValue={value} type="text" />
    );
  }
  if (typeof value === "number") {
    return (
      <input
        key={path}
        className={fieldCls}
        name={path}
        defaultValue={value}
        type="number"
        step="any"
      />
    );
  }
  if (typeof value === "boolean") {
    return (
      <select key={path} className={fieldCls} name={path} defaultValue={String(value)}>
        <option value="true">yes</option>
        <option value="false">no</option>
      </select>
    );
  }
  if (Array.isArray(value)) {
    if (isBlockArray(value)) {
      return <RichBlocksField key={path} name={path} blocks={value} />;
    }
    if (value.every((v) => typeof v === "string")) {
      return (
        <textarea
          key={path}
          className={fieldCls}
          name={`${path}__lines`}
          defaultValue={(value as string[]).join("\n")}
          rows={Math.min(12, value.length + 1)}
        />
      );
    }
    /* C8: object arrays edit in a client repeater — reorder, add, duplicate,
       remove — serialised wholesale to a hidden input. */
    return <RepeaterField key={path} name={path} items={value as Record<string, unknown>[]} />;
  }
  if (value !== null && typeof value === "object") {
    return Object.entries(value).map(([k, v]) => (
      <label key={posix(path, k)} className="jf-label">
        <span className="jf-key">{labelize(k)}</span>
        {renderFields(v, posix(path, k), fieldCls)}
      </label>
    ));
  }
  return null;
}

export function rebuildFromForm(value: unknown, path: string, form: FormData): unknown {
  if (typeof value === "string") {
    const v = form.get(path);
    return v === null ? value : String(v);
  }
  if (typeof value === "number") {
    const v = form.get(path);
    if (v === null) return value;
    const n = Number(v);
    return Number.isFinite(n) ? n : value;
  }
  if (typeof value === "boolean") {
    const v = form.get(path);
    return v === null ? value : v === "true";
  }
  if (Array.isArray(value)) {
    if (isBlockArray(value)) {
      return <RichBlocksField key={path} name={path} blocks={value} />;
    }
    if (value.every((v) => typeof v === "string")) {
      const v = form.get(`${path}__lines`);
      if (v === null) return value;
      return String(v)
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);
    }
    {
      const v = form.get(path);
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

function labelize(key: string): string {
  return key.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[_-]/g, " ");
}
