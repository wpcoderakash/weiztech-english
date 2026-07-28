import type { Metadata } from "next";

import { PostCard } from "@/components/blog";
import { Container, Section } from "@/components/layout";
import { PageHero } from "@/components/sections";
import { POSTS } from "@/content/posts";

import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Our Blog - Weiz Technologies",
};

/**
 * `/blog/` — the post index.
 *
 * The source is a Bricks query loop with `infinite_scroll: true`. With nine
 * posts in a three-column grid that is three rows, all of which fit on one
 * screen at any desktop size, so every post is rendered and there is nothing
 * to scroll for. PHASE-5 §3 anticipated client-side pagination; at this
 * volume it would be machinery with no user-visible effect. If the blog is
 * relaunched and the count grows, `POSTS` is already sorted newest-first and
 * slicing it is a two-line change.
 */
export default function BlogPage() {
  return (
    <>
      <PageHero
        className={styles.hero}
        innerClassName={styles.heroInner}
        headingId="hero-heading"
        heading="Our Blog"
        body="Learn about IT with our blog. We share helpful articles and news."
        bodyTone="muted"
        bodySize="m"
      />

      <Section spacing="compact" className={styles.postsSection}>
        <Container className={styles.grid}>
          {POSTS.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </Container>
      </Section>
    </>
  );
}
