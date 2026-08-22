import {
  Boxes,
  Cable,
  Circle,
  Component,
  Layers,
  Package,
  PlugZap,
  ShieldCheck,
} from "lucide-react";

import { getTranslations } from "next-intl/server";

import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/ui/section-heading";

const categories = [
  {
    key: "connectors",
    icon: PlugZap,
  },
  {
    key: "terminals",
    icon: Component,
  },
  {
    key: "seals",
    icon: ShieldCheck,
  },
  {
    key: "wires",
    icon: Cable,
  },
  {
    key: "sleeves",
    icon: Layers,
  },
  {
    key: "heatShrink",
    icon: Package,
  },
  {
    key: "grommets",
    icon: Circle,
  },
  {
    key: "accessories",
    icon: Boxes,
  },
] as const;

export async function ProductCategoriesSection() {
  const t = await getTranslations("ProductsPage.categories");

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
            grid gap-3

            sm:grid-cols-2
            sm:gap-4

            lg:mt-12
            lg:grid-cols-4
          "
        >
          {categories.map(({ key, icon: Icon }) => (
            <div
              key={key}
              className="
                group
                flex min-h-[210px]
                flex-col
                rounded-2xl
                border border-[#dfe8ee]
                bg-white
                p-5
                transition duration-300

                hover:-translate-y-1
                hover:border-[#c9dce8]
                hover:shadow-[0_14px_40px_rgba(7,29,51,0.07)]

                sm:p-6
              "
            >
              <div
                className="
                  flex size-12
                  items-center justify-center
                  rounded-xl
                  border border-[#d7e4ec]
                  bg-[#f3f8fb]
                  text-[var(--primary)]
                  transition-colors

                  group-hover:bg-[#eaf4f9]
                "
              >
                <Icon className="size-6" strokeWidth={1.6} />
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

        <div className="mt-8 flex justify-center">
          <a
            href="https://sklep.tmidc.pl"
            className="
              inline-flex h-12
              items-center justify-center
              rounded-lg
              border border-[var(--primary)]
              px-6
              text-[13px]
              font-extrabold
              uppercase
              text-[var(--primary)]
              transition

              hover:bg-[#f2f7fa]
            "
          >
            {t("shopCta")}
          </a>
        </div>
      </Container>
    </section>
  );
}
