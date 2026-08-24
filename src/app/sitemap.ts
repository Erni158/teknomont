import type { MetadataRoute } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://www.tmidc.pl";

const locales = ["pl", "en"] as const;

const routes = [
  "",
  "/produkty",
  "/producenci",
  "/sourcing",
  "/oferta-b2b",
  "/o-firmie",
  "/kontakt",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.flatMap((locale) =>
    routes.map((route) => ({
      url: `${siteUrl}/${locale}${route}`,
      changeFrequency: route === "" ? "weekly" : "monthly",
      priority: route === "" ? 1 : route === "/produkty" ? 0.9 : 0.8,
    })),
  );
}
