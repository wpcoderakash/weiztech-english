"use client";

import { useEffect, useRef } from "react";

import { useOverlay } from "@/components/overlays";
import { Button, Heading, Icon, Link } from "@/components/primitives";
import type { IconName } from "@/components/primitives";
import { MOBILE_MENU } from "@/content/site";

import { LanguageToggle } from "../LanguageToggle";

import styles from "./MobileMenuDrawer.module.css";

/**
 * MobileMenuDrawer — Bricks popup template 1851.
 *
 * Opened by the header hamburger (fadeIn 0.35s in the source), closed by its
 * own X button (fadeOut 0.2s). Backdrop is rgba(27,27,67,0.5); the panel is
 * var(--primary-dark) with a 16px radius.
 *
 * Adds a focus trap and Escape-to-close, neither of which the Bricks popup
 * had. Both are standard dialog behaviour and do not change the visuals.
 */
export function MobileMenuDrawer({ menu = MOBILE_MENU }: { menu?: typeof MOBILE_MENU }) {
  const { isOpen, close } = useOverlay();
  const open = isOpen("mobileMenu");
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  /* Move focus into the panel on open. The source sets popupDisableAutoFocus,
     so it never did this — but with focus indicators restored, leaving focus
     behind the backdrop would strand keyboard users. */
  useEffect(() => {
    if (open) closeButtonRef.current?.focus();
  }, [open]);

  /* Focus trap. */
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  if (!open) return null;

  return (
    <div className={styles.backdrop} onClick={close} role="presentation">
      <div
        ref={panelRef}
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Top bar: quick contact + language toggle */}
        <div className={styles.topBar}>
          <div className={styles.quickContact}>
            <Link href={menu.cta.href} className={styles.quickCta}>
              {menu.cta.label}
            </Link>
            <div className={styles.quickIcons}>
              {menu.quickContact.map((item) => (
                <a key={item.href} href={item.href} aria-label={item.ariaLabel}>
                  <Icon name={item.icon as IconName} size="22px" color="var(--white)" />
                </a>
              ))}
            </div>
          </div>
          <LanguageToggle variant="outlined" />
        </div>

        {/* Menu header */}
        <div className={styles.menuHeader}>
          <Heading as="h2" size="h4" className={styles.menuTitle}>
            Menu
          </Heading>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={close}
            aria-label="Close menu"
            className={styles.closeButton}
          >
            <Icon name="ion-ios-close" size="34px" color="var(--white)" />
          </button>
        </div>

        {/* Two link columns */}
        <div className={styles.columns}>
          {menu.columns.map((column, index) => (
            <nav key={index} className={styles.column} aria-label={`Menu column ${index + 1}`}>
              {column.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-label={item.ariaLabel ?? item.label}
                  className={styles.columnLink}
                  onClick={close}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          ))}
        </div>

        {/* Services — static on the live popup: title + always-visible links,
            no chevron, no collapse (measured; the accordion transcription was
            never functional and never matched). */}
        <nav className={styles.services} aria-label="Services">
          <span className={styles.servicesTitle}>{menu.services.label}</span>
          <div className={styles.servicesList}>
            {menu.services.items.map((item) => (
              <Link
                key={item.href + item.label}
                href={item.href}
                aria-label={item.ariaLabel ?? item.label}
                className={styles.serviceLink}
                onClick={close}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>

        {/* Footer CTA */}
        <Button
          href={menu.footerCta.href}
          variant="solidLight"
          icon="ion-ios-paper-plane"
          iconPosition="right"
          className={styles.cta}
        >
          {menu.footerCta.label}
        </Button>
      </div>
    </div>
  );
}
