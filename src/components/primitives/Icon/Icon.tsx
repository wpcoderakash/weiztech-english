import { ICONS, type IconName } from "./icons";

export interface IconProps {
  name: IconName;
  /**
   * Rendered height. The original sets icon size as a font-size on the icon
   * element, so height (not width) is the controlling dimension — width
   * follows the glyph's advance ratio, exactly as the webfont behaved.
   * Accepts any CSS length. Defaults to 1em so icons inherit text size.
   */
  size?: string | undefined;
  /** Defaults to currentColor so icons inherit the parent's colour. */
  color?: string | undefined;
  /** Accessible label. Omit for purely decorative icons (default). */
  label?: string | undefined;
  className?: string | undefined;
}

/**
 * Inline SVG icon.
 *
 * Replaces the three icon webfonts (ionicons, themify, fontawesome-brands)
 * the original loads. Path data is extracted from those exact fonts, so
 * geometry is identical — see icons.ts.
 */
export function Icon({ name, size = "1em", color, label, className }: IconProps) {
  const icon = ICONS[name];

  return (
    <svg
      viewBox={`0 0 ${icon.w} ${icon.h}`}
      fill={color ?? "currentColor"}
      className={className}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
      /*
       * Size is set in CSS, not via width/height attributes: `width="auto"` is
       * invalid as an SVG attribute (Chrome logs "Expected length"). With a
       * viewBox and a CSS height, the intrinsic aspect ratio gives the correct
       * width automatically — which is what reproduces the webfont's advance.
       */
      style={{
        height: size,
        width: "auto",
        display: "inline-block",
        verticalAlign: "middle",
        flexShrink: 0,
      }}
    >
      <path d={icon.d} />
    </svg>
  );
}
