import { ArrowRight, Check } from "lucide-react";

import { getTranslations } from "next-intl/server";

import { Container } from "@/components/layout/container";
import { Link } from "@/i18n/navigation";

const items = ["pricing", "series", "stock"] as const;

export async function ProductsB2BSection() {
  const t = await getTranslations("ProductsPage.b2b");

  return (
    <section className="bg-white py-14 sm:py-16 lg:py-20">
      <Container maxWidth={1440}>
        <div
          className="
            relative overflow-hidden
            rounded-[24px]
            bg-[#07345d]
            px-5 py-9
            text-white

            sm:px-8
            sm:py-11

            lg:grid
            lg:grid-cols-[0.9fr_1.1fr]
            lg:items-center
            lg:gap-14
            lg:px-12
            lg:py-12

            xl:px-16
          "
        >
          <div
            className="
              pointer-events-none
              absolute -right-24 top-1/2
              size-[480px]
              -translate-y-1/2
              rounded-full
              bg-[#1375ad]/25
              blur-[110px]
            "
          />

          {/* LEFT */}
          <div className="relative z-10">
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
                text-3xl
                font-extrabold
                tracking-[-0.04em]

                sm:text-4xl
              "
            >
              {t("title")}
            </h2>

            <p className="mt-4 max-w-[560px] text-[15px] leading-7 text-white/70">
              {t("description")}
            </p>

            <Link
              href="/oferta-b2b"
              className="
                mt-6
                inline-flex h-12
                w-full
                items-center justify-center
                gap-2
                rounded-lg
                border border-white/60
                px-6
                text-[13px]
                font-extrabold
                uppercase
                text-white
                transition

                hover:bg-white
                hover:text-[#07345d]

                sm:w-auto
              "
            >
              {t("cta")}
              <ArrowRight className="size-4" />
            </Link>
          </div>

          {/* RIGHT */}
          <div
            className="
              relative z-10
              mt-8
              grid gap-4

              sm:grid-cols-3

              lg:mt-0
            "
          >
            {items.map((key) => (
              <div
                key={key}
                className="
                  border-t
                  border-white/15
                  pt-4

                  sm:border-l
                  sm:border-t-0
                  sm:pl-5
                  sm:pt-0

                  first:border-l-0
                  first:pl-0
                "
              >
                <div className="flex items-start gap-2.5">
                  <Check
                    className="
                      mt-0.5
                      size-4
                      shrink-0
                      text-[#8cc6ef]
                    "
                    strokeWidth={2.4}
                  />

                  <div>
                    <p className="text-[14px] font-extrabold">
                      {t(`items.${key}.title`)}
                    </p>

                    <p className="mt-1.5 text-[12px] leading-5 text-white/60">
                      {t(`items.${key}.description`)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
