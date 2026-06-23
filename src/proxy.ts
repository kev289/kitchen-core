import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/api/auth/login') || pathname.startsWith('/api/auth/register')) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/api/')) {
    const authHeader = req.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Acceso denegado: Token requerido' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];

    try {
      const rawSecret = process.env.JWT_SECRET;
      if (!rawSecret) {
        return NextResponse.json({ error: 'Configuration error' }, { status: 500 });
      }
      const secret = new TextEncoder().encode(rawSecret);
      await jwtVerify(token, secret);
      return NextResponse.next(); 
    } catch {
      return NextResponse.json({ error: 'Sesión expirada o inválida' }, { status: 403 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};