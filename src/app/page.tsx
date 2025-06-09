'use client';
import { useTranslations } from 'next-intl';
import MacBrowser from '@/components/home/MacBrowser';
import Timeline from '@/components/home/Timeline';

export default function Home() {
  return (
    <main className="min-h-screen w-full  flex flex-col items-center">
      {/* HERO */}
      <section className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-6">
        <span className="text-lg text-blue-400 font-mono">React Native _</span>
        <h1 className="text-5xl md:text-6xl font-bold">
          Hi, I&apos;m <span className="text-cyan-400">.jorge</span>
        </h1>
        <h2 className="text-2xl font-medium">
          A front-end{' '}
          <span className="text-cyan-400 underline underline-offset-4">hardcore gamer</span>{' '}
          <span role="img" aria-label="gamer">
            🎮
          </span>
        </h2>
        <div className="flex gap-4 mt-6">
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-xl text-lg font-semibold shadow-lg transition">
            Reviews
          </button>
          <button className="bg-neutral-900 hover:bg-neutral-800 text-white px-8 py-3 rounded-xl text-lg font-semibold shadow-lg transition">
            Discord
          </button>
        </div>
      </section>
      {/* MAC BROWSER */}
      <MacBrowser />

      <Timeline />
    </main>
  );
}
