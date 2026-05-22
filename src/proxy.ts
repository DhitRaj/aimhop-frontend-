import { NextRequest, NextResponse } from 'next/server';

/**
 * Proxy (formerly middleware) for admin route protection.
 * Redirects unauthenticated users to /admin/login.
 */
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // Protect /admin/* except login page
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const token = req.cookies.get('token')?.value;
    if (!token) {
      const loginUrl = new URL('/admin/login', req.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
