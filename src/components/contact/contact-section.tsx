import { Building2, Mail, MapPin, Phone } from "lucide-react";

import { getTranslations } from "next-intl/server";

import { Container } from "@/components/layout/container";
import { ContactForm } from "@/components/contact/contact-form";

const contactDetails = {
  email: "TU_WPISZ_EMAIL",
  phone: "TU_WPISZ_TELEFON",
  phoneHref: "TU_WPISZ_TELEFON_DO_TEL",
  address: "TU_WPISZ_ADRES",
};

export async function ContactSection() {
  const t = await getTranslations("ContactPage.contact");

  return (
    <section className="bg-white py-14 sm:py-16 lg:py-20">
      <Container maxWidth={1280}>
        <div
          className="
            grid gap-8

            lg:grid-cols-[0.72fr_1.28fr]
            lg:gap-12

            xl:gap-16
          "
        >
          {/* LEFT */}
          <div>
            <p
              className="
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
                mt-4
                max-w-[480px]
                text-[15px]
                leading-7
                text-[var(--muted-foreground)]
              "
            >
              {t("description")}
            </p>

            <div className="mt-8 space-y-3">
              <a
                href={`mailto:${contactDetails.email}`}
                className="
                  flex items-start gap-4
                  rounded-xl
                  border border-[#dce6ec]
                  bg-[#f8fafb]
                  p-4
                  transition

                  hover:border-[#c4d8e4]
                "
              >
                <div
                  className="
                    flex size-10 shrink-0
                    items-center justify-center
                    rounded-full
                    bg-white
                    text-[var(--primary)]
                  "
                >
                  <Mail className="size-4" />
                </div>

                <div>
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#7c8e9a]">
                    {t("details.email")}
                  </p>

                  <p className="mt-1 text-[14px] font-extrabold text-[var(--foreground)]">
                    {contactDetails.email}
                  </p>
                </div>
              </a>

              <a
                href={`tel:${contactDetails.phoneHref}`}
                className="
                  flex items-start gap-4
                  rounded-xl
                  border border-[#dce6ec]
                  bg-[#f8fafb]
                  p-4
                  transition

                  hover:border-[#c4d8e4]
                "
              >
                <div
                  className="
                    flex size-10 shrink-0
                    items-center justify-center
                    rounded-full
                    bg-white
                    text-[var(--primary)]
                  "
                >
                  <Phone className="size-4" />
                </div>

                <div>
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#7c8e9a]">
                    {t("details.phone")}
                  </p>

                  <p className="mt-1 text-[14px] font-extrabold text-[var(--foreground)]">
                    {contactDetails.phone}
                  </p>
                </div>
              </a>

              <div
                className="
                  flex items-start gap-4
                  rounded-xl
                  border border-[#dce6ec]
                  bg-[#f8fafb]
                  p-4
                "
              >
                <div
                  className="
                    flex size-10 shrink-0
                    items-center justify-center
                    rounded-full
                    bg-white
                    text-[var(--primary)]
                  "
                >
                  <MapPin className="size-4" />
                </div>

                <div>
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#7c8e9a]">
                    {t("details.address")}
                  </p>

                  <p className="mt-1 text-[14px] font-extrabold leading-6 text-[var(--foreground)]">
                    {contactDetails.address}
                  </p>
                </div>
              </div>

              <div
                className="
                  flex items-start gap-4
                  rounded-xl
                  border border-[#dce6ec]
                  bg-[#f8fafb]
                  p-4
                "
              >
                <div
                  className="
                    flex size-10 shrink-0
                    items-center justify-center
                    rounded-full
                    bg-white
                    text-[var(--primary)]
                  "
                >
                  <Building2 className="size-4" />
                </div>

                <div>
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#7c8e9a]">
                    {t("details.company")}
                  </p>

                  <p className="mt-1 text-[14px] font-extrabold text-[var(--foreground)]">
                    Teknomont
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <ContactForm />
        </div>
      </Container>
    </section>
  );
}
