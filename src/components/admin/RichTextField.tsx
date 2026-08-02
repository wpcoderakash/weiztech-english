"use client";

import { useRef } from "react";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

/**
 * Plain-text Tiptap surface for long string fields: comfortable editing
 * (paragraph handling, no plain <textarea>), but serialises to a PLAIN
 * string — site components render these values as text nodes, so no markup
 * may ever enter them.
 */
export function RichTextField({ name, defaultValue }: { name: string; defaultValue: string }) {
  const inputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: false,
        bold: false,
        italic: false,
        strike: false,
        code: false,
        codeBlock: false,
        blockquote: false,
        bulletList: false,
        orderedList: false,
        horizontalRule: false,
        link: false,
      }),
    ],
    content: {
      type: "doc",
      content: defaultValue.split("\n").map((line) => ({
        type: "paragraph",
        ...(line.length ? { content: [{ type: "text", text: line }] } : {}),
      })),
    },
    onUpdate: ({ editor: e }) => {
      if (inputRef.current) inputRef.current.value = e.getText({ blockSeparator: "\n" });
    },
  });

  return (
    <div className="rb-wrap">
      <EditorContent editor={editor} className="rb-editor rb-editor-plain" />
      <input ref={inputRef} type="hidden" name={name} defaultValue={defaultValue} />
    </div>
  );
}
