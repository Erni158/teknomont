import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { SourcingHero } from "@/components/sourcing/sourcing-hero";
import { SourcingUseCases } from "@/components/sourcing/sourcing-use-cases";
import { SourcingProcess } from "@/components/sourcing/sourcing-process";
import { SourcingPreparation } from "@/components/sourcing/sourcing-preparation";
import { SourcingFaq } from "@/components/sourcing/sourcing-faq";
import { SourcingInquirySection } from "@/components/sourcing/sourcing-inquiry-section";
import { getLocalizedAlternates, getLocalizedUrl } from "@/lib/seo";
import { Props } from "@/lib/types";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const t = await getTranslations({
    locale,
    namespace: "SourcingPage.metadata",
  });

  return {
    title: t("title"),
    description: t("description"),
    alternates: getLocalizedAlternates(locale, "/sourcing"),
    openGraph: {
      title: `${t("title")} | Teknomont`,
      description: t("description"),
      url: getLocalizedUrl(locale, "/sourcing"),
      siteName: "Teknomont",
      type: "website",

      images: [
        {
          url: "/images/sourcing-hero.png",
          width: 1200,
          height: 630,
          alt:
            locale === "pl"
              ? "Sourcing komponentów — Teknomont"
              : "Component sourcing — Teknomont",
        },
      ],
    },
  };
}

export default async function SourcingPage({ params }: Props) {
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
        name: "Sourcing",
        item: getLocalizedUrl(locale, "/sourcing"),
      },
    ],
  };

  return (
    <main>
      <SourcingHero />
      <SourcingUseCases />
      <SourcingProcess />
      <SourcingPreparation />
      <SourcingFaq />
      <SourcingInquirySection />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />
    </main>
  );
}
