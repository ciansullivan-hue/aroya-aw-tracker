import { NextResponse, type NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only gate /admin (but never /admin/login itself)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const cookie = req.cookies.get('aroya-auth');
    if (cookie?.value !== 'ok') {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = '/admin/login';
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
