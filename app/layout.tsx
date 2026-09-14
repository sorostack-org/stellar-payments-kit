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
  title: "Stellar Payments Kit",
  description:
    "A lightweight TypeScript toolkit for building payment flows on the Stellar network. Supports XLM transfers, custom assets, fee-bump transactions, and more.",
  keywords: ["stellar", "payments", "blockchain", "sdk", "typescript", "soroban"],
  authors: [{ name: "sorostack-org", url: "https://github.com/sorostack-org" }],
  openGraph: {
    title: "Stellar Payments Kit",
    description:
      "Composable utilities for Stellar network payments — accounts, assets, fee-bump transactions, and more.",
    url: "https://github.com/sorostack-org/stellar-payments-kit",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
