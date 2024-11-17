import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { ClerkProvider } from "@clerk/nextjs";
import 'regenerator-runtime/runtime'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PoyoVision",
  description: "Your cute AI tutor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <Navbar />
          {children}
        </body>
        </html>
    </ClerkProvider>
  );
}
