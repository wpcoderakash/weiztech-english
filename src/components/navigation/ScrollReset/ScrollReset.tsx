"use client";

import { useEffect, useRef } from "react";

import { usePathname } from "next/navigation";

/**
 * ScrollReset — scrolls to the top on client-side navigation.
 *
 * Next 16's own scroll-on-navigate never fires in this app (instrumented:
 * zero scrollTo/scrollIntoView calls after a Link click), so clicking a menu
 * item from a scrolled position landed the new page mid-scroll with the hero
 * off-screen. This owns the behaviour explicitly:
 *
 *  - pathname change from a Link/push -> jump to top
 *  - back/forward (popstate) -> leave the browser's own restoration alone
 *  - hash targets -> leave the anchor jump alone
 */
export function ScrollReset() {
  const pathname = usePathname();
  const isPop = useRef(false);

  useEffect(() => {
    const onPop = () => {
      isPop.current = true;
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    if (isPop.current) {
      isPop.current = false;
      return;
    }
    if (window.location.hash) return;
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
