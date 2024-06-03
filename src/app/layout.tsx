import './globals.css';
import type { Metadata } from 'next';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/sonner';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { supportedLocales } from './dictionaries';
import type { SuppportedLocale } from './dictionaries';
import { DM_Sans as FontSans } from 'next/font/google';

export async function generateStaticParams() {
  return supportedLocales.map((lang) => {
    return { lang };
  });
}

const fontSans = FontSans({
  variable: '--font-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Translate Subtitles',
  description: 'Translate your subtitles from Final Cut Pro',
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { lang: SuppportedLocale };
}>) {
  return (
    <html lang={params.lang}>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable,
        )}
      >
        <div className="flex min-h-screen w-full max-w-full flex-col items-center justify-items-center font-sans">
          <header className="sticky inset-0 z-50 flex w-full">
            <p className="w-full bg-muted p-2 text-center text-2xl text-muted-foreground sm:text-4xl">
              Translate Subtitles
            </p>
          </header>
          {children}
          <Toaster />
        </div>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
