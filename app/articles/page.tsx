"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { 
  FileText, 
  Lock, 
  Calendar, 
  Clock,
  ChevronUp,
  Filter
} from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { FeedSkeleton } from "@/components/skeletons"
import { useAuth } from "@/lib/auth-context"
import type { Article } from "@/lib/types"

// Mock data - would come from /api/v1/articles
const publicArticles: Article[] = [
  {
    id: "1",
    title: "Implementando Autenticação Segura em Aplicações Web",
    slug: "auth-segura-web",
    excerpt: "Um guia completo sobre as melhores práticas de segurança para sistemas de autenticação modernos.",
    author: { id: "a1", username: "maria_sec" },
    tags: ["segurança", "auth", "webdev"],
    upvotes: 234,
    comments_count: 42,
    reading_time_minutes: 12,
    published_at: "2024-01-15T08:30:00Z"
  },
  {
    id: "2",
    title: "Arquitetura de Microsserviços: Lições Aprendidas",
    slug: "microservicos-licoes",
    excerpt: "Após dois anos de migração, compartilhamos os principais desafios encontrados.",
    author: { id: "a2", username: "joao_arch" },
    tags: ["arquitetura", "backend", "devops"],
    upvotes: 189,
    comments_count: 38,
    reading_time_minutes: 15,
    published_at: "2024-01-14T14:00:00Z"
  },
  {
    id: "3",
    title: "Performance em React: Técnicas Avançadas",
    slug: "react-performance",
    excerpt: "Estratégias para otimizar aplicações React de grande escala.",
    author: { id: "a3", username: "ana_front" },
    tags: ["react", "performance", "frontend"],
    upvotes: 312,
    comments_count: 67,
    reading_time_minutes: 10,
    published_at: "2024-01-13T10:15:00Z"
  },
  {
    id: "4",
    title: "Introdução ao Design System Escalável",
    slug: "design-system-intro",
    excerpt: "Como construir um design system que cresce com sua organização.",
    author: { id: "a4", username: "pedro_ui" },
    tags: ["design", "ui", "sistemas"],
    upvotes: 156,
    comments_count: 29,
    reading_time_minutes: 8,
    published_at: "2024-01-12T16:45:00Z"
  },
]

const myArticles: Article[] = [
  {
    id: "my1",
    title: "Meu Primeiro Artigo (Rascunho)",
    slug: "meu-primeiro-artigo",
    excerpt: "Este é um rascunho que ainda não foi publicado.",
    author: { id: "me", username: "você" },
    tags: ["rascunho"],
    upvotes: 0,
    comments_count: 0,
    reading_time_minutes: 5,
    published_at: "2024-01-14T09:00:00Z"
  },
]

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "short",
    day: "2-digit"
  })
}

function ArticleRow({ article }: { article: Article }) {
  return (
    <article className="flex items-start gap-4 p-4 border-b border-border hover:bg-secondary/30 transition-colors">
      {/* Upvotes */}
      <div className="flex flex-col items-center text-muted-foreground">
        <ChevronUp className="h-4 w-4" />
        <span className="font-mono text-xs">{article.upvotes}</span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <Link 
          href={`/articles/${article.id}`}
          className="font-medium hover:text-coffee transition-colors line-clamp-1"
        >
          {article.title}
        </Link>
        
        {article.excerpt && (
          <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
            {article.excerpt}
          </p>
        )}
        
        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
          <span className="font-mono">@{article.author.username}</span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {article.reading_time_minutes} min
          </span>
          <span className="font-mono">{formatDate(article.published_at)}</span>
        </div>
      </div>

      {/* Tags */}
      <div className="hidden sm:flex gap-2">
        {article.tags.slice(0, 2).map((tag) => (
          <span 
            key={tag}
            className="px-2 py-0.5 bg-secondary text-xs font-mono text-muted-foreground rounded-sm"
          >
            #{tag}
          </span>
        ))}
      </div>
    </article>
  )
}

