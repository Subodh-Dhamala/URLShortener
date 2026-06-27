import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata = {
  title: "SanoLink",
  description: "URL Shortener",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geist.className} flex min-h-screen flex-col`}>
        <AuthProvider>
          <Navbar />
          <main className="flex-1 pt-20">
            {children}
          </main>
        </AuthProvider>
         <Footer />
      </body>
    </html>
  );
}