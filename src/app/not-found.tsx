import { useTranslations } from 'next-intl';
import Link from 'next/link';

import MainLayout from '@/components/layout/MainLayout';

export default function NotFound() {
  const t = useTranslations('NotFound');

  return (
    <MainLayout>
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-4">
        <h1 className="text-7xl font-bold mb-4">404</h1>
        <h2 className="text-3xl font-semibold mb-6">{t('title')}</h2>
        <p className="text-xl text-muted-foreground mb-10 max-w-md">{t('description')}</p>
        <Link
          href="/"
          className="bg-foreground text-background px-6 py-3 rounded-full hover:bg-foreground/90 transition-colors font-medium"
        >
          {t('backHome')}
        </Link>
      </div>
    </MainLayout>
  );
}
