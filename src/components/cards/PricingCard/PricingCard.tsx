import { Button, Heading, Icon, Text } from "@/components/primitives";

import styles from "./PricingCard.module.css";

export interface PricingPlan {
  name: string;
  blurb: string;
  price: string;
  /** Null on the Pro plan, whose price is "Get a Free Quote". */
  period: string | null;
  featuresLabel: string;
  features: readonly string[];
}

export interface PricingCardProps {
  plan: PricingPlan;
  cta: { label: string; href: string };
}

/**
 * PricingCard — `.webapp-pricing-table`, one of the three plans behind the
 * Monthly/Annually tabs on the Web Design page.
 *
 * Two stacked blocks: the plan itself (`.pad--m`) and a features panel
 * (`.pricing-table-features` — var(--tertiary-ultra-dark), space-m padding,
 * 14px row gap, bottom corners rounded). The card border turns
 * var(--primary-trans-70) on hover.
 */
export function PricingCard({ plan, cta }: PricingCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.head}>
        <Heading as="h3" className={styles.name}>
          {plan.name}
        </Heading>
        <Text className={styles.blurb}>{plan.blurb}</Text>
        <div className={styles.priceRow}>
          <Text as="span" className={styles.price}>
            {plan.price}
          </Text>
          {plan.period ? (
            <Text as="span" className={styles.period}>
              {plan.period}
            </Text>
          ) : null}
        </div>
        <Button href={cta.href} variant="outline" className={styles.cta}>
          {cta.label}
        </Button>
      </div>

      <div className={styles.features}>
        <Text className={styles.featuresLabel}>{plan.featuresLabel}</Text>
        <ul className={styles.featureList}>
          {plan.features.map((feature, i) => (
            <li key={`${feature}-${i}`} className={styles.feature}>
              <Icon name="ion-ios-checkmark" size="20px" color="var(--primary)" />
              <Text as="span" className={styles.featureText}>
                {feature}
              </Text>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
