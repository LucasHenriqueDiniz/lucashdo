import { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';

import MainLayout from '@/components/layout/MainLayout';

export const generateMetadata = ({ params }: { params: { id: string } }): Metadata => {
  return {
    title: `Blog Post ${params.id}`,
    description: `Read blog post ${params.id} with detailed insights and information.`,
  };
};

export default function BlogPostDetail({ params }: { params: { id: string } }) {
  const t = useTranslations('Blog');
  const postId = params.id;

  // Em um cenário real, você carregaria os dados do post de uma API ou CMS
  const post = {
    id: postId,
    title: `Blog Post ${postId}`,
    description:
      'This is a detailed blog post with insights and information about a specific topic.',
    content: `
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim.</p>
      <p>Suspendisse dictum feugiat nisl ut dapibus. Mauris iaculis porttitor posuere. Praesent id metus massa, ut blandit odio. Proin quis tortor orci. Etiam at risus et justo dignissim congue.</p>
      <h2>Key Points</h2>
      <p>Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim.</p>
      <ul>
        <li>Point one about this topic</li>
        <li>Another important consideration</li>
        <li>Something else to keep in mind</li>
      </ul>
      <p>Suspendisse dictum feugiat nisl ut dapibus. Mauris iaculis porttitor posuere. Praesent id metus massa, ut blandit odio. Proin quis tortor orci. Etiam at risus et justo dignissim congue.</p>
      <h2>Conclusion</h2>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim.</p>
    `,
    date: '2025-06-01',
    readTime: '8 min',
    author: 'Lucas',
    authorImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200',
    tags: ['Development', 'Tips', 'Web'],
  };

  const date = new Date(post.date);
  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <MainLayout>
      <article className="py-16 max-w-3xl mx-auto">
        <div className="mb-8">
          <Link href="/blog" className="text-muted-foreground hover:text-primary">
            ← {t('title')}
          </Link>
        </div>

        <h1 className="text-4xl font-bold mb-6">{post.title}</h1>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full overflow-hidden relative bg-muted">
              <Image
                width={32}
                height={32}
                src={post.authorImage}
                alt={post.author}
                className="object-cover w-full h-full"
              />
            </div>
            <span>{post.author}</span>
          </div>
          <span>•</span>
          <time dateTime={post.date}>{formattedDate}</time>
          <span>•</span>
          <span>{post.readTime}</span>
        </div>

        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="mt-10 pt-8 border-t border-border/50">
          <div className="flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <span key={tag} className="text-xs px-3 py-1 bg-muted rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </article>
    </MainLayout>
  );
}
