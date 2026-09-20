import type { MetadataRoute } from "next";

import { getLocalizedUrl } from "@/lib/seo";

const routes = [
  {
    pathname: "/",
    changeFrequency: "weekly",
    priority: 1,
  },
  {
    pathname: "/produkty",
    changeFrequency: "monthly",
    priority: 0.9,
  },
  {
    pathname: "/sourcing",
    changeFrequency: "monthly",
    priority: 0.9,
  },
  {
    pathname: "/oferta-b2b",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    pathname: "/o-firmie",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    pathname: "/kontakt",
    changeFrequency: "monthly",
    priority: 0.8,
  },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.flatMap(({ pathname, changeFrequency, priority }) => {
    const plUrl = getLocalizedUrl("pl", pathname);

    const enUrl = getLocalizedUrl("en", pathname);

    const alternates = {
      languages: {
        pl: plUrl,
        en: enUrl,
      },
    };

    return [
      {
        url: plUrl,
        changeFrequency,
        priority,
        alternates,
      },
      {
        url: enUrl,
        changeFrequency,
        priority,
        alternates,
      },
    ];
  });
}
