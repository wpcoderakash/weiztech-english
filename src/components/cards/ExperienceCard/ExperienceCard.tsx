import Image from "next/image";

import { Link } from "@/components/primitives";

import styles from "./ExperienceCard.module.css";

export interface ExperienceCardProps {
  /** Client name, taken from the card's own link and banner filename. */
  brand: string;
  image: string;
  href: string;
  label: string;
}

/**
 * ExperienceCard — `.oe-card`, the ten client banners in Cybersec's
 * "Our Experience" grid.
 *
 * The source puts a heading and a blurb between the banner and the button,
 * both Hebrew placeholders and both `display: none` — verified on the live
 * page, where they have never rendered. They are not reproduced; see
 * content/pages/cybersec.ts for the strings and the reasoning.
 *
 * That leaves ten identical "View" buttons, which is a poor accessible name.
 * Each is given `aria-label` "View <brand>", the brand coming from the card's
 * own link target rather than from the artwork. CHANGE #23.
 */
export function ExperienceCard({ brand, image, href, label }: ExperienceCardProps) {
  return (
    <div className={styles.card} data-anim="card">
      <div className={styles.banner}>
        <Image src={image} alt={brand} width={214} height={108} className={styles.image} />
      </div>
      <div className={styles.main}>
        <Link href={href} className={styles.button} aria-label={`${label} ${brand}`}>
          {label}
        </Link>
      </div>
    </div>
  );
}
