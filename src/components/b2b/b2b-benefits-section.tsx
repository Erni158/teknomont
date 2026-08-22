import {
  CalendarClock,
  Handshake,
  PackageOpen,
  TrendingDown,
} from "lucide-react";

import { getTranslations } from "next-intl/server";

import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/ui/section-heading";

const items = [
  {
    key: "pricing",
    icon: TrendingDown,
  },
  {
    key: "schedule",
    icon: CalendarClock,
  },
  {
    key: "stock",
    icon: PackageOpen,
  },
  {
    key: "cooperation",
    icon: Handshake,
  },
] as const;

export async function B2BBenefitsSection() {
  const t = await getTranslations("B2BPage.benefits");

  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <Container>
        <SectionHeading
          title={t("title")}
          accent={t("accent")}
          description={t("description")}
        />

        <div
          className="
            mt-10
            grid gap-4

            sm:grid-cols-2

            lg:mt-12
            lg:grid-cols-4
          "
        >
          {items.map(({ key, icon: Icon }) => (
            <div
              key={key}
              className="
                rounded-2xl
                border border-[#dfe8ee]
                bg-white
                p-5
                shadow-[0_8px_30px_rgba(7,29,51,0.04)]

                sm:p-6
              "
            >
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
                <Icon className="size-5" strokeWidth={1.7} />
              </div>

              <h3
                className="
                  mt-5
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
