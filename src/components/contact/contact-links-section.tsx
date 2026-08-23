import { ArrowRight, Search, ShoppingCart, UsersRound } from "lucide-react";

import { getTranslations } from "next-intl/server";

import { Container } from "@/components/layout/container";
import { Link } from "@/i18n/navigation";

const items = [
  {
    key: "shop",
    icon: ShoppingCart,
    external: true,
  },
  {
    key: "sourcing",
    icon: Search,
    external: false,
  },
  {
    key: "b2b",
    icon: UsersRound,
    external: false,
  },
] as const;

export async function ContactLinksSection() {
  const t = await getTranslations("ContactPage.links");

  return (
    <section className="bg-[#f5f8fa] py-14 sm:py-16 lg:py-20">
      <Container>
        <div className="mx-auto max-w-[680px] text-center">
          <h2 className="text-3xl font-extrabold tracking-[-0.04em] text-[var(--foreground)]">
            {t("title")}
          </h2>

          <p className="mt-3 text-[14px] leading-6 text-[var(--muted-foreground)]">
            {t("description")}
          </p>
        </div>

        <div
          className="
            mt-8
            grid gap-3

            md:grid-cols-3
          "
        >
          {items.map(({ key, icon: Icon, external }) => {
            const content = (
              <>
                <div
                  className="
                    flex size-11
                    items-center justify-center
                    rounded-full
                    bg-[#eff6fa]
                    text-[var(--primary)]
                  "
                >
                  <Icon className="size-5" />
                </div>

                <div className="mt-5">
                  <h3 className="text-[16px] font-extrabold text-[var(--foreground)]">
                    {t(`items.${key}.title`)}
                  </h3>

                  <p className="mt-2 text-[13px] leading-6 text-[var(--muted-foreground)]">
                    {t(`items.${key}.description`)}
                  </p>
                </div>

                <div className="mt-auto flex items-center gap-2 pt-5 text-[13px] font-extrabold text-[var(--primary)]">
                  {t(`items.${key}.cta`)}

                  <ArrowRight className="size-4" />
                </div>
              </>
            );

            const className = `
              flex min-h-[220px]
              flex-col
              rounded-2xl
              border border-[#dce6ec]
              bg-white
              p-5
              transition

              hover:-translate-y-1
              hover:shadow-[0_14px_35px_rgba(7,29,51,0.06)]

              sm:p-6
            `;

            if (external) {
              return (
                <a
                  key={key}
                  href="https://sklep.tmidc.pl"
                  className={className}
                >
                  {content}
                </a>
              );
            }

            return (
              <Link
                key={key}
                href={key === "sourcing" ? "/sourcing" : "/oferta-b2b"}
                className={className}
              >
                {content}
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
