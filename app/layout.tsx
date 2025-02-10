import type { Metadata } from 'next';
import './globals.css';

import { cn } from '@/utils/cn';
import { Open_Sans, Roboto_Mono } from 'next/font/google';

import Header from '@/components/Header';

const openSans = Open_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-opensans',
});

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono',
});

export const metadata: Metadata = {
  title: 'Next.js 15 Search App',
  description: 'Handcrafted by Dmitry',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(openSans.variable, robotoMono.variable)}>
        <Header />
        <main className="px-4 py-4 xl:px-16">{children}</main>
      </body>
    </html>
  );
}
