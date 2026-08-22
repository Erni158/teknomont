import {
    BriefcaseBusiness,
    Globe2,
    History,
    Zap
} from 'lucide-react';
import { getTranslations } from 'next-intl/server';

const items = [
    {
        key: 'experience',
        icon: History
    },
    {
        key: 'b2b',
        icon: BriefcaseBusiness
    },
    {
        key: 'sourcing',
        icon: Globe2
    },
    {
        key: 'quote',
        icon: Zap
    }
] as const;

export async function HeroBenefits() {
    const t = await getTranslations('Home.heroBenefits');

    return (
        <div className="mt-8">
            <div className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4 sm:gap-x-7">
                {items.map(({ key, icon: Icon }) => (
                    <div
                        key={key}
                        className="flex min-w-0 items-center gap-2.5"
                    >
                        <div
                            className="
                                flex size-10 shrink-0
                                items-center justify-center
                                rounded-full
                                border border-[#c9d9e5]
                                bg-white/60
                                text-[var(--primary)]
                            "
                        >
                            <Icon className="size-5" strokeWidth={1.8} />
                        </div>

                        <div className="min-w-0">
                            <p
                                className="
                                    whitespace-nowrap
                                    text-[14px] font-extrabold
                                    leading-[1.15]
                                    tracking-[-0.015em]
                                    text-[var(--foreground)]
                                "
                            >
                                {t(`${key}.title`)}
                            </p>

                            <p
                                className="
                                    mt-1 whitespace-nowrap
                                    text-[12px] leading-none
                                    text-[var(--muted-foreground)]
                                "
                            >
                                {t(`${key}.description`)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}