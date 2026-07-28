import { notFound } from "next/navigation";

import type { Metadata } from "next";

import { PostBody } from "@/components/blog";
import { Container, Section } from "@/components/layout";
import { Text } from "@/components/primitives";
import { ContactCTA, PageHero } from "@/components/sections";
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

  const published = new Date(`${post.date}T00:00:00Z`);

  return (
    <>
      <PageHero className={styles.hero} headingId="post-heading" heading={post.title}>
        <div className={styles.meta}>
          <span className={styles.category}>{post.category.label}</span>
          <Text as="span" className={styles.date}>
            <time dateTime={post.date}>
              {published.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
                timeZone: "UTC",
              })}
            </time>
          </Text>
        </div>
      </PageHero>

      <Section className={styles.bodySection}>
        <Container className={styles.bodyInner}>
          <PostBody blocks={post.blocks} />
        </Container>
      </Section>

      <ContactCTA
        eyebrow="Get in Touch"
        heading="Connect with Us Today"
        body="Have a question or need assistance? Contact us today. Our team is ready to help you."
      />
    </>
  );
}
