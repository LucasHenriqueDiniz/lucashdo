import { ContactLinks } from '@/constants/contacts';

interface PersonStructuredDataProps {
  name: string;
  jobTitle: string;
  description: string;
  url: string;
  image: string;
  sameAs: string[];
  knowsAbout: string[];
  worksFor?: {
    name: string;
    url: string;
  };
}

interface ProjectStructuredDataProps {
  name: string;
  description: string;
  url: string;
  image: string;
  technologies: string[];
  datePublished: string;
  author: {
    name: string;
    url: string;
  };
}

interface BlogPostStructuredDataProps {
  title: string;
  description: string;
  url: string;
  image: string;
  datePublished: string;
  dateModified: string;
  author: {
    name: string;
    url: string;
  };
  publisher: {
    name: string;
    url: string;
  };
}

export function PersonStructuredData({
  name,
  jobTitle,
  description,
  url,
  image,
  sameAs,
  knowsAbout,
  worksFor,
}: PersonStructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    jobTitle,
    description,
    url,
    image,
    sameAs,
    knowsAbout,
    ...(worksFor && {
      worksFor: {
        '@type': 'Organization',
        name: worksFor.name,
        url: worksFor.url,
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export function ProjectStructuredData({
  name,
  description,
  url,
  image,
  technologies,
  datePublished,
  author,
}: ProjectStructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    description,
    url,
    image,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web',
    softwareVersion: '1.0',
    datePublished,
    author: {
      '@type': 'Person',
      name: author.name,
      url: author.url,
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    ...(technologies.length > 0 && {
      softwareRequirements: technologies.join(', '),
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export function BlogPostStructuredData({
  title,
  description,
  url,
  image,
  datePublished,
  dateModified,
  author,
  publisher,
}: BlogPostStructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    url,
    image,
    datePublished,
    dateModified,
    author: {
      '@type': 'Person',
      name: author.name,
      url: author.url,
    },
    publisher: {
      '@type': 'Organization',
      name: publisher.name,
      url: publisher.url,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export function WebsiteStructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Lucas Hdo - Portfolio',
    description:
      'Portfólio de Lucas Hdo - Desenvolvedor Full Stack especializado em React, Next.js, TypeScript e design criativo.',
    url: 'https://lucashdo.com',
    author: {
      '@type': 'Person',
      name: 'Lucas Hdo',
      url: 'https://lucashdo.com',
      sameAs: [ContactLinks.github, ContactLinks.linkedin, ContactLinks.steam],
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://lucashdo.com/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export function OrganizationStructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Lucas Hdo',
    url: 'https://lucashdo.com',
    logo: 'https://lucashdo.com/logo.webp',
    description:
      'Desenvolvedor Full Stack especializado em React, Next.js, TypeScript e design criativo.',
    sameAs: [ContactLinks.github, ContactLinks.linkedin, ContactLinks.steam],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: ContactLinks.email,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
