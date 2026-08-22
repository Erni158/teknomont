import type { Metadata } from "next";

import { getTranslations, setRequestLocale } from "next-intl/server";

import { ProductsHero } from "@/components/products/products-hero";
import { ProductCategoriesSection } from "@/components/products/product-categories-section";
import { ProductSupportSection } from "@/components/products/product-support-section";
import { ProductsB2BSection } from "@/components/products/products-b2b-section";

type Props = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const t = await getTranslations({
    locale,
    namespace: "ProductsPage.metadata",
  });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function ProductsPage({ params }: Props) {
  const { locale } = await params;

  setRequestLocale(locale);

  return (
    <main>
      <ProductsHero />
      <ProductCategoriesSection />
      <ProductSupportSection />
      <ProductsB2BSection />
    </main>
  );
}
