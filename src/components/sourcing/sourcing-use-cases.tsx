import { Boxes, PackageX, RefreshCw } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/ui/section-heading";

const items = [
  { key: "availability", icon: PackageX },
  { key: "alternative", icon: RefreshCw },
  { key: "series", icon: Boxes },
] as const;

export async function SourcingUseCases() {
  const t = await getTranslations("SourcingPage.useCases");

  return (
    <section className="bg-white py-14 sm:py-20">
      <Container>
        <SectionHeading
          align="left"
          title={t("title")}
          accent={t("accent")}
          description={t("description")}
        />
        <div className="mt-9 grid gap-5 md:grid-cols-3">
          {items.map(({ key, icon: Icon }) => (
            <article
              key={key}
              className="rounded-2xl border border-[var(--border)] p-6"
            >
              <Icon
                className="size-7 text-[var(--primary)]"
                strokeWidth={1.6}
                aria-hidden="true"
              />
              <h3 className="mt-5 text-xl font-extrabold">
                {t(`items.${key}.title`)}
              </h3>
              <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">
                {t(`items.${key}.description`)}
              </p>
              <p className="mt-5 border-t border-[var(--border)] pt-4 text-sm leading-6">
                <span className="font-bold">{t("includeLabel")} </span>
                {t(`items.${key}.include`)}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
