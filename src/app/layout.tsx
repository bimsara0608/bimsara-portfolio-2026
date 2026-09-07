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
  title: 'Bimsara Gunawardana — Design Engineer | CAD, Robotics & 3D Visualization',
  description:
    'Portfolio of Bimsara Gunawardana, Design Engineer & Certified SOLIDWORKS Professional (CSWP). Specializing in parametric 3D CAD modeling, robotics automation, DFM, and photorealistic visualization.',
  keywords: [
    'Design Engineer',
    'Certified SOLIDWORKS Professional',
    'CSWP',
    'Product Design',
    'Parametric CAD',
    'Robotics and Automation',
    'DFM',
    '3D Visualization',
    'Blender Cycles',
    'Finite Element Analysis',
    'University of Colombo',
    'Sri Lanka',
  ],
  authors: [{ name: 'Bimsara Gunawardana', url: 'https://bimsara-portfolio-2026.vercel.app' }],
  openGraph: {
    title: 'Bimsara Gunawardana — Design Engineer | CAD, Robotics & 3D Visualization',
    description:
      'Certified SOLIDWORKS Professional (CSWP) specializing in parametric CAD, robotics automation, DFM, and photorealistic visualization.',
    url: 'https://bimsara-portfolio-2026.vercel.app',
    siteName: 'Bimsara Gunawardana Portfolio',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bimsara Gunawardana — Design Engineer',
    description:
      'Certified SOLIDWORKS Professional (CSWP) specializing in parametric CAD, robotics automation, and 3D visualization.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Bimsara Gunawardana',
  jobTitle: 'Design Engineer',
  email: 'bimsaragunawardana3d@gmail.com',
  url: 'https://bimsara-portfolio-2026.vercel.app',
  alumniOf: {
    '@type': 'EducationalOrganization',
    name: 'University of Colombo',
  },
  hasCredential: [
    {
      '@type': 'EducationalOccupationalCredential',
      name: 'Certified SOLIDWORKS Professional (CSWP)',
      credentialCategory: 'Professional Certification',
      recognizedBy: {
        '@type': 'Organization',
        name: 'Dassault Systèmes',
      },
    },
  ],
  sameAs: [
    'https://www.linkedin.com/in/bimsara-gunawardana-8a9b07253',
    'https://github.com/bimsara0608',
    'https://grabcad.com/bimsara.gunawardana-1',
  ],
  knowsAbout: [
    'Parametric 3D CAD',
    'SolidWorks',
    'Blender 3D Visualization',
    'Robotics & Automation',
    'Instrumentation & Control',
    'Design for Manufacturing (DFM)',
    'Finite Element Analysis (FEA)',
    'Additive Manufacturing',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} dark h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
