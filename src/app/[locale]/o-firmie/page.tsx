import type { Metadata } from "next";

import { getTranslations, setRequestLocale } from "next-intl/server";

import { AboutHero } from "@/components/about/about-hero";
import { AboutScopeSection } from "@/components/about/about-scope-section";
import { AboutContactSection } from "@/components/about/about-contact-section";
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
    namespace: "AboutPage.metadata",
  });

  return {
    title: t("title"),
    description: t("description"),
    alternates: getLocalizedAlternates(locale, "/o-firmie"),
  };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;

  setRequestLocale(locale);

  return (
    <main>
      <AboutHero />
      <AboutScopeSection />
      <AboutContactSection />
    </main>
  );
}
