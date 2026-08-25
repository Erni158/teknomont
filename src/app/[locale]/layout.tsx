import type { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { routing } from "@/i18n/routing";
import { GoogleAnalytics } from "@next/third-parties/google";
import { CookieConsent } from "@/components/cookies/cookie-consent";
import Script from "next/script";
import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const googleConsentDefaults = `
  window.dataLayer = window.dataLayer || [];

  function gtag() {
    dataLayer.push(arguments);
  }

  window.gtag = gtag;

  var analyticsConsent = 'denied';
  var marketingConsent = 'denied';

  try {
    var cookie = document.cookie
      .split('; ')
      .find(function (item) {
        return item.indexOf('tmidc_consent=') === 0;
      });

    if (cookie) {
      var value = cookie.substring(
        'tmidc_consent='.length
      );

      var preferences = JSON.parse(
        decodeURIComponent(value)
      );

      if (preferences.analytics === true) {
        analyticsConsent = 'granted';
      }

      if (preferences.marketing === true) {
        marketingConsent = 'granted';
      }
    }
  } catch (error) {
    // Niepoprawne lub stare ustawienia zgody.
  }

  gtag('consent', 'default', {
    analytics_storage: analyticsConsent,
    ad_storage: marketingConsent,
    ad_user_data: marketingConsent,
    ad_personalization: marketingConsent,
    wait_for_update: 500
  });
`;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://tmidc.pl",
    ),
    title: {
      default: t("title"),
      template: `%s | ${t("brand")}`,
    },
    description: t("description"),
    alternates: {
      languages: {
        pl: "/pl",
        en: "/en",
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <Script
          id="google-consent-default"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: googleConsentDefaults,
          }}
        />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <div className="flex min-h-dvh flex-col">
            <Header />
            <div className="flex-1">{children}</div>
            <Footer />
          </div>

          <CookieConsent />
        </NextIntlClientProvider>
      </body>
      {process.env.NEXT_PUBLIC_GA_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
      )}
    </html>
  );
}
