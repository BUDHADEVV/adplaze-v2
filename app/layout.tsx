import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Adplaze | OOH Marketplace",
  description: "Book Billboards and Digital Screens with AI-powered recommendations",
};

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body
        className={`${outfit.className} antialiased bg-slate-50 text-slate-900 selection:bg-blue-200 selection:text-blue-900`}
      >
        <Providers session={session}>
          {children}
          {/* Global Mobile Bottom Navigation */}
          <MobileBottomNav />
        </Providers>
      </body>
    </html>
  );
}

import Link from "next/link";
import { Layout, Monitor, User, ShoppingBag, Search } from "lucide-react";

function MobileBottomNav() {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 md:hidden flex justify-around py-3 z-[100] shadow-[0_-5px_15px_rgba(0,0,0,0.08)] pb-safe-area">
      <Link href="/" className="flex flex-col items-center gap-1 group">
        <div className="p-1.5 rounded-xl group-hover:bg-blue-50 transition-colors">
          <Layout className="h-5 w-5 text-gray-500 group-hover:text-blue-600" />
        </div>
        <span className="text-[10px] font-medium text-gray-500 group-hover:text-blue-600">Home</span>
      </Link>

      <Link href="/explore" className="flex flex-col items-center gap-1 group">
        <div className="p-1.5 rounded-xl group-hover:bg-blue-50 transition-colors">
          <Search className="h-5 w-5 text-gray-500 group-hover:text-blue-600" />
        </div>
        <span className="text-[10px] font-medium text-gray-500 group-hover:text-blue-600">Explore</span>
      </Link>

      <Link href="/wizard" className="flex flex-col items-center gap-1 group -mt-6">
        <div className="h-12 w-12 bg-blue-600 rounded-full shadow-lg shadow-blue-300 flex items-center justify-center text-white transform group-active:scale-95 transition-all">
          <Monitor className="h-6 w-6" />
        </div>
        <span className="text-[10px] font-bold text-blue-600">AI Plan</span>
      </Link>

      <Link href="/cart" className="flex flex-col items-center gap-1 group">
        <div className="p-1.5 rounded-xl group-hover:bg-blue-50 transition-colors">
          <ShoppingBag className="h-5 w-5 text-gray-500 group-hover:text-blue-600" />
        </div>
        <span className="text-[10px] font-medium text-gray-500 group-hover:text-blue-600">Cart</span>
      </Link>

      <Link href="/dashboard/agency" className="flex flex-col items-center gap-1 group">
        <div className="p-1.5 rounded-xl group-hover:bg-blue-50 transition-colors">
          <User className="h-5 w-5 text-gray-500 group-hover:text-blue-600" />
        </div>
        <span className="text-[10px] font-medium text-gray-500 group-hover:text-blue-600">Account</span>
      </Link>
    </div>
  )
}
