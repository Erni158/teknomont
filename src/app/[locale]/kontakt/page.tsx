import type { Metadata } from "next";

import { getTranslations, setRequestLocale } from "next-intl/server";

import { ContactHero } from "@/components/contact/contact-hero";
import { ContactSection } from "@/components/contact/contact-section";
import { ContactLinksSection } from "@/components/contact/contact-links-section";

type Props = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const t = await getTranslations({
    locale,
    namespace: "ContactPage.metadata",
  });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;

  setRequestLocale(locale);

  return (
    <main>
      <ContactHero />
      <ContactSection />
      <ContactLinksSection />
    </main>
  );
}
