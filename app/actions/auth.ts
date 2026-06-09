"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { ApiResponseDto, AuthResponse, AuthCredentials } from "@/lib/types"

const API_URL = "http://localhost:8080/api/v1"

import { revalidatePath } from "next/cache"
import { setAuthToken, removeAuthToken } from "@/lib/auth-actions"

export async function loginAction(credentials: AuthCredentials) {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })

    const result: ApiResponseDto<AuthResponse> = await response.json()

    if (!response.ok) {
      const isUnverified = response.status === 403 && (
        result.message === "Conta não verificada" ||
        (typeof result.message === "string" && result.message.toLowerCase().includes("não verificada"))
      )
      if (isUnverified) {
        return { error: result.message || "Conta não verificada", isUnverified: true }
      }
      return { error: result.message || "Falha na autenticação" }
    }

    const { token, user } = result.data
    await setAuthToken(token)

    const cookieStore = await cookies()
    cookieStore.set("auth_user", JSON.stringify(user), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    })
    
    // Revalidate all paths to sync authentication state
    revalidatePath("/", "layout")
  } catch (error) {
    return { error: "Erro de conexão com o servidor" }
  }

  redirect("/feed")
}

export async function registerAction(formData: any) {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })

    const result = await response.json().catch(() => ({}))

    if (!response.ok) {
      return { error: result?.message || result?.error || "Erro ao criar conta" }
    }
    
    // Success - redirect to login
  } catch (error: any) {
    return { error: error.message || "Erro de conexão com o servidor" }
  }

  redirect("/login?registered=true")
}

export async function logoutAction() {
  await removeAuthToken()
  const cookieStore = await cookies()
  cookieStore.delete("auth_user")
  revalidatePath("/", "layout")
  redirect("/")
}
