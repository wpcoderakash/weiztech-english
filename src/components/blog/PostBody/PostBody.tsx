import { Fragment } from "react";

import { Link } from "@/components/primitives";
import type { PostBlock, TextRun } from "@/types/content";

import styles from "./PostBody.module.css";

export interface PostBodyProps {
  blocks: readonly PostBlock[];
  /**
   * How blocks are spaced.
   *
   * `post` — a flex column with a `--space-s` row gap and a matching top
   * margin on headings.
   *
   * `document` — plain block flow: paragraphs carry `margin-block-end: 1.2em`
   * and headings carry no margin at all, so a heading picks up the preceding
   * paragraph's trailing margin and the paragraph after it sits flush. That is
   * what `/privacy-policy/` measures on the live site — 19.2px before every
   * heading and 0 after it, not a uniform gap.
   */
  flow?: "post" | "document" | undefined;
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
        return (
          <Fragment key={i}>
            {node}
            {run.br ? <br /> : null}
          </Fragment>
        );
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
export function PostBody({ blocks, flow = "post" }: PostBodyProps) {
  return (
    <div className={[styles.body, flow === "document" ? styles.document : ""].join(" ").trim()}>
      {blocks.map((block, i) => {
        if (block.type === "heading") {
          const Tag = block.level === 2 ? "h2" : "h3";
          return (
            <Tag key={i} className={styles.heading}>
              <Runs runs={block.runs} />
            </Tag>
          );
        }

        if (block.type === "image") {
           
          return (
            <img key={i} className={styles.image} src={block.src} alt={block.alt} loading="lazy" />
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
