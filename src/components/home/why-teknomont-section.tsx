import {
  Boxes,
  Globe2,
  Handshake,
  Headphones,
  ShieldCheck,
} from "lucide-react";

import { getTranslations } from "next-intl/server";

import { Container } from "@/components/layout/container";

const benefits = [
  {
    key: "experience",
    icon: Handshake,
  },
  {
    key: "assortment",
    icon: Boxes,
  },
  {
    key: "quality",
    icon: ShieldCheck,
  },
  {
    key: "sourcing",
    icon: Globe2,
  },
  {
    key: "support",
    icon: Headphones,
  },
] as const;

export async function WhyTeknomontSection() {
  const t = await getTranslations("Home.whyTeknomont");

  return (
    <section className="bg-[#f7f9fb] pt-10 pb-16 sm:pt-12 sm:pb-20 lg:pt-14 lg:pb-24">
      <Container maxWidth={1460}>
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

        {/* BENEFITS */}
        <div
          className="
            mt-10
            grid grid-cols-1
            gap-4

            sm:grid-cols-2

            lg:mt-14
            lg:grid-cols-5
            lg:gap-0
          "
        >
          {benefits.map(({ key, icon: Icon }, index) => (
            <div
              key={key}
              className={`
                group
                flex flex-col
                rounded-2xl
                border border-[#e0e7ed]
                bg-white
                p-5
                transition
                duration-300

                hover:-translate-y-1
                hover:border-[#cbdce8]
                hover:shadow-[0_15px_40px_rgba(7,29,51,0.07)]

                sm:p-6

                lg:rounded-none
                lg:border-0
                lg:bg-transparent
                lg:px-7
                lg:py-2
                lg:text-center
                lg:hover:translate-y-0
                lg:hover:border-[#dce5eb]
                lg:hover:shadow-none

                ${index !== benefits.length - 1 ? "lg:border-r" : ""}
              `}
            >
              <div
                className="
                  flex size-11
                  items-center justify-center
                  rounded-full
                  border border-[#ccdae5]
                  bg-white
                  text-[var(--primary)]
                  shadow-[0_7px_20px_rgba(7,29,51,0.04)]

                  lg:mx-auto
                  lg:size-12
                "
              >
                <Icon className="size-5 lg:size-[22px]" strokeWidth={1.65} />
              </div>

              <h3
                className="
                  mt-4
                  text-[16px]
                  font-extrabold
                  leading-[1.2]
                  tracking-[-0.02em]
                  text-[var(--foreground)]
                "
              >
                {t(`benefits.${key}.title`)}
              </h3>

              <p
                className="
                  mt-2
                  text-[13px]
                  leading-5
                  text-[var(--muted-foreground)]
                "
              >
                {t(`benefits.${key}.description`)}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
