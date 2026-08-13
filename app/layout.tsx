import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import CosmicBackground from "@/components/CosmicBackground";
import { Analytics } from '@vercel/analytics/next';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://oviniciusgodoy.vercel.app'),
  title: "Vinicius Godoy",
  description: "Analista de Dados · Empreendedor Digital",
  openGraph: {
    title: "Vinicius Godoy",
    description: "Analista de Dados · Empreendedor Digital",
    url: '/',
    siteName: 'Vinícius Godoy',
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Vinicius Godoy",
    description: "Analista de Dados · Empreendedor Digital",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CosmicBackground />
        <div style={{ position: 'relative', zIndex: 1 }} className="flex flex-col flex-1">
          {children}
        </div>
        <Analytics />
      </body>
    </html>
  );
}
