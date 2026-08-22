import { BadgeCheck, CircleDollarSign, Globe2 } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { SourcingForm } from "@/components/home/sourcing-form";

const benefits = [
  {
    key: "sourcing",
    icon: Globe2,
  },
  {
    key: "quality",
    icon: BadgeCheck,
  },
  {
    key: "pricing",
    icon: CircleDollarSign,
  },
] as const;

export async function SourcingSection() {
  const t = await getTranslations("Home.sourcing");

  return (
    <section className="bg-white pb-8 sm:pb-10 lg:pb-12">
      <div className="mx-auto w-full max-w-[1880px] px-3 sm:px-5 lg:px-6 xl:px-20">
        <div
          className="
            relative overflow-hidden
            rounded-[24px]
            border border-[#dce8f0]
            bg-[#f2f7fa]

            px-4 py-6
            sm:px-8 sm:py-9
            lg:px-12 lg:py-11
            xl:px-16 xl:py-12
            2xl:px-20
          "
        >
          {/* delikatna poświata */}
          <div
            className="
              pointer-events-none
              absolute -left-32 top-1/2
              size-[420px]
              -translate-y-1/2
              rounded-full
              bg-[rgba(0,91,158,0.045)]
              blur-[80px]
            "
          />

          <div
            className="
              relative
              grid items-center gap-10

              lg:grid-cols-[0.9fr_1.1fr]
              lg:gap-14

              xl:grid-cols-[0.85fr_1.15fr]
              xl:gap-20

              2xl:grid-cols-[0.8fr_1.2fr]
              2xl:gap-24
            "
          >
            {/* LEFT */}
            <div className="max-w-[620px]">
              <p
                className="
                  text-xs font-extrabold
                  uppercase tracking-[0.16em]
                  text-[var(--primary)]
                "
              >
                {t("eyebrow")}
              </p>

              <h2
                className="
                  mt-3
                  text-3xl font-extrabold
                  leading-[1.05]
                  tracking-[-0.04em]
                  text-[var(--foreground)]

                  sm:text-4xl

                  lg:text-[46px]

                  xl:text-[48px]
                "
              >
                {t("title")}{" "}
                <span className="text-[var(--primary)]">{t("accent")}</span>
              </h2>

              <p
                className="
                  mt-5
                  max-w-[580px]
                  text-[15px] leading-7
                  text-[var(--muted-foreground)]

                  sm:text-base
                "
              >
                {t("description")}
              </p>

              <div
                className="
                  mt-9
                  grid gap-5

                  sm:grid-cols-3
                  sm:gap-6

                  xl:gap-7
                "
              >
                {benefits.map(({ key, icon: Icon }) => (
                  <div key={key} className="flex min-w-0 items-start gap-3">
                    <div
                      className="
                        flex size-10 shrink-0
                        items-center justify-center
                        rounded-full
                        border border-[#cbdde8]
                        bg-white
                        text-[var(--primary)]

                        sm:size-11
                      "
                    >
                      <Icon
                        className="size-[18px] sm:size-5"
                        strokeWidth={1.7}
                      />
                    </div>

                    <div className="min-w-0 pt-0.5">
                      <p
                        className="
                          text-[13px]
                          font-extrabold
                          leading-[1.25]
                          text-[var(--foreground)]

                          sm:text-[14px]
                        "
                      >
                        {t(`benefits.${key}.title`)}
                      </p>

                      <p
                        className="
                          mt-1
                          text-[11px]
                          leading-[1.4]
                          text-[var(--muted-foreground)]

                          sm:text-[12px]
                        "
                      >
                        {t(`benefits.${key}.description`)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT */}
            <div className="w-full">
              <SourcingForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
