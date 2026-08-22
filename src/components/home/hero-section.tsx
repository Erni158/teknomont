import Image from "next/image";
import { Send, ShoppingCart } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Container } from "@/components/layout/container";
import { HeroBenefits } from "@/components/home/hero-benefits";
import { buttonClassName } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export async function HeroSection() {
  const t = await getTranslations("Home");

  return (
    <section
      className="
        relative
        overflow-hidden
        border-b border-[var(--border)]
        bg-[#f4f7f8]
      "
    >
      {/* DESKTOP IMAGE */}
      <div
        className="
          pointer-events-none
          absolute inset-y-0 right-0
          hidden w-[57%]
          lg:block
          xl:w-[56%]
        "
        aria-hidden="true"
      >
        <Image
          src="/images/hero.png"
          alt=""
          fill
          priority
          className="object-cover object-[58%_center]"
          sizes="57vw"
          style={{
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, black 24%, black 100%)",
            maskImage:
              "linear-gradient(to right, transparent 0%, black 24%, black 100%)",
          }}
        />

        <div
          className="
            absolute inset-0
            bg-gradient-to-r
            from-[#f4f7f8]
            via-[#f4f7f8]/25
            to-transparent
          "
        />
      </div>

      <Container
        maxWidth={1440}
        className="
          relative
          flex items-center

          py-10

          sm:py-14

          lg:min-h-[620px]
          lg:py-0

          xl:min-h-[640px]
        "
      >
        <div
          className="
            relative z-10
            w-full

            lg:w-[53%]
            lg:max-w-[720px]

            xl:w-[51%]
          "
        >
          {/* EYEBROW */}
          <p
            className="
              text-[11px]
              font-extrabold
              uppercase
              tracking-[0.17em]
              text-[var(--primary)]

              sm:text-xs
            "
          >
            {t("eyebrow")}
          </p>

          {/* TITLE */}
          <h1
            className="
              mt-4
              max-w-[700px]
              text-[40px]
              font-extrabold
              leading-[1.02]
              tracking-[-0.045em]
              text-[var(--foreground)]

              sm:text-[52px]

              lg:text-[62px]

              xl:text-[68px]
            "
          >
            {t("title")}
          </h1>

          {/* DESCRIPTION */}
          <p
            className="
              mt-5
              max-w-[610px]
              text-[15px]
              leading-7
              text-[var(--muted-foreground)]

              sm:mt-6
              sm:text-base
              sm:leading-8

              lg:text-[17px]
            "
          >
            {t("description")}
          </p>

          {/* BENEFITS */}
          <HeroBenefits />

          {/* MOBILE IMAGE */}
          <div
            className="
              relative
              -mx-5 mt-7
              h-[245px]
              overflow-hidden

              sm:-mx-8
              sm:h-[330px]

              lg:hidden
            "
            aria-hidden="true"
          >
            <Image
              src="/images/hero.png"
              alt=""
              fill
              className="
                object-cover
                object-[54%_center]
              "
              sizes="100vw"
            />

            {/* miękkie przejście na górze */}
            <div
              className="
                pointer-events-none
                absolute inset-x-0 top-0
                h-10
                bg-gradient-to-b
                from-[#f4f7f8]
                to-transparent
              "
            />

            {/* bardzo delikatne wygaszenie dołu */}
            <div
              className="
                pointer-events-none
                absolute inset-x-0 bottom-0
                h-8
                bg-gradient-to-t
                from-[#f4f7f8]/40
                to-transparent
              "
            />
          </div>

          {/* CTA */}
          <div
            className="
              mt-5
              grid gap-3

              sm:mt-7
              sm:flex
              sm:flex-wrap
            "
          >
            <Link
              href="/kontakt"
              className={buttonClassName(
                "primary",
                "w-full sm:w-auto sm:min-w-[205px]",
              )}
            >
              <Send className="size-4" />
              {t("primaryCta")}
            </Link>

            <a
              href="https://sklep.tmidc.pl"
              className={buttonClassName(
                "outline",
                "w-full sm:w-auto sm:min-w-[220px]",
              )}
            >
              <ShoppingCart className="size-4" />
              {t("shopCta")}
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
