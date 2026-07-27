import { EyebrowBadge, ParticlesField } from "@/components/decorative";
import { Container, Section } from "@/components/layout";
import { Heading, Text } from "@/components/primitives";

import styles from "./PageHero.module.css";

export interface PageHeroProps {
  eyebrow?: { label: string; chip?: string | undefined } | undefined;
  heading: string;
  headingId?: string | undefined;
  body?: string | undefined;
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
          {body ? <Text>{body}</Text> : null}
          {children}
        </div>
      </Container>
      {after}
    </Section>
  );
}
