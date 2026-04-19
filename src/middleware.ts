import { NextRequest, NextResponse } from 'next/server';

/**
 * Next.js Edge Middleware — Server-Side Route Protection
 *
 * This runs BEFORE any page is rendered. It checks for the httpOnly `token`
 * cookie on every request to /admin/*. If the cookie is missing, the user
 * is immediately redirected to /admin/login — no page code runs at all.
 *
 * NOTE: We cannot decode the JWT here (edge runtime, no Node crypto) so we
 * rely on the presence of the cookie as the first gate. The actual role check
 * is enforced by the backend API (requireAdmin middleware) on every data fetch.
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only protect admin routes (excluding the login page itself)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const token = req.cookies.get('token')?.value;

    if (!token) {
      // No token — redirect to login immediately
      const loginUrl = new URL('/admin/login', req.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  // Match all /admin/* routes
  matcher: ['/admin/:path*'],
};
