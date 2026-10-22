import { Check } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Container } from "@/components/layout/container";
import { SourcingForm } from "@/components/home/sourcing-form";

export async function SourcingInquirySection() {
  const t = await getTranslations("SourcingPage.inquiry");

  return (
    <section id="zapytanie" className="scroll-mt-28 bg-white py-14 sm:py-20">
      <Container className="grid items-start gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:gap-14">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[var(--primary)]">
            {t("eyebrow")}
          </p>
          <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.035em] sm:text-4xl">
            {t("title")}{" "}
            <span className="text-[var(--primary)]">{t("accent")}</span>
          </h2>
          <p className="mt-5 text-sm leading-7 text-[var(--muted-foreground)]">
            {t("description")}
          </p>
          <ul className="mt-6 space-y-4">
            {(["part", "quantity", "requirements"] as const).map((key) => (
              <li
                key={key}
                className="flex items-start gap-3 text-sm leading-6"
              >
                <Check
                  className="mt-1 size-4 shrink-0 text-[var(--primary)]"
                  aria-hidden="true"
                />
                <span>{t(`items.${key}`)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 border-t border-[var(--border)] pt-5 text-sm leading-6 text-[var(--muted-foreground)]">
            {t("attachmentNote")}
          </p>
        </div>
        <div className="min-w-0">
          <SourcingForm />
        </div>
      </Container>
    </section>
  );
}
