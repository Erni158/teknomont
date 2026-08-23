import { PackageCheck, Search, Send } from "lucide-react";

import { getTranslations } from "next-intl/server";

import { Container } from "@/components/layout/container";

const steps = [
  {
    key: "request",
    number: "01",
    icon: Send,
  },
  {
    key: "search",
    number: "02",
    icon: Search,
  },
  {
    key: "delivery",
    number: "03",
    icon: PackageCheck,
  },
] as const;

export async function SourcingProcess() {
  const t = await getTranslations("SourcingPage.process");

  return (
    <section id="proces" className="bg-[#f5f8fa] py-14 sm:py-16 lg:py-20">
      <Container maxWidth={1120}>
        {/* HEADING */}
        <div className="mx-auto max-w-[660px] text-center">
          <p
            className="
              text-xs
              font-extrabold
              uppercase
              tracking-[0.16em]
              text-[var(--primary)]
            "
          >
            {t("eyebrow")}
          </p>

          <h2
            className="
              mt-3
              text-3xl
              font-extrabold
              tracking-[-0.04em]
              text-[var(--foreground)]

              sm:text-4xl
            "
          >
            {t("title")}{" "}
            <span className="text-[var(--primary)]">{t("accent")}</span>
          </h2>

          <p
            className="
              mx-auto
              mt-4
              max-w-[580px]
              text-[14px]
              leading-6
              text-[var(--muted-foreground)]

              sm:text-[15px]
            "
          >
            {t("description")}
          </p>
        </div>

        {/* DESKTOP */}
        <div
          className="
            relative
            mt-12
            hidden
            grid-cols-3

            md:grid
          "
        >
          {/* LINE */}
          <div
            className="
              absolute
              left-[16.666%]
              right-[16.666%]
              top-6
              h-px
              bg-[#cfdde6]
            "
          />

          {steps.map(({ key, number, icon: Icon }) => (
            <div
              key={key}
              className="
                  relative z-10
                  px-6
                  text-center
                "
            >
              <div
                className="
                    mx-auto
                    flex size-12
                    items-center justify-center
                    rounded-full
                    border border-[#c9dce7]
                    bg-white
                    text-[var(--primary)]
                    shadow-[0_5px_20px_rgba(7,29,51,0.04)]
                  "
              >
                <Icon className="size-5" strokeWidth={1.7} />
              </div>

              <p
                className="
                    mt-4
                    text-[11px]
                    font-extrabold
                    tracking-[0.12em]
                    text-[#94a8b5]
                  "
              >
                {number}
              </p>

              <h3
                className="
                    mt-2
                    text-[16px]
                    font-extrabold
                    tracking-[-0.02em]
                    text-[var(--foreground)]
                  "
              >
                {t(`steps.${key}.title`)}
              </h3>

              <p
                className="
                    mx-auto
                    mt-2
                    max-w-[280px]
                    text-[13px]
                    leading-6
                    text-[var(--muted-foreground)]
                  "
              >
                {t(`steps.${key}.description`)}
              </p>
            </div>
          ))}
        </div>

        {/* MOBILE */}
        <div className="mt-9 space-y-0 md:hidden">
          {steps.map(({ key, number, icon: Icon }, index) => (
            <div
              key={key}
              className="
                  relative
                  grid
                  grid-cols-[48px_1fr]
                  gap-4
                  pb-7
                "
            >
              {index !== steps.length - 1 && (
                <div
                  className="
                      absolute
                      left-[23px]
                      top-12
                      bottom-0
                      w-px
                      bg-[#cfdde6]
                    "
                />
              )}

              <div
                className="
                    relative z-10
                    flex size-12
                    items-center justify-center
                    rounded-full
                    border border-[#c9dce7]
                    bg-white
                    text-[var(--primary)]
                  "
              >
                <Icon className="size-5" strokeWidth={1.7} />
              </div>

              <div className="pt-0.5">
                <p
                  className="
                      text-[10px]
                      font-extrabold
                      tracking-[0.12em]
                      text-[#94a8b5]
                    "
                >
                  {number}
                </p>

                <h3
                  className="
                      mt-1
                      text-[16px]
                      font-extrabold
                      text-[var(--foreground)]
                    "
                >
                  {t(`steps.${key}.title`)}
                </h3>

                <p
                  className="
                      mt-1.5
                      text-[13px]
                      leading-6
                      text-[var(--muted-foreground)]
                    "
                >
                  {t(`steps.${key}.description`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