export default function ArticlesPage() {
  const { isAuthenticated } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [articles, setArticles] = useState<Article[]>([])
  const [activeTab, setActiveTab] = useState<"recent" | "my">("recent")

  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true)
      // Simulate API call to /api/v1/articles
      await new Promise(resolve => setTimeout(resolve, 600))
      setArticles(publicArticles)
      setIsLoading(false)
    }
    fetchArticles()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <main className="lg:pl-64">
        <div className="max-w-4xl mx-auto">
          {/* Content Toolbar */}
          <div className="sticky top-16 z-10 bg-background/95 backdrop-blur border-b border-border">
            <div className="px-4 py-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-coffee" />
                  <h1 className="font-semibold">Artigos</h1>
                </div>
              </div>
              
              {/* Tabs */}
              <div className="flex items-center gap-1 bg-secondary rounded-sm p-1">
                <button
                  onClick={() => setActiveTab("recent")}
                  className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-sm transition-colors ${
                    activeTab === "recent"
                      ? "bg-background text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Calendar className="h-3.5 w-3.5" />
                  Recentes
                </button>
                <button
                  onClick={() => setActiveTab("my")}
                  className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-sm transition-colors ${
                    activeTab === "my"
                      ? "bg-background text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Lock className="h-3.5 w-3.5" />
                  Meus Artigos
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          {activeTab === "recent" ? (
            // Recent Articles
            isLoading ? (
              <FeedSkeleton count={4} />
            ) : (
              <div>
                {articles.map((article) => (
                  <ArticleRow key={article.id} article={article} />
                ))}
              </div>
            )
          ) : (
            // My Articles - Restricted
            isAuthenticated ? (
              <div>
                {myArticles.length === 0 ? (
                  <div className="p-8 text-center">
                    <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">Você ainda não tem artigos</p>
                    <button className="mt-4 px-4 py-2 bg-coffee text-accent-foreground text-sm font-medium rounded-sm hover:bg-coffee-light transition-colors">
                      Criar primeiro artigo
                    </button>
                  </div>
                ) : (
                  myArticles.map((article) => (
                    <ArticleRow key={article.id} article={article} />
                  ))
                )}
              </div>
            ) : (
              // Unauthorized State - Terminal Style
              <div className="p-8">
                <div className="max-w-md mx-auto border border-border rounded-sm overflow-hidden">
                  <div className="bg-secondary/50 px-4 py-2 border-b border-border">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-destructive/60" />
                      <div className="w-3 h-3 rounded-full bg-warning/60" />
                      <div className="w-3 h-3 rounded-full bg-success/60" />
                      <span className="ml-2 font-mono text-xs text-muted-foreground">auth_check</span>
                    </div>
                  </div>
                  <div className="p-6 font-mono text-sm space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="text-muted-foreground select-none">$</span>
                      <span className="text-muted-foreground">checking authorization...</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-destructive select-none">!</span>
                      <div>
                        <span className="text-destructive">error</span>
                        <span className="text-muted-foreground">[</span>
                        <span className="text-warning">401</span>
                        <span className="text-muted-foreground">]:</span>{" "}
                        <span className="text-foreground/80">unauthorized</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 pt-2">
                      <span className="text-muted-foreground select-none">&gt;</span>
                      <span className="text-muted-foreground">
                        Token inválido ou expirado.
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-muted-foreground select-none">&gt;</span>
                      <span className="text-muted-foreground">
                        Faça login para acessar seus artigos.
                      </span>
                    </div>
                  </div>
                  <div className="px-6 pb-6">
                    <Link
                      href="/login"
                      className="block w-full text-center px-4 py-2.5 bg-coffee text-accent-foreground text-sm font-medium rounded-sm hover:bg-coffee-light transition-colors"
                    >
                      Fazer login
                    </Link>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </main>
    </div>
  )
}
