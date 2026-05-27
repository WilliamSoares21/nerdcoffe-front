import Link from "next/link"
import { 
  ChevronLeft, 
  Clock, 
  Calendar, 
  MessageSquare, 
  Share2, 
  Bookmark,
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
    return (
      <div className="min-h-screen bg-background">
        <Sidebar />
        <main className="lg:pl-64 flex items-center justify-center p-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold mb-4">Artigo não encontrado</h1>
            <p className="text-muted-foreground mb-6">O artigo que você está procurando não existe ou foi removido.</p>
            <Button asChild variant="outline">
              <Link href="/feed">Voltar ao feed</Link>
            </Button>
          </div>
        </main>
      </div>
    )
  }

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
            
            <h1 className="text-4xl font-bold tracking-tight mb-8 leading-tight">
              {article.title}
            </h1>

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
                      {formatDate(article.publishedAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {article.readingTimeMinutes} min de leitura
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-coffee">
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-coffee">
                  <Bookmark className={`h-4 w-4 ${article.isBookmarked ? "fill-coffee text-coffee" : ""}`} />
                </Button>
              </div>
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
                <div dangerouslySetInnerHTML={{ __html: article.content }} />
              ) : (
                <p>Nenhum conteúdo disponível para este artigo.</p>
              )}
            </div>
          </article>

          {/* Footer Actions */}
          <footer className="pt-12 border-t border-border flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button className="flex items-center gap-2 text-muted-foreground hover:text-coffee transition-colors group">
                <div className="p-2 bg-secondary rounded-full group-hover:bg-coffee/10">
                  <ChevronUp className="h-5 w-5" />
                </div>
                <span className="font-mono text-sm">{article.upvotes} upvotes</span>
              </button>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MessageSquare className="h-5 w-5" />
                <span className="font-mono text-sm">{article.commentsCount} comentários</span>
              </div>
            </div>
          </footer>
        </div>
      </main>
    </div>
  )
}
