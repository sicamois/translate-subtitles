import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['en', 'fr'];

// Get the preferred locale, similar to the above or using a library
function getLocale(request: NextRequest) {
  const acceptLanguage = request.headers.get('Accept-Language');
  if (!acceptLanguage) return 'en';

  const preferredLocales = acceptLanguage
    .split(',')
    .map((locale) => locale.split(';')[0]);

  for (const preferredLocale of preferredLocales) {
    if (locales.includes(preferredLocale)) {
      return preferredLocale;
    }
  }

  return 'en';
}

export function middleware(request: NextRequest) {
  // Check if there is any supported locale in the pathname
  const { pathname } = request.nextUrl;

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  // Redirect if there is no locale
  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  // e.g. incoming request is /products
  // The new URL is now /en-US/products
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next).*)',
    // Optional: only run on root (/) URL
    // '/'
  ],
};
