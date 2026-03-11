import type { Metadata } from "next";
import { ClientProviders } from "@/components/providers/ClientProviders";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sift — Find Things Worth Doing in NYC",
  description:
    "Stop scrolling six apps. Sift gives you 3–5 personalized event recommendations in NYC, matched to what you actually care about.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Merriweather:ital,wght@0,400;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ minHeight: "100vh" }}>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}