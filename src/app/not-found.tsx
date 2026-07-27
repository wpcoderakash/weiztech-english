import { Container, Section } from "@/components/layout";
import { Button, Heading, Text } from "@/components/primitives";

import styles from "./not-found.module.css";

/**
 * 404 — Bricks template 6222.
 *
 * Copy and layout transcribed from the original: h1, muted subtext at
 * --text-m constrained to width--l, and a single primary gradient button.
 * The particles field that sits behind it is added in Phase 9 with the rest
 * of the decorative components.
 */
export default function NotFound() {
  return (
    <Section spacing="large">
      <Container className={styles.inner}>
        <Heading as="h1" className={styles.heading}>
          Oops! We can&apos;t find the page you&apos;re looking for.
        </Heading>
        <Text size="m" tone="muted" className={styles.subtext}>
          Can&apos;t find what you&apos;re looking for? Click here to go home.
        </Text>
        <div className={styles.actions}>
          <Button href="/" variant="primary" icon="ion-ios-paper-plane" iconSize="16px">
            Go Home
          </Button>
        </div>
      </Container>
    </Section>
  );
}
