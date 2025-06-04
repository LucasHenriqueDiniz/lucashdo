import { useTranslations } from 'next-intl';
import { Metadata } from 'next';
import Link from 'next/link';

import MainLayout from '@/components/layout/MainLayout';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Thoughts, ideas, tutorials and insights.',
};

// Dados simulados - Depois será substituído por dados reais de um CMS ou API
const posts = [
  {
    id: 1,
    title: 'Creating a unique portfolio with Next.js',
    description:
      'A step-by-step guide to building a standout portfolio using Next.js, with tips for making it unique and memorable.',
    date: '2025-05-28',
    readTime: '5 min',
  },
  {
    id: 2,
    title: 'The importance of design in developer portfolios',
    description:
      'Why good design matters for developers and how it can make your portfolio stand out from the crowd.',
    date: '2025-05-15',
    readTime: '4 min',
  },
  {
    id: 3,
    title: 'Implementing i18n in Next.js applications',
    description:
      'A comprehensive guide to adding multi-language support to your Next.js application using next-intl.',
    date: '2025-05-02',
    readTime: '7 min',
  },
  {
    id: 4,
    title: 'Animation techniques for modern web applications',
    description:
      'An exploration of various animation techniques to enhance user experience in web applications.',
    date: '2025-04-18',
    readTime: '6 min',
  },
  {
    id: 5,
    title: 'Building accessible web interfaces',
    description:
      'Best practices and guidelines for creating web interfaces that are accessible to all users.',
    date: '2025-04-05',
    readTime: '8 min',
  },
];

export default function Blog() {
  const t = useTranslations('Blog');

  return (
    <MainLayout>
      <section className="py-16 max-w-5xl mx-auto">
        <h1 className="text-5xl font-bold mb-4">{t('title')}</h1>
        <p className="text-xl text-muted-foreground mb-12 max-w-3xl">{t('description')}</p>

        <div className="space-y-8">
          {posts.map(post => {
            const date = new Date(post.date);
            const formattedDate = date.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            });

            return (
              <article
                key={post.id}
                className="group border border-border/50 rounded-xl overflow-hidden hover:border-primary transition-colors p-6"
              >
                <div className="mb-2 flex items-center gap-3 text-sm text-muted-foreground">
                  <time dateTime={post.date}>{formattedDate}</time>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
                <h2 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h2>
                <p className="text-muted-foreground line-clamp-2 mb-3">{post.description}</p>
                <Link
                  href={`/blog/${post.id}`}
                  className="inline-block text-sm font-medium hover:underline"
                >
                  {t('readMore')} →
                </Link>
              </article>
            );
          })}
        </div>
      </section>
    </MainLayout>
  );
}
