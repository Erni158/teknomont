import { Check } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Image from "next/image";

import { Link } from "@/i18n/navigation";

const benefits = ["pricing", "moq", "stock", "cooperation"] as const;

export async function B2BCtaSection() {
  const t = await getTranslations("Home.b2bCta");

  return (
    <section
      className="
        relative overflow-hidden
        bg-gradient-to-r
        from-[#07345d]
        via-[#074879]
        to-[#064f82]
        text-white
      "
    >
      {/* subtelna poświata po prawej */}
      <div
        className="
          pointer-events-none
          absolute -right-20 top-1/2
          size-[500px]
          -translate-y-1/2
          rounded-full
          bg-[#1683bd]/20
          blur-[110px]
        "
      />

      {/* CONNECTOR OUTLINE */}
      <div
        className="
            pointer-events-none
            absolute
            inset-y-0 right-0
            hidden
            w-[38%]
            overflow-hidden

            lg:block
            xl:w-[36%]
            2xl:w-[34%]
        "
        aria-hidden="true"
      >
        <Image
          src="/images/connector-outline.png"
          alt=""
          fill
          className="object-cover object-center"
          sizes="38vw"
          style={{
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, black 22%, black 100%)",
            maskImage:
              "linear-gradient(to right, transparent 0%, black 22%, black 100%)",
          }}
        />
      </div>

      <div
        className="
          relative
          mx-auto
          w-full
          max-w-[1600px]
          px-5 py-10

          sm:px-8
          sm:py-12

          lg:px-12
          lg:py-11

          xl:px-16
        "
      >
        <div
          className="
            grid gap-9

            lg:grid-cols-[0.85fr_1.15fr]
            lg:items-center
            lg:gap-12

            xl:grid-cols-[0.9fr_1.1fr]
            xl:gap-16
          "
        >
          {/* LEFT */}
          <div className="max-w-[520px]">
            <h2
              className="
                text-3xl
                font-extrabold
                leading-tight
                tracking-[-0.035em]

                sm:text-[34px]
              "
            >
              {t("title")}
            </h2>

            <p
              className="
                mt-4
                max-w-[480px]
                text-[14px]
                leading-6
                text-white/70

                sm:text-[15px]
              "
            >
              {t("description")}
            </p>

            <Link
              href="/kontakt"
              className="
                mt-6
                inline-flex h-12
                w-full
                items-center justify-center
                rounded-md
                border border-white/70
                px-6
                text-[13px]
                font-extrabold
                uppercase
                tracking-[0.01em]
                text-white
                transition

                hover:bg-white
                hover:text-[#07345d]

                sm:w-auto
              "
            >
              {t("cta")}
            </Link>
          </div>

          {/* RIGHT */}
          <div
            className="
              relative z-10

              lg:max-w-[600px]
              lg:border-l
              lg:border-white/20
              lg:pl-10

              xl:pl-12
            "
          >
            <ul className="grid gap-4">
              {benefits.map((key) => (
                <li key={key} className="flex items-center gap-3">
                  <Check
                    className="
                      size-4
                      shrink-0
                      text-[#8fc7e7]
                    "
                    strokeWidth={2.6}
                  />

                  <span
                    className="
                      text-[13px]
                      font-medium
                      leading-5
                      text-white/85

                      sm:text-[14px]
                    "
                  >
                    {t(`benefits.${key}.title`)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
