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

const publicRoutes = ['/login', '/register', '/_next', '/favicon.ico'];
const protectedRoutes = ['/crear', '/favorites'];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ── Permitir assets estáticos siempre ──
  if (pathname.startsWith('/_next') || pathname === '/favicon.ico') {
    return NextResponse.next();
  }

  // ── API routes ──
  if (pathname.startsWith('/api/auth/login') || pathname.startsWith('/api/auth/register')) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/api/recipes') && req.method === 'GET') {
    return NextResponse.next();
  }

  if (pathname.startsWith('/api/')) {
    const token = await getTokenFromRequest(req);
    if (!token) {
      return NextResponse.json({ error: 'Acceso denegado: Token requerido' }, { status: 401 });
    }
    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Sesión expirada o inválida' }, { status: 403 });
    }
    return NextResponse.next();
  }

  // ── Frontend routes ──
  const isPublic = publicRoutes.some((route) => pathname.startsWith(route));
  if (isPublic) {
    return NextResponse.next();
  }

  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
  if (isProtected) {
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

  // ── Todo lo demás (catálogo, detalle, etc.) público ──
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)'],
};
