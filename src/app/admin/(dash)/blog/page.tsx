import { supabaseAdmin } from "@/lib/supabase/server";

import styles from "../../admin.module.css";

import { setPostStatus, updatePostMeta } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const db = supabaseAdmin();
  const { data: posts } = await db
    .from("posts")
    .select("id, slug, title, excerpt, status, published_at, categories(name)")
    .is("deleted_at", null)
    .order("published_at", { ascending: false });

  return (
    <div className={styles.panel}>
      <div className={styles.panelHead}>
        Blog posts
        <span style={{ fontSize: 12, opacity: 0.6 }}>
          Title/excerpt edits publish instantly; the block editor arrives with the section editors.
        </span>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Post</th>
            <th>Category</th>
            <th>Status</th>
            <th>Published</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {(posts ?? []).map((post) => (
            <tr key={post.id}>
              <td>
                <details>
                  <summary style={{ cursor: "pointer", color: "#fff", fontWeight: 600 }}>
                    {post.title}
                  </summary>
                  <form
                    action={updatePostMeta.bind(null, post.id)}
                    style={{ display: "grid", gap: 8, marginBlockStart: 10, maxInlineSize: 480 }}
                  >
                    <input
                      className={styles.loginField}
                      name="title"
                      defaultValue={post.title}
                      maxLength={200}
                      required
                    />
                    <textarea
                      className={styles.loginField}
                      name="excerpt"
                      defaultValue={post.excerpt}
                      rows={3}
                      maxLength={500}
                    />
                    <button type="submit" className={styles.exportBtn} style={{ border: 0 }}>
                      Save & publish change
                    </button>
                  </form>
                </details>
                <div style={{ opacity: 0.55, marginBlockStart: 4 }}>/{post.slug}/</div>
              </td>
              <td>{(post.categories as unknown as { name: string } | null)?.name ?? "—"}</td>
              <td
                className={post.status === "published" ? styles.statusReplied : styles.statusRead}
              >
                {post.status}
              </td>
              <td>
                {post.published_at ? new Date(post.published_at).toLocaleDateString("en-GB") : "—"}
              </td>
              <td>
                <div className={styles.rowActions}>
                  <form
                    action={setPostStatus.bind(
                      null,
                      post.id,
                      post.status === "published" ? "draft" : "published",
                    )}
                  >
                    <button type="submit" className={styles.miniBtn}>
                      {post.status === "published" ? "unpublish" : "publish"}
                    </button>
                  </form>
                  <a
                    className={styles.miniBtn}
                    href={`/${post.slug}/`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    view
                  </a>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
