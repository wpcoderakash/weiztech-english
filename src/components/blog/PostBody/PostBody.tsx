import { Fragment } from "react";

import { Link } from "@/components/primitives";
import type { PostBlock, TextRun } from "@/types/content";

import styles from "./PostBody.module.css";

export interface PostBodyProps {
  blocks: readonly PostBlock[];
}

function Runs({ runs }: { runs: readonly TextRun[] }) {
  return (
    <>
      {runs.map((run, i) => {
        let node = <>{run.t}</>;
        if (run.b) node = <strong>{node}</strong>;
        if (run.i) node = <em>{node}</em>;
        if (run.href) {
          node = (
            <Link href={run.href} className={styles.link}>
              {node}
            </Link>
          );
        }
        return <Fragment key={i}>{node}</Fragment>;
      })}
    </>
  );
}

/**
 * PostBody — renders a post's typed blocks.
 *
 * No `dangerouslySetInnerHTML`: the extractor already reduced the Gutenberg
 * HTML to headings, paragraphs and lists with inline runs, so everything here
 * is real React. Headings render at the level the source used (h2/h3), which
 * sits correctly under the post's h1.
 */
export function PostBody({ blocks }: PostBodyProps) {
  return (
    <div className={styles.body}>
      {blocks.map((block, i) => {
        if (block.type === "heading") {
          const Tag = block.level === 2 ? "h2" : "h3";
          return (
            <Tag key={i} className={styles.heading}>
              <Runs runs={block.runs} />
            </Tag>
          );
        }

        if (block.type === "list") {
          const Tag = block.ordered ? "ol" : "ul";
          return (
            <Tag key={i} className={styles.list}>
              {block.items.map((item, j) => (
                <li key={j}>
                  <Runs runs={item} />
                </li>
              ))}
            </Tag>
          );
        }

        return (
          <p key={i} className={styles.paragraph}>
            <Runs runs={block.runs} />
          </p>
        );
      })}
    </div>
  );
}
