"use client";

import { useEffect, useState } from "react";
import {
  ChevronRight,
  Languages,
  Menu,
  Send,
  ShoppingCart,
  X,
} from "lucide-react";

import { useLocale, useTranslations } from "next-intl";

import { Link, usePathname, useRouter } from "@/i18n/navigation";

import { Container } from "./container";
import { Logo } from "@/components/ui/logo";
import { buttonClassName } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/produkty", key: "products" },
  { href: "/sourcing", key: "sourcing" },
  { href: "/oferta-b2b", key: "b2b" },
  { href: "/o-firmie", key: "about" },
  { href: "/kontakt", key: "contact" },
] as const;

export function Header() {
  const t = useTranslations("Navigation");

  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const otherLocale = locale === "pl" ? "en" : "pl";

  useEffect(() => {
    if (!open) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  function changeLocale() {
    router.replace(pathname, {
      locale: otherLocale,
    });
  }

  return (
    <>
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-white/95 backdrop-blur-md">
        <Container className="flex h-[72px] items-center justify-between gap-6 lg:h-20">
          <Logo />

          {/* DESKTOP NAV */}
          <nav
            className="hidden items-center gap-1 lg:flex"
            aria-label={t("mainNav")}
          >
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={cn(
                  `
                    rounded-md
                    px-3 py-2
                    text-sm font-semibold
                    text-[var(--nav-foreground)]
                    transition-colors
                    hover:bg-[var(--muted)]
                    hover:text-[var(--primary)]
                  `,
                  pathname === item.href && "text-[var(--primary)]",
                )}
              >
                {t(item.key)}
              </Link>
            ))}
          </nav>

          {/* DESKTOP ACTIONS */}
          <div className="hidden items-center gap-2 lg:flex">
            <button
              type="button"
              onClick={changeLocale}
              aria-label={t("switchLanguage", {
                language: otherLocale.toUpperCase(),
              })}
              className="
                inline-flex min-h-11
                cursor-pointer
                items-center gap-2
                rounded-md
                px-3
                text-sm font-bold
                uppercase
                text-[var(--foreground)]
                transition-colors
                hover:bg-[var(--muted)]
              "
            >
              <Languages className="size-4" />
              {otherLocale}
            </button>

            <a
              href="https://sklep.tmidc.pl"
              className={buttonClassName("primary", "px-4")}
            >
              <ShoppingCart className="size-4" />
              {t("shop")}
            </a>
          </div>

          {/* MOBILE HAMBURGER */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label={t("openMenu")}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            className="
              grid size-11
              cursor-pointer
              place-items-center
              rounded-md
              text-[var(--primary)]
              transition-colors
              hover:bg-[var(--muted)]
              lg:hidden
            "
          >
            <Menu className="size-6" />
          </button>
        </Container>
      </header>

      {/* 
        MOBILE MENU
        Celowo poza <header>, żeby backdrop-filter / sticky
        nie wpływały na position: fixed.
      */}

      {/* OVERLAY */}
      <div
        className={cn(
          `
            fixed inset-0
            z-[100]
            bg-slate-950/40
            backdrop-blur-[2px]
            transition-opacity
            duration-300
            lg:hidden
          `,
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        )}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* DRAWER */}
      <aside
        id="mobile-navigation"
        className={cn(
          `
            fixed
            right-0 top-0
            z-[110]
            flex
            h-dvh
            w-[min(92vw,410px)]
            flex-col
            bg-white
            shadow-[-20px_0_60px_rgba(7,29,51,0.18)]
            transition-transform
            duration-300
            ease-out
            lg:hidden
          `,
          open ? "translate-x-0" : "translate-x-full",
        )}
        aria-hidden={!open}
      >
        {/* DRAWER HEADER */}
        <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-[var(--border)] px-5">
          <Logo />

          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label={t("closeMenu")}
            className="
              grid size-11
              cursor-pointer
              place-items-center
              rounded-md
              text-[var(--foreground)]
              transition-colors
              hover:bg-[var(--muted)]
            "
          >
            <X className="size-6" />
          </button>
        </div>

        {/* DRAWER CONTENT */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          <nav
            className="divide-y divide-[var(--border)]"
            aria-label={t("mobileNav")}
          >
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setOpen(false)}
                className="
                  flex min-h-13
                  items-center
                  justify-between
                  gap-4
                  py-3.5
                  text-[15px]
                  font-semibold
                  text-[var(--foreground)]
                "
              >
                {t(item.key)}

                <ChevronRight className="size-4 text-[var(--muted-foreground)]" />
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="mt-7 grid gap-3">
            <Link
              href="/kontakt"
              onClick={() => setOpen(false)}
              className={buttonClassName("primary", "w-full")}
            >
              <Send className="size-4" />
              {t("sendInquiry")}
            </Link>

            <a
              href="https://sklep.tmidc.pl"
              className={buttonClassName("outline", "w-full")}
            >
              <ShoppingCart className="size-4" />
              {t("goToShop")}
            </a>
          </div>

          {/* LANGUAGE */}
          <div className="mt-7 border-t border-[var(--border)] pt-6">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-[var(--muted-foreground)]">
              {t("language")}
            </p>

            <div className="grid grid-cols-2 gap-3">
              {(["pl", "en"] as const).map((language) => (
                <button
                  key={language}
                  type="button"
                  onClick={() => {
                    router.replace(pathname, {
                      locale: language,
                    });

                    setOpen(false);
                  }}
                  className={cn(
                    `
                      min-h-12
                      cursor-pointer
                      rounded-md
                      border
                      text-sm font-bold
                      uppercase
                      transition-colors
                    `,
                    locale === language
                      ? "border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary)]"
                      : "border-[var(--border)] bg-white text-[var(--foreground)] hover:bg-[var(--muted)]",
                  )}
                >
                  {language === "pl" ? "🇵🇱 PL" : "🇬🇧 EN"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
