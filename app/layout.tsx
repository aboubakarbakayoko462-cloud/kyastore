import type { Metadata, Viewport } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SearchProvider } from "@/lib/SearchContext";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import InstallPrompt from "@/components/InstallPrompt";

const heading = Poppins({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-heading",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "KyaStore",
  description: "Boutique en ligne KyaStore — commandez en un clic via WhatsApp.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icons/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "KyaStore",
  },
};

export const viewport: Viewport = {
  themeColor: "#F68B1E",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${heading.variable} ${sans.variable}`}>
      <body className="font-sans bg-bg text-ink flex min-h-screen flex-col">
        <ServiceWorkerRegister />
        <SearchProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </SearchProvider>
        <InstallPrompt />
      </body>
    </html>
  );
}
