import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { ClerkProvider } from "@clerk/nextjs";
import 'regenerator-runtime/runtime'
// import { initializeDatabase } from "@/lib/db";

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
  try {
    // Initialize database on app load
    // await initializeDatabase();
  } catch (error) {
    console.error("Failed to initialize database:", error);
    // You might want to handle this error more gracefully
  }
  
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
