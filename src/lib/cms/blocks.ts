import type { PostBlock, TextRun } from "@/types/content";

/**
 * PostBlock[] ⇄ Tiptap document conversion — pure, dependency-free, used by
 * the RichBlocksField editor and by the round-trip fidelity test. The stored
 * shape stays PostBlock[] (the frontend renderer is untouched); Tiptap is
 * only the editing surface.
 */

interface TiptapMark {
  type: string;
  attrs?: Record<string, unknown>;
}
export interface TiptapNode {
  type: string;
  attrs?: Record<string, unknown>;
  content?: TiptapNode[];
  text?: string;
  marks?: TiptapMark[];
}

function runsToInline(runs: TextRun[]): TiptapNode[] {
  const out: TiptapNode[] = [];
  for (const run of runs) {
    const marks: TiptapMark[] = [];
    if (run.b) marks.push({ type: "bold" });
    if (run.i) marks.push({ type: "italic" });
    if (run.href) marks.push({ type: "link", attrs: { href: run.href } });
    if (run.t.length > 0)
      out.push({ type: "text", text: run.t, ...(marks.length ? { marks } : {}) });
    if (run.br) out.push({ type: "hardBreak" });
  }
  return out;
}

function inlineToRuns(nodes: TiptapNode[] | undefined): TextRun[] {
  const runs: TextRun[] = [];
  for (const node of nodes ?? []) {
    if (node.type === "hardBreak") {
      const prev = runs[runs.length - 1];
      if (prev) prev.br = true;
      else runs.push({ t: "", br: true });
      continue;
    }
    if (node.type !== "text" || !node.text) continue;
    const run: TextRun = { t: node.text };
    for (const mark of node.marks ?? []) {
      if (mark.type === "bold") run.b = true;
      if (mark.type === "italic") run.i = true;
      if (mark.type === "link" && typeof mark.attrs?.href === "string") run.href = mark.attrs.href;
    }
    runs.push(run);
  }
  return runs;
}

export function blocksToDoc(blocks: PostBlock[]): TiptapNode {
  const content: TiptapNode[] = blocks.map((block) => {
    if (block.type === "image") {
      return { type: "image", attrs: { src: block.src, alt: block.alt } };
    }
    if (block.type === "heading") {
      return { type: "heading", attrs: { level: block.level }, content: runsToInline(block.runs) };
    }
    if (block.type === "paragraph") {
      const inline = runsToInline(block.runs);
      return { type: "paragraph", ...(inline.length ? { content: inline } : {}) };
    }
    return {
      type: block.ordered ? "orderedList" : "bulletList",
      ...(block.ordered ? { attrs: { start: 1 } } : {}),
      content: block.items.map((item) => ({
        type: "listItem",
        content: [{ type: "paragraph", content: runsToInline(item) }],
      })),
    };
  });
  return { type: "doc", content };
}

export function docToBlocks(doc: TiptapNode): PostBlock[] {
  const blocks: PostBlock[] = [];
  for (const node of doc.content ?? []) {
    if (node.type === "image") {
      const src = typeof node.attrs?.src === "string" ? node.attrs.src : "";
      const alt = typeof node.attrs?.alt === "string" ? node.attrs.alt : "";
      if (src) blocks.push({ type: "image", src, alt });
      continue;
    }
    if (node.type === "heading") {
      const level = node.attrs?.level === 3 ? 3 : 2;
      blocks.push({ type: "heading", level, runs: inlineToRuns(node.content) });
    } else if (node.type === "paragraph") {
      blocks.push({ type: "paragraph", runs: inlineToRuns(node.content) });
    } else if (node.type === "bulletList" || node.type === "orderedList") {
      blocks.push({
        type: "list",
        ordered: node.type === "orderedList",
        items: (node.content ?? []).map((li) => inlineToRuns(li.content?.[0]?.content)),
      });
    }
  }
  return blocks;
}

/** True when a value is a PostBlock[] the rich editor can own. */
export function isBlockArray(value: unknown): value is PostBlock[] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every(
      (b) =>
        b !== null &&
        typeof b === "object" &&
        "type" in b &&
        ["heading", "paragraph", "list", "image"].includes((b as { type: string }).type),
    )
  );
}
