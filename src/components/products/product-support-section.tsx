import { ArrowRight, FileText, ShoppingCart } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Container } from "@/components/layout/container";
import { buttonClassName } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { Link } from "@/i18n/navigation";

export async function ProductSupportSection() {
  const t = await getTranslations("ProductsPage.ordering");

  return (
    <section className="bg-white py-14 sm:py-20">
      <Container>
        <SectionHeading
          align="left"
          title={t("title")}
          accent={t("accent")}
          description={t("description")}
        />
        <div className="mt-9 grid gap-5 lg:grid-cols-2">
          <article className="flex flex-col rounded-2xl border border-[var(--border)] bg-[#f5f8fa] p-6 sm:p-8">
            <ShoppingCart
              className="size-7 text-[var(--primary)]"
              aria-hidden="true"
            />
            <h3 className="mt-5 text-2xl font-extrabold">{t("shop.title")}</h3>
            <p className="mt-4 text-sm leading-7 text-[var(--muted-foreground)]">
              {t("shop.description")}
            </p>
            <a
              href="https://sklep.tmidc.pl/"
              className={buttonClassName("outline", "mt-7 self-start py-3")}
            >
              {t("shop.cta")}
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
          </article>
          <article className="flex flex-col rounded-2xl bg-[#07345d] p-6 text-white sm:p-8">
            <FileText className="size-7 text-[#a5d6f5]" aria-hidden="true" />
            <h3 className="mt-5 text-2xl font-extrabold">
              {t("inquiry.title")}
            </h3>
            <p className="mt-4 text-sm leading-7 text-white/80">
              {t("inquiry.description")}
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-white/90">
              {(["part", "quantity", "requirements"] as const).map((key) => (
                <li key={key}>{t(`inquiry.items.${key}`)}</li>
              ))}
            </ul>
            <Link
              href="/kontakt"
              className={buttonClassName("outline", "mt-7 self-start py-3")}
            >
              {t("inquiry.cta")}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </article>
        </div>
        <div className="mt-7 flex flex-col gap-4 border-t border-[var(--border)] pt-6 text-sm leading-7 sm:flex-row sm:items-start sm:justify-between">
          <p className="max-w-2xl text-[var(--muted-foreground)]">
            {t("support")}
          </p>
          <div className="flex shrink-0 flex-wrap gap-x-6 gap-y-2">
            <Link
              href="/sourcing"
              className="inline-flex min-h-11 items-center gap-2 font-bold text-[var(--primary)] hover:underline"
            >
              {t("sourcingCta")}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link
              href="/oferta-b2b"
              className="inline-flex min-h-11 items-center gap-2 font-bold text-[var(--primary)] hover:underline"
            >
              {t("b2bCta")}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
