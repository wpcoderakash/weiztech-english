import { notFound } from "next/navigation";

import { RichBlocksField } from "@/components/admin";
import { supabaseAdmin } from "@/lib/supabase/server";
import type { Post } from "@/types/content";

import styles from "../../../admin.module.css";

import { savePostBody } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminPostEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: post } = await supabaseAdmin()
    .from("posts")
    .select("id, slug, title, body")
    .eq("id", id)
    .single();
  if (!post) notFound();

  const body = post.body as Post;

  return (
    <div className={styles.panel}>
      <div className={styles.panelHead}>
        <span>
          Edit post — <strong>{post.title}</strong>
        </span>
        <a className={styles.miniBtn} href={`/${post.slug}/`} target="_blank" rel="noreferrer">
          view live
        </a>
      </div>
      <form action={savePostBody.bind(null, post.id)} className="jf-form">
        <label className="jf-label">
          <span className="jf-key">title</span>
          <input className={styles.loginField} name="title" defaultValue={body.title} required />
        </label>
        <label className="jf-label">
          <span className="jf-key">excerpt</span>
          <textarea
            className={styles.loginField}
            name="excerpt"
            defaultValue={body.excerpt}
            rows={3}
          />
        </label>
        <span className="jf-key">content</span>
        <RichBlocksField name="blocks" blocks={body.blocks} />
        <button
          type="submit"
          className={styles.exportBtn}
          style={{ border: 0, marginBlockStart: 14 }}
        >
          Publish changes
        </button>
      </form>
    </div>
  );
}
