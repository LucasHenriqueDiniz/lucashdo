import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { LanguageSwitcher } from '../language-switcher';

export default function Header() {
  const t = useTranslations('Navigation');
  return (
    <header className="fixed top-0 w-full backdrop-blur-md z-50 border-b border-border/50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="font-bold text-xl">
          Lucas
        </Link>
        <nav>
          <ul className="flex gap-6">
            <li>
              <Link href="/" className="hover:text-primary transition-colors">
                {t('home')}
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-primary transition-colors">
                {t('about')}
              </Link>
            </li>
            <li>
              <Link href="/projects" className="hover:text-primary transition-colors">
                {t('projects')}
              </Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-primary transition-colors">
                {t('blog')}
              </Link>
            </li>
            <li>
              <Link href="/gallery" className="hover:text-primary transition-colors">
                {t('gallery')}
              </Link>
            </li>
          </ul>
        </nav>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
