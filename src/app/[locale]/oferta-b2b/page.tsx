import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { B2BHero } from "@/components/b2b/b2b-hero";
import { B2BBenefitsSection } from "@/components/b2b/b2b-benefits-section";
import { B2BForWhoSection } from "@/components/b2b/b2b-for-who-section";
import { B2BCooperationSection } from "@/components/b2b/b2b-cooperation-section";
import { B2BInquirySection } from "@/components/b2b/b2b-inquiry-section";
import { getLocalizedAlternates } from "@/lib/seo";

type Props = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const t = await getTranslations({
    locale,
    namespace: "B2BPage.metadata",
  });

  return {
    title: t("title"),
    description: t("description"),
    alternates: getLocalizedAlternates(locale, "/oferta-b2b"),
  };
}

export default async function B2BPage({ params }: Props) {
  const { locale } = await params;

  setRequestLocale(locale);

  return (
    <main>
      <B2BHero />
      <B2BBenefitsSection />
      <B2BForWhoSection />
      <B2BCooperationSection />
      <B2BInquirySection />
    </main>
  );
}
