import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Bimsara Gunawardana | Design Engineer",
  description: "Portfolio of Bimsara Gunawardana, Design Engineer specializing in Product Design and 3D Animation. CSWP Certified.",
  keywords: ["Design Engineer", "3D Animation", "SolidWorks", "Blender", "CSWP", "Product Design", "Mechanical Engineering", "Sri Lanka"],
  authors: [{ name: "Bimsara Gunawardana" }],
  openGraph: {
    title: "Bimsara Gunawardana | Design Engineer",
    description: "Portfolio of Bimsara Gunawardana, Design Engineer specializing in Product Design and 3D Animation.",
    url: "https://bimsara.com",
    siteName: "Bimsara Gunawardana Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bimsara Gunawardana | Design Engineer",
    description: "Design Engineer specializing in Product Design and 3D Animation.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Bimsara Gunawardana",
  jobTitle: "Design Engineer",
  url: "https://bimsara.com",
  sameAs: [
    "https://www.linkedin.com/in/bimsara",
    "https://github.com/bimsara0608"
  ],
  knowsAbout: ["Product Design", "3D Animation", "SolidWorks", "Blender", "CAD Engineering", "3D Printing"]
};

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} h-full antialiased`}
    >
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
      <body className="min-h-full flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
