// src/instrumentation-client.ts

type ConsentPreferences = {
  version: number;
  analytics: boolean;
  marketing: boolean;
};

type WindowWithGtag = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
};

const win = window as WindowWithGtag;

win.dataLayer = win.dataLayer || [];

win.gtag = function (...args: unknown[]) {
  win.dataLayer?.push(args);
};

let analyticsConsent = "denied";
let marketingConsent = "denied";

try {
  const cookie = document.cookie
    .split("; ")
    .find((item) => item.startsWith("tmidc_consent="));

  if (cookie) {
    const value = cookie.slice("tmidc_consent=".length);

    const preferences = JSON.parse(
      decodeURIComponent(value),
    ) as ConsentPreferences;

    if (preferences.analytics === true) {
      analyticsConsent = "granted";
    }

    if (preferences.marketing === true) {
      marketingConsent = "granted";
    }
  }
} catch {
  // Niepoprawna lub stara wartość cookie.
}

win.gtag?.("consent", "default", {
  analytics_storage: analyticsConsent,
  ad_storage: marketingConsent,
  ad_user_data: marketingConsent,
  ad_personalization: marketingConsent,
  wait_for_update: 500,
});
