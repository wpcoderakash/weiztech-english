import { EyebrowBadge, ParticlesField } from "@/components/decorative";
import { Container, Section } from "@/components/layout";
import { Heading, Text } from "@/components/primitives";

import styles from "./PageHero.module.css";

export interface PageHeroProps {
  eyebrow?: { label: string; chip?: string | undefined } | undefined;
  heading: string;
  headingId?: string | undefined;
  body?: string | undefined;
  /**
   * Hero body colour. Home's (`#brxe-rmnpoh`) declares none and so inherits
   * --base; Hardware, Software, Web Design and Cybersec all set #98a2b3.
   */
  bodyTone?: "base" | "muted" | undefined;
  /**
   * Hero body size. `s` everywhere except `/blog/`, whose `#brxe-swqfzc`
   * sets `font-size: var(--text-m)` inline — 18px, and unlike the ACSS
   * `.text--m` utility an inline rule does beat the theme style.
   */
  bodySize?: "s" | "m" | undefined;
  /**
   * Trailing margin on the hero body, which varies per page:
   *   Home      `margin-bottom: var(--space-s)`  (#brxe-rmnpoh)
   *   Cybersec  ACSS `.margin-bottom--xs`        (#brxe-cjsoyo)
   *   Hardware, Software                          none
   */
  bodyGap?: "none" | "xs" | "s" | undefined;
  containerId?: string | undefined;
  children?: React.ReactNode | undefined;
  /** Extra classes on the section — for the per-page padding variations. */
  className?: string | undefined;
  /** Extra classes on the centred container. */
  innerClassName?: string | undefined;
  /**
   * Sibling containers rendered after the centred column but still inside the
   * hero section. Hardware and Software both stack a `HeroIntro` and a
   * `LogoMarquee` here rather than opening a new section.
   */
  after?: React.ReactNode | undefined;
}

/**
 * PageHero — the hero band shared by every page (9 instances).
 *
 * Particles fill the section behind a centred column constrained to
 * width--l (60% of content width). `children` renders below the body,
 * which Home uses for its two CTA buttons.
 */
export function PageHero({
  eyebrow,
  heading,
  headingId,
  body,
  bodyTone = "base",
  bodySize = "s",
  bodyGap = "none",
  containerId,
  children,
  className,
  innerClassName,
  after,
}: PageHeroProps) {
  return (
    <Section spacing="large" className={[styles.hero, className].filter(Boolean).join(" ")}>
      <ParticlesField />
      <Container
        id={containerId}
        className={[styles.inner, innerClassName].filter(Boolean).join(" ")}
      >
        <div className={styles.column}>
          {eyebrow ? (
            <EyebrowBadge variant="hero" label={eyebrow.label} chip={eyebrow.chip} />
          ) : null}
          <Heading as="h1" id={headingId}>
            {heading}
          </Heading>
          {body ? (
            <Text size={bodySize} tone={bodyTone} className={styles[`gap-${bodyGap}`]}>
              {body}
            </Text>
          ) : null}
          {children}
        </div>
      </Container>
      {after}
    </Section>
  );
}
