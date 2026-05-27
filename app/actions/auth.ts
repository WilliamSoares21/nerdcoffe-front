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
      return { error: result.message || "Falha na autenticação" }
    }

    const { token } = result.data
    await setAuthToken(token)
    
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

    const result: ApiResponseDto<any> = await response.json()

    if (!response.ok) {
      return { error: result.message || "Erro ao criar conta" }
    }
    
    // Success - redirect to login
  } catch (error) {
    return { error: "Erro de conexão com o servidor" }
  }

  redirect("/login?registered=true")
}

export async function logoutAction() {
  await removeAuthToken()
  revalidatePath("/", "layout")
  redirect("/")
}
