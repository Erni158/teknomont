import { Boxes, CalendarDays, Globe2, UsersRound } from "lucide-react";

import { getTranslations } from "next-intl/server";

import { Container } from "@/components/layout/container";

const facts = [
  {
    key: "experience",
    icon: CalendarDays,
  },
  {
    key: "b2b",
    icon: UsersRound,
  },
  {
    key: "distribution",
    icon: Boxes,
  },
  {
    key: "sourcing",
    icon: Globe2,
  },
] as const;

export async function AboutHero() {
  const t = await getTranslations("AboutPage.hero");

  return (
    <section
      className="
        border-b border-[var(--border)]
        bg-[#f2f7fa]
        py-14

        sm:py-16

        lg:py-20
      "
    >
      <Container maxWidth={1440}>
        <div
          className="
            grid gap-10

            lg:grid-cols-[1fr_0.9fr]
            lg:items-center
            lg:gap-16
          "
        >
          <div className="max-w-[720px]">
            <p
              className="
                text-xs
                font-extrabold
                uppercase
                tracking-[0.17em]
                text-[var(--primary)]
              "
            >
              {t("eyebrow")}
            </p>

            <h1
              className="
                mt-4
                text-[42px]
                font-extrabold
                leading-[1]
                tracking-[-0.045em]
                text-[var(--foreground)]

                sm:text-[52px]

                lg:text-[58px]
              "
            >
              {t("title")}{" "}
              <span className="text-[var(--primary)]">{t("accent")}</span>
            </h1>

            <p
              className="
                mt-6
                max-w-[650px]
                text-[15px]
                leading-7
                text-[var(--muted-foreground)]

                sm:text-[17px]
                sm:leading-8
              "
            >
              {t("description")}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {facts.map(({ key, icon: Icon }) => (
              <div
                key={key}
                className="
                  rounded-2xl
                  border border-[#d7e3ea]
                  bg-white/75
                  p-4

                  sm:p-5
                "
              >
                <div
                  className="
                    flex size-10
                    items-center justify-center
                    rounded-full
                    bg-[#edf5f9]
                    text-[var(--primary)]
                  "
                >
                  <Icon className="size-[18px]" strokeWidth={1.7} />
                </div>

                <p
                  className="
                    mt-4
                    text-[15px]
                    font-extrabold
                    text-[var(--foreground)]

                    sm:text-[16px]
                  "
                >
                  {t(`facts.${key}.title`)}
                </p>

                <p
                  className="
                    mt-1
                    text-[12px]
                    leading-5
                    text-[var(--muted-foreground)]
                  "
                >
                  {t(`facts.${key}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
