import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { SourcingHero } from "@/components/sourcing/sourcing-hero";
import { SourcingUseCases } from "@/components/sourcing/sourcing-use-cases";
import { SourcingCapabilities } from "@/components/sourcing/sourcing-capabilities";
import { SourcingProcess } from "@/components/sourcing/sourcing-process";
import { SourcingInquirySection } from "@/components/sourcing/sourcing-inquiry-section";

type Props = {
  params: Promise<{
    locale: string;
  }>;
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
  };
}

export default async function SourcingPage({ params }: Props) {
  const { locale } = await params;

  setRequestLocale(locale);

  return (
    <main>
      <SourcingHero />
      <SourcingUseCases />
      <SourcingCapabilities />
      <SourcingProcess />
      <SourcingInquirySection />
    </main>
  );
}
