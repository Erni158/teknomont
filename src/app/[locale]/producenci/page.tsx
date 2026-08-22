import {getTranslations, setRequestLocale} from 'next-intl/server';
import {PageIntro} from '@/components/layout/page-intro';

export default async function ManufacturersPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Pages.manufacturers');
  return <PageIntro eyebrow={t('eyebrow')} title={t('title')} description={t('description')} />;
}
