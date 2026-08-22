import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Link } from "@/i18n/navigation";

const categories = [
  {
    key: "connectors",
    href: "/produkty",
    image: "/images/hero.png",
    position: "object-center",
  },
  {
    key: "materials",
    href: "/produkty",
    image: "/images/materials.png",
    position: "object-center",
  },
  {
    key: "hardToFind",
    href: "/sourcing",
    image: "/images/magnifier.png",
    position: "object-[center_52%]",
  },
  {
    key: "series",
    href: "/oferta-b2b",
    image: "/images/shipping.png",
    position: "object-[center_58%]",
  },
] as const;

export async function CategoriesSection() {
  const t = await getTranslations("Home.categories");

  return (
    <section className="bg-white py-14 sm:py-20 lg:py-24">
      <Container>
        <SectionHeading
          title={t("title")}
          accent={t("accent")}
          description={t("description")}
        />

        <div
          className="
            mt-8
            grid gap-4

            sm:mt-10
            sm:grid-cols-2

            lg:mt-12
            lg:grid-cols-4
          "
        >
          {categories.map((category) => (
            <Link
              key={category.key}
              href={category.href}
              className="
                group
                flex h-full flex-col
                overflow-hidden
                rounded-2xl
                border border-[var(--border)]
                bg-white
                shadow-[0_8px_35px_rgba(7,29,51,0.05)]
                transition duration-300

                hover:-translate-y-1
                hover:border-[rgba(0,78,138,0.28)]
                hover:shadow-[0_16px_45px_rgba(7,29,51,0.10)]
              "
            >
              {/* IMAGE */}
              <div
                className="
                  relative
                  h-[175px]
                  shrink-0
                  overflow-hidden
                  bg-[#f4f7f8]

                  sm:h-[185px]

                  lg:h-40
                "
              >
                <Image
                  src={category.image}
                  alt=""
                  fill
                  className={`
                    scale-[1.02]
                    object-cover
                    ${category.position}
                    mix-blend-multiply
                    transition duration-500

                    group-hover:scale-[1.07]
                  `}
                  sizes="
                    (min-width: 1024px) 25vw,
                    (min-width: 640px) 50vw,
                    100vw
                  "
                />

                <div
                  className="
                    pointer-events-none
                    absolute inset-0
                    bg-gradient-to-t
                    from-[#f4f7f8]/30
                    to-transparent
                  "
                />
              </div>

              {/* CONTENT */}
              <div
                className="
                  flex flex-1 flex-col
                  px-4 pb-5 pt-4

                  sm:px-5
                "
              >
                <div className="flex items-start justify-between gap-4">
                  <h3
                    className="
                      text-[17px]
                      font-extrabold
                      leading-[1.2]
                      tracking-[-0.025em]
                      text-[var(--foreground)]
                    "
                  >
                    {t(`${category.key}.title`)}
                  </h3>

                  <ArrowUpRight
                    className="
                      mt-0.5
                      size-[17px]
                      shrink-0
                      text-[var(--primary)]
                      transition-transform
                      duration-300

                      group-hover:translate-x-0.5
                      group-hover:-translate-y-0.5
                    "
                    strokeWidth={2}
                  />
                </div>

                <p
                  className="
                    mt-2
                    text-[13px]
                    leading-[1.6]
                    text-[var(--muted-foreground)]

                    sm:text-[14px]
                  "
                >
                  {t(`${category.key}.description`)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
