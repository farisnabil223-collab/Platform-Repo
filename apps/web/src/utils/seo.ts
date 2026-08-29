import { Metadata } from 'next';

interface SeoProps {
  title: string;
  description: string;
  path: string;
  type?: 'website' | 'article' | 'profile';
  ogImage?: string;
}

export function generateSeoMetadata({
  title,
  description,
  path,
  type = 'website',
  ogImage = '/images/og-default.png',
}: SeoProps): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://eduverse.com';
  const canonicalUrl = `${baseUrl}${path}`;

  return {
    title: `${title} | EduVerse`,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${title} | EduVerse`,
      description,
      url: canonicalUrl,
      type,
      siteName: 'EduVerse',
      images: [
        {
          url: ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | EduVerse`,
      description,
      images: [ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export function generateJsonLd(type: string, data: any) {
  return {
    __html: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': type,
      ...data,
    }),
  };
}
