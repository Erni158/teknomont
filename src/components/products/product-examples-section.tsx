import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { catalogExamples } from "@/lib/catalog";

export async function ProductExamplesSection() {
  const t = await getTranslations("ProductsPage.examples");

  return (
    <section className="bg-[#f5f8fa] py-14 sm:py-20">
      <Container>
        <SectionHeading
          align="left"
          title={t("title")}
          accent={t("accent")}
          description={t("description")}
        />
        <div className="mt-9 grid gap-5 md:grid-cols-3">
          {catalogExamples.map(
            ({ key, manufacturer, partNumber, image, href }) => (
              <article
                key={key}
                className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-white"
              >
                <div className="relative aspect-[4/3] border-b border-[var(--border)] bg-white">
                  <Image
                    src={image}
                    alt={t(`items.${key}.imageAlt`)}
                    fill
                    className="object-contain p-6"
                    sizes="(min-width: 1280px) 380px, (min-width: 768px) 30vw, 90vw"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--primary)]">
                    {manufacturer}
                  </p>
                  <p className="mt-2 break-words font-mono text-sm text-[var(--muted-foreground)]">
                    {partNumber}
                  </p>
                  <h3 className="mt-3 text-xl font-extrabold leading-snug">
                    {t(`items.${key}.title`)}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">
                    {t(`items.${key}.description`)}
                  </p>
                  <a
                    href={href}
                    className="mt-auto inline-flex min-h-11 items-center gap-2 pt-5 text-sm font-bold text-[var(--primary)] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4"
                  >
                    {t("cta")}
                    <span className="sr-only">
                      {" "}
                      — {manufacturer} {partNumber}
                    </span>
                    <ArrowUpRight
                      className="size-4 shrink-0"
                      aria-hidden="true"
                    />
                  </a>
                </div>
              </article>
            ),
          )}
        </div>
        <p className="mt-5 max-w-3xl text-sm leading-6 text-[var(--muted-foreground)]">
          {t("note")}
        </p>
      </Container>
    </section>
  );
}
