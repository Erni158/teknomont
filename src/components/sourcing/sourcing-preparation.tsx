import { ArrowRight, Check } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Container } from "@/components/layout/container";
import { Link } from "@/i18n/navigation";

export async function SourcingPreparation() {
  const t = await getTranslations("SourcingPage.preparation");

  return (
    <section className="bg-white py-14 sm:py-20">
      <Container className="grid gap-8 lg:grid-cols-2 lg:gap-14">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[var(--primary)]">
            {t("eyebrow")}
          </p>
          <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.035em] sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-5 text-sm leading-7 text-[var(--muted-foreground)]">
            {t("description")}
          </p>
          <p className="mt-4 text-sm leading-7 text-[var(--muted-foreground)]">
            {t("approval")}
          </p>
          <Link
            href="/produkty"
            className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[var(--primary)] hover:underline"
          >
            {t("productsCta")}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[#f5f8fa] p-6 sm:p-8">
          <h3 className="text-xl font-extrabold">{t("checklistTitle")}</h3>
          <ul className="mt-5 space-y-5">
            {(
              ["connection", "electrical", "environment", "documents"] as const
            ).map((key) => (
              <li
                key={key}
                className="flex items-start gap-3 text-sm leading-6"
              >
                <Check
                  className="mt-1 size-4 shrink-0 text-[var(--primary)]"
                  aria-hidden="true"
                />
                <div>
                  <p className="font-bold">{t(`items.${key}.title`)}</p>
                  <p className="mt-1 text-[var(--muted-foreground)]">
                    {t(`items.${key}.description`)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
