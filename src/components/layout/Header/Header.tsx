"use client";

import { useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { LanguageToggle, NavSwapLink } from "@/components/navigation";
import { useOverlay } from "@/components/overlays";
import { Icon } from "@/components/primitives";
import { HEADER_NAV } from "@/content/site";

import styles from "./Header.module.css";

/**
 * Header — Bricks template 8.
 *
 * Absolutely positioned over the hero (--header-height is 0 site-wide), with
 * backdrop-filter: blur(4px). Bricks' `headerSticky` swaps the background to
 * rgba(18,18,18,0.8) once scrolled, which is what the `scrolled` state does.
 *
 * The desktop nav is NOT a WordPress menu — the template hard-codes five
 * swap-hover links. See content/site.ts.
 */
export function Header({ nav = HEADER_NAV }: { nav?: typeof HEADER_NAV }) {
  const [scrolled, setScrolled] = useState(false);
  const { open } = useOverlay();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={[styles.header, scrolled ? styles.scrolled : ""].join(" ")}>
      <Container as="div" className={styles.inner}>
        {/* Logo */}
        <div className={styles.logoBlock}>
          <Link href="/" aria-label="Weiz Technologies — home">
            <Image
              src="/images/Weiz-Logo.svg"
              alt="Weiz Technologies"
              width={92}
              height={48}
              priority
              className={styles.logo}
            />
          </Link>
        </div>

        {/* Desktop nav + mobile trigger */}
        <nav className={styles.navBlock} aria-label="Primary">
          <div className={styles.navPill}>
            <div className={styles.navLinks}>
              {nav.map((item) => (
                <NavSwapLink
                  key={item.href + item.label}
                  label={item.label}
                  href={item.href}
                  ariaLabel={item.ariaLabel ?? item.label}
                />
              ))}
            </div>
          </div>

          <button
            type="button"
            className={styles.menuTrigger}
            aria-label="Open menu"
            onClick={() => open("mobileMenu")}
          >
            <Icon name="ion-ios-menu" size="24px" color="var(--white)" />
          </button>
        </nav>

        {/* Language toggle */}
        <div className={styles.langBlock}>
          <LanguageToggle />
        </div>
      </Container>
    </header>
  );
}
