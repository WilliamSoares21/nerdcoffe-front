import Link from "next/link"
import { 
  ChevronUp, 
  MessageSquare, 
  Clock, 
  Flame,
  TrendingUp,
  Calendar,
  Hash,
  Filter
} from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { apiClient } from "@/lib/api-client"
import { 
  ArticleSchema, 
  createApiResponseSchema, 
  createPageResponseSchema,
  type Article 
} from "@/lib/schemas"
import { calculateReadingTime } from "@/lib/utils"

import { getPopularTagsAction, getPublicArticlesAction, getTrendingArticlesAction } from "@/app/actions/articles"
import { ArticleCard } from "@/components/article-card"


export default async function FeedPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string; sort?: string; q?: string }>
}) {
  const { tag: tagFilter, sort = "recent", q } = await searchParams
  
  let articles: Article[] = []
  let error = false
  let popularTags: Array<{ name: string; count?: number; articles_count?: number }> = []

  // Define the schema for this specific request
  const FeedResponseSchema = createApiResponseSchema(
    createPageResponseSchema(ArticleSchema)
  )

  try {
    if (q) {
      const response = await apiClient<any>(
        `/articles/search?q=${encodeURIComponent(q)}`,
        { schema: FeedResponseSchema }
      )
      const data = response.data || response
      articles = data.content || (Array.isArray(data) ? data : [])
    } else if (sort === "trending") {
      const res = await getTrendingArticlesAction()
      if (res.success && res.data) {
        articles = res.data
      } else {
        error = true
      }
    } else {
      if (tagFilter) {
        const response = await apiClient<any>(
          `/articles/public?page=0&size=50&tag=${tagFilter}`,
          { schema: FeedResponseSchema }
        )
        articles = response.data?.content ?? []
      } else {
        const res = await getPublicArticlesAction()
        if (res.success && res.data) {
          articles = res.data
        } else {
          error = true
        }
      }
    }
  } catch (e) {
    console.error("Failed to fetch articles:", e)
    error = true
  }

  // Fetch real tags dynamically
  try {
    const resTags = await getPopularTagsAction()
    if (resTags.success && resTags.data) {
      popularTags = resTags.data
    }
  } catch (e) {
    console.error("Failed to fetch popular tags in FeedPage:", e)
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      {/* Main Content */}
      <main className="lg:pl-64">
        <div className="max-w-6xl mx-auto">
          <div className="flex">
            {/* Feed Column */}
            <div className="flex-1 min-w-0 border-r border-border">
              {/* Feed Content Toolbar */}
              <div className="sticky top-16 z-10 bg-background/95 backdrop-blur border-b border-border">
                <div className="px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Flame className="h-5 w-5 text-coffee" />
                      <h1 className="font-semibold">
                        {q ? `Pesquisa: "${q}"` : tagFilter ? `#${tagFilter}` : "Feed"}
                      </h1>
                      {(tagFilter || q) && (
                        <Link 
                          href="/feed" 
                          className="text-xs text-muted-foreground hover:text-coffee transition-colors"
                        >
                          limpar
                        </Link>
                      )}
                    </div>
                    
                    {/* Sort Filters */}
                    <div className="flex items-center gap-1 bg-secondary rounded-sm p-1">
                      {[
                        { key: "recent", label: "Recentes", icon: Calendar },
                        { key: "trending", label: "Trending", icon: TrendingUp },
                      ].map(({ key, label, icon: Icon }) => (
                        <Link
                          key={key}
                          href={`/feed?sort=${key}${tagFilter ? `&tag=${tagFilter}` : ""}`}
                          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-sm transition-colors ${
                            sort === key
                              ? "bg-background text-foreground"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <Icon className="h-3.5 w-3.5" />
                          {label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Articles List */}
              {error ? (
                <div className="p-8 text-center">
                  <p className="text-destructive font-mono text-sm">Erro ao carregar o feed de artigos.</p>
                </div>
              ) : articles.length === 0 ? (
                <div className="p-8 text-center">
                  <Filter className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">Nenhum artigo encontrado</p>
                  {tagFilter && (
                    <Link href="/feed" className="text-sm text-coffee hover:text-coffee-light mt-2 inline-block">
                      Ver todos os artigos
                    </Link>
                  )}
                </div>
              ) : (
                <div>
                  {articles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              )}
            </div>

            {/* Right Sidebar - Tags */}
            {popularTags.length > 0 && (
              <aside className="hidden xl:block w-72 p-4">
                <div className="sticky top-4">
                  <h2 className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-4">
                    <Hash className="h-4 w-4" />
                    Tags populares
                  </h2>
                  <div className="space-y-1">
                    {popularTags.map((tag) => (
                      <Link
                        key={tag.name}
                        href={`/feed?tag=${tag.name}${sort !== "recent" ? `&sort=${sort}` : ""}`}
                        className={`flex items-center justify-between py-2 px-3 rounded-sm transition-colors ${
                          tagFilter === tag.name
                            ? "bg-coffee/20 text-coffee"
                            : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <span className="font-mono text-sm">#{tag.name}</span>
                        <span className="font-mono text-xs opacity-60">
                          {tag.articles_count ?? tag.count ?? 0}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </aside>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
