import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";
import Providers from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HiveMind",
  description: "A community for deep dive to any topic",
};

export default function RootLayout({
  children,
  authModal,
}: Readonly<{
  children: React.ReactNode;
  authModal: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "light bg-white text-slate-900 antialiased",
        inter.className,
      )}
    >
      <body className="min-h-screen bg-slate-50 pt-12 antialiased">
        <Providers>
          <Navbar />
          {authModal}
          <div className="container mx-auto h-full max-w-7xl pt-12">
            {children}
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
