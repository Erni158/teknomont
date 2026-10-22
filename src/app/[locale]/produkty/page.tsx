import type { Metadata } from "next";

import { getTranslations, setRequestLocale } from "next-intl/server";

import { ProductsHero } from "@/components/products/products-hero";
import { ProductCategoriesSection } from "@/components/products/product-categories-section";
import { ProductExamplesSection } from "@/components/products/product-examples-section";
import { ProductSupportSection } from "@/components/products/product-support-section";
import { getLocalizedAlternates, getLocalizedUrl } from "@/lib/seo";
import { Props } from "@/lib/types";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const t = await getTranslations({
    locale,
    namespace: "ProductsPage.metadata",
  });

  return {
    title: t("title"),
    description: t("description"),
    alternates: getLocalizedAlternates(locale, "/produkty"),
    openGraph: {
      title: `${t("title")} | Teknomont`,
      description: t("description"),
      url: getLocalizedUrl(locale, "/produkty"),
      siteName: "Teknomont",
      type: "website",
      images: [
        { url: "/images/hero.png", width: 1200, height: 630, alt: "Teknomont" },
      ],
    },
  };
}

export default async function ProductsPage({ params }: Props) {
  const { locale } = await params;

  setRequestLocale(locale);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: locale === "pl" ? "Strona główna" : "Home",
        item: getLocalizedUrl(locale, "/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: locale === "pl" ? "Produkty" : "Products",
        item: getLocalizedUrl(locale, "/produkty"),
      },
    ],
  };

  return (
    <main>
      <ProductsHero />
      <ProductCategoriesSection />
      <ProductExamplesSection />
      <ProductSupportSection />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    </main>
  );
}
