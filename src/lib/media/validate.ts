import "server-only";

/**
 * Upload validation shared by the two upload paths (media library action and
 * the inline editor route).
 *
 * Two checks the client-declared MIME type cannot fake:
 *
 * 1. Magic bytes — the file's real signature must match its declared type.
 *    A .png that is actually an .exe (or an SVG) is rejected.
 * 2. SVG screening — SVG is XML and can carry scripts. Uploads keep working,
 *    but any SVG containing active content (script, event handlers,
 *    javascript: URLs, foreignObject, external references) is rejected.
 */

function startsWith(bytes: Uint8Array, sig: number[], offset = 0): boolean {
  if (bytes.length < offset + sig.length) return false;
  return sig.every((b, i) => bytes[offset + i] === b);
}

function looksLikeSvg(bytes: Uint8Array): boolean {
  /* Text head: optional BOM/whitespace/comments, then <?xml, <!DOCTYPE or <svg. */
  const head = new TextDecoder("utf-8", { fatal: false })
    .decode(bytes.slice(0, 1024))
    .replace(/^﻿/, "")
    .trimStart()
    .toLowerCase();
  return head.startsWith("<?xml") || head.startsWith("<!doctype svg") || head.startsWith("<svg");
}

/** True when the real bytes match the declared MIME type. */
export function matchesDeclaredType(mime: string, bytes: Uint8Array): boolean {
  switch (mime) {
    case "image/png":
      return startsWith(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    case "image/jpeg":
      return startsWith(bytes, [0xff, 0xd8, 0xff]);
    case "image/gif":
      return startsWith(bytes, [0x47, 0x49, 0x46, 0x38]); // GIF87a / GIF89a
    case "image/webp":
      /* RIFF....WEBP */
      return (
        startsWith(bytes, [0x52, 0x49, 0x46, 0x46]) &&
        startsWith(bytes, [0x57, 0x45, 0x42, 0x50], 8)
      );
    case "video/mp4":
      /* ....ftyp at offset 4. */
      return startsWith(bytes, [0x66, 0x74, 0x79, 0x70], 4);
    case "image/svg+xml":
      return looksLikeSvg(bytes);
    default:
      return false;
  }
}

const SVG_ACTIVE_CONTENT = /<script|<foreignObject|<use\s[^>]*href\s*=\s*["']?\s*(?:https?:)?\/\//i;
const SVG_EVENT_HANDLER = /\son[a-z]+\s*=/i;
const SVG_JS_URL = /(?:href|xlink:href)\s*=\s*["']\s*javascript:/i;

/** True when an SVG contains scripts/handlers and must be rejected. */
export function svgHasActiveContent(bytes: Uint8Array): boolean {
  const text = new TextDecoder("utf-8", { fatal: false }).decode(bytes);
  return SVG_ACTIVE_CONTENT.test(text) || SVG_EVENT_HANDLER.test(text) || SVG_JS_URL.test(text);
}

/**
 * Full check for an upload. Returns null when the file is acceptable, or a
 * short reason string when it must be rejected.
 */
export function rejectUpload(mime: string, bytes: Uint8Array): string | null {
  if (!matchesDeclaredType(mime, bytes)) return "file content does not match its type";
  if (mime === "image/svg+xml" && svgHasActiveContent(bytes)) {
    return "SVG contains scripts or event handlers";
  }
  return null;
}
