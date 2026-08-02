import { Fragment } from "react";

import { Link } from "@/components/primitives/Link";
import type { TextRun } from "@/types/content";

/**
 * Inline renderer for TextRun[] page copy — the same shape and precedence
 * as the blog's PostBody runs (bold wraps italic wraps link, then a hard
 * break). Unstyled beyond the site's own strong/em defaults; links pick up
 * the .richLink treatment.
 */
export function RichRuns({
  runs,
  linkClassName,
}: {
  runs: readonly TextRun[];
  linkClassName?: string;
}) {
  return (
    <>
      {runs.map((run, i) => {
        let node = <>{run.t}</>;
        if (run.b) node = <strong>{node}</strong>;
        if (run.i) node = <em>{node}</em>;
        if (run.href) {
          node = (
            <Link href={run.href} {...(linkClassName ? { className: linkClassName } : {})}>
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
