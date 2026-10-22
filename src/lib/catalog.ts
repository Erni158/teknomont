// Links and examples checked against the public shop catalogue on 2026-10-22.
// Keep prices and stock in the shop so these examples do not imply live availability.
const SHOP_URL = "https://sklep.tmidc.pl";

export const catalogCategories = [
  {
    key: "connectors",
    links: [
      { key: "connectors", href: `${SHOP_URL}/zlacza-c-1.html` },
      { key: "terminals", href: `${SHOP_URL}/konektory-c-18.html` },
    ],
  },
  {
    key: "wires",
    links: [{ key: "wires", href: `${SHOP_URL}/kable-c-2.html` }],
  },
  {
    key: "protection",
    links: [
      { key: "sleeves", href: `${SHOP_URL}/koszulki-i-weze-c-24.html` },
      { key: "glands", href: `${SHOP_URL}/dlawnice-i-przepusty-c-21.html` },
    ],
  },
  {
    key: "controls",
    links: [
      { key: "relays", href: `${SHOP_URL}/przekazniki-c-13.html` },
      { key: "sensors", href: `${SHOP_URL}/czujniki-c-5.html` },
    ],
  },
] as const;

export const catalogExamples = [
  {
    key: "connector",
    manufacturer: "TE Connectivity",
    partNumber: "213870-1",
    image: "/images/catalog/te-connectivity-213870-1.jpg",
    href: `${SHOP_URL}/213870-1-te-connectivity-zlacze-cpc-19p-p-157.html`,
  },
  {
    key: "cable",
    manufacturer: "LAPP",
    partNumber: "0022605",
    image: "/images/catalog/lapp-0022605.jpg",
    href: `${SHOP_URL}/0022605-lapp-kabel-unitronic-liyy-a-5x22awg-p-113.html`,
  },
  {
    key: "braid",
    manufacturer: "HellermannTyton",
    partNumber: "170-12000",
    image: "/images/catalog/hellermann-170-12000.jpg",
    href: `${SHOP_URL}/170-12000-oplot-poliestrowy-hellermann-14-26mm-hf-czarny-p-161.html`,
  },
] as const;
