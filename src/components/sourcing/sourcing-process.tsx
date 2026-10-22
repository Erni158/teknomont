import { getTranslations } from "next-intl/server";

import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/ui/section-heading";

const steps = ["request", "search", "agreement", "delivery"] as const;

export async function SourcingProcess() {
  const t = await getTranslations("SourcingPage.process");

  return (
    <section id="proces" className="scroll-mt-28 bg-[#f5f8fa] py-14 sm:py-20">
      <Container>
        <SectionHeading
          align="left"
          title={t("title")}
          accent={t("accent")}
          description={t("description")}
        />
        <ol className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((key, index) => (
            <li key={key} className="border-t-2 border-[#c7dcea] pt-5">
              <span
                className="text-sm font-extrabold tracking-widest text-[var(--primary)]"
                aria-hidden="true"
              >
                0{index + 1}
              </span>
              <h3 className="mt-4 text-lg font-extrabold">
                {t(`steps.${key}.title`)}
              </h3>
              <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">
                {t(`steps.${key}.description`)}
              </p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
