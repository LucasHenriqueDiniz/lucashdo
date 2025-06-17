import { useTranslations } from 'next-intl';
import { Metadata } from 'next';
import Image from 'next/image';

import MainLayout from '@/components/layout/MainLayout';
import { LastFmProfile, LastFmTopArtists, LastFmStats } from '@/components/lastfm';

export const metadata: Metadata = {
  title: 'Sobre | LHDO',
  description: 'Conheça mais sobre minha jornada, habilidades e experiências.',
};

export default function About() {
  const t = useTranslations('About');

  return (
    <MainLayout>
      <section className="py-16 max-w-4xl mx-auto px-4">
        <h1 className="text-5xl font-bold mb-8">{t('title')}</h1>
        <p className="text-xl text-muted-foreground mb-12">{t('description')}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold mb-4">Quem Sou Eu</h2>
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
          </div>

          <div className="relative rounded-xl overflow-hidden h-80">
            <Image
              src="https://images.unsplash.com/photo-1529421308418-eab98863cee4?q=80&w=1976&auto=format&fit=crop"
              alt="Profile"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* LastFm Profile Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Meu Gosto Musical</h2>
          <div className="bg-gray-50 dark:bg-gray-800/30 rounded-xl p-6 space-y-8">
            <LastFmProfile username="Amayacrab" />
            <hr className="border-t border-gray-200 dark:border-gray-700 my-8" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <LastFmTopArtists username="Amayacrab" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">Estatísticas</h3>
                <LastFmStats username="Amayacrab" />
              </div>
            </div>
            {/* Removed duplicate LastFmProfile component */}
          </div>
        </div>

        {/* Skills Section */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold mb-6">{t('skills')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              'React / Next.js',
              'TypeScript',
              'UI/UX Design',
              'Node.js',
              'GraphQL',
              'TailwindCSS',
              'Git',
              'Docker',
            ].map(skill => (
              <div
                key={skill}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center gap-2"
              >
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                <span>{skill}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Experience Section */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold mb-6">{t('experience')}</h2>
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between flex-wrap gap-2">
                <h3 className="text-xl font-bold">Senior Developer</h3>
                <p className="text-primary font-medium">2023 - Presente</p>
              </div>
              <p className="text-muted-foreground">Company Name</p>
              <p className="mt-2">
                Led development of various projects using Next.js and TypeScript. Implemented design
                systems and improved performance across applications.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between flex-wrap gap-2">
                <h3 className="text-xl font-bold">Frontend Developer</h3>
                <p className="text-primary font-medium">2020 - 2023</p>
              </div>
              <p className="text-muted-foreground">Previous Company</p>
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
