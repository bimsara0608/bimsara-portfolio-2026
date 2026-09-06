import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Bimsara Gunawardana | Design Engineer',
  description:
    'Portfolio of Bimsara Gunawardana, Design Engineer specializing in Product Design and 3D Animation. CSWP Certified.',
  keywords: [
    'Design Engineer',
    '3D Animation',
    'SolidWorks',
    'Blender',
    'CSWP',
    'Product Design',
    'Mechanical Engineering',
    'Sri Lanka',
  ],
  authors: [{ name: 'Bimsara Gunawardana' }],
  openGraph: {
    title: 'Bimsara Gunawardana | Design Engineer',
    description:
      'Portfolio of Bimsara Gunawardana, Design Engineer specializing in Product Design and 3D Animation.',
    url: 'https://bimsara.com',
    siteName: 'Bimsara Gunawardana Portfolio',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bimsara Gunawardana | Design Engineer',
    description: 'Design Engineer specializing in Product Design and 3D Animation.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Bimsara Gunawardana',
  jobTitle: 'Design Engineer',
  url: 'https://bimsara.com',
  sameAs: [
    'https://www.linkedin.com/in/bimsara-gunawardana-8a9b07253',
    'https://github.com/bimsara0608',
  ],
  knowsAbout: [
    'Product Design',
    '3D Animation',
    'SolidWorks',
    'Blender',
    'CAD Engineering',
    '3D Printing',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark')
                } else {
                  document.documentElement.classList.remove('dark')
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
