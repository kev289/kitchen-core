import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const rawSecret = process.env.JWT_SECRET;
    if (!rawSecret) {
      return NextResponse.json({ error: "Configuration error" }, { status: 500 });
    }

    const secret = new TextEncoder().encode(rawSecret);
    const { payload } = await jwtVerify(token, secret);

    return NextResponse.json({
      user: {
        name: payload.name,
        email: payload.email,
      },
    }, { status: 200 });
  } catch {
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
