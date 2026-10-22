import Image from "next/image";
import { ArrowDown, ShoppingCart } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Container } from "@/components/layout/container";
import { buttonClassName } from "@/components/ui/button";

export async function ProductsHero() {
  const t = await getTranslations("ProductsPage.hero");

  return (
    <section className="relative overflow-hidden border-b border-[var(--border)] bg-[#f4f7f8]">
      <div
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-[52%] lg:block"
        aria-hidden="true"
      >
        <Image
          src="/images/hero.png"
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="52vw"
          style={{
            maskImage: "linear-gradient(to right, transparent, black 35%)",
          }}
        />
      </div>
      <Container maxWidth={1440} className="relative py-12 sm:py-16 lg:py-20">
        <div className="relative z-10 lg:max-w-[650px] lg:w-[56%]">
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[var(--primary)]">
            {t("eyebrow")}
          </p>
          <h1 className="mt-4 text-4xl font-extrabold leading-[1.08] tracking-[-0.04em] sm:text-5xl xl:text-[56px]">
            {t("title")}{" "}
            <span className="text-[var(--primary)]">{t("accent")}</span>
          </h1>
          <p className="mt-6 max-w-[580px] text-base leading-8 text-[var(--muted-foreground)]">
            {t("description")}
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a href="#oferta" className={buttonClassName("primary", "py-3")}>
              {t("rangeCta")}
              <ArrowDown className="size-4" aria-hidden="true" />
            </a>
            <a
              href="https://sklep.tmidc.pl/"
              className={buttonClassName("outline", "py-3")}
            >
              <ShoppingCart className="size-4" aria-hidden="true" />
              {t("shopCta")}
            </a>
          </div>
          <p className="mt-5 text-sm leading-6 text-[var(--muted-foreground)]">
            {t("note")}
          </p>
        </div>
      </Container>
    </section>
  );
}
