"use client";

import { useTranslations } from "next-intl";

export function CookieSettingsButton() {
  const t = useTranslations("CookieConsent");

  function openSettings() {
    window.dispatchEvent(new Event("tmidc:open-cookie-settings"));
  }

  return (
    <button
      type="button"
      onClick={openSettings}
      className="
        text-left
        text-sm
        text-[var(--muted-foreground)]

        transition

        hover:text-[var(--foreground)]
      "
    >
      {t("settingsLink")}
    </button>
  );
}
