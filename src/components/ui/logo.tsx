import Image from "next/image";

import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Teknomont — strona główna"
      className={cn("inline-flex shrink-0 items-center gap-2.5", className)}
    >
      <Image
        src="/images/logo.png"
        alt=""
        width={140}
        height={89}
        priority
        className="
          h-[50px]
          w-auto
          object-contain

          sm:h-[54px]

          lg:h-[64px]
        "
      />

      <span className="hidden leading-none sm:block">
        <span
          className="
            block
            text-[18px]
            font-extrabold
            tracking-[0.035em]
            text-[var(--foreground)]

            lg:text-[20px]
          "
        >
          TEKNOMONT
        </span>

        <span
          className="
            mt-1
            block
            text-[7px]
            font-semibold
            uppercase
            tracking-[0.21em]
            text-[var(--muted-foreground)]

            lg:text-[8px]
          "
        >
          Dystrybucja komponentów
        </span>
      </span>
    </Link>
  );
}
