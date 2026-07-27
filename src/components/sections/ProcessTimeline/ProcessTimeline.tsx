import { Heading, Text } from "@/components/primitives";

import styles from "./ProcessTimeline.module.css";

export interface ProcessStep {
  title: string;
  body: string;
}

export interface ProcessTimelineProps {
  steps: readonly ProcessStep[];
}

/**
 * ProcessTimeline — replaces the NextBricks `next_timeline` element holding
 * the five development-process steps.
 *
 * The original is a horizontally scrubbed GSAP timeline (`scrub: true`, with
 * left/right/centre fades) built on a rail of blocks. The structure it renders
 * is a simple ordered sequence: heading, a marker on the rail, then a body
 * panel (`.timeline-content-text` — space-s padding, rgba(13,13,33,0.59),
 * 8px radius).
 *
 * Reproduced here as a semantic <ol> on a static rail, measured off the live
 * page: each step is a 384/192/384 grid inside the 960px width--xl column,
 * padded 40px, heading left, dot centre, panel right — no alternation. The
 * scrub animation is Phase 11's; the resting layout is final and the sequence
 * reads correctly with no JS.
 */
export function ProcessTimeline({ steps }: ProcessTimelineProps) {
  return (
    <ol className={styles.timeline}>
      {steps.map((step) => (
        <li key={step.title} className={styles.step}>
          <Heading as="h3" className={styles.title}>
            {step.title}
          </Heading>
          <span className={styles.marker} aria-hidden="true" />
          <div className={styles.content}>
            <Text>{step.body}</Text>
          </div>
        </li>
      ))}
    </ol>
  );
}
