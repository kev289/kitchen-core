import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

async function getTokenFromRequest(req: NextRequest) {
  const cookieToken = req.cookies.get('accessToken')?.value;
  if (cookieToken) return cookieToken;

  const authHeader = req.headers.get('Authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }

  return null;
}

async function verifyToken(token: string) {
  const rawSecret = process.env.JWT_SECRET;
  if (!rawSecret) return null;
  try {
    const secret = new TextEncoder().encode(rawSecret);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // static assets
  if (pathname.startsWith('/_next') || pathname === '/favicon.ico') {
    return NextResponse.next();
  }

  // public API routes (login, register, GET recipes)
  if (pathname.startsWith('/api/auth/login') || pathname.startsWith('/api/auth/register')) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/api/recipes') && req.method === 'GET') {
    return NextResponse.next();
  }

  // protected API routes
  if (pathname.startsWith('/api/')) {
    const token = await getTokenFromRequest(req);
    if (!token) {
      return NextResponse.json({ error: 'Access denied: token required' }, { status: 401 });
    }
    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Session expired or invalid' }, { status: 403 });
    }
    return NextResponse.next();
  }

  // public frontend pages (login and register)
  if (pathname === '/login' || pathname === '/register') {
    return NextResponse.next();
  }

  // everything else requires an authenticated session
  const token = await getTokenFromRequest(req);
  if (!token) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = '/login';
    return NextResponse.redirect(loginUrl);
  }
  const payload = await verifyToken(token);
  if (!payload) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = '/login';
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)'],
};
