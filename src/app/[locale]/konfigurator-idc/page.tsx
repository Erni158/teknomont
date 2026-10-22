import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { IdcStudio } from "@/components/idc/idc-studio";
import { getLocalizedAlternates, getLocalizedUrl } from "@/lib/seo";
import type { Props } from "@/lib/types";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "IdcStudio.metadata" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: getLocalizedAlternates(locale, "/konfigurator-idc"),
    openGraph: {
      title: `${t("title")} | Teknomont`,
      description: t("description"),
      url: getLocalizedUrl(locale, "/konfigurator-idc"),
      siteName: "Teknomont",
      type: "website",
    },
  };
}

export default async function IdcPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("IdcStudio");
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: t("products"),
        item: getLocalizedUrl(locale, "/produkty"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "IDC Studio",
        item: getLocalizedUrl(locale, "/konfigurator-idc"),
      },
    ],
  };
  return (
    <>
      <IdcStudio />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbs).replace(/</g, "\\u003c"),
        }}
      />
    </>
  );
}
