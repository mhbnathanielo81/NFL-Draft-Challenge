import type { Metadata, Viewport } from "next";
import { Chakra_Petch, Space_Mono } from "next/font/google";
import "./globals.css";

const chakra = Chakra_Petch({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-chakra",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
});

export const metadata: Metadata = {
  title: "NFL Draft Challenge",
  description: "The ultimate NFL Draft prediction game. Build your mock draft, compete with friends, and score live on draft night.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Draft Challenge",
  },
};

export const viewport: Viewport = {
  themeColor: "#06090f",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="apple-touch-icon" sizes="192x192" href="/icon-192x192.png" />
      </head>
      <body className={`${chakra.variable} ${spaceMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
