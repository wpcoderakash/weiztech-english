import { currentAdmin, supabaseAdmin } from "@/lib/supabase/server";

import styles from "../../admin.module.css";

import { ProfileForm } from "../security/ProfileForm";

import { InviteForm } from "./InviteForm";
import { removeUser, setRole } from "./actions";

export const dynamic = "force-dynamic";

const ROLE_OPTIONS = [
  "super_admin",
  "admin",
  "editor",
  "content_manager",
  "author",
  "viewer",
] as const;

export default async function AdminUsersPage() {
  const me = await currentAdmin();
  const db = supabaseAdmin();
  const [{ data: profiles }, { data: authUsers }] = await Promise.all([
    db.from("profiles").select("user_id, name, role, created_at"),
    db.auth.admin.listUsers({ perPage: 200 }),
  ]);
  const emailOf = new Map(authUsers.users.map((u) => [u.id, u.email ?? ""]));
  const canManage = me?.role === "super_admin";

  const { data: myProfile } = me
    ? await db.from("profiles").select("name").eq("user_id", me.userId).single()
    : { data: null };

  return (
    <>
      <div className={styles.panel} style={{ marginBlockEnd: 16 }}>
        <div className={styles.panelHead}>My profile</div>
        <ProfileForm name={myProfile?.name ?? ""} email={me?.email ?? ""} />
      </div>

      {canManage ? (
        <div className={styles.panel} style={{ marginBlockEnd: 16 }}>
          <div className={styles.panelHead}>Invite a team member</div>
          <InviteForm />
        </div>
      ) : null}

      <div className={styles.panel}>
        <div className={styles.panelHead}>Users</div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Since</th>
              {canManage ? <th>Actions</th> : null}
            </tr>
          </thead>
          <tbody>
            {(profiles ?? []).map((p) => {
              const email = emailOf.get(p.user_id) ?? "—";
              const isSelf = p.user_id === me?.userId;
              const isSuper = p.role === "super_admin";
              return (
                <tr key={p.user_id}>
                  <td style={{ color: "#fff" }}>
                    {p.name || email}
                    <div style={{ opacity: 0.55 }}>{email}</div>
                  </td>
                  <td>
                    <span className={styles.rolePill}>{p.role.replace("_", " ")}</span>
                  </td>
                  <td>{new Date(p.created_at).toLocaleDateString("en-GB")}</td>
                  {canManage ? (
                    <td>
                      {!isSelf && !isSuper ? (
                        <div className={styles.rowActions}>
                          <form
                            action={setRole.bind(null, p.user_id)}
                            style={{ display: "flex", gap: 6 }}
                          >
                            <select
                              name="role"
                              defaultValue={p.role}
                              className={styles.loginField}
                              style={{ marginBlockEnd: 0, padding: "4px 8px", fontSize: 12 }}
                            >
                              {ROLE_OPTIONS.map((r) => (
                                <option key={r} value={r}>
                                  {r.replace("_", " ")}
                                </option>
                              ))}
                            </select>
                            <button type="submit" className={styles.miniBtn}>
                              set
                            </button>
                          </form>
                          <form action={removeUser.bind(null, p.user_id)}>
                            <button
                              type="submit"
                              className={styles.miniBtn}
                              style={{ color: "#ff9d9d" }}
                            >
                              remove
                            </button>
                          </form>
                        </div>
                      ) : (
                        <span style={{ opacity: 0.4 }}>{isSelf ? "you" : "protected"}</span>
                      )}
                    </td>
                  ) : null}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
