"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
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

export async function getPublicArticlesAction(filters?: { author?: string; tag?: string }) {
  try {
    const params = new URLSearchParams({
      page: "0",
      size: "50",
    })
    
    if (filters?.author) {
      params.append("author", filters.author)
    }
    if (filters?.tag) {
      params.append("tag", filters.tag)
    }

    const url = `/articles/public?${params.toString()}`
    const response = await apiClient<any>(url)
    return { success: true, data: response.data?.content ?? [] }
  } catch (error: any) {
    console.error("getPublicArticlesAction error:", error)
    return { error: error.message || "Erro ao buscar artigos públicos" }
  }
}


export async function getTrendingArticlesAction() {
  try {
    const response = await apiClient<any>("/articles/public/trending?page=0&size=50")
    // Cover Page wrappers or direct arrays
    const data = response.data || response
    const articles = data.content || (Array.isArray(data) ? data : [])
    return { success: true, data: articles }
  } catch (error: any) {
    console.error("getTrendingArticlesAction error:", error)
    return { error: error.message || "Erro ao buscar artigos em alta" }
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
  } catch (error: any) {
    console.error("deleteArticleAction error:", error)
    return { error: error.message || "Erro de conexão com o servidor" }
  }

  redirect("/feed")
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

export async function getPopularTagsAction() {
  try {
    const response = await apiClient<any>("/tags")
    const data = response?.data || response
    return { success: true, data: Array.isArray(data) ? data : [] }
  } catch (error: any) {
    console.error("getPopularTagsAction error:", error)
    // If the endpoint doesn't exist yet, return an empty array to wait for the API
    return { success: true, data: [] }
  }
}

export async function saveArticleAction(id: string) {
  try {
    const response = await apiClient<any>(`/articles/${id}/save`, {
      method: "POST",
    })
    
    if (response && response.success === false) {
      return { error: response.message || "Erro ao salvar artigo" }
    }
    
    revalidatePath("/feed")
    revalidatePath("/articles")
    revalidatePath(`/articles/${id}`)
    return { success: true, data: response.data || response }
  } catch (error: any) {
    console.error("saveArticleAction error:", error)
    return { error: error.message || "Erro ao conectar com o servidor" }
  }
}

export async function getSavedArticlesAction() {
  try {
    const response = await apiClient<any>("/articles/saved")
    const data = response.data || response
    const articles = data.content || (Array.isArray(data) ? data : [])
    return { success: true, data: articles }
  } catch (error: any) {
    console.error("getSavedArticlesAction error:", error)
    return { error: error.message || "Erro ao buscar artigos salvos" }
  }
}

export async function publishArticleAction(id: string) {
  try {
    const response = await apiClient<any>(`/articles/${id}/publish`, {
      method: "PATCH",
    })
    
    if (response && response.success === false) {
      return { error: response.message || "Erro ao publicar artigo" }
    }
    
    revalidatePath("/feed")
    revalidatePath("/articles")
    revalidatePath(`/articles/${id}`)
    return { success: true, data: response.data || response }
  } catch (error: any) {
    console.error("publishArticleAction error:", error)
    return { error: error.message || "Erro ao conectar com o servidor" }
  }
}

export async function archiveArticleAction(id: string) {
  try {
    const response = await apiClient<any>(`/articles/${id}/archive`, {
      method: "PATCH",
    })
    
    if (response && response.success === false) {
      return { error: response.message || "Erro ao arquivar artigo" }
    }
    
    revalidatePath("/feed")
    revalidatePath("/articles")
    revalidatePath(`/articles/${id}`)
    return { success: true, data: response.data || response }
  } catch (error: any) {
    console.error("archiveArticleAction error:", error)
    return { error: error.message || "Erro ao conectar com o servidor" }
  }
}

export async function getCommentsAction(articleId: string) {
  try {
    const response = await apiClient<any>(`/articles/${articleId}/comments`)
    const data = response?.data || response
    const comments = Array.isArray(data) ? data : (data?.content || [])
    return { success: true, data: comments }
  } catch (error: any) {
    console.error("getCommentsAction error:", error)
    return { error: error.message || "Erro ao buscar comentários" }
  }
}

export async function createCommentAction(articleId: string, content: string) {
  try {
    const response = await apiClient<any>(`/articles/${articleId}/comments`, {
      method: "POST",
      body: JSON.stringify({ content }),
    })
    
    if (response && response.success === false) {
      return { error: response.message || "Erro ao criar comentário" }
    }
    
    revalidatePath("/articles/[id]", "page")
    return { success: true, data: response.data || response }
  } catch (error: any) {
    console.error("createCommentAction error:", error)
    return { error: error.message || "Erro ao conectar com o servidor" }
  }
}


