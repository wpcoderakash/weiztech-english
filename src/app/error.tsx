"use client";

import { useEffect } from "react";

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Button, Heading, Text } from "@/components/primitives";

import styles from "./error.module.css";

/**
 * Route-level error boundary.
 *
 * No equivalent exists in the original. Styled to match the 404 template so a
 * runtime failure still looks like part of the site.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Section spacing="large">
      <Container className={styles.inner}>
        <Heading as="h1">Something went wrong.</Heading>
        <Text size="m" tone="muted">
          An unexpected error occurred. Try again, or head back to the homepage.
        </Text>
        <div className={styles.actions}>
          <Button onClick={reset} variant="primary" icon="ion-md-repeat">
            Try again
          </Button>
          <Button href="/" variant="outline" icon="ion-ios-paper-plane">
            Go Home
          </Button>
        </div>
      </Container>
    </Section>
  );
}
