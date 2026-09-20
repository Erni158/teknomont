import type { Metadata } from "next";

import { routing } from "@/i18n/routing";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://www.tmidc.pl";

type Locale = (typeof routing.locales)[number];

type InternalPathname = keyof typeof routing.pathnames;

export function getLocalizedPathname(
  locale: Locale,
  pathname: InternalPathname,
) {
  const localizedPath = routing.pathnames[pathname];

  if (typeof localizedPath === "string") {
    return localizedPath;
  }

  return localizedPath[locale];
}

export function getLocalizedUrl(locale: Locale, pathname: InternalPathname) {
  const localizedPath = getLocalizedPathname(locale, pathname);

  const suffix = localizedPath === "/" ? "" : localizedPath;

  return `${SITE_URL}/${locale}${suffix}`;
}

export function getLocalizedAlternates(
  locale: Locale,
  pathname: InternalPathname = "/",
): Metadata["alternates"] {
  return {
    canonical: getLocalizedUrl(locale, pathname),

    languages: {
      pl: getLocalizedUrl("pl", pathname),

      en: getLocalizedUrl("en", pathname),
    },
  };
}
