import { ArrowUpRight, Box, Cable } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Container } from "@/components/layout/container";
import { Link } from "@/i18n/navigation";

export async function IdcConfiguratorSection() {
  const t = await getTranslations("IdcStudio.promo");
  return (
    <section className="border-b border-[var(--border)] bg-white py-8 sm:py-12">
      <Container maxWidth={1440}>
        <div className="relative flex flex-col justify-between gap-7 overflow-hidden rounded-2xl bg-[#102c4e] p-7 text-white sm:flex-row sm:items-center sm:p-10">
          <div className="max-w-2xl">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#9ec7ff]">
              <Box size={16} aria-hidden="true" />
              IDC Studio / 3D
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
              {t("title")}
            </h2>
            <p className="mt-3 text-sm leading-7 text-[#c2d0e3]">
              {t("description")}
            </p>
          </div>
          <Link
            href="/konfigurator-idc"
            className="inline-flex min-h-12 shrink-0 items-center justify-center gap-4 rounded-lg bg-white px-5 text-sm font-bold text-[#144b8e] transition hover:bg-[#e4eeff]"
          >
            <Cable size={18} aria-hidden="true" />
            {t("cta")}
            <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
