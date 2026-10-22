import {
  ArrowUpRight,
  Cable,
  Layers,
  PlugZap,
  ToggleRight,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { catalogCategories } from "@/lib/catalog";

const icons = {
  connectors: PlugZap,
  wires: Cable,
  protection: Layers,
  controls: ToggleRight,
};

export async function ProductCategoriesSection() {
  const t = await getTranslations("ProductsPage.categories");

  return (
    <section id="oferta" className="scroll-mt-28 bg-white py-14 sm:py-20">
      <Container>
        <SectionHeading
          align="left"
          title={t("title")}
          accent={t("accent")}
          description={t("description")}
        />
        <div className="mt-9 grid gap-5 lg:grid-cols-2">
          {catalogCategories.map(({ key, links }, index) => {
            const Icon = icons[key];
            return (
              <article
                key={key}
                className="flex flex-col rounded-2xl border border-[var(--border)] p-6 sm:p-8"
              >
                <div className="flex items-center justify-between gap-4">
                  <Icon
                    className="size-7 text-[var(--primary)]"
                    strokeWidth={1.6}
                    aria-hidden="true"
                  />
                  <span
                    className="text-xs font-bold tracking-widest text-[var(--muted-foreground)]"
                    aria-hidden="true"
                  >
                    0{index + 1}
                  </span>
                </div>
                <h3 className="mt-5 text-2xl font-extrabold tracking-[-0.025em]">
                  {t(`items.${key}.title`)}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">
                  {t(`items.${key}.description`)}
                </p>
                <dl className="mt-5 space-y-4 border-t border-[var(--border)] pt-5 text-sm leading-6">
                  <div>
                    <dt className="font-bold">{t("examplesLabel")}</dt>
                    <dd className="mt-1 text-[var(--muted-foreground)]">
                      {t(`items.${key}.examples`)}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-bold">{t("selectionLabel")}</dt>
                    <dd className="mt-1 text-[var(--muted-foreground)]">
                      {t(`items.${key}.selection`)}
                    </dd>
                  </div>
                </dl>
                <div className="mt-auto flex flex-wrap gap-x-6 gap-y-1 pt-5">
                  {links.map((link) => (
                    <a
                      key={link.key}
                      href={link.href}
                      className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[var(--primary)] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4"
                    >
                      {t(`links.${link.key}`)}
                      <ArrowUpRight
                        className="size-4 shrink-0"
                        aria-hidden="true"
                      />
                    </a>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
