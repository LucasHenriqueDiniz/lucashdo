import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';

import MainLayout from '@/components/layout/MainLayout';

export default function Home() {
  const t = useTranslations('Home');

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="py-20 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="space-y-6">
          <h1 className="text-5xl font-bold tracking-tight">{t('title')}</h1>
          <h2 className="text-2xl text-muted-foreground">{t('subtitle')}</h2>
          <p className="text-lg max-w-md">{t('description')}</p>
          <div className="pt-4">
            <Link
              href="/projects"
              className="bg-foreground text-background px-6 py-3 rounded-full hover:bg-foreground/90 transition-colors font-medium"
            >
              {t('viewProjects')}
            </Link>
          </div>
        </div>

        <div className="relative aspect-square rounded-xl overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1517292987719-0369a794ec0f?q=80&w=1000"
            alt="Creative Workspace"
            fill
            className="object-cover"
          />
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-16">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold">{t('projects')}</h2>
          <Link
            href="/projects"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            {t('viewAll')} →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Sample Project Cards - To be replaced with real content */}
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className="group border border-border/50 rounded-xl overflow-hidden hover:border-primary transition-colors"
            >
              <div className="aspect-video bg-muted relative">
                <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold">
                  Project {i}
                </div>
              </div>
              <div className="p-5 space-y-2">
                <h3 className="text-xl font-medium">Project Title {i}</h3>
                <p className="text-muted-foreground line-clamp-2">
                  A brief description of this amazing project that showcases my skills.
                </p>
                <Link
                  href={`/projects/${i}`}
                  className="inline-block pt-2 text-sm font-medium hover:underline"
                >
                  {t('viewProject')} →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Latest Blog Posts */}
      <section className="py-16">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold">{t('latestPosts')}</h2>
          <Link
            href="/blog"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            {t('viewAll')} →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Sample Blog Posts - To be replaced with real content */}
          {[1, 2].map(i => (
            <div
              key={i}
              className="group border border-border/50 rounded-xl overflow-hidden hover:border-primary transition-colors p-6"
            >
              <div className="mb-3 text-sm text-muted-foreground">June {i}, 2025</div>
              <h3 className="text-xl font-medium mb-2 group-hover:text-primary transition-colors">
                Blog Post Title {i}
              </h3>
              <p className="text-muted-foreground line-clamp-3">
                This is a summary of the blog post content. It&apos;s interesting and engaging...
              </p>
              <Link
                href={`/blog/${i}`}
                className="inline-block pt-3 text-sm font-medium hover:underline"
              >
                {t('readMore')} →
              </Link>
            </div>
          ))}
        </div>
      </section>
    </MainLayout>
  );
}
