import Image from "next/image";
import { ArrowDown, FileSearch } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Container } from "@/components/layout/container";
import { buttonClassName } from "@/components/ui/button";

export async function SourcingHero() {
  const t = await getTranslations("SourcingPage.hero");

  return (
    <section className="relative overflow-hidden border-b border-[var(--border)] bg-[#f2f7fa]">
      <div
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-[52%] lg:block"
        aria-hidden="true"
      >
        <Image
          src="/images/sourcing-hero.png"
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
        <div className="relative z-10 lg:w-[56%] lg:max-w-[660px]">
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[var(--primary)]">
            {t("eyebrow")}
          </p>
          <h1 className="mt-4 text-4xl font-extrabold leading-[1.08] tracking-[-0.04em] sm:text-5xl xl:text-[56px]">
            {t("title")}{" "}
            <span className="text-[var(--primary)]">{t("accent")}</span>
          </h1>
          <p className="mt-6 max-w-[600px] text-base leading-8 text-[var(--muted-foreground)]">
            {t("description")}
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a href="#zapytanie" className={buttonClassName("primary", "py-3")}>
              <FileSearch className="size-4 shrink-0" aria-hidden="true" />
              {t("primaryCta")}
            </a>
            <a href="#proces" className={buttonClassName("outline", "py-3")}>
              {t("secondaryCta")}
              <ArrowDown className="size-4" aria-hidden="true" />
            </a>
          </div>
          <p className="mt-5 max-w-[560px] text-sm leading-6 text-[var(--muted-foreground)]">
            {t("note")}
          </p>
        </div>
      </Container>
    </section>
  );
}
