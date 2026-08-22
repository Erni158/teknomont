import Image from "next/image";

import { ArrowRight, Search } from "lucide-react";

import { getTranslations } from "next-intl/server";

import { Container } from "@/components/layout/container";
import { Link } from "@/i18n/navigation";

export async function ProductSupportSection() {
  const t = await getTranslations("ProductsPage.support");

  return (
    <section className="bg-[#f6f9fb] py-14 sm:py-18 lg:py-20">
      <Container maxWidth={1440}>
        <div
          className="
            grid overflow-hidden
            rounded-[24px]
            border border-[#dce7ed]
            bg-white

            lg:grid-cols-[0.95fr_1.05fr]
          "
        >
          {/* IMAGE */}
          <div
            className="
              relative
              min-h-[260px]
              overflow-hidden

              sm:min-h-[340px]

              lg:min-h-[430px]
            "
          >
            <Image
              src="/images/magnifier.png"
              alt=""
              fill
              className="object-cover object-center"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />

            <div
              className="
                pointer-events-none
                absolute inset-0
                bg-gradient-to-r
                from-transparent
                to-white/10
              "
            />
          </div>

          {/* CONTENT */}
          <div
            className="
              flex flex-col
              justify-center
              px-5 py-8

              sm:px-8
              sm:py-10

              lg:px-12

              xl:px-16
            "
          >
            <div
              className="
                flex size-11
                items-center justify-center
                rounded-full
                border border-[#cfdee8]
                bg-[#f4f8fb]
                text-[var(--primary)]
              "
            >
              <Search className="size-5" strokeWidth={1.7} />
            </div>

            <p
              className="
                mt-5
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
                leading-[1.05]
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
                mt-5
                max-w-[570px]
                text-[15px]
                leading-7
                text-[var(--muted-foreground)]

                sm:text-base
              "
            >
              {t("description")}
            </p>

            <Link
              href="/sourcing"
              className="
                mt-7
                inline-flex
                items-center gap-2
                self-start
                text-[14px]
                font-extrabold
                text-[var(--primary)]

                hover:underline
              "
            >
              {t("cta")}
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
