import { NextRequest, NextResponse } from 'next/server';

const authCookieName = 'erimu_access_token';
const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

async function hasValidAdminSession(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(authCookieName)?.value;

  if (!token) {
    return false;
  }

  try {
    const response = await fetch(`${apiBaseUrl}/auth/me`, {
      method: 'GET',
      headers: {
        cookie: `${authCookieName}=${token}`,
      },
      cache: 'no-store',
    });

    return response.ok;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
  const isLoginRoute = request.nextUrl.pathname === '/admin/login';
  const hasAuthCookie = request.cookies.has(authCookieName);

  if (isAdminRoute && !isLoginRoute && !hasAuthCookie) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  if (isLoginRoute && hasAuthCookie) {
    const isSessionValid = await hasValidAdminSession(request);

    if (isSessionValid) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }

    const response = NextResponse.next();
    response.cookies.delete(authCookieName);
    return response;
  }

  if (isAdminRoute && !isLoginRoute && hasAuthCookie) {
    const isSessionValid = await hasValidAdminSession(request);

    if (!isSessionValid) {
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      response.cookies.delete(authCookieName);
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
