type SectionHeadingProps = {
    title: string;
    accent?: string;
    description?: string;
    align?: 'left' | 'center';
};

export function SectionHeading({
    title,
    accent,
    description,
    align = 'center'
}: SectionHeadingProps) {
    return (
        <div
            className={
                align === 'center'
                    ? 'mx-auto max-w-2xl text-center'
                    : 'max-w-2xl'
            }
        >
            <h2 className="text-3xl font-extrabold tracking-[-0.035em] text-[var(--foreground)] sm:text-4xl">
                {title}{' '}
                {accent && (
                    <span className="text-[var(--primary)]">{accent}</span>
                )}
            </h2>

            {description && (
                <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)] sm:text-base">
                    {description}
                </p>
            )}
        </div>
    );
}