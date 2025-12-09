import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Adplaze | OOH Marketplace",
  description: "Book Billboards and Digital Screens with AI-powered recommendations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.className} antialiased bg-slate-50 text-slate-900 selection:bg-blue-200 selection:text-blue-900`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
