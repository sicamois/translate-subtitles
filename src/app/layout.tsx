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
          'grid-row-[auto,1fr] h-screen w-screen min-w-0 items-center justify-center bg-background font-sans antialiased',
          fontSans.variable,
        )}
      >
        <nav className="flex shrink-0 justify-center bg-muted p-2 text-center text-2xl text-muted-foreground sm:text-4xl">
          <p>Translate Subtitles</p>
        </nav>
        <div className="shrink">
          {children}
          <Toaster />
          <SpeedInsights />
          <Analytics />
        </div>
      </body>
    </html>
  );
}
