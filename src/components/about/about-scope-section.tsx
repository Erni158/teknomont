import { PackageCheck, Search, Truck } from "lucide-react";

import { getTranslations } from "next-intl/server";

import { Container } from "@/components/layout/container";

const items = [
  {
    key: "distribution",
    icon: PackageCheck,
  },
  {
    key: "b2b",
    icon: Truck,
  },
  {
    key: "sourcing",
    icon: Search,
  },
] as const;

export async function AboutScopeSection() {
  const t = await getTranslations("AboutPage.scope");

  return (
    <section className="bg-white py-14 sm:py-16 lg:py-20">
      <Container maxWidth={1180}>
        <div className="mx-auto max-w-[680px] text-center">
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
              mt-4
              text-[14px]
              leading-6
              text-[var(--muted-foreground)]

              sm:text-[15px]
            "
          >
            {t("description")}
          </p>
        </div>

        <div
          className="
            mt-10
            grid

            md:grid-cols-3

            lg:mt-12
          "
        >
          {items.map(({ key, icon: Icon }, index) => (
            <div
              key={key}
              className={`
                py-6

                md:px-8
                md:py-2

                ${
                  index !== items.length - 1
                    ? `
                      border-b border-[#dfe8ee]

                      md:border-b-0
                      md:border-r
                    `
                    : ""
                }
              `}
            >
              <div
                className="
                  flex size-11
                  items-center justify-center
                  rounded-full
                  border border-[#d0e0e9]
                  bg-[#f4f8fa]
                  text-[var(--primary)]
                "
              >
                <Icon className="size-5" strokeWidth={1.7} />
              </div>

              <h3
                className="
                  mt-4
                  text-[17px]
                  font-extrabold
                  tracking-[-0.025em]
                  text-[var(--foreground)]
                "
              >
                {t(`items.${key}.title`)}
              </h3>

              <p
                className="
                  mt-2
                  max-w-[300px]
                  text-[13px]
                  leading-6
                  text-[var(--muted-foreground)]
                "
              >
                {t(`items.${key}.description`)}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
