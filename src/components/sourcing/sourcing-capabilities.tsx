import {
  Cable,
  Component,
  FileSearch,
  PlugZap,
  Settings2,
  Shapes,
} from "lucide-react";

import { getTranslations } from "next-intl/server";

import { Container } from "@/components/layout/container";

const items = [
  {
    key: "connectors",
    icon: PlugZap,
  },
  {
    key: "harness",
    icon: Cable,
  },
  {
    key: "electromechanical",
    icon: Component,
  },
  {
    key: "partNumber",
    icon: FileSearch,
  },
  {
    key: "custom",
    icon: Settings2,
  },
  {
    key: "other",
    icon: Shapes,
  },
] as const;

export async function SourcingCapabilities() {
  const t = await getTranslations("SourcingPage.capabilities");

  return (
    <section className="bg-[#f6f9fb] py-16 sm:py-20 lg:py-24">
      <Container maxWidth={1440}>
        <div
          className="
            grid gap-10

            lg:grid-cols-[0.7fr_1.3fr]
            lg:items-start
            lg:gap-16

            xl:gap-20
          "
        >
          {/* INTRO */}
          <div className="max-w-[480px]">
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
                text-3xl
                font-extrabold
                leading-[1.05]
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
                mt-5
                text-[15px]
                leading-7
                text-[var(--muted-foreground)]

                sm:text-base
              "
            >
              {t("description")}
            </p>

            <div
              className="
                mt-6
                rounded-xl
                border border-[#dbe7ee]
                bg-white
                p-4
                text-[13px]
                leading-6
                text-[var(--muted-foreground)]
              "
            >
              {t("note")}
            </div>
          </div>

          {/* ITEMS */}
          <div
            className="
              grid gap-3

              sm:grid-cols-2

              xl:grid-cols-3
            "
          >
            {items.map(({ key, icon: Icon }) => (
              <div
                key={key}
                className="
                  flex min-h-[150px]
                  flex-col
                  rounded-2xl
                  border border-[#dde7ed]
                  bg-white
                  p-5
                "
              >
                <Icon
                  className="size-6 text-[var(--primary)]"
                  strokeWidth={1.6}
                />

                <h3
                  className="
                    mt-5
                    text-[15px]
                    font-extrabold
                    text-[var(--foreground)]
                  "
                >
                  {t(`items.${key}.title`)}
                </h3>

                <p
                  className="
                    mt-2
                    text-[12px]
                    leading-5
                    text-[var(--muted-foreground)]
                  "
                >
                  {t(`items.${key}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
