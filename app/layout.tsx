import type { Metadata } from "next";
import { Inter, Libre_Baskerville } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const libreBaskerville = Libre_Baskerville({
  variable: "--font-libre-baskerville",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "KUANGTU | Luxury Directory",
    template: "%s | KUANGTU",
  },
  description:
    "KUANGTU is an English-first luxury directory for retail discovery and trade inquiry across sunglasses, womenswear, menswear, bags, shoes, and jewelry.",
  keywords: [
    "luxury fashion",
    "designer sunglasses",
    "designer bags",
    "designer shoes",
    "designer jewelry",
    "wholesale fashion",
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    siteName: "KUANGTU",
    title: "KUANGTU | Luxury Directory",
    description: "An English-first luxury directory with retail discovery and trade inquiry.",
  },
  twitter: {
    card: "summary_large_image",
    title: "KUANGTU | Luxury Directory",
    description: "An English-first luxury directory with retail discovery and trade inquiry.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${libreBaskerville.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
