// https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap

export default async function sitemap() {
  const baseUrl = process.env.SITE_URL || 'http://localhost:3000';

  // Data estática para as páginas principais
  const routes = ['', 'about', 'projects', 'blog', 'gallery'].map(route => ({
    url: `${baseUrl}/${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.8,
  }));

  // Aqui você pode adicionar páginas dinâmicas de projetos, blog posts, etc.
  // Exemplo:
  // const posts = await getPosts();
  // const postUrls = posts.map(post => ({
  //   url: `${baseUrl}/blog/${post.slug}`,
  //   lastModified: post.updatedAt,
  //   changeFrequency: 'monthly',
  //   priority: 0.6,
  // }));

  return [...routes];
}
