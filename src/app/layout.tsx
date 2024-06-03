import './globals.css';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { cn } from '@/lib/utils';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { supportedLocales } from './dictionaries';
import type { SuppportedLocale } from './dictionaries';

export async function generateStaticParams() {
  return supportedLocales.map((lang) => {
    return { lang };
  });
}

const fontSans = localFont({
  src: [
    {
      path: './fonts/SF-Pro-Display-Thin.otf',
      weight: '100',
      style: 'normal',
    },
    {
      path: './fonts/SF-Pro-Display-ThinItalic.otf',
      weight: '100',
      style: 'italic',
    },
    {
      path: './fonts/SF-Pro-Display-Ultralight.otf',
      weight: '200',
      style: 'normal',
    },
    {
      path: './fonts/SF-Pro-Display-UltralightItalic.otf',
      weight: '200',
      style: 'italic',
    },
    {
      path: './fonts/SF-Pro-Display-Light.otf',
      weight: '300',
      style: 'normal',
    },
    {
      path: './fonts/SF-Pro-Display-LightItalic.otf',
      weight: '300',
      style: 'italic',
    },
    {
      path: './fonts/SF-Pro-Display-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/SF-Pro-Display-RegularItalic.otf',
      weight: '400',
      style: 'italic',
    },
    {
      path: './fonts/SF-Pro-Display-Medium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: './fonts/SF-Pro-Display-MediumItalic.otf',
      weight: '500',
      style: 'italic',
    },
    {
      path: './fonts/SF-Pro-Display-Semibold.otf',
      weight: '600',
      style: 'normal',
    },
    {
      path: './fonts/SF-Pro-Display-SemiboldItalic.otf',
      weight: '600',
      style: 'italic',
    },
    {
      path: './fonts/SF-Pro-Display-Bold.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: './fonts/SF-Pro-Display-BoldItalic.otf',
      weight: '700',
      style: 'italic',
    },
    {
      path: './fonts/SF-Pro-Display-Heavy.otf',
      weight: '800',
      style: 'normal',
    },
    {
      path: './fonts/SF-Pro-Display-HeavyItalic.otf',
      weight: '800',
      style: 'italic',
    },
    {
      path: './fonts/SF-Pro-Display-Black.otf',
      weight: '900',
      style: 'normal',
    },
    {
      path: './fonts/SF-Pro-Display-BlackItalic.otf',
      weight: '900',
      style: 'italic',
    },
  ],
  variable: '--font-sans',
  preload: false,
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
        <div className="flex h-screen w-full max-w-full flex-col items-center justify-items-center font-sans">
          <header className="sticky inset-0 z-50 flex w-full">
            <p className="w-full bg-muted p-2 text-center text-2xl text-muted-foreground sm:text-4xl">
              Translate Subtitles
            </p>
          </header>
          {children}
        </div>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
