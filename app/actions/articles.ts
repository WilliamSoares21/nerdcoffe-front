"use server"

import { revalidatePath } from "next/cache"
import { apiClient } from "@/lib/api-client"

import { ArticleSchema, createApiResponseSchema } from "@/lib/schemas"

export interface ArticleInput {
  title: string
  excerpt: string
  content: string
  tags: string[]
}

export async function getArticleAction(id: string) {
  try {
    const response = await apiClient<any>(`/articles/${id}`, {
      schema: createApiResponseSchema(ArticleSchema)
    })
    return { success: true, data: response.data }
  } catch (error: any) {
    console.error(`getArticleAction error for id ${id}:`, error)
    return { error: error.message || "Erro ao buscar artigo" }
  }
}

export async function getPublicArticlesAction() {
  try {
    const response = await apiClient<any>("/articles/public?page=0&size=50")
    return { success: true, data: response.data?.content ?? [] }
  } catch (error: any) {
    console.error("getPublicArticlesAction error:", error)
    return { error: error.message || "Erro ao buscar artigos públicos" }
  }
}

export async function getMyArticlesAction() {
  try {
    const response = await apiClient<any>("/articles/my-articles")
    // Fallback logic to cover both ApiResponseDto wrapped arrays and direct arrays
    const data = response.data || response
    const articles = data.content || (Array.isArray(data) ? data : [])
    return { success: true, data: articles }
  } catch (error: any) {
    console.error("getMyArticlesAction error:", error)
    return { error: error.message || "Erro ao buscar seus artigos" }
  }
}

export async function createArticleAction(formData: ArticleInput) {
  try {
    // 1. Create the article draft with summary instead of excerpt matching backend expected JSON keys
    const { excerpt, ...rest } = formData
    const payload = {
      ...rest,
      summary: excerpt,
    }

    const response = await apiClient<any>("/articles", {
      method: "POST",
      body: JSON.stringify(payload),
    })

    if (response && response.success === false) {
      return { error: response.message || "Erro ao criar artigo" }
    }

    // 2. Safely get the ID and instantly publish it for the MVP
    const createdArticle = response.data || response
    const id = createdArticle.id

    if (id) {
      const publishResponse = await apiClient<any>(`/articles/${id}/publish`, {
        method: "PATCH",
      })
      if (publishResponse && publishResponse.success === false) {
        console.warn("Publishing newly created article failed:", publishResponse.message)
      }
    } else {
      console.warn("No ID was returned from article creation POST response, skipping publish PATCH.")
    }

    revalidatePath("/feed")
    revalidatePath("/articles")
    return { success: true, data: response }
  } catch (error: any) {
    console.error("createArticleAction error:", error)
    return { error: error.message || "Erro de conexão com o servidor" }
  }
}

export async function updateArticleAction(id: string, formData: ArticleInput) {
  try {
    const { excerpt, ...rest } = formData
    const payload = {
      ...rest,
      summary: excerpt,
    }

    const response = await apiClient<any>(`/articles/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    })

    if (response && response.success === false) {
      return { error: response.message || "Erro ao atualizar artigo" }
    }

    revalidatePath("/feed")
    revalidatePath("/articles")
    revalidatePath(`/articles/${id}`)
    return { success: true, data: response }
  } catch (error: any) {
    console.error("updateArticleAction error:", error)
    return { error: error.message || "Erro de conexão com o servidor" }
  }
}

export async function deleteArticleAction(id: string) {
  try {
    const response = await apiClient<any>(`/articles/${id}`, {
      method: "DELETE",
    })

    if (response && response.success === false) {
      return { error: response.message || "Erro ao excluir artigo" }
    }

    revalidatePath("/feed")
    revalidatePath("/articles")
    return { success: true }
  } catch (error: any) {
    console.error("deleteArticleAction error:", error)
    return { error: error.message || "Erro de conexão com o servidor" }
  }
}

export async function upvoteArticleAction(id: string) {
  try {
    const response = await apiClient<any>(`/articles/${id}/upvote`, {
      method: "POST",
    })
    
    if (response && response.success === false) {
      return { error: response.message || "Erro ao curtir artigo" }
    }
    
    revalidatePath("/feed")
    revalidatePath(`/articles/${id}`)
    return { success: true, data: response.data || response }
  } catch (error: any) {
    console.error("upvoteArticleAction error:", error)
    return { error: error.message || "Erro ao conectar com o servidor" }
  }
}
