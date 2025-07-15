// "use client";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";
import SessionWrapper from "./SessionWrapper";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sing-MuzaK App",
  description: "Sing-MuzaK is a platform that makes e-Choir",
};

export default function RootLayout({
  children,
}:
  { children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionWrapper>
          {children}
          <Toaster position="top-left" />
        </SessionWrapper>
      </body>
    </html>
  );
}
