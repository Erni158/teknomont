"use client";

import { useEffect, useState } from "react";

import {
  BarChart3,
  Check,
  ChevronLeft,
  ShieldCheck,
  Target,
  X,
} from "lucide-react";

import { useTranslations } from "next-intl";

const COOKIE_NAME = "tmidc_consent";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 180;

type ConsentPreferences = {
  version: 1;
  analytics: boolean;
  marketing: boolean;
};

type WindowWithGtag = Window & {
  gtag?: (...args: unknown[]) => void;
};

function readConsentCookie(): ConsentPreferences | null {
  if (typeof document === "undefined") {
    return null;
  }

  const cookie = document.cookie
    .split("; ")
    .find((item) => item.startsWith(`${COOKIE_NAME}=`));

  if (!cookie) {
    return null;
  }

  try {
    const value = cookie.slice(`${COOKIE_NAME}=`.length);

    const parsed = JSON.parse(decodeURIComponent(value)) as ConsentPreferences;

    if (parsed.version !== 1) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

function saveConsentCookie(preferences: ConsentPreferences) {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";

  document.cookie = [
    `${COOKIE_NAME}=${encodeURIComponent(JSON.stringify(preferences))}`,
    "Path=/",
    `Max-Age=${COOKIE_MAX_AGE}`,
    "SameSite=Lax",
    secure,
  ].join("; ");
}

function updateGoogleConsent(preferences: ConsentPreferences) {
  const gtag = (window as WindowWithGtag).gtag;

  gtag?.("consent", "update", {
    analytics_storage: preferences.analytics ? "granted" : "denied",

    ad_storage: preferences.marketing ? "granted" : "denied",

    ad_user_data: preferences.marketing ? "granted" : "denied",

    ad_personalization: preferences.marketing ? "granted" : "denied",
  });
}

export function CookieConsent() {
  const t = useTranslations("CookieConsent");

  const [visible, setVisible] = useState(false);

  const [showSettings, setShowSettings] = useState(false);

  const [analytics, setAnalytics] = useState(false);

  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const saved = readConsentCookie();

    if (!saved) {
      setVisible(true);
      return;
    }

    setAnalytics(saved.analytics);
    setMarketing(saved.marketing);
  }, []);

  useEffect(() => {
    function openSettings() {
      const saved = readConsentCookie();

      if (saved) {
        setAnalytics(saved.analytics);
        setMarketing(saved.marketing);
      }

      setShowSettings(true);
      setVisible(true);
    }

    window.addEventListener("tmidc:open-cookie-settings", openSettings);

    return () => {
      window.removeEventListener("tmidc:open-cookie-settings", openSettings);
    };
  }, []);

  function save(preferences: ConsentPreferences) {
    saveConsentCookie(preferences);
    updateGoogleConsent(preferences);

    setAnalytics(preferences.analytics);
    setMarketing(preferences.marketing);

    setVisible(false);
    setShowSettings(false);
  }

  function acceptAll() {
    save({
      version: 1,
      analytics: true,
      marketing: true,
    });
  }

  function rejectOptional() {
    save({
      version: 1,
      analytics: false,
      marketing: false,
    });
  }

  function saveSettings() {
    save({
      version: 1,
      analytics,
      marketing,
    });
  }

  if (!visible) {
    return null;
  }

  return (
    <>
      <div
        className="
          fixed inset-0
          z-[998]
          bg-[#071d33]/20
          backdrop-blur-[2px]
        "
        aria-hidden="true"
      />

      <div
        className="
          fixed
          inset-x-3 bottom-3
          z-[999]

          mx-auto
          max-w-[780px]

          overflow-hidden
          rounded-2xl
          border border-[#d9e4eb]
          bg-white

          shadow-[0_24px_80px_rgba(7,29,51,0.22)]

          sm:inset-x-5
          sm:bottom-5
        "
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-consent-title"
      >
        {!showSettings ? (
          <div className="p-5 sm:p-6">
            <div
              className="
                flex
                items-start
                gap-4
              "
            >
              <div
                className="
                  hidden
                  size-11
                  shrink-0
                  items-center
                  justify-center

                  rounded-full
                  bg-[#eef6fa]

                  text-[var(--primary)]

                  sm:flex
                "
              >
                <ShieldCheck className="size-5" strokeWidth={1.8} />
              </div>

              <div className="min-w-0">
                <h2
                  id="cookie-consent-title"
                  className="
                    text-[18px]
                    font-extrabold
                    tracking-[-0.025em]
                    text-[var(--foreground)]

                    sm:text-[20px]
                  "
                >
                  {t("title")}
                </h2>

                <p
                  className="
                    mt-2
                    text-[12px]
                    leading-5
                    text-[var(--muted-foreground)]

                    sm:text-[13px]
                    sm:leading-6
                  "
                >
                  {t("description")}
                </p>
              </div>
            </div>

            <div
              className="
                mt-5
                grid gap-2.5

                sm:flex
                sm:flex-wrap
                sm:justify-end
              "
            >
              <button
                type="button"
                onClick={() => setShowSettings(true)}
                className="
                  h-11
                  rounded-lg

                  border border-[#d6e2e9]

                  px-5

                  text-[12px]
                  font-extrabold
                  uppercase
                  tracking-[0.02em]

                  text-[var(--foreground)]

                  transition

                  hover:bg-[#f5f8fa]
                "
              >
                {t("settings")}
              </button>

              <button
                type="button"
                onClick={rejectOptional}
                className="
                  h-11
                  rounded-lg

                  border border-[var(--primary)]

                  px-5

                  text-[12px]
                  font-extrabold
                  uppercase
                  tracking-[0.02em]

                  text-[var(--primary)]

                  transition

                  hover:bg-[#f1f7fa]
                "
              >
                {t("necessaryOnly")}
              </button>

              <button
                type="button"
                onClick={acceptAll}
                className="
                  h-11
                  rounded-lg

                  bg-[var(--primary)]

                  px-5

                  text-[12px]
                  font-extrabold
                  uppercase
                  tracking-[0.02em]

                  text-white

                  transition

                  hover:brightness-95
                "
              >
                {t("acceptAll")}
              </button>
            </div>
          </div>
        ) : (
          <div className="p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <button
                  type="button"
                  onClick={() => setShowSettings(false)}
                  className="
                    mb-3
                    inline-flex
                    items-center
                    gap-1

                    text-[11px]
                    font-bold

                    text-[var(--primary)]
                  "
                >
                  <ChevronLeft className="size-3.5" />

                  {t("back")}
                </button>

                <h2
                  className="
                    text-[19px]
                    font-extrabold
                    tracking-[-0.025em]
                    text-[var(--foreground)]
                  "
                >
                  {t("settingsTitle")}
                </h2>

                <p
                  className="
                    mt-2
                    max-w-[620px]
                    text-[12px]
                    leading-5
                    text-[var(--muted-foreground)]
                  "
                >
                  {t("settingsDescription")}
                </p>
              </div>

              <button
                type="button"
                onClick={rejectOptional}
                aria-label={t("close")}
                className="
                  flex size-9
                  shrink-0
                  items-center
                  justify-center

                  rounded-full

                  text-[#70838f]

                  transition

                  hover:bg-[#f2f6f8]
                "
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="mt-5 space-y-3">
              {/* NECESSARY */}
              <div
                className="
                  flex
                  items-start
                  justify-between
                  gap-4

                  rounded-xl
                  border border-[#dce6ec]

                  bg-[#f8fafb]

                  p-4
                "
              >
                <div className="flex gap-3">
                  <div
                    className="
                      flex size-9
                      shrink-0
                      items-center
                      justify-center

                      rounded-full

                      bg-white

                      text-[var(--primary)]
                    "
                  >
                    <ShieldCheck className="size-4" strokeWidth={1.8} />
                  </div>

                  <div>
                    <p
                      className="
                        text-[13px]
                        font-extrabold
                        text-[var(--foreground)]
                      "
                    >
                      {t("categories.necessary.title")}
                    </p>

                    <p
                      className="
                        mt-1
                        text-[11px]
                        leading-5
                        text-[var(--muted-foreground)]
                      "
                    >
                      {t("categories.necessary.description")}
                    </p>
                  </div>
                </div>

                <span
                  className="
                    flex size-8
                    shrink-0
                    items-center
                    justify-center

                    rounded-full

                    bg-[#eaf5ee]

                    text-emerald-700
                  "
                >
                  <Check className="size-4" />
                </span>
              </div>

              {/* ANALYTICS */}
              <PreferenceRow
                icon={<BarChart3 className="size-4" strokeWidth={1.8} />}
                title={t("categories.analytics.title")}
                description={t("categories.analytics.description")}
                checked={analytics}
                onChange={setAnalytics}
              />

              {/* MARKETING */}
              <PreferenceRow
                icon={<Target className="size-4" strokeWidth={1.8} />}
                title={t("categories.marketing.title")}
                description={t("categories.marketing.description")}
                checked={marketing}
                onChange={setMarketing}
              />
            </div>

            <div
              className="
                mt-5
                grid gap-2.5

                sm:flex
                sm:justify-end
              "
            >
              <button
                type="button"
                onClick={rejectOptional}
                className="
                  h-11
                  rounded-lg

                  border border-[#d5e1e8]

                  px-5

                  text-[12px]
                  font-extrabold
                  uppercase

                  text-[var(--foreground)]

                  hover:bg-[#f5f8fa]
                "
              >
                {t("necessaryOnly")}
              </button>

              <button
                type="button"
                onClick={saveSettings}
                className="
                  h-11
                  rounded-lg

                  bg-[var(--primary)]

                  px-6

                  text-[12px]
                  font-extrabold
                  uppercase

                  text-white

                  transition

                  hover:brightness-95
                "
              >
                {t("save")}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

type PreferenceRowProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
};

function PreferenceRow({
  icon,
  title,
  description,
  checked,
  onChange,
}: PreferenceRowProps) {
  return (
    <div
      className="
        flex
        items-start
        justify-between
        gap-4

        rounded-xl
        border border-[#dce6ec]

        bg-white

        p-4
      "
    >
      <div className="flex gap-3">
        <div
          className="
            flex size-9
            shrink-0
            items-center
            justify-center

            rounded-full

            bg-[#f1f7fa]

            text-[var(--primary)]
          "
        >
          {icon}
        </div>

        <div>
          <p
            className="
              text-[13px]
              font-extrabold
              text-[var(--foreground)]
            "
          >
            {title}
          </p>

          <p
            className="
              mt-1
              text-[11px]
              leading-5
              text-[var(--muted-foreground)]
            "
          >
            {description}
          </p>
        </div>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`
          relative
          mt-1
          h-6 w-11
          shrink-0

          rounded-full

          transition-colors

          ${checked ? "bg-[var(--primary)]" : "bg-[#ccd7dd]"}
        `}
      >
        <span
          className={`
            absolute
            top-1
            size-4

            rounded-full
            bg-white

            shadow-sm

            transition-transform

            ${checked ? "translate-x-[23px]" : "translate-x-1"}
          `}
        />
      </button>
    </div>
  );
}
