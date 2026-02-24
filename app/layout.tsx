import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ConditionalSiteHeader } from "@/components/conditional-site-header";
import { ConditionalSiteFooter } from "@/components/conditional-site-footer";
import { MainContentWrapper } from "@/components/main-content-wrapper";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://jamesnicholaskinney.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "James Nicholas Kinney",
    template: "%s | James Nicholas Kinney",
  },
  description:
    "Daily intelligence on business, technology, politics, and culture — curated and framed by James Nicholas Kinney.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "James Nicholas Kinney",
    title: "James Nicholas Kinney",
    description:
      "Daily intelligence on business, technology, politics, and culture — curated and framed by James Nicholas Kinney.",
  },
  twitter: {
    card: "summary_large_image",
    title: "James Nicholas Kinney",
    description:
      "Daily intelligence on business, technology, politics, and culture — curated and framed by James Nicholas Kinney.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col bg-neutral-950 text-neutral-100 antialiased`}
      >
        <ConditionalSiteHeader />
        <MainContentWrapper>{children}</MainContentWrapper>
        <ConditionalSiteFooter />
        <Analytics />
      </body>
    </html>
  );
}
