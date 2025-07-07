import MacBrowser from '@/components/home/HeroBrowser/HeroBrowser';
import ExpGraph from '@/components/home/ExpGraph';
import Hero from '@/components/home/Hero';
import Timeline from '@/components/home/Timeline/Timeline';
import ProjectsShowcase from '@/components/ProjectsShowcase/FeaturedProjects';

export default function Home() {
  return (
    <main className="min-h-screen w-full flex flex-col items-center mt-[--navbar-height]">
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
