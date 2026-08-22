import { Factory, Settings, Wrench, Cable } from "lucide-react";

import { getTranslations } from "next-intl/server";

import { Container } from "@/components/layout/container";

const items = [
  {
    key: "manufacturing",
    icon: Factory,
  },
  {
    key: "harness",
    icon: Cable,
  },
  {
    key: "automation",
    icon: Settings,
  },
  {
    key: "service",
    icon: Wrench,
  },
] as const;

export async function B2BForWhoSection() {
  const t = await getTranslations("B2BPage.forWho");

  return (
    <section className="bg-[#f6f9fb] py-16 sm:py-20 lg:py-24">
      <Container maxWidth={1440}>
        <div
          className="
            grid gap-10

            lg:grid-cols-[0.7fr_1.3fr]
            lg:items-center
            lg:gap-16
          "
        >
          {/* LEFT */}
          <div className="max-w-[500px]">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[var(--primary)]">
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

            <p className="mt-5 text-[15px] leading-7 text-[var(--muted-foreground)] sm:text-base">
              {t("description")}
            </p>
          </div>

          {/* RIGHT */}
          <div className="grid gap-3 sm:grid-cols-2">
            {items.map(({ key, icon: Icon }) => (
              <div
                key={key}
                className="
                  flex gap-4
                  rounded-2xl
                  border border-[#dde7ed]
                  bg-white
                  p-5

                  sm:p-6
                "
              >
                <div
                  className="
                    flex size-11 shrink-0
                    items-center justify-center
                    rounded-full
                    bg-[#eff6fa]
                    text-[var(--primary)]
                  "
                >
                  <Icon className="size-5" strokeWidth={1.7} />
                </div>

                <div>
                  <h3 className="text-[16px] font-extrabold text-[var(--foreground)]">
                    {t(`items.${key}.title`)}
                  </h3>

                  <p className="mt-2 text-[13px] leading-6 text-[var(--muted-foreground)]">
                    {t(`items.${key}.description`)}
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
