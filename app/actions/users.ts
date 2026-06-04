"use server"

import { apiClient } from "@/lib/api-client"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

export async function getUserProfileAction(username: string) {
  try {
    const response = await apiClient<any>(`/users/${encodeURIComponent(username)}`)
    return { success: true, data: response.data || response }
  } catch (error: any) {
    console.error(`getUserProfileAction error for username ${username}:`, error)
    return { success: false, error: error.message || "Usuário não encontrado" }
  }
}

export async function updateProfileAction(data: { name: string; bio?: string; avatarUrl?: string }) {
  try {
    const response = await apiClient<any>("/users/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    })

    const updatedUser = response.data || response

    // Sync user cookie for layout/client-side auth context
    const cookieStore = await cookies()
    const userCookie = cookieStore.get("auth_user")?.value
    if (userCookie) {
      try {
        const currentUser = JSON.parse(userCookie)
        const newUserData = {
          ...currentUser,
          name: updatedUser.name || data.name,
          avatarUrl: updatedUser.avatarUrl || updatedUser.avatar_url || data.avatarUrl,
        }
        cookieStore.set("auth_user", JSON.stringify(newUserData), {
          httpOnly: false,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 7,
        })
      } catch (e) {
        console.warn("updateProfileAction: failed to update auth_user cookie", e)
      }
    }

    revalidatePath("/", "layout")
    return { success: true, data: updatedUser }
  } catch (error: any) {
    console.error("updateProfileAction error:", error)
    return { success: false, error: error.message || "Erro ao atualizar perfil" }
  }
}
