import Image from "next/image";
import { Send, ShoppingCart } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/layout/container";
import { buttonClassName } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { HeroBenefits } from "@/components/home/hero-benefits";
import { CategoriesSection } from "@/components/home/categories-section";
import { SourcingSection } from "@/components/home/sourcing-section";
import { HowItWorksSection } from "@/components/home/how-it-works-section";
import { WhyTeknomontSection } from "@/components/home/why-teknomont-section";
import { B2BCtaSection } from "@/components/home/b2b-cta-section";
import { HeroSection } from "@/components/home/hero-section";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Home");

  return (
    <main>
      <HeroSection />
      <CategoriesSection />
      <SourcingSection />
      <HowItWorksSection />
      <WhyTeknomontSection />
      <B2BCtaSection />
    </main>
  );
}
