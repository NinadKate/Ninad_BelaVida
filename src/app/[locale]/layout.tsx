import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "../globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import NextAuthProvider from "@/components/providers/NextAuthProvider";
import CartDrawer from "@/components/cart/CartDrawer";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BELLA VIDA | Belleza a través de la Ciencia",
  description: "Descubre BELLA VIDA, productos dermatológicos de alta calidad para el cuidado de tu piel.",
};

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={`${inter.variable} ${outfit.variable} antialiased min-h-screen flex flex-col`}
      >
        <NextIntlClientProvider messages={messages} locale={locale}>
          <NextAuthProvider>
            <Header />
            <CartDrawer locale={locale} />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </NextAuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
