// https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots

export default function robots() {
  const baseUrl = process.env.SITE_URL || 'http://localhost:3000';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
