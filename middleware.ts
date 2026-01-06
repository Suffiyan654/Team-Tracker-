import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token")
  const { pathname } = request.nextUrl

  // Allow access to login page, API routes, and static assets
  if (pathname === "/login" || pathname.startsWith("/api/") || pathname.startsWith("/_next/")) {
    return NextResponse.next()
  }

  // Redirect to login if no token
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  try {
    // Verify token
    jwt.verify(token.value, JWT_SECRET)
    return NextResponse.next()
  } catch (error) {
    // Invalid token, redirect to login
    return NextResponse.redirect(new URL("/login", request.url))
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
}
