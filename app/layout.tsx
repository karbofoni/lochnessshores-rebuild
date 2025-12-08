import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#16a34a',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://lochnessshores-rebuild.netlify.app'),
  title: {
    default: "Loch Ness Camping & Trails Guide | Unofficial Directory",
    template: "%s | Loch Ness Camping",
  },
  description: "Independent guide to campsites, glamping, and trails around Loch Ness. Find the best spots for your Highland adventure.",
  keywords: ["Loch Ness camping", "Scotland campsites", "Highland trails", "glamping Loch Ness", "wild camping Scotland"],
  authors: [{ name: "Loch Ness Camping & Trails Guide" }],
  creator: "Loch Ness Camping & Trails Guide",
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    siteName: 'Loch Ness Camping & Trails Guide',
    title: 'Loch Ness Camping & Trails Guide',
    description: 'Independent guide to campsites, glamping, and trails around Loch Ness.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Loch Ness Camping & Trails Guide',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Loch Ness Camping & Trails Guide',
    description: 'Independent guide to campsites, glamping, and trails around Loch Ness.',
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
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={cn(outfit.variable, "font-sans antialiased min-h-screen flex flex-col")}>
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
