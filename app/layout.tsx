import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ConditionalSiteHeader } from "@/components/conditional-site-header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "James Nicholas Kinney",
  description: "James Nicholas Kinney — author, speaker, and commentator.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ConditionalSiteHeader />
        {children}
      </body>
    </html>
  );
}
