import { NextResponse, type NextRequest } from "next/server";

import { createServerClient } from "@supabase/ssr";

/**
 * Hidden, dashboard-configurable admin entry (Next 16 "proxy").
 *
 * The entry slug lives in the CMS (settings.admin_slug, editable at
 * /admin/site) and is cached here for 30s per edge instance. Visiting
 * /{slug} sets an httpOnly cookie (value = the slug, so changing the slug
 * instantly invalidates every existing cookie) and redirects to the login
 * screen. /admin/* without the current cookie renders the site's 404 —
 * indistinguishable from a missing page. Auth + roles still apply behind it.
 */
const GATE_COOKIE = "weiz_gate";
const SLUG_TTL_MS = 30_000;

let cachedSlug: { value: string | null; at: number } = { value: null, at: 0 };

async function adminSlug(): Promise<string | null> {
  if (Date.now() - cachedSlug.at < SLUG_TTL_MS) return cachedSlug.value;
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/settings?key=eq.admin_slug&select=value`,
      {
        headers: {
          apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        },
        cache: "no-store",
      },
    );
    const rows = (await res.json()) as { value?: { slug?: string } }[];
    const slug = rows[0]?.value?.slug ?? null;
    cachedSlug = { value: slug, at: Date.now() };
    return slug;
  } catch {
    return cachedSlug.value; // stale beats broken
  }
}

function notFound(request: NextRequest) {
  return NextResponse.rewrite(new URL("/__not_found__", request.url), { status: 404 });
}

export async function proxy(request: NextRequest) {
  /* trailingSlash: true normalises /x to /x/ — compare without. */
  const pathname = request.nextUrl.pathname.replace(/\/$/, "");

  if (pathname.startsWith("/admin")) {
    const slug = await adminSlug();
    if (slug && request.cookies.get(GATE_COOKIE)?.value !== slug) {
      return notFound(request);
    }
    let response = NextResponse.next({ request });
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => request.cookies.getAll(),
          setAll: (all) => {
            for (const { name, value } of all) request.cookies.set(name, value);
            response = NextResponse.next({ request });
            for (const { name, value, options } of all) response.cookies.set(name, value, options);
          },
        },
      },
    );
    await supabase.auth.getUser();
    return response;
  }

  /* Single-segment paths: is it the admin entry slug? */
  const segment = pathname.slice(1);
  if (!segment || segment.includes("/")) return NextResponse.next();
  const slug = await adminSlug();
  if (slug && segment === slug) {
    const response = NextResponse.redirect(new URL("/admin/login", request.url));
    response.cookies.set(GATE_COOKIE, slug, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });
    return response;
  }
  return NextResponse.next();
}

export const config = {
  /* /admin subtree + every single-segment path (slug check is one cached
     compare; real pages fall through untouched). Assets excluded. */
  matcher: ["/admin/:path*", "/((?!_next|api|images|fonts|favicon\\.ico|.*\\..*)[^/]+)/"],
};
