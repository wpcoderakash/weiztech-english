"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

export type OverlayId = "mobileMenu" | "careersForm" | "emailMarketing";

interface OverlayContextValue {
  active: OverlayId | null;
  open: (id: OverlayId) => void;
  close: () => void;
  isOpen: (id: OverlayId) => boolean;
}

const OverlayContext = createContext<OverlayContextValue | null>(null);

/**
 * OverlayProvider — the entire global state surface of the application.
 *
 * Needed because overlay triggers sit far from the overlays themselves: the
 * header hamburger opens the mobile menu, and job cards deep inside /careers/
 * open the careers modal. Both overlays render once at the root.
 *
 * This mirrors how Bricks handled popups — rendered globally, opened by
 * interaction. See PHASE-6-NEXTJS-ARCHITECTURE.md §8.
 *
 * Only one overlay can be open at a time, which matches the original: the
 * three popups are mutually exclusive in practice.
 */
export function OverlayProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<OverlayId | null>(null);

  const open = useCallback((id: OverlayId) => setActive(id), []);
  const close = useCallback(() => setActive(null), []);
  const isOpen = useCallback((id: OverlayId) => active === id, [active]);

  /* Lock body scroll while an overlay is open. The source sets
     popupBodyScroll: true on all three popups, meaning Bricks locks it. */
  useEffect(() => {
    if (!active) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [active]);

  /* Escape closes. Not in the original — Bricks popups close only via their
     close button — but it is standard dialog behaviour and costs nothing. */
  useEffect(() => {
    if (!active) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [active, close]);

  const value = useMemo(() => ({ active, open, close, isOpen }), [active, open, close, isOpen]);

  return <OverlayContext.Provider value={value}>{children}</OverlayContext.Provider>;
}

export function useOverlay(): OverlayContextValue {
  const context = useContext(OverlayContext);
  if (!context) {
    throw new Error("useOverlay must be used inside OverlayProvider");
  }
  return context;
}
