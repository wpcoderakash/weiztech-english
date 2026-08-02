import type { ReactNode } from "react";

import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import type { Metadata } from "next";

import { currentAdmin } from "@/lib/supabase/server";

import { version } from "../../../../package.json";

import styles from "../admin.module.css";
import { signOut } from "../login/actions";

export const metadata: Metadata = {
  title: "WeizTech Admin",
  robots: { index: false, follow: false },
};

const NAV = [
  { label: "Dashboard", href: "/admin", icon: "◧" },
  { label: "Submissions", href: "/admin/submissions", icon: "✉" },
  { label: "Blog", href: "/admin/blog", icon: "✎" },
  { label: "Pages & Sections", href: "/admin/pages", icon: "▤" },
  { label: "Media Library", href: "/admin/media", icon: "🖼" },
  { label: "SEO", href: "/admin/seo", icon: "◎" },
  { label: "Navigation & Settings", href: "/admin/site", icon: "⚙" },
  { label: "Users & Roles", href: "/admin/users", icon: "☺" },
  { label: "Security", href: "/admin/security", icon: "🔒" },
  { label: "Activity", href: "/admin/activity", icon: "≡" },
];

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const admin = await currentAdmin();
  if (!admin) redirect("/admin/login");

  return (
    <div className={styles.root}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <Image
            src="/images/Weiz-Logo.svg"
            alt="Weiz Technologies"
            width={78}
            height={41}
            priority
          />
        </div>

        <div className={styles.navGroupLabel}>Manage</div>
        {NAV.map((item) => (
          <Link key={item.href} href={item.href} className={styles.navLink}>
            <span aria-hidden="true">{item.icon}</span>
            {item.label}
          </Link>
        ))}

        <div className={styles.sidebarFooter}>v{version}</div>
      </aside>

      <div className={styles.main}>
        <div className={styles.topbar}>
          <div className={styles.topbarTitle}>Admin</div>
          <div className={styles.userChip}>
            <span>{admin.email}</span>
            <span className={styles.rolePill}>{admin.role.replace("_", " ")}</span>
            <form action={signOut}>
              <button type="submit" className={styles.signOut}>
                Sign out
              </button>
            </form>
          </div>
        </div>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
