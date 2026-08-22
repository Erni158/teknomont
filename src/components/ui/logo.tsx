import {Box} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import {cn} from '@/lib/utils';

export function Logo({className}: {className?: string}) {
  return (
    <Link
      href="/"
      aria-label="Teknomont — strona główna"
      className={cn('inline-flex shrink-0 items-center gap-2.5', className)}
    >
      <span className="grid size-9 place-items-center rounded-lg border border-[var(--primary)] text-[var(--primary)] sm:size-10">
        <Box className="size-5 sm:size-[22px]" strokeWidth={1.8} />
      </span>
      <span className="leading-none">
        <span className="block text-[17px] font-extrabold tracking-[0.035em] text-[var(--foreground)] sm:text-[19px]">
          TEKNOMONT
        </span>
        <span className="mt-1 block text-[7px] font-semibold uppercase tracking-[0.21em] text-[var(--muted-foreground)] sm:text-[8px]">
          Dystrybucja komponentów
        </span>
      </span>
    </Link>
  );
}
