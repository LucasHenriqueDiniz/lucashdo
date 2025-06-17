import MacBrowser from '@/components/home/Browser/MacBrowser';
import Timeline from '@/components/home/Timeline';
import ExpGraph from '@/components/home/ExpGraph';
import ProjectsShowcase from '@/components/ProjectsShowcase';
import Hero from '@/components/home/Hero';

export default function Home() {
  return (
    <main className="min-h-screen w-full flex flex-col items-center">
      {/* HERO */}
      <Hero />
      {/* MAC BROWSER */}
      <MacBrowser />
      {/* EXPERIENCE GRAPH */}
      <ExpGraph />
      {/* TIMELINE */}
      <Timeline />
      {/* PROJECTS SHOWCASE */}
      <ProjectsShowcase />
      {/* GUESTBOOK */}
    </main>
  );
}
