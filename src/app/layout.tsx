import './globals.css';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { cn } from '@/lib/utils';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='fr'>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable
        )}
      >
        <div className='font-sans flex flex-col items-center justify-items-center w-max sm:w-full min-h-screen pb-10'>
          <header className='flex justify-center items-center gap-8 w-full'>
            <p className='bg-muted p-2 text-4xl text-muted-foreground text-center w-full'>
              Translate Subtitles
            </p>
          </header>
          <main className='flex flex-col gap-8 row-start-2 items-center sm:items-start p-8 sm:p-10 sm:px-20'>
            {children}
          </main>
          <footer className='row-start-3 flex gap-6 flex-wrap items-center justify-center'></footer>
        </div>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
