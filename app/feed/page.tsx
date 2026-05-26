"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
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
import { FeedSkeleton } from "@/components/skeletons"
import type { Article, FeedFilters } from "@/lib/types"

// Mock data for demo - in production this would come from /api/v1/articles
const mockArticles: Article[] = [
  {
    id: "1",
    title: "TypeScript 6.0: O que esperar da nova versão",
    slug: "typescript-6-o-que-esperar",
    excerpt: "Uma análise completa das novas features que chegam no TypeScript 6.0, incluindo melhorias no sistema de tipos e performance do compilador.",
    author: { id: "a1", username: "lucasdev", avatar_url: undefined },
    tags: ["typescript", "javascript", "webdev"],
    upvotes: 342,
    comments_count: 47,
    reading_time_minutes: 8,
    published_at: "2024-01-15T08:30:00Z"
  },
  {
    id: "2", 
    title: "Por que Rust está dominando o backend em 2024",
    slug: "rust-dominando-backend-2024",
    excerpt: "Empresas como Discord, Cloudflare e AWS estão migrando serviços críticos para Rust. Entenda os motivos por trás dessa tendência.",
    author: { id: "a2", username: "mariana_rs" },
    tags: ["rust", "backend", "performance"],
    upvotes: 289,
    comments_count: 63,
    reading_time_minutes: 12,
    published_at: "2024-01-15T07:15:00Z"
  },
  {
    id: "3",
    title: "Configurando Nginx como reverse proxy para Node.js",
    slug: "nginx-reverse-proxy-nodejs",
    excerpt: "Guia prático para configurar Nginx com SSL, load balancing e caching para aplicações Node.js em produção.",
    author: { id: "a3", username: "devops_br" },
    tags: ["nginx", "nodejs", "devops"],
    upvotes: 156,
    comments_count: 22,
    reading_time_minutes: 6,
    published_at: "2024-01-15T06:00:00Z"
  },
  {
    id: "4",
    title: "React Server Components na prática",
    slug: "react-server-components-pratica",
    excerpt: "Como implementar RSC em projetos reais: patterns, armadilhas comuns e quando usar client vs server components.",
    author: { id: "a4", username: "frontend_ana" },
    tags: ["react", "nextjs", "rsc"],
    upvotes: 234,
    comments_count: 38,
    reading_time_minutes: 10,
    published_at: "2024-01-14T22:00:00Z"
  },
  {
    id: "5",
    title: "Docker Compose para desenvolvimento local",
    slug: "docker-compose-desenvolvimento-local",
    excerpt: "Crie ambientes de desenvolvimento reproduzíveis com Docker Compose. Inclui exemplos para stacks populares.",
    author: { id: "a5", username: "container_guru" },
    tags: ["docker", "devops", "tooling"],
    upvotes: 198,
    comments_count: 29,
    reading_time_minutes: 7,
    published_at: "2024-01-14T18:30:00Z"
  }
]

const popularTags = [
  { name: "typescript", count: 1420 },
  { name: "react", count: 980 },
  { name: "nextjs", count: 756 },
  { name: "rust", count: 542 },
  { name: "golang", count: 489 },
  { name: "docker", count: 412 },
  { name: "kubernetes", count: 387 },
  { name: "aws", count: 356 },
]

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  
  if (diffHours < 1) return "agora"
  if (diffHours < 24) return `${diffHours}h`
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays < 7) return `${diffDays}d`
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })
}

function ArticleCard({ article }: { article: Article }) {
  const [upvoted, setUpvoted] = useState(false)
  const [upvoteCount, setUpvoteCount] = useState(article.upvotes)

  const handleUpvote = () => {
    setUpvoted(!upvoted)
    setUpvoteCount(upvoted ? upvoteCount - 1 : upvoteCount + 1)
  }

  return (
    <article className="p-4 border-b border-border hover:bg-secondary/30 transition-colors">
      <div className="flex items-start gap-4">
        {/* Upvote */}
        <button
          onClick={handleUpvote}
          className={`flex flex-col items-center gap-0.5 pt-1 transition-colors ${
            upvoted ? "text-coffee" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <ChevronUp className={`h-5 w-5 ${upvoted ? "fill-coffee" : ""}`} />
          <span className="font-mono text-xs">{upvoteCount}</span>
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <Link href={`/articles/${article.slug}`} className="group">
            <h2 className="font-semibold text-foreground group-hover:text-coffee transition-colors mb-1.5 leading-snug">
              {article.title}
            </h2>
          </Link>
          
          {article.excerpt && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {article.excerpt}
            </p>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-3">
            {article.tags.map((tag) => (
              <Link
                key={tag}
                href={`/feed?tag=${tag}`}
                className="px-2 py-0.5 bg-secondary text-xs font-mono text-muted-foreground hover:text-coffee hover:bg-secondary/80 rounded-sm transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>

          {/* Meta */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="font-mono">@{article.author.username}</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {article.reading_time_minutes} min
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              {article.comments_count}
            </span>
            <span className="font-mono">{formatRelativeTime(article.published_at)}</span>
          </div>
        </div>
      </div>
    </article>
  )
}

export default function FeedPage() {
  const searchParams = useSearchParams()
  const tagFilter = searchParams.get("tag")
  
  const [isLoading, setIsLoading] = useState(true)
  const [articles, setArticles] = useState<Article[]>([])
  const [filters, setFilters] = useState<FeedFilters>({ sort: "recent" })

  useEffect(() => {
    // Simulate API fetch from /api/v1/articles
    const fetchArticles = async () => {
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 800))
      
      let filtered = [...mockArticles]
      if (tagFilter) {
        filtered = filtered.filter(a => a.tags.includes(tagFilter))
      }
      
      if (filters.sort === "trending") {
        filtered.sort((a, b) => b.upvotes - a.upvotes)
      }
      
      setArticles(filtered)
      setIsLoading(false)
    }

    fetchArticles()
  }, [tagFilter, filters.sort])

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      {/* Main Content */}
      <main className="lg:pl-64">
        <div className="max-w-6xl mx-auto">
          <div className="flex">
            {/* Feed Column */}
            <div className="flex-1 min-w-0 border-r border-border">
              {/* Feed Header */}
              <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
                <div className="px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Flame className="h-5 w-5 text-coffee" />
                      <h1 className="font-semibold">
                        {tagFilter ? `#${tagFilter}` : "Feed"}
                      </h1>
                      {tagFilter && (
                        <Link 
                          href="/feed" 
                          className="text-xs text-muted-foreground hover:text-foreground"
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
                        <button
                          key={key}
                          onClick={() => setFilters({ ...filters, sort: key as "recent" | "trending" })}
                          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-sm transition-colors ${
                            filters.sort === key
                              ? "bg-background text-foreground"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <Icon className="h-3.5 w-3.5" />
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </header>

              {/* Articles List */}
              {isLoading ? (
                <FeedSkeleton count={5} />
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
                      href={`/feed?tag=${tag.name}`}
                      className={`flex items-center justify-between py-2 px-3 rounded-sm transition-colors ${
                        tagFilter === tag.name
                          ? "bg-coffee/20 text-coffee"
                          : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <span className="font-mono text-sm">#{tag.name}</span>
                      <span className="font-mono text-xs opacity-60">{tag.count}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  )
}
