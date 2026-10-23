import { NextResponse } from 'next/server';

const COOKIE = process.env.COOKIE_NAME || 'bb_token';

/** Нэвтрээгүй хэрэглэгчийг /account, /admin руу оруулахгүй. Эрхийг backend дахин шалгана. */
export function middleware(req) {
  if (!req.cookies.get(COOKIE)) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.search = `?next=${encodeURIComponent(req.nextUrl.pathname + req.nextUrl.search)}`;
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ['/account/:path*', '/admin/:path*'] };
