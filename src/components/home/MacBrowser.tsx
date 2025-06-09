'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { projects } from '@/constants/projects';

type Tab = { key: string; type: 'home' } | { key: string; type: 'project'; projectId: string };

function ShowcaseProjects({ onOpenProject }: { onOpenProject: (id: string) => void }) {
  const [search, setSearch] = useState('');
  const filtered = projects.filter(
    p =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.en.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div>
      <input
        className="w-full mb-6 px-4 py-2 rounded bg-[#23232a] text-foreground placeholder:text-muted-foreground outline-none"
        placeholder="Search for a project"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map(project => (
          <div
            key={project.id}
            className="group border border-border/50 rounded-xl overflow-hidden hover:border-primary transition-colors cursor-pointer bg-[#18181b]"
            onClick={() => onOpenProject(project.id)}
          >
            <div className="aspect-video bg-muted relative overflow-hidden">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold group-hover:text-primary transition-colors truncate">
                {project.title}
              </h3>
              <p className="text-muted-foreground text-sm line-clamp-2">{project.description.en}</p>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center text-muted-foreground">No projects found.</div>
        )}
      </div>
    </div>
  );
}

function ProjectTab({ projectId }: { projectId: string }) {
  const project = projects.find(p => p.id === projectId);
  if (!project) return <div>Project not found.</div>;
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6">
      <div className="w-full max-w-md aspect-video relative rounded-xl overflow-hidden border border-border">
        <Image src={project.image} alt={project.title} fill className="object-cover" />
      </div>
      <h2 className="text-2xl font-bold">{project.title}</h2>
      <p className="text-muted-foreground text-center max-w-xl">{project.description.en}</p>
      {project.repoUrl && (
        <a
          href={project.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 px-6 py-2 rounded bg-blue-500 text-white font-semibold hover:bg-blue-600 transition"
        >
          Ver projeto real ↗
        </a>
      )}
    </div>
  );
}

export default function MacBrowser() {
  const [isClosed, setIsClosed] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [tab, setTab] = useState<Tab>({ key: 'home', type: 'home' });

  function openProjectTab(projectId: string) {
    setTab({ key: `project-${projectId}`, type: 'project', projectId });
  }
  function goHome() {
    setTab({ key: 'home', type: 'home' });
  }

  let fakeAddress = 'lucashdo.com/projects';
  if (tab.type === 'project') {
    const project = projects.find(p => p.id === tab.projectId);
    fakeAddress = project ? `lucashdo.com/projects/${project.id}` : 'lucashdo.com/projects';
  }

  if (isClosed || isMinimized) {
    return (
      <div className="flex flex-col items-center justify-center mt-12">
        <button
          className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold shadow-lg hover:bg-blue-700 transition text-lg"
          onClick={() => {
            setIsClosed(false);
            setIsMinimized(false);
          }}
        >
          Re-open {tab.type === 'home' ? 'Home' : 'Project'}
        </button>
      </div>
    );
  }

  return (
    <AnimatePresence>
      {isMaximized && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-40 bg-black"
        />
      )}
      <motion.div
        key="browser"
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3, type: 'spring' }}
        className={`z-50 ${isMaximized ? 'fixed top-8 left-1/2 -translate-x-1/2 w-[98vw] max-w-[1200px] min-w-[350px] h-[90vh] max-h-[900px]' : 'relative w-[90vw] max-w-[900px] min-w-[350px]'} mx-auto rounded-2xl overflow-hidden shadow-2xl border border-border bg-[#18181b]`}
        style={{ boxShadow: '0 8px 40px 0 rgba(0,0,0,0.45)' }}
      >
        <div className="flex items-center gap-2 px-4 py-2 bg-[#23232a] border-b border-border select-none">
          <div className="flex gap-2 mr-4">
            <button
              aria-label="Fechar"
              className="w-3 h-3 rounded-full bg-red-500 hover:scale-110 transition-transform border-2 border-[#18181b]"
              onClick={() => setIsClosed(true)}
            />
            <button
              aria-label="Minimizar"
              className="w-3 h-3 rounded-full bg-yellow-400 hover:scale-110 transition-transform border-2 border-[#18181b]"
              onClick={() => setIsMinimized(true)}
            />
            <button
              aria-label="Maximizar"
              className={`w-3 h-3 rounded-full bg-green-500 hover:scale-110 transition-transform border-2 border-[#18181b] ${isMaximized ? 'ring-2 ring-green-400' : ''}`}
              onClick={() => setIsMaximized(m => !m)}
            />
          </div>
          <div className="flex-1 flex items-center gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-[#23232a]">
            <div
              className="flex items-center px-4 py-1 rounded-t-md  text-foreground shadow text-sm font-medium max-w-[220px] truncate cursor-pointer"
              onClick={goHome}
            >
              {tab.type === 'home'
                ? 'Home'
                : projects.find(p => p.id === tab.projectId)?.title || 'Project'}
            </div>
          </div>
        </div>
        <div className="bg-[#23232a] px-6 py-2 border-b border-border text-sm text-muted-foreground font-mono flex items-center">
          {fakeAddress}
        </div>
        <div className={`bg-[#18181b] min-h-[400px] max-h-[calc(80vh-100px)] p-6 overflow-y-auto`}>
          {tab.type === 'home' && <ShowcaseProjects onOpenProject={openProjectTab} />}
          {tab.type === 'project' && <ProjectTab projectId={tab.projectId} />}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
