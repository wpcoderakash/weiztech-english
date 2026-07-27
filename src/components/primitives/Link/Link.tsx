import type { CSSProperties, MouseEventHandler, ReactNode } from "react";

import NextLink from "next/link";

export interface LinkProps {
  href: string;
  children: ReactNode;
  /** Force external behaviour. Normally inferred from the href. */
  external?: boolean | undefined;
  className?: string | undefined;
  style?: CSSProperties | undefined;
  id?: string | undefined;
  title?: string | undefined;
  tabIndex?: number | undefined;
  onClick?: MouseEventHandler<HTMLAnchorElement> | undefined;
  "aria-label"?: string | undefined;
  "aria-current"?: "page" | undefined;
}

/** True for anything that leaves the site or is not a page navigation. */
export function isExternalHref(href: string): boolean {
  return (
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:")
  );
}

/**
 * Link — internal hrefs go through next/link, external ones through a plain
 * anchor opened in a new tab.
 *
 * The original applies Rank Math's `new_window_external_links: on`, which adds
 * target="_blank" to every external link site-wide. Reproduced here.
 *
 * Internal hrefs must keep their trailing slash — the app runs with
 * `trailingSlash: true` to preserve the WordPress URL shape.
 *
 * The prop surface is deliberately narrow rather than extending
 * AnchorHTMLAttributes: next/link's own types do not declare `| undefined` on
 * their handlers, so a wide spread cannot satisfy `exactOptionalPropertyTypes`
 * without an unsafe cast.
 */
export function Link({
  href,
  children,
  external,
  className,
  style,
  id,
  title,
  tabIndex,
  onClick,
  "aria-label": ariaLabel,
  "aria-current": ariaCurrent,
}: LinkProps) {
  const isExternal = external ?? isExternalHref(href);

  /**
   * `onClick` is spread conditionally: next/link declares it as
   * `onClick?: MouseEventHandler` without `| undefined`, so under
   * `exactOptionalPropertyTypes` passing an explicit undefined is a type error.
   * Omitting the key entirely is the correct way to express "no handler".
   */
  const shared = {
    className,
    style,
    id,
    title,
    tabIndex,
    "aria-label": ariaLabel,
    "aria-current": ariaCurrent,
    ...(onClick !== undefined ? { onClick } : {}),
  };

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...shared}>
        {children}
      </a>
    );
  }

  return (
    <NextLink href={href} {...shared}>
      {children}
    </NextLink>
  );
}
