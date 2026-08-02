import type { Metadata } from "next";

import { PostCard } from "@/components/blog";
import { Container, Section } from "@/components/layout";
import { Reveal } from "@/components/motion";
import { PageHero } from "@/components/sections";
import { BLOG_HERO_STEPS, BLOG_POSTS_STEPS } from "@/content/animations/pages";
import { getPosts } from "@/lib/cms/getContent";
import { DESCRIPTIONS, pageMetadata } from "@/lib/seo";

import styles from "./page.module.css";

/** Rank Math-resolved title; the description is CHANGE #30 (lib/seo.ts). */
export const metadata: Metadata = pageMetadata({
  title: "Our Blog",
  description: DESCRIPTIONS.blog,
  path: "/blog/",
  /* Rank Math treats the posts page as an archive: og:type website. */
  ogType: "website",
});

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
export default async function BlogPage() {
  const POSTS = await getPosts();

  return (
    <>
      <Reveal steps={BLOG_HERO_STEPS}>
        <PageHero
          className={styles.hero}
          innerClassName={styles.heroInner}
          headingId="hero-heading"
          heading="Our Blog"
          body="Learn about IT with our blog. We share helpful articles and news."
          bodyTone="muted"
          bodySize="m"
        />
      </Reveal>

      <Reveal steps={BLOG_POSTS_STEPS}>
        <Section spacing="compact" className={styles.postsSection}>
          <Container className={styles.grid}>
            {POSTS.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </Container>
        </Section>
      </Reveal>
    </>
  );
}
