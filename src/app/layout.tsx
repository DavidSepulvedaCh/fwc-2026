import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Test - Demmo",
    /* default: "Polla Mundial 2026 · Predice el Mundial de Fútbol", */
    template: "%s · Polla Mundial 2026",
  },
  description:
    "Polla del Mundial de Fútbol 2026 (USA · Canadá · México). Predice marcadores, arma tu bracket y compite con tus amigos por el trofeo.",
  applicationName: "Polla Mundial 2026",
  keywords: [
    "Polla Mundial 2026",
    "Mundial 2026",
    "FIFA World Cup 2026",
    "predicciones fútbol",
    "quiniela mundial",
    "bracket mundial",
    "USA Canadá México",
  ],
  authors: [{ name: "Polla Mundial 2026" }],
  creator: "Polla Mundial 2026",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: siteUrl,
    siteName: "Polla Mundial 2026",
    title: "Polla Mundial 2026 · Predice el Mundial de Fútbol",
    description:
      "Predice los 104 partidos del Mundial 2026, arma tu bracket y compite con tus amigos.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Polla Mundial 2026",
    description:
      "Predice el Mundial 2026 y compite con tus amigos por el trofeo.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "sports",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Navbar />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
