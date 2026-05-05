import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BrandSwitcher from "@/components/ui/BrandSwitcher";
import FloatingWhatsApp from "@/components/ui/FloatingWhatsApp";
import { ToastProvider } from "@/components/ui/ToastProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import QueryProvider from "@/components/providers/QueryProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DySalatto & DyCake | Artisan Taze Bowl ve Doğal Tatlılar",
  description: "Tazeliğin sanatla buluştuğu DySalatto ve rafine şekersiz artisan tatlıların adresi DyCake. Sağlıklı, taze ve estetik lezzet dünyamızı keşfedin.",
  keywords: ["sağlıklı beslenme", "taze bowl", "artisan salata", "şekersiz tatlı", "glutensiz pasta", "nişantaşı yemek", "sağlıklı kase", "taze içerik"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <AuthProvider>
            <ToastProvider>
              {children}
              <FloatingWhatsApp />
              <BrandSwitcher />
            </ToastProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
