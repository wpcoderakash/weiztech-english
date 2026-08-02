import { NextResponse, type NextRequest } from "next/server";

import { createServerClient } from "@supabase/ssr";

/**
 * Admin gate + session refresh (Next 16 "proxy", né middleware).
 *
 * The admin URL is HIDDEN, WP-hide-login style: /admin/* without the gate
 * cookie renders the site's 404, indistinguishable from a missing page.
 * Visiting /gate/{ADMIN_GATE_SECRET} once sets the (httpOnly, 30-day)
 * cookie and redirects to the login screen; wrong secrets 404. Login and
 * roles still apply after the gate — this only removes the discoverable
 * front door.
 */
const GATE_COOKIE = "weiz_gate";

export async function proxy(request: NextRequest) {
  /* trailingSlash: true normalises /gate/x to /gate/x/ — compare without. */
  const pathname = request.nextUrl.pathname.replace(/\/$/, "");
  const secret = process.env.ADMIN_GATE_SECRET;

  if (pathname.startsWith("/gate/")) {
    if (!secret || pathname !== `/gate/${secret}`) {
      return NextResponse.rewrite(new URL("/__not_found__", request.url), { status: 404 });
    }
    const response = NextResponse.redirect(new URL("/admin/login", request.url));
    response.cookies.set(GATE_COOKIE, secret, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });
    return response;
  }

  /* /admin/*: gate first (when configured), then Supabase session refresh. */
  if (secret && request.cookies.get(GATE_COOKIE)?.value !== secret) {
    return NextResponse.rewrite(new URL("/__not_found__", request.url), { status: 404 });
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

export const config = {
  matcher: ["/admin/:path*", "/gate/:path*"],
};
