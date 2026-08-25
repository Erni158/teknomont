import { Mail, MapPin, Phone } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "./container";
import { Logo } from "@/components/ui/logo";
import { CookieSettingsButton } from "@/components/cookies/cookie-settings-button";

const footerNav = [
  { href: "/produkty", key: "products" },
  { href: "/producenci", key: "manufacturers" },
  { href: "/sourcing", key: "sourcing" },
  { href: "/oferta-b2b", key: "b2b" },
  { href: "/o-firmie", key: "about" },
  { href: "/kontakt", key: "contact" },
] as const;

export async function Footer() {
  const t = await getTranslations("Footer");
  const nav = await getTranslations("Navigation");

  return (
    <footer className="border-t border-white/10 bg-[var(--footer)] text-white">
      <Container className="grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_0.8fr_1fr] lg:gap-12 lg:py-16">
        <div>
          <Logo className="[&_span]:text-white [&>span:first-of-type]:border-white/60" />
          <p className="mt-5 max-w-sm text-sm leading-6 text-white/65">
            {t("description")}
          </p>
        </div>

        <div>
          <h2 className="text-sm font-bold">{t("menu")}</h2>
          <ul className="mt-4 space-y-3 text-sm text-white/65">
            {footerNav.map((item) => (
              <li key={item.key}>
                <Link
                  className="transition-colors hover:text-white"
                  href={item.href}
                >
                  {nav(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-bold">{t("information")}</h2>
          <ul className="mt-4 space-y-3 text-sm text-white/65">
            <li>
              <a
                className="transition-colors hover:text-white"
                href="https://sklep.tmidc.pl/regulamin-pm-11.html"
              >
                {t("terms")}
              </a>
            </li>
            <li>
              <a
                className="transition-colors hover:text-white"
                href="https://sklep.tmidc.pl/polityka-prywatnosci-i-informacja-o-cookie-pm-20.html"
              >
                {t("privacy")}
              </a>
            </li>
            <li>
              <a
                className="transition-colors hover:text-white"
                href="https://sklep.tmidc.pl/zasady-wysylki-pm-16.html"
              >
                {t("shipping")}
              </a>
            </li>
            <li>
              <CookieSettingsButton />
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-bold">{t("contact")}</h2>
          <ul className="mt-4 space-y-4 text-sm text-white/70">
            <li>
              <a
                href="tel:+48781702472"
                className="flex items-start gap-3 transition-colors hover:text-white"
              >
                <Phone className="mt-0.5 size-4 shrink-0" />
                +48 781 702 472
              </a>
            </li>
            <li>
              <a
                href="mailto:sklep@tmidc.pl"
                className="flex items-start gap-3 transition-colors hover:text-white"
              >
                <Mail className="mt-0.5 size-4 shrink-0" />
                sklep@tmidc.pl
              </a>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0" />
              <span>ul. Polna 34, 05-079 Okuniew</span>
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex min-h-16 flex-col justify-center gap-1 py-4 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between sm:py-0">
          <p>
            © {new Date().getFullYear()} Teknomont. {t("rights")}
          </p>
          <p>Teknomont Kieś Małgorzata · NIP 952-113-65-28</p>
        </Container>
      </div>
    </footer>
  );
}
