import { EyebrowBadge } from "@/components/decorative";
import { Container } from "@/components/layout";
import { Heading, Text } from "@/components/primitives";
import type { IconName } from "@/components/primitives";

import styles from "./HeroIntro.module.css";

export interface HeroIntroProps {
  eyebrow: { label: string; icon?: IconName | undefined };
  heading: string;
  body: string;
  /**
   * Software's paragraph (`#brxe-htufvg`) carries ACSS's `.text--xs`;
   * Hardware's (`#brxe-hcawog`) sets `font-size: var(--text-s)` inline.
   *
   * Both render at 16px. The utility's own `font-size: var(--text-xs)` never
   * lands: Bricks' theme style targets `.brxe-text-basic` at equal specificity
   * and wins on source order, so all the utility contributes is the 1.7
   * line-height. Measured on the live page: 16px / 27.2px against Hardware's
   * 16px / 28.8px. Reproducing the class name rather than the token is what
   * would be wrong here.
   */
  bodyTight?: boolean | undefined;
}

/**
 * HeroIntro — the two-column band directly under the hero heading on Hardware
 * (`container#dbyfzm`) and Software (`container#sbunxs`).
 *
 * A 33/67 row: eyebrow + h2 on the left, separated from the body copy on the
 * right by a 1px var(--tertiary-dark) rule. Below mobile_landscape both blocks
 * go full width and the rule is removed, so the columns stack.
 *
 * It renders inside the hero section rather than opening its own, matching the
 * source — hence a bare Container rather than a Section.
 */
export function HeroIntro({ eyebrow, heading, body, bodyTight = false }: HeroIntroProps) {
  return (
    <Container className={styles.row}>
      <div className={styles.lead}>
        <EyebrowBadge label={eyebrow.label} icon={eyebrow.icon} data-anim="intro-badge" />
        <Heading as="h2" data-anim="intro-heading">
          {heading}
        </Heading>
      </div>
      <div className={styles.body}>
        <Text size="s" className={bodyTight ? styles.bodyTight : undefined} data-anim="intro-body">
          {body}
        </Text>
      </div>
    </Container>
  );
}
