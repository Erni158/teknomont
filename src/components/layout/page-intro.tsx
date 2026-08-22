import {Container} from './container';

export function PageIntro({
  eyebrow,
  title,
  description
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <main className="min-h-[60vh] bg-[var(--background)]">
      <Container className="py-16 sm:py-20 lg:py-28">
        <div className="max-w-3xl">
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[var(--primary)]">
            {eyebrow}
          </p>
          <h1 className="mt-4 text-4xl font-extrabold tracking-[-0.035em] text-[var(--foreground)] sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-[var(--muted-foreground)] sm:text-lg sm:leading-8">
            {description}
          </p>
        </div>
      </Container>
    </main>
  );
}
