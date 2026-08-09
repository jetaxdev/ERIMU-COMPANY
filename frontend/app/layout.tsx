import type { Metadata } from 'next';
import { ConditionalWhatsAppButton } from '@/components/common/conditional-whatsapp-button';
import { defaultTitle, siteDescription, siteKeywords, siteName, siteUrl, socialImage } from '@/lib/seo';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: defaultTitle,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: siteKeywords,
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: defaultTitle,
    description: siteDescription,
    url: siteUrl,
    siteName,
    type: 'website',
    images: [
      {
        url: socialImage,
        width: 1200,
        height: 630,
        alt: `${siteName} logo`, 
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: defaultTitle,
    description: siteDescription,
    images: [socialImage],
  },
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'Organization',
                  name: siteName,
                  url: siteUrl,
                  logo: `${siteUrl}/erimuland%20logo.png`,
                },
                {
                  '@type': 'WebSite',
                  name: siteName,
                  url: siteUrl,
                  potentialAction: {
                    '@type': 'SearchAction',
                    target: `${siteUrl}/properties?q={search_term_string}`,
                    'query-input': 'required name=search_term_string',
                  },
                },
              ],
            }),
          }}
        />
        <ConditionalWhatsAppButton />
      </body>
    </html>
  );
}
