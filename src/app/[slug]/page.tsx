import { notFound } from "next/navigation";

import type { Metadata } from "next";

import { PostBody } from "@/components/blog";
import { Container, Section } from "@/components/layout";
import { PageHero } from "@/components/sections";
import { POSTS, getPost } from "@/content/posts";

import styles from "./page.module.css";

/**
 * `/[slug]/` — the nine blog posts, which sit at the site ROOT rather than
 * under `/blog/` (PHASE-4 §2.2). Every indexed URL depends on that shape.
 *
 * `dynamicParams = false` is what makes a root-level catch-all safe: only the
 * nine known slugs render, and anything else 404s instead of matching this
 * route. Static segments like `/products/` take precedence regardless, but
 * this closes the rest.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  /* The source has no per-post description — PHASE-5 §5 records all nine as
     auto-generated. The excerpt is the honest stand-in until Phase 13. */
  return {
    title: `${post.title} - Weiz Technologies`,
    ...(post.excerpt ? { description: post.excerpt } : {}),
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  /*
   * The hero labels this "Last updated:" but the live template renders the
   * PUBLICATION date — verified against three posts (this one, E-E-A-T and
   * the laptops guide). `post.modified` is a uniform 2025-01-08 across all
   * nine, a bulk edit, and matches nothing on the live page. The source's
   * label is kept; the value it actually shows is used.
   */
  const published = new Date(`${post.date}T00:00:00Z`);

  return (
    <>
      <PageHero
        className={styles.hero}
        innerClassName={styles.heroInner}
        headingId="post-heading"
        heading={post.title}
      >
        {/*
          The source's post meta is `Posted by Weiz Team / Last updated: <date>`
          — the author and the MODIFIED date, not the category and the
          publication date. Measured on the live template (`.brxe-post-meta`):
          three spans in an 18px flex row with a 20px gap, in var(--body-color).
        */}
        <div className={styles.meta}>
          <span className={styles.metaItem}>Posted by Weiz Team</span>
          <span className={styles.separator} aria-hidden="true">
            /
          </span>
          <span className={styles.metaItem}>
            Last updated:{" "}
            <time dateTime={post.date}>
              {published.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
                timeZone: "UTC",
              })}
            </time>
          </span>
        </div>
      </PageHero>

      <Section className={styles.bodySection}>
        <Container className={styles.bodyInner}>
          {/* Same document flow as the legal page: the live post body is
              block flow with a 1.2em margin under each paragraph — 21.6px at
              18px copy — and no margin on the headings. */}
          <PostBody blocks={post.blocks} flow="document" />
        </Container>
      </Section>
    </>
  );
}
