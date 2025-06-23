// https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap

import { projects } from '@/constants/projects';

export default async function sitemap() {
  const baseUrl = process.env.SITE_URL || 'http://localhost:3000';

  // Data estática para as páginas principais
  const routes = ['', 'about', 'projects', 'blog', 'gallery'].map(route => ({
    url: `${baseUrl}/${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.8,
  }));

  // Adiciona páginas dinâmicas de projetos
  const projectRoutes = projects.map(project => ({
    url: `${baseUrl}/projects/${project.id}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...routes, ...projectRoutes];
}
