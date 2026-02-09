import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const raw = process.env.IS_WEBSITE_ACTIVE;
  const isActive = raw === 'true' || raw === '1';

  const { pathname } = req.nextUrl;

  // allow Next internals + static assets + maintenance page itself
  if (
    pathname.startsWith('/_next') ||
    pathname === '/favicon.ico' ||
    pathname.startsWith('/logos') ||
    pathname.startsWith('/maintenance')
  ) {
    return NextResponse.next();
  }

  if (!isActive) {
    // keep URL as-is, but serve /maintenance content
    return NextResponse.rewrite(new URL('/maintenance', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api/health).*)'], // allow health endpoint through
};
