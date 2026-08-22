import { Calculator, CalendarRange, PackageCheck, Repeat2 } from "lucide-react";

import { getTranslations } from "next-intl/server";

import { Container } from "@/components/layout/container";

const steps = [
  {
    key: "requirement",
    number: "01",
    icon: Calculator,
  },
  {
    key: "terms",
    number: "02",
    icon: CalendarRange,
  },
  {
    key: "order",
    number: "03",
    icon: PackageCheck,
  },
  {
    key: "repeat",
    number: "04",
    icon: Repeat2,
  },
] as const;

export async function B2BCooperationSection() {
  const t = await getTranslations("B2BPage.cooperation");

  return (
    <section id="wspolpraca" className="bg-white py-16 sm:py-20 lg:py-24">
      <Container>
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

        <div
          className="
            mt-10
            grid gap-4

            sm:grid-cols-2

            lg:mt-14
            lg:grid-cols-4
          "
        >
          {steps.map(({ key, number, icon: Icon }) => (
            <div
              key={key}
              className="
                rounded-2xl
                border border-[#dfe8ee]
                bg-white
                p-5

                sm:p-6
              "
            >
              <div className="flex items-center justify-between">
                <div
                  className="
                    flex size-11
                    items-center justify-center
                    rounded-full
                    border border-[#cfdee8]
                    bg-[#f5f9fb]
                    text-[var(--primary)]
                  "
                >
                  <Icon className="size-5" strokeWidth={1.6} />
                </div>

                <span className="text-[13px] font-extrabold text-[#a2b5c3]">
                  {number}
                </span>
              </div>

              <h3 className="mt-5 text-[16px] font-extrabold text-[var(--foreground)]">
                {t(`steps.${key}.title`)}
              </h3>

              <p className="mt-2 text-[13px] leading-6 text-[var(--muted-foreground)]">
                {t(`steps.${key}.description`)}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
