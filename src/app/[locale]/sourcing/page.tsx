import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { SourcingHero } from "@/components/sourcing/sourcing-hero";
import { SourcingUseCases } from "@/components/sourcing/sourcing-use-cases";
// import { SourcingCapabilities } from "@/components/sourcing/sourcing-capabilities";
import { SourcingProcess } from "@/components/sourcing/sourcing-process";
import { SourcingInquirySection } from "@/components/sourcing/sourcing-inquiry-section";
import { getLocalizedAlternates } from "@/lib/seo";

type Props = {
  params: Promise<{
    locale: string;
  }>;
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Strona główna",
      item: "https://www.tmidc.pl/pl",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Sourcing",
      item: "https://www.tmidc.pl/pl/sourcing",
    },
  ],
};

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
      title: t("title"),
      description: t("description"),
      url: `https://www.tmidc.pl/${locale}/sourcing`,
      siteName: "Teknomont",
      type: "website",

      images: [
        {
          url: "/images/sourcing.png",
          width: 1200,
          height: 630,
          alt: "Sourcing komponentów — Teknomont",
        },
      ],
    },
  };
}

export default async function SourcingPage({ params }: Props) {
  const { locale } = await params;

  setRequestLocale(locale);

  return (
    <main>
      <SourcingHero />
      <SourcingUseCases />
      <SourcingProcess />
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
