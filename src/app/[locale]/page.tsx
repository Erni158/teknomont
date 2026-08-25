import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { CategoriesSection } from "@/components/home/categories-section";
import { SourcingSection } from "@/components/home/sourcing-section";
import { HowItWorksSection } from "@/components/home/how-it-works-section";
import { WhyTeknomontSection } from "@/components/home/why-teknomont-section";
import { B2BCtaSection } from "@/components/home/b2b-cta-section";
import { HeroSection } from "@/components/home/hero-section";

import { getLocalizedAlternates } from "@/lib/seo";

type Props = {
  params: Promise<{
    locale: string;
  }>;
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://www.tmidc.pl/#organization",

  name: "Teknomont",
  url: "https://www.tmidc.pl",

  logo: {
    "@type": "ImageObject",
    url: "https://www.tmidc.pl/images/logo.png",
  },

  description:
    "Dystrybucja złączy i komponentów dla przemysłu, dostawy B2B oraz globalny sourcing komponentów.",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const t = await getTranslations({
    locale,
    namespace: "Metadata",
  });

  return {
    // "absolute" omija template "%s | Teknomont"
    // z głównego layoutu.
    title: {
      absolute: t("title"),
    },

    description: t("description"),

    alternates: getLocalizedAlternates(locale),
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;

  setRequestLocale(locale);

  return (
    <main>
      <HeroSection />
      <CategoriesSection />
      <SourcingSection />
      <HowItWorksSection />
      <WhyTeknomontSection />
      <B2BCtaSection />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd),
        }}
      />
    </main>
  );
}
