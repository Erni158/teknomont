import { routing } from "@/i18n/routing";

type Locale = (typeof routing.locales)[number];

export type Props = {
  params: Promise<{
    locale: Locale;
  }>;
};
