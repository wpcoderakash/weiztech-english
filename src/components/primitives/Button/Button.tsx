import type { ButtonHTMLAttributes, ReactNode } from "react";

import { Icon } from "../Icon";
import type { IconName } from "../Icon";
import { Link } from "../Link";

import styles from "./Button.module.css";

export type ButtonVariant =
  "primary" | "outline" | "pillGhost" | "pillSmall" | "cardCta" | "solidLight";

interface CommonProps {
  children: ReactNode;
  variant?: ButtonVariant | undefined;
  icon?: IconName | undefined;
  iconPosition?: "left" | "right" | undefined;
  iconSize?: string | undefined;
  className?: string | undefined;
  /** Animation role, read by Reveal. Phase 11. */
  "data-anim"?: string | undefined;
}

type AsLink = CommonProps & { href: string; onClick?: never; type?: never };
type AsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & { href?: never };

export type ButtonProps = AsLink | AsButton;

/**
 * Button — renders an anchor when given `href`, otherwise a <button>.
 *
 * Six variants, each transcribed from a distinct treatment in the original.
 * See Button.module.css for the per-variant provenance.
 */
export function Button(props: ButtonProps) {
  const {
    children,
    variant = "primary",
    icon,
    iconPosition = "left",
    iconSize = "18px",
    className,
    "data-anim": dataAnim,
  } = props;

  const classes = [
    styles.button,
    styles[variant],
    iconPosition === "right" ? styles.iconRight : undefined,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      {icon ? <Icon name={icon} size={iconSize} /> : null}
      <span>{children}</span>
    </>
  );

  if ("href" in props && props.href !== undefined) {
    return (
      <Link href={props.href} className={classes} data-anim={dataAnim}>
        {content}
      </Link>
    );
  }

  const {
    children: _c,
    variant: _v,
    icon: _i,
    iconPosition: _p,
    iconSize: _s,
    className: _cl,
    "data-anim": _da,
    ...buttonProps
  } = props as AsButton;

  return (
    <button type="button" className={classes} data-anim={dataAnim} {...buttonProps}>
      {content}
    </button>
  );
}
