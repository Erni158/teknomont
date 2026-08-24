import { getTranslations } from "next-intl/server";

import { Container } from "@/components/layout/container";
import { SourcingForm } from "@/components/home/sourcing-form";

export async function SourcingInquirySection() {
  const t = await getTranslations("SourcingPage.inquiry");

  return (
    <section
      id="zapytanie"
      className="
        bg-white
        pt-10 pb-14
        sm:pt-12 sm:pb-16
        lg:pt-14 lg:pb-20
      "
    >
      <Container maxWidth={1440}>
        <div
          className="
            rounded-[24px]
            border border-[#dce8f0]
            bg-[#f2f7fa]

            px-4 py-7

            sm:px-7
            sm:py-9

            lg:px-10
            lg:py-10

            xl:px-12
          "
        >
          <div className="mx-auto max-w-[1120px]">
            {/* INTRO */}
            <div className="max-w-[720px]">
              <p
                className="
                  text-xs
                  font-extrabold
                  uppercase
                  tracking-[0.16em]
                  text-[var(--primary)]
                "
              >
                {t("eyebrow")}
              </p>

              <h2
                className="
                  mt-3
                  text-3xl
                  font-extrabold
                  tracking-[-0.04em]
                  text-[var(--foreground)]

                  sm:text-4xl
                "
              >
                {t("title")}{" "}
                <span className="text-[var(--primary)]">{t("accent")}</span>
              </h2>

              <p
                className="
                  mt-3
                  max-w-[680px]
                  text-[14px]
                  leading-6
                  text-[var(--muted-foreground)]

                  sm:text-[15px]
                  sm:leading-7
                "
              >
                {t("description")}
              </p>
            </div>

            {/* FORM */}
            <div className="mt-7 sm:mt-8">
              <SourcingForm />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
