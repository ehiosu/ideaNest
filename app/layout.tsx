import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "@/components/providers/ConvexProvider";
import { useConvexAuth } from "convex/react";
import { Toaster } from "@/components/ui/sonner";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IdeaForest",
  description: "Supercharge your ideas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en">
      <ConvexClientProvider>
       <Toaster position="bottom-center"/>
      <body className={inter.className}>{children}</body>
      </ConvexClientProvider>

    </html>
  );
}
