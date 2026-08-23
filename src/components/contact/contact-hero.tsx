import { Mail, MessageSquareText, Phone } from "lucide-react";

import { getTranslations } from "next-intl/server";

import { Container } from "@/components/layout/container";

export async function ContactHero() {
  const t = await getTranslations("ContactPage.hero");

  return (
    <section
      className="
        relative overflow-hidden
        border-b border-[var(--border)]
        bg-[#f2f7fa]
      "
    >
      <div
        className="
          pointer-events-none
          absolute
          -right-20 top-1/2
          size-[520px]
          -translate-y-1/2
          rounded-full
          bg-[#6ba9cb]/10
          blur-[110px]
        "
      />

      <Container
        maxWidth={1440}
        className="
          relative
          py-14

          sm:py-16

          lg:py-20
        "
      >
        <div
          className="
            grid gap-10

            lg:grid-cols-[1fr_auto]
            lg:items-end
            lg:gap-16
          "
        >
          <div className="max-w-[760px]">
            <p
              className="
                text-xs
                font-extrabold
                uppercase
                tracking-[0.17em]
                text-[var(--primary)]
              "
            >
              {t("eyebrow")}
            </p>

            <h1
              className="
                mt-4
                text-[42px]
                font-extrabold
                leading-[1]
                tracking-[-0.045em]
                text-[var(--foreground)]

                sm:text-[52px]

                lg:text-[58px]
              "
            >
              {t("title")}{" "}
              <span className="text-[var(--primary)]">{t("accent")}</span>
            </h1>

            <p
              className="
                mt-6
                max-w-[650px]
                text-[15px]
                leading-7
                text-[var(--muted-foreground)]

                sm:text-[17px]
                sm:leading-8
              "
            >
              {t("description")}
            </p>
          </div>

          <div
            className="
              grid gap-3

              sm:grid-cols-3

              lg:min-w-[500px]
            "
          >
            <div
              className="
                flex items-center gap-3
                rounded-xl
                border border-[#d6e3eb]
                bg-white/70
                px-4 py-3
              "
            >
              <Mail
                className="size-5 text-[var(--primary)]"
                strokeWidth={1.7}
              />

              <div>
                <p className="text-[12px] font-extrabold text-[var(--foreground)]">
                  {t("items.email.title")}
                </p>

                <p className="mt-0.5 text-[11px] text-[var(--muted-foreground)]">
                  {t("items.email.description")}
                </p>
              </div>
            </div>

            <div
              className="
                flex items-center gap-3
                rounded-xl
                border border-[#d6e3eb]
                bg-white/70
                px-4 py-3
              "
            >
              <Phone
                className="size-5 text-[var(--primary)]"
                strokeWidth={1.7}
              />

              <div>
                <p className="text-[12px] font-extrabold text-[var(--foreground)]">
                  {t("items.phone.title")}
                </p>

                <p className="mt-0.5 text-[11px] text-[var(--muted-foreground)]">
                  {t("items.phone.description")}
                </p>
              </div>
            </div>

            <div
              className="
                flex items-center gap-3
                rounded-xl
                border border-[#d6e3eb]
                bg-white/70
                px-4 py-3
              "
            >
              <MessageSquareText
                className="size-5 text-[var(--primary)]"
                strokeWidth={1.7}
              />

              <div>
                <p className="text-[12px] font-extrabold text-[var(--foreground)]">
                  {t("items.inquiry.title")}
                </p>

                <p className="mt-0.5 text-[11px] text-[var(--muted-foreground)]">
                  {t("items.inquiry.description")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
