import { ArrowRight, Mail, Phone } from "lucide-react";

import { getTranslations } from "next-intl/server";

import { Container } from "@/components/layout/container";
import { Link } from "@/i18n/navigation";

export async function B2BInquirySection() {
  const t = await getTranslations("B2BPage.inquiry");

  return (
    <section id="zapytanie-b2b" className="bg-white pb-16 sm:pb-20 lg:pb-24">
      <Container maxWidth={1440}>
        <div
          className="
            relative overflow-hidden
            rounded-[24px]
            bg-[#07345d]
            px-5 py-9
            text-white

            sm:px-8 sm:py-11

            lg:px-12 lg:py-12

            xl:px-16
          "
        >
          <div
            className="
              pointer-events-none
              absolute -right-20 top-1/2
              size-[420px]
              -translate-y-1/2
              rounded-full
              bg-[#1073ad]/30
              blur-[100px]
            "
          />

          <div
            className="
              relative
              grid gap-8

              lg:grid-cols-[1fr_auto]
              lg:items-center
              lg:gap-14
            "
          >
            <div className="max-w-[720px]">
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#8cc6ef]">
                {t("eyebrow")}
              </p>

              <h2
                className="
                  mt-3
                  text-3xl
                  font-extrabold
                  tracking-[-0.04em]

                  sm:text-4xl
                "
              >
                {t("title")}
              </h2>

              <p className="mt-4 max-w-[650px] text-[15px] leading-7 text-white/70">
                {t("description")}
              </p>
            </div>

            <div
              className="
                grid gap-3

                sm:grid-cols-2

                lg:min-w-[380px]
              "
            >
              <Link
                href="/kontakt"
                className="
                  flex h-12
                  items-center justify-center gap-2
                  rounded-lg
                  bg-white
                  px-5
                  text-[13px]
                  font-extrabold
                  uppercase
                  text-[#07345d]
                  transition

                  hover:bg-[#eef6fb]
                "
              >
                <Mail className="size-4" />
                {t("contact")}
              </Link>

              <a
                href="tel:+48781702472"
                className="
                  flex h-12
                  items-center justify-center gap-2
                  rounded-lg
                  border border-white/40
                  px-5
                  text-[13px]
                  font-extrabold
                  uppercase
                  text-white
                  transition

                  hover:bg-white/10
                "
              >
                <Phone className="size-4" />
                {t("phone")}
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
