"use client";

import { useMemo, useRef } from "react";

import ImageExt from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import { blocksToDoc, docToBlocks, type TiptapNode } from "@/lib/cms/blocks";
import type { PostBlock } from "@/types/content";

/**
 * Rich block editor (Tiptap) for PostBlock[] fields — headings 2/3, bold,
 * italic, links, bullet/ordered lists, hard breaks. Serialises back to the
 * exact PostBlock[] shape into a hidden input (round-trip is covered by a
 * fidelity test over every existing document).
 */
export function RichBlocksField({ name, blocks }: { name: string; blocks: PostBlock[] }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const initial = useMemo(() => JSON.stringify(blocks), [blocks]);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        codeBlock: false,
        blockquote: false,
        horizontalRule: false,
        link: false,
      }),
      Link.configure({ openOnClick: false }),
      ImageExt,
    ],
    content: blocksToDoc(blocks) as object,
    onUpdate: ({ editor: e }) => {
      if (inputRef.current) {
        inputRef.current.value = JSON.stringify(docToBlocks(e.getJSON() as TiptapNode));
      }
    },
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
          {btn("H2", editor.isActive("heading", { level: 2 }), () =>
            editor.chain().focus().toggleHeading({ level: 2 }).run(),
          )}
          {btn("H3", editor.isActive("heading", { level: 3 }), () =>
            editor.chain().focus().toggleHeading({ level: 3 }).run(),
          )}
          {btn("• list", editor.isActive("bulletList"), () =>
            editor.chain().focus().toggleBulletList().run(),
          )}
          {btn("1. list", editor.isActive("orderedList"), () =>
            editor.chain().focus().toggleOrderedList().run(),
          )}
          {btn("🖼 image", false, () => imageInputRef.current?.click())}
          {btn("link", editor.isActive("link"), () => {
            const prev = (editor.getAttributes("link").href as string | undefined) ?? "";
            const href = window.prompt("Link URL (empty to remove)", prev);
            if (href === null) return;
            if (href === "") editor.chain().focus().unsetLink().run();
            else editor.chain().focus().setLink({ href }).run();
          })}
        </div>
      ) : null}
      <EditorContent editor={editor} className="rb-editor" />
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        hidden
        data-rb-image
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (!file || !editor) return;
          void (async () => {
            const body = new FormData();
            body.append("file", file);
            const res = await fetch("/admin/api/upload", { method: "POST", body });
            const json = (await res.json()) as { url?: string };
            if (json.url) {
              const alt = window.prompt("Describe the image (alt text)", "") ?? "";
              editor.chain().focus().setImage({ src: json.url, alt }).run();
            }
          })();
        }}
      />
      <input ref={inputRef} type="hidden" name={name} defaultValue={initial} />
    </div>
  );
}
