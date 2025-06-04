import { useTranslations } from 'next-intl';
import { Metadata } from 'next';

import MainLayout from '@/components/layout/MainLayout';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn more about my journey, skills and experiences.',
};

export default function About() {
  const t = useTranslations('About');

  return (
    <MainLayout>
      <section className="py-16 max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold mb-8">{t('title')}</h1>
        <p className="text-xl text-muted-foreground mb-12">{t('description')}</p>

        <div className="prose prose-lg max-w-none">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus
            hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut
            eleifend nibh porttitor. Ut in nulla enim.
          </p>

          <p>
            Suspendisse dictum feugiat nisl ut dapibus. Mauris iaculis porttitor posuere. Praesent
            id metus massa, ut blandit odio. Proin quis tortor orci. Etiam at risus et justo
            dignissim congue.
          </p>

          <h2>{t('skills')}</h2>
          <ul>
            <li>React / Next.js</li>
            <li>TypeScript</li>
            <li>UI/UX Design</li>
            <li>Node.js</li>
            <li>GraphQL</li>
          </ul>

          <h2>{t('experience')}</h2>

          <div className="mt-6 space-y-8">
            <div className="border-l-4 border-primary pl-4">
              <h3 className="text-xl font-bold">Senior Developer</h3>
              <p className="text-muted-foreground">Company Name • 2023 - Present</p>
              <p className="mt-2">
                Led development of various projects using Next.js and TypeScript. Implemented design
                systems and improved performance across applications.
              </p>
            </div>

            <div className="border-l-4 border-primary pl-4">
              <h3 className="text-xl font-bold">Frontend Developer</h3>
              <p className="text-muted-foreground">Previous Company • 2020 - 2023</p>
              <p className="mt-2">
                Developed responsive interfaces and improved application architecture. Worked on
                large-scale applications with complex state management.
              </p>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
