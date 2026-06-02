import Link from "next/link"
import { notFound } from "next/navigation"
import { cookies } from "next/headers"
import { 
  ChevronLeft, 
  Clock, 
  Calendar, 
  MessageSquare, 
  ChevronUp
} from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { apiClient } from "@/lib/api-client"
import { 
  ArticleSchema, 
  createApiResponseSchema, 
  type Article 
} from "@/lib/schemas"
import { Button } from "@/components/ui/button"
import { ArticleHeaderActions, ArticleFooterActions } from "@/components/article-actions"
import { calculateReadingTime } from "@/lib/utils"
import MarkdownRenderer from "@/components/markdown-renderer"

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  })
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  
  let article: Article | null = null
  let error = false

  try {
    // We use the specific article endpoint. 
    // Assuming backend follows /api/v1/articles/{id}
    const response = await apiClient<any>(`/articles/${id}`, {
      schema: createApiResponseSchema(ArticleSchema)
    })
    article = response.data
  } catch (e) {
    console.error(`Failed to fetch article ${id}:`, e)
    error = true
  }

  if (error || !article) {
    notFound()
  }

  // Retrieve current logged in user from cookies to check ownership
  const cookieStore = await cookies()
  const userCookie = cookieStore.get("auth_user")?.value
  let currentUser = null
  if (userCookie) {
    try {
      currentUser = JSON.parse(userCookie)
    } catch (e) {
      console.warn("Failed to parse auth_user cookie inside ArticleDetailPage:", e)
    }
  }

  // Check if current user is the author
  const isAuthor = !!(
    currentUser && 
    (currentUser.id === article.author.id || 
     currentUser.username === article.author.username || 
     currentUser.email === article.author.email)
  )

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <main className="lg:pl-64">
        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* Navigation */}
          <Link 
            href="/feed" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-coffee transition-colors mb-12 group"
          >
            <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Voltar ao feed
          </Link>

          {/* Article Header */}
          <header className="mb-12">
            <div className="flex flex-wrap gap-2 mb-6">
              {article.tags.map((tag) => (
                <span 
                  key={tag}
                  className="px-2 py-0.5 bg-secondary text-xs font-mono text-muted-foreground rounded-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
            
            <h1 className={`text-4xl font-bold tracking-tight leading-tight ${article.summary ? "mb-4" : "mb-8"}`}>
              {article.title}
            </h1>
            {article.summary && (
              <p className="text-lg text-muted-foreground mb-8">
                {article.summary}
              </p>
            )}

            <div className="flex items-center justify-between py-6 border-y border-border">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center border border-border">
                  <span className="text-sm font-mono uppercase text-muted-foreground">
                    {article.author.name?.charAt(0) || article.author.username?.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="text-sm font-medium">@{article.author.username || article.author.name}</div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {article.publishedAt ? formatDate(article.publishedAt) : "Rascunho"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {calculateReadingTime(article.content)} min de leitura
                    </span>
                  </div>
                </div>
              </div>

              <ArticleHeaderActions 
                articleId={article.id} 
                title={article.title} 
                excerpt={article.excerpt || undefined} 
                isBookmarkedInitial={article.isBookmarked}
              />
            </div>
          </header>

          {/* Article Content */}
          <article className="prose prose-neutral dark:prose-invert max-w-none mb-16">
            <p className="text-xl text-muted-foreground leading-relaxed italic mb-10">
              {article.excerpt}
            </p>
            
            <div className="text-lg leading-relaxed space-y-6">
              {/* If backend provides content as markdown or raw text */}
              {article.content ? (
                <MarkdownRenderer content={article.content} />
              ) : (
                <p>Nenhum conteúdo disponível para este artigo.</p>
              )}
            </div>
          </article>

          {/* Footer Actions */}
          <ArticleFooterActions 
            articleId={article.id} 
            initialUpvotes={article.upvoteCount} 
            commentsCount={article.commentsCount} 
            isAuthor={isAuthor}
            author={article.author}
            initialIsUpvoted={article.userUpvoted}
          />
        </div>
      </main>
    </div>
  )
}
