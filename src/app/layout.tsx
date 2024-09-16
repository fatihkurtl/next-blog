import type { Metadata } from "next";
import localFont from "next/font/local";
// import "./globals.css";
import "bootstrap/dist/css/bootstrap.css";
import BootstrapClient from "@/components/BootstrapClient";
import Navbar from "@/layouts/navbar";
import Footer from "@/layouts/footer";
import { AuthWrapper } from "@/components/AuthWrapper";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Blog Sitesi",
  description: "Güncel Bloglar ve Yazılımlar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} d-flex flex-column min-vh-100`}
      >
        <BootstrapClient />
        <Navbar />
        <main className="flex-grow-1">
          <AuthWrapper>{children}</AuthWrapper>
        </main>
        <Footer />
      </body>
    </html>
  );
}
