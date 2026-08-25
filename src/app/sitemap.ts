import type { MetadataRoute } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://www.tmidc.pl";

const routes = [
  "",
  "/produkty",
  "/sourcing",
  "/oferta-b2b",
  "/o-firmie",
  "/kontakt",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.flatMap((route) => {
    const plUrl = `${SITE_URL}/pl${route}`;
    const enUrl = `${SITE_URL}/en${route}`;

    const priority =
      route === ""
        ? 1
        : route === "/produkty" || route === "/sourcing"
          ? 0.9
          : 0.8;

    return [
      {
        url: plUrl,
        changeFrequency: route === "" ? "weekly" : "monthly",
        priority,
        alternates: {
          languages: {
            pl: plUrl,
            en: enUrl,
          },
        },
      },
      {
        url: enUrl,
        changeFrequency: route === "" ? "weekly" : "monthly",
        priority,
        alternates: {
          languages: {
            pl: plUrl,
            en: enUrl,
          },
        },
      },
    ];
  });
}
