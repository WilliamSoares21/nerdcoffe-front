import { cookies } from "next/headers"
import { z } from "zod"
import { redirect } from "next/navigation"

const API_BASE_URL = process.env.SERVER_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1"

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit & { schema?: z.ZodSchema<T> } = {}
): Promise<T> {
  let token: string | undefined
  const { schema, ...fetchOptions } = options

  try {
    const cookieStore = await cookies()
    token = cookieStore.get("auth_token")?.value
  } catch (error) {
    console.warn("apiClient: could not access cookies", error)
  }

  const headers = new Headers(fetchOptions.headers)
  if (token) {
    headers.set("Authorization", `Bearer ${token}`)
  }
  
  if (!headers.has("Content-Type") && !(fetchOptions.body instanceof FormData)) {
    headers.set("Content-Type", "application/json")
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  })

  if (response.status === 401) {
    if (typeof window !== "undefined") {
      window.location.href = "/login"
    } else {
      redirect("/login")
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || errorData.error || `API request failed: ${response.status}`)
  }

  const rawData = await response.json()

  if (schema) {
    const result = schema.safeParse(rawData)
    if (!result.success) {
      console.error("API Validation Error:", JSON.stringify(result.error.format(), null, 2))
      // In development, we might want to see the error clearly
      return rawData as T
    }
    return result.data
  }

  return rawData as T
}
