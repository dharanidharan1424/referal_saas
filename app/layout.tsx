import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: {
    default: "GymReferral - Grow Your Gym with Word-of-Mouth",
    template: "%s | GymReferral",
  },
  description: "Turn your gym members into your best marketing team. Create referral campaigns, track joins, and reward loyalty automatically.",
  keywords: ["gym", "referral", "marketing", "fitness", "membership", "rewards", "saas"],
  authors: [{ name: "GymReferral" }],
  creator: "GymReferral",
  publisher: "GymReferral",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "GymReferral",
    title: "GymReferral - Grow Your Gym with Word-of-Mouth",
    description: "Turn your gym members into your best marketing team. Create referral campaigns, track joins, and reward loyalty automatically.",
  },
  twitter: {
    card: "summary_large_image",
    title: "GymReferral - Grow Your Gym with Word-of-Mouth",
    description: "Turn your gym members into your best marketing team. Create referral campaigns, track joins, and reward loyalty automatically.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add your verification codes here when available
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#2563eb" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
