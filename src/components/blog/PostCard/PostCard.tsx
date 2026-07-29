import { Heading, Link } from "@/components/primitives";
import type { Post } from "@/types/content";

import styles from "./PostCard.module.css";

export interface PostCardProps {
  post: Post;
}

/**
 * PostCard — one tile in the `/blog/` grid (`.blog-post` query loop).
 *
 * The source card is image / category pill / title. **No post has a featured
 * image** (PHASE-5 §4.5), so the source's `{featured_image}` resolves to
 * nothing and the 1.8-ratio box renders empty on the live site. Rather than
 * reproduce an empty box, the card leads with the category pill and title;
 * the image slot returns the moment a post has one.
 *
 * Titles render h3, as the live index does.
 *
 * The whole tile is the link — the source links the image and the title
 * separately, which is two tab stops to one post.
 */
export function PostCard({ post }: PostCardProps) {
  return (
    <article className={styles.card} data-anim="card">
      <Link href={`/${post.slug}/`} className={styles.link}>
        <div className={styles.meta}>
          <span className={styles.category}>{post.category.label}</span>
          <Heading as="h3" className={styles.title}>
            {post.title}
          </Heading>
        </div>
      </Link>
    </article>
  );
}
