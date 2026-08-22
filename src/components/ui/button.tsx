import type {AnchorHTMLAttributes, ButtonHTMLAttributes} from 'react';
import {cn} from '@/lib/utils';

const base =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-5 text-sm font-bold uppercase tracking-[0.025em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';

const variants = {
  primary:
    'bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]',
  outline:
    'border border-[var(--primary)] bg-white text-[var(--primary)] hover:bg-[var(--primary-soft)]',
  ghost:
    'text-[var(--foreground)] hover:bg-[var(--muted)]'
};

export type ButtonVariant = keyof typeof variants;

export function buttonClassName(
  variant: ButtonVariant = 'primary',
  className?: string
) {
  return cn(base, variants[variant], className);
}

export function Button({
  className,
  variant = 'primary',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {variant?: ButtonVariant}) {
  return <button className={buttonClassName(variant, className)} {...props} />;
}

export function ExternalButtonLink({
  className,
  variant = 'primary',
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & {variant?: ButtonVariant}) {
  return <a className={buttonClassName(variant, className)} {...props} />;
}
