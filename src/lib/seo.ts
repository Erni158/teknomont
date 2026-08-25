import type { Metadata } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://www.tmidc.pl";

export function getLocalizedAlternates(
  locale: string,
  pathname = "",
): Metadata["alternates"] {
  const normalizedPath =
    pathname === "" || pathname === "/"
      ? ""
      : pathname.startsWith("/")
        ? pathname
        : `/${pathname}`;

  return {
    canonical: `${SITE_URL}/${locale}${normalizedPath}`,

    languages: {
      pl: `${SITE_URL}/pl${normalizedPath}`,
      en: `${SITE_URL}/en${normalizedPath}`,
    },
  };
}
