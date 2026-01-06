import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { i18n } from "./i18n";

// Add necessary imports for getLocale helper
import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

// Helper function to get the locale from the request
function getLocale(request: NextRequest): string | undefined {
    const negotiatorHeaders: Record<string, string> = {};
    request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));
  
    const locales = i18n.locales as unknown as string[];
  
    const languages = new Negotiator({ headers: negotiatorHeaders }).languages(
      locales
    );
  
    const locale = matchLocale(languages, locales, i18n.defaultLocale);
  
    return locale;
}

export function middleware(request: NextRequest) { // Renamed export function to middleware
  const { pathname } = request.nextUrl;

  // Admin routes protection
  // Now relies on locale being present in the path
  if (pathname.includes("/admin/dashboard")) { // Checks for admin dashboard path
    // Check if user has auth token
    const token = request.cookies.get("kovancilar_access_token");
    
    if (!token) {
      // Redirect to admin login if no token, now with default locale
      return NextResponse.redirect(new URL(`/${i18n.defaultLocale}/admin/login`, request.url));
    }
  }

  // API routes - bypass locale routing
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Locale routing for public pages and now all admin pages
  const hasLocale = i18n.locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  if (!hasLocale) {
    const locale = getLocale(request);

    return NextResponse.redirect(
      new URL(`/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`, request.url)
    );
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};