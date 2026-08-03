import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001').replace(/\/$/, '');
const COOKIE_NAME = 'erimu_access_token';

export async function POST(request: NextRequest) {
  const body = await request.json();

  let backendRes: Response;
  try {
    backendRes = await fetch(`${BACKEND_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    return NextResponse.json({ message: 'Backend unreachable' }, { status: 503 });
  }

  const data = await backendRes.json();

  if (!backendRes.ok) {
    return NextResponse.json(data, { status: backendRes.status });
  }

  // Extract JWT from backend Set-Cookie and re-issue it on the frontend domain
  const setCookie = backendRes.headers.get('set-cookie') ?? '';
  const match = setCookie.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  const maxAgeMatch = setCookie.match(/max-age=(\d+)/i);
  const token = match?.[1];

  const response = NextResponse.json(data, { status: 200 });

  if (token) {
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: maxAgeMatch ? Number(maxAgeMatch[1]) : 3600,
    });
  }

  return response;
}
