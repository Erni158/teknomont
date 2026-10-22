import { Plus } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/ui/section-heading";

export async function SourcingFaq() {
  const t = await getTranslations("SourcingPage.faq");

  return (
    <section className="bg-[#f5f8fa] py-14 sm:py-20">
      <Container className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:gap-14">
        <SectionHeading
          align="left"
          title={t("title")}
          description={t("description")}
        />
        <div className="divide-y divide-[var(--border)] border-y border-[var(--border)]">
          {(["identification", "list", "terms", "sample"] as const).map(
            (key) => (
              <details key={key} className="group">
                <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-5 py-5 text-base font-bold marker:content-none focus-visible:outline-2 focus-visible:outline-offset-4 [&::-webkit-details-marker]:hidden">
                  {t(`items.${key}.question`)}
                  <Plus
                    className="size-5 shrink-0 text-[var(--primary)] transition-transform group-open:rotate-45"
                    aria-hidden="true"
                  />
                </summary>
                <p className="pb-6 pr-5 text-sm leading-7 text-[var(--muted-foreground)]">
                  {t(`items.${key}.answer`)}
                </p>
              </details>
            ),
          )}
        </div>
      </Container>
    </section>
  );
}
