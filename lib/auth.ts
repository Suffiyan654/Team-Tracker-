import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

export interface JWTPayload {
  userId: string
  email: string
  role: "manager" | "employee"
}

export async function createSession(payload: JWTPayload) {
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" })

  const cookieStore = await cookies()
  cookieStore.set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  })

  return token
}

export async function getSession(): Promise<JWTPayload | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth-token")

    if (!token) return null

    const decoded = jwt.verify(token.value, JWT_SECRET) as JWTPayload
    return decoded
  } catch (error) {
    return null
  }
}

export async function destroySession() {
  const cookieStore = await cookies()
  cookieStore.delete("auth-token")
}

export async function requireAuth() {
  const session = await getSession()
  if (!session) {
    throw new Error("Unauthorized")
  }
  return session
}

export async function requireManager() {
  const session = await requireAuth()
  if (session.role !== "manager") {
    throw new Error("Forbidden: Manager access required")
  }
  return session
}
