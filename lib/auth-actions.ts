"use server"

import { cookies } from "next/headers"

const COOKIE_NAME = "auth_token"

export async function setAuthToken(token: string) {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    // Add maxAge if needed, e.g., 7 days
    maxAge: 60 * 60 * 24 * 7,
  })
}

export async function removeAuthToken() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

export async function getAuthToken() {
  const cookieStore = await cookies()
  return cookieStore.get(COOKIE_NAME)?.value
}
