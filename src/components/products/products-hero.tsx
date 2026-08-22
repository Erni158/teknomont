import Image from "next/image";

import { Boxes, PackageCheck, Send, ShoppingCart, Truck } from "lucide-react";

import { getTranslations } from "next-intl/server";

import { Container } from "@/components/layout/container";
import { buttonClassName } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

const benefits = [
  {
    key: "range",
    icon: Boxes,
  },
  {
    key: "availability",
    icon: PackageCheck,
  },
  {
    key: "series",
    icon: Truck,
  },
] as const;

export async function ProductsHero() {
  const t = await getTranslations("ProductsPage.hero");

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
          hidden w-[56%]

          lg:block
        "
        aria-hidden="true"
      >
        <Image
          src="/images/hero.png"
          alt=""
          fill
          priority
          className="object-cover object-[58%_center]"
          sizes="56vw"
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
            via-[#f4f7f8]/20
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
        "
      >
        <div
          className="
            relative z-10
            w-full

            lg:w-[53%]
            lg:max-w-[730px]
          "
        >
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

          <h1
            className="
              mt-4
              max-w-[720px]
              text-[42px]
              font-extrabold
              leading-[1]
              tracking-[-0.045em]
              text-[var(--foreground)]

              sm:text-[52px]

              lg:text-[58px]

              xl:text-[62px]
            "
          >
            {t("title")}{" "}
            <span className="text-[var(--primary)]">{t("accent")}</span>
          </h1>

          <p
            className="
              mt-6
              max-w-[610px]
              text-[15px]
              leading-7
              text-[var(--muted-foreground)]

              sm:text-[17px]
              sm:leading-8
            "
          >
            {t("description")}
          </p>

          {/* BENEFITS */}
          <div
            className="
              mt-8
              grid gap-5

              sm:grid-cols-3
              sm:gap-6
            "
          >
            {benefits.map(({ key, icon: Icon }) => (
              <div key={key} className="flex min-w-0 items-center gap-2.5">
                <div
                  className="
                    flex size-10 shrink-0
                    items-center justify-center
                    rounded-full
                    border border-[#c9dce8]
                    bg-white/75
                    text-[var(--primary)]
                  "
                >
                  <Icon className="size-[18px]" strokeWidth={1.7} />
                </div>

                <div>
                  <p className="text-[13px] font-extrabold leading-[1.15] text-[var(--foreground)]">
                    {t(`benefits.${key}.title`)}
                  </p>

                  <p className="mt-1 text-[11px] leading-[1.3] text-[var(--muted-foreground)]">
                    {t(`benefits.${key}.description`)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* MOBILE IMAGE */}
          <div
            className="
              relative
              -mx-5 mt-7
              h-[250px]
              overflow-hidden

              sm:-mx-8
              sm:h-[340px]

              lg:hidden
            "
            aria-hidden="true"
          >
            <Image
              src="/images/hero.png"
              alt=""
              fill
              className="object-cover object-center"
              sizes="100vw"
            />

            <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-[#f4f7f8] to-transparent" />
          </div>

          {/* CTA */}
          <div
            className="
              mt-7
              grid gap-3

              sm:flex
              sm:flex-wrap
            "
          >
            <a
              href="https://sklep.tmidc.pl"
              className={buttonClassName(
                "primary",
                "w-full sm:w-auto sm:min-w-[205px]",
              )}
            >
              <ShoppingCart className="size-4" />
              {t("shopCta")}
            </a>

            <Link
              href="/kontakt"
              className={buttonClassName(
                "outline",
                "w-full sm:w-auto sm:min-w-[190px]",
              )}
            >
              <Send className="size-4" />
              {t("inquiryCta")}
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
