"use client";

import { useOverlay } from "@/components/overlays";
import { Heading, Icon, Text } from "@/components/primitives";

import styles from "./JobPositionCard.module.css";

export interface JobPositionCardProps {
  title: string;
  summary: string;
}

/**
 * JobPositionCard — `.job-position-card` (global class ryzpvo), the six tiles
 * in the Open Positions grid.
 *
 * A row that splits 65/35 between the copy and the Apply Now button, with a
 * 1px --tertiary-dark border that turns --primary-hover on hover.
 *
 * The button opens the shared application modal. In the source all six carry
 * the same Bricks interaction — `startAnimation` → popup template 4521 — so
 * the modal never learns which position was clicked. Reproduced: the title is
 * announced to screen readers via `aria-label` so the control is not six
 * identical "Apply Now" buttons, but nothing is sent with the form.
 */
export function JobPositionCard({ title, summary }: JobPositionCardProps) {
  const { open } = useOverlay();

  return (
    <div className={styles.card} data-anim="job-card">
      <div className={styles.content}>
        <Heading as="h3" className={styles.title}>
          {title}
        </Heading>
        <Text className={styles.summary}>{summary}</Text>
      </div>
      <div className={styles.action}>
        <button
          type="button"
          className={styles.apply}
          onClick={() => open("careersForm")}
          aria-label={`Apply now for ${title}`}
        >
          {/* The label is a direct text node, as Bricks renders it — wrapping
              it in a <span> makes it a flex item with its own box and shifts
              the pill's width. iconPosition: right, iconTypography 18. */}
          Apply Now
          <Icon name="ion-ios-arrow-round-forward" size="18px" />
        </button>
      </div>
    </div>
  );
}
