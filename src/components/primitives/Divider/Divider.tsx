import styles from "./Divider.module.css";

export interface DividerProps {
  /** Defaults to var(--tertiary-dark), the footer divider colour. */
  color?: string | undefined;
  className?: string | undefined;
}

/** Horizontal rule. Used twice in the footer. */
export function Divider({ color, className }: DividerProps) {
  return (
    <hr
      className={[styles.divider, className].filter(Boolean).join(" ")}
      style={color ? { borderColor: color } : undefined}
    />
  );
}
