import Image from "next/image";

import { SocialIcons } from "@/components/decorative";
import { Container } from "@/components/layout/Container";
import { FooterNavMenu } from "@/components/navigation";
import { Divider, Heading, Link, Text } from "@/components/primitives";
import {
  COPYRIGHT,
  FOOTER_INTRO,
  FOOTER_QUICK_LINKS,
  FOOTER_SERVICES,
  OFFICES,
} from "@/content/site";

import styles from "./Footer.module.css";

/**
 * Footer — Bricks template 303.
 *
 * Four columns (40/20/20/20), a divider row above, and a copyright + socials
 * row below. The "Get in Touch" button is a NextBricks `glowingbutton`; its
 * animated spark border is reproduced in CSS.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      {/* Divider row — hidden below 767px in the source. */}
      <Container as="div" className={styles.dividerRow}>
        <Divider />
        <Divider />
      </Container>

      <Container as="div" className={styles.columns}>
        {/* Column 1 — logo, blurb, CTA */}
        <div className={styles.brandColumn}>
          <Image
            src="/images/Weiz-Logo.svg"
            alt="Weiz Technologies"
            width={100}
            height={53}
            className={styles.logo}
          />
          <Text>{FOOTER_INTRO.text}</Text>
          {/* NextBricks glowingbutton — three layers: a spinning conic-gradient
              ring, an opaque background, and the label. */}
          <Link href={FOOTER_INTRO.cta.href} className={styles.glowButton}>
            <span className={styles.glowRing} aria-hidden="true" />
            <span className={styles.glowBackground}>
              <span className={styles.glowTitle}>{FOOTER_INTRO.cta.label}</span>
            </span>
          </Link>
        </div>

        {/* Column 2 — Quick Links */}
        <div className={`${styles.linkColumn} ${styles.quickLinksColumn}`}>
          <FooterNavMenu title="Quick Links" items={FOOTER_QUICK_LINKS} underlineTitle />
        </div>

        {/* Column 3 — Our Services */}
        <div className={`${styles.linkColumn} ${styles.servicesColumn}`}>
          <FooterNavMenu title="Our Services" items={FOOTER_SERVICES} />
        </div>

        {/* Column 4 — Offices */}
        <div className={styles.linkColumn}>
          <Heading as="h3" className={styles.officesTitle}>
            Offices
          </Heading>
          {OFFICES.map((office) => (
            <div key={office.label} className={styles.office}>
              <Link href={office.href} className={styles.officeLabel}>
                {office.label}
              </Link>
              <Link href={office.href} className={styles.officeAddress}>
                {office.address}
              </Link>
            </div>
          ))}
        </div>
      </Container>

      {/* Bottom row — copyright + socials */}
      <Container as="div" className={styles.bottomRow}>
        <div>
          <Text className={styles.copyright}>
            {year} © {COPYRIGHT.text}
            <br />
            Powered by{" "}
            <Link href={COPYRIGHT.poweredBy.href} className={styles.poweredBy}>
              {COPYRIGHT.poweredBy.label}
            </Link>
          </Text>
        </div>
        <div className={styles.socials}>
          <SocialIcons />
        </div>
      </Container>
    </footer>
  );
}
