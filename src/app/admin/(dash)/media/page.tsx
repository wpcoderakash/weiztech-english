/* eslint-disable @next/next/no-img-element -- admin previews render raw
   storage URLs; the optimizer adds nothing behind auth. */
import { supabaseAdmin } from "@/lib/supabase/server";

import styles from "../../admin.module.css";

import { deleteMedia, updateAlt, uploadMedia } from "./actions";
import { CopyUrl } from "./CopyUrl";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const db = supabaseAdmin();
  let query = db.from("media").select("*").order("created_at", { ascending: false }).limit(120);
  if (q) query = query.or(`storage_path.ilike.%${q}%,alt.ilike.%${q}%,folder.ilike.%${q}%`);
  const { data: items } = await query;

  const publicUrl = (path: string) =>
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/${path}`;

  return (
    <>
      <div className={styles.panel} style={{ marginBlockEnd: 16 }}>
        <div className={styles.panelHead}>Upload</div>
        <form
          action={uploadMedia}
          className="jf-form"
          style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}
        >
          <input
            type="file"
            name="file"
            required
            accept="image/*,video/mp4"
            className={styles.loginField}
            style={{ maxInlineSize: 320, marginBlockEnd: 0 }}
          />
          <input
            type="text"
            name="folder"
            placeholder="folder (optional)"
            className={styles.loginField}
            style={{ maxInlineSize: 200, marginBlockEnd: 0 }}
          />
          <button type="submit" className={styles.exportBtn} style={{ border: 0 }}>
            Upload
          </button>
          <span style={{ fontSize: 12, opacity: 0.55 }}>
            PNG · JPG · WebP · GIF · SVG · MP4 — max 10 MB
          </span>
        </form>
      </div>

      <div className={styles.panel}>
        <div className={styles.panelHead}>
          Media library ({items?.length ?? 0})
          <form style={{ display: "flex", gap: 8 }}>
            <input
              type="search"
              name="q"
              defaultValue={q}
              placeholder="Search files, alt, folder…"
              className={styles.loginField}
              style={{ maxInlineSize: 260, marginBlockEnd: 0 }}
            />
            <button type="submit" className={styles.miniBtn}>
              search
            </button>
          </form>
        </div>
        <div className="media-grid">
          {(items ?? []).map((item) => {
            const url = publicUrl(item.storage_path as string);
            return (
              <div key={item.id as string} className="media-card">
                <div className="media-thumb">
                  {item.kind === "video" ? (
                    <video src={url} muted loop playsInline />
                  ) : (
                    <img
                      src={url}
                      alt={(item.alt as string) || (item.storage_path as string)}
                      loading="lazy"
                    />
                  )}
                </div>
                <div className="media-meta">
                  <div className="media-name">{(item.storage_path as string).split("/").pop()}</div>
                  <div className="media-sub">
                    {item.folder as string} · {Math.round(((item.bytes as number) ?? 0) / 1024)} KB
                  </div>
                  <form
                    action={updateAlt.bind(null, item.id as string)}
                    style={{ display: "flex", gap: 6 }}
                  >
                    <input
                      name="alt"
                      defaultValue={(item.alt as string) ?? ""}
                      placeholder="alt text"
                      className={styles.loginField}
                      style={{ marginBlockEnd: 0, padding: "6px 10px", fontSize: 12 }}
                    />
                    <button type="submit" className={styles.miniBtn}>
                      save
                    </button>
                  </form>
                  <div className={styles.rowActions} style={{ marginBlockStart: 6 }}>
                    <CopyUrl url={url} className={styles.miniBtn ?? ""} />
                    <a className={styles.miniBtn} href={url} target="_blank" rel="noreferrer">
                      open
                    </a>
                    <form action={deleteMedia.bind(null, item.id as string)}>
                      <button type="submit" className={styles.miniBtn} style={{ color: "#ff9d9d" }}>
                        delete
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            );
          })}
          {(items ?? []).length === 0 ? (
            <div className={styles.empty}>No media yet — upload your first file above.</div>
          ) : null}
        </div>
      </div>
    </>
  );
}
