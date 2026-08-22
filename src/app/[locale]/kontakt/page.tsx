import {getTranslations, setRequestLocale} from 'next-intl/server';
import {PageIntro} from '@/components/layout/page-intro';

export default async function ContactPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Pages.contact');
  return <PageIntro eyebrow={t('eyebrow')} title={t('title')} description={t('description')} />;
}
