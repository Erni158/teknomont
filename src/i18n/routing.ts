import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["pl", "en"],
  defaultLocale: "pl",
  localePrefix: "always",
  pathnames: {
    "/": "/",
    "/produkty": {
      pl: "/produkty",
      en: "/products",
    },
    "/sourcing": "/sourcing",
    "/oferta-b2b": {
      pl: "/oferta-b2b",
      en: "/b2b",
    },
    "/o-firmie": {
      pl: "/o-firmie",
      en: "/about",
    },
    "/kontakt": {
      pl: "/kontakt",
      en: "/contact",
    },
  },
});
