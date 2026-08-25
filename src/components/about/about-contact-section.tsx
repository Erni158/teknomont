import { ArrowRight, Mail } from "lucide-react";

import { getTranslations } from "next-intl/server";

import { Container } from "@/components/layout/container";
import { Link } from "@/i18n/navigation";

export async function AboutContactSection() {
  const t = await getTranslations("AboutPage.contact");

  return (
    <section className="bg-white pb-16 sm:pb-20">
      <Container maxWidth={1280}>
        <div
          className="
            rounded-[22px]
            bg-[#07345d]
            px-5 py-8
            text-white

            sm:px-8
            sm:py-9

            lg:flex
            lg:items-center
            lg:justify-between
            lg:gap-12
            lg:px-12
            lg:py-10
          "
        >
          <div className="max-w-[720px]">
            <p
              className="
                text-xs
                font-extrabold
                uppercase
                tracking-[0.16em]
                text-[#8cc6ef]
              "
            >
              {t("eyebrow")}
            </p>

            <h2
              className="
                mt-3
                text-2xl
                font-extrabold
                tracking-[-0.035em]

                sm:text-3xl
              "
            >
              {t("title")}
            </h2>

            <p
              className="
                mt-3
                max-w-[620px]
                text-[14px]
                leading-6
                text-white/70
              "
            >
              {t("description")}
            </p>
          </div>

          <div
            className="
              mt-6
              grid gap-3

              sm:flex

              lg:mt-0
              lg:shrink-0
            "
          >
            <Link
              href="/kontakt"
              className="
                inline-flex h-11
                items-center justify-center
                gap-2
                rounded-lg
                bg-white
                px-6
                text-[12px]
                font-extrabold
                uppercase
                text-[#07345d]
                transition

                hover:bg-[#eef6fb]
              "
            >
              <Mail className="size-4" />

              {t("contactCta")}
            </Link>

            <Link
              href="/sourcing"
              className="
                inline-flex h-11
                items-center justify-center
                gap-2
                rounded-lg
                border border-white/40
                px-6
                text-[12px]
                font-extrabold
                uppercase
                text-white
                transition

                hover:bg-white/10
              "
            >
              {t("sourcingCta")}

              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
