"use client";

import { useMemo } from "react";

import Link from "@tiptap/extension-link";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import type { TiptapNode } from "@/lib/cms/blocks";
import { isRunArray } from "@/lib/cms/runs";
import type { TextRun } from "@/types/content";

/**
 * Rich inline copy editor (bold / italic / link) for page text fields.
 * Value stays a PLAIN STRING while no formatting is used — byte-identical
 * round trips — and becomes TextRun[] the moment an editor formats
 * something (the Text primitive renders both).
 */
export type RichValue = string | TextRun[];

function toDoc(value: RichValue): TiptapNode {
  const runs: TextRun[] = isRunArray(value) ? value : plainToRuns(value);
  const content: TiptapNode[] = [];
  let paragraph: TiptapNode[] = [];
  const flush = () => {
    content.push({ type: "paragraph", ...(paragraph.length ? { content: paragraph } : {}) });
    paragraph = [];
  };
  for (const run of runs) {
    const marks = [];
    if (run.b) marks.push({ type: "bold" });
    if (run.i) marks.push({ type: "italic" });
    if (run.href) marks.push({ type: "link", attrs: { href: run.href } });
    if (run.t) paragraph.push({ type: "text", text: run.t, ...(marks.length ? { marks } : {}) });
    if (run.br) flush();
  }
  flush();
  return { type: "doc", content };
}

function plainToRuns(text: string): TextRun[] {
  const lines = text.split("\n");
  return lines.map((line, i) => ({ t: line, ...(i < lines.length - 1 ? { br: true } : {}) }));
}

function docToValue(doc: TiptapNode): RichValue {
  const runs: TextRun[] = [];
  const paragraphs = doc.content ?? [];
  paragraphs.forEach((par, pi) => {
    for (const node of par.content ?? []) {
      if (node.type !== "text" || !node.text) continue;
      const run: TextRun = { t: node.text };
      for (const mark of node.marks ?? []) {
        if (mark.type === "bold") run.b = true;
        if (mark.type === "italic") run.i = true;
        if (mark.type === "link" && typeof mark.attrs?.href === "string")
          run.href = mark.attrs.href;
      }
      runs.push(run);
    }
    if (pi < paragraphs.length - 1) {
      const last = runs[runs.length - 1];
      if (last) last.br = true;
      else runs.push({ t: "", br: true });
    }
  });
  const plainOnly = runs.every((r) => !r.b && !r.i && !r.href);
  if (plainOnly) return runs.map((r) => r.t + (r.br ? "\n" : "")).join("");
  return runs;
}

export function InlineRichText({
  value,
  onChange,
}: {
  value: RichValue;
  onChange: (next: RichValue) => void;
}) {
  const initialDoc = useMemo(() => toDoc(value), []); // eslint-disable-line react-hooks/exhaustive-deps -- editor owns state after mount

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: false,
        strike: false,
        code: false,
        codeBlock: false,
        blockquote: false,
        bulletList: false,
        orderedList: false,
        horizontalRule: false,
        link: false,
      }),
      Link.configure({ openOnClick: false }),
    ],
    content: initialDoc as object,
    onUpdate: ({ editor: e }) => onChange(docToValue(e.getJSON() as TiptapNode)),
  });

  const btn = (label: string, active: boolean, onClick: () => void) => (
    <button
      type="button"
      className={`rb-btn ${active ? "rb-btn-active" : ""}`}
      onMouseDown={(event) => {
        event.preventDefault();
        onClick();
      }}
    >
      {label}
    </button>
  );

  return (
    <div className="rb-wrap">
      {editor ? (
        <div className="rb-toolbar">
          {btn("B", editor.isActive("bold"), () => editor.chain().focus().toggleBold().run())}
          {btn("I", editor.isActive("italic"), () => editor.chain().focus().toggleItalic().run())}
          {btn("link", editor.isActive("link"), () => {
            const prev = (editor.getAttributes("link").href as string | undefined) ?? "";
            const href = window.prompt("Link URL (empty to remove)", prev);
            if (href === null) return;
            if (href === "") editor.chain().focus().unsetLink().run();
            else editor.chain().focus().setLink({ href }).run();
          })}
        </div>
      ) : null}
      <EditorContent editor={editor} className="rb-editor rb-editor-plain" />
    </div>
  );
}
