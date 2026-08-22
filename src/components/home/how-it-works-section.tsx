import { PackageCheck, Search, Send, Truck } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Container } from "@/components/layout/container";

const steps = [
  {
    key: "inquiry",
    number: "01",
    icon: Send,
  },
  {
    key: "verification",
    number: "02",
    icon: Search,
  },
  {
    key: "samples",
    number: "03",
    icon: PackageCheck,
  },
  {
    key: "delivery",
    number: "04",
    icon: Truck,
  },
] as const;

export async function HowItWorksSection() {
  const t = await getTranslations("Home.howItWorks");

  return (
    <section className="bg-white pt-8 pb-8 sm:pt-10 sm:pb-10 lg:pt-12 lg:pb-12">
      <Container>
        {/* HEADING */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[var(--primary)]">
            {t("eyebrow")}
          </p>

          <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.04em] text-[var(--foreground)] sm:text-4xl">
            {t("title")}{" "}
            <span className="text-[var(--primary)]">{t("accent")}</span>
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[var(--muted-foreground)] sm:text-base">
            {t("description")}
          </p>
        </div>

        {/* DESKTOP */}
        <div className="relative mt-14 hidden lg:block">
          {/* linia łącząca kroki */}
          <div
            className="
              absolute
              left-[12.5%] right-[12.5%]
              top-[50px]
              h-px
              bg-[#d7e4ec]
            "
          />

          <div className="relative grid grid-cols-4 gap-8">
            {steps.map(({ key, number, icon: Icon }) => (
              <div
                key={key}
                className="relative flex flex-col items-center text-center"
              >
                {/* NUMBER */}
                <div
                  className="
                    absolute
                    left-1/2 top-0
                    z-20
                    -translate-x-[58px]
                    -translate-y-[2px]
                    rounded-md
                    bg-[#edf5fa]
                    px-2 py-1
                    text-[14px]
                    font-extrabold
                    text-[var(--primary)]
                  "
                >
                  {number}
                </div>

                {/* ICON */}
                <div
                  className="
                    relative z-10
                    flex size-[100px]
                    items-center justify-center
                    rounded-full
                    border border-[#d2e1ea]
                    bg-white
                    text-[var(--primary)]
                    shadow-[0_10px_35px_rgba(7,29,51,0.06)]
                  "
                >
                  <Icon className="size-9" strokeWidth={1.55} />
                </div>

                {/* CONTENT */}
                <div className="mt-6 max-w-[240px]">
                  <h3 className="text-[17px] font-extrabold tracking-[-0.025em] text-[var(--foreground)]">
                    {t(`steps.${key}.title`)}
                  </h3>

                  <p className="mt-2 text-[13px] leading-6 text-[var(--muted-foreground)]">
                    {t(`steps.${key}.description`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MOBILE / TABLET */}
        <div className="relative mx-auto mt-10 max-w-2xl lg:hidden">
          {/* pionowa linia */}
          <div
            className="
              absolute
              bottom-10 left-[23px] top-10
              w-px
              bg-[#d7e4ec]
              sm:left-[27px]
            "
          />

          <div className="space-y-4 sm:space-y-5">
            {steps.map(({ key, number, icon: Icon }) => (
              <div
                key={key}
                className="
                  relative
                  grid grid-cols-[48px_1fr]
                  gap-4

                  sm:grid-cols-[56px_1fr]
                  sm:gap-5
                "
              >
                {/* ICON */}
                <div
                  className="
                    relative z-10
                    flex size-12
                    items-center justify-center
                    rounded-full
                    border border-[#d2e1ea]
                    bg-white
                    text-[var(--primary)]
                    shadow-[0_6px_20px_rgba(7,29,51,0.05)]

                    sm:size-14
                  "
                >
                  <Icon className="size-5 sm:size-6" strokeWidth={1.6} />
                </div>

                {/* CARD */}
                <div
                  className="
                    rounded-xl
                    border border-[#e0e8ee]
                    bg-white
                    px-4 py-4
                    shadow-[0_6px_24px_rgba(7,29,51,0.045)]

                    sm:px-5
                    sm:py-5
                  "
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="
                        rounded-md
                        bg-[#edf5fa]
                        px-2 py-1
                        text-[12px]
                        font-extrabold
                        text-[var(--primary)]
                      "
                    >
                      {number}
                    </span>

                    <h3 className="text-[15px] font-extrabold tracking-[-0.02em] text-[var(--foreground)] sm:text-base">
                      {t(`steps.${key}.title`)}
                    </h3>
                  </div>

                  <p className="mt-2 text-[13px] leading-5 text-[var(--muted-foreground)] sm:text-sm sm:leading-6">
                    {t(`steps.${key}.description`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
