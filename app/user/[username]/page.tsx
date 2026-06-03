import Link from "next/link"
import { notFound } from "next/navigation"
import { Calendar, ChevronLeft, FileText, User as UserIcon } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { getUserProfileAction } from "@/app/actions/users"
import { getPublicArticlesAction } from "@/app/actions/articles"
import { ArticleCard } from "@/components/article-card"

function formatDate(dateString: string): string {
  try {
    return new Date(dateString).toLocaleDateString("pt-PT", {
      month: "long",
      year: "numeric",
    })
  } catch (e) {
    return "N/D"
  }
}

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params
  const decodedUsername = decodeURIComponent(username)

  // 1. Fetch user profile
  const profileRes = await getUserProfileAction(decodedUsername)
  
  if (!profileRes.success || !profileRes.data) {
    return (
      <div className="min-h-screen bg-background">
        <Sidebar />
        <main className="lg:pl-64 flex flex-col items-center justify-center p-8 min-h-screen">
          <div className="max-w-md w-full text-center space-y-6 border border-border p-8 rounded-lg bg-secondary/10">
            <h2 className="text-2xl font-bold tracking-tight">Utilizador não encontrado</h2>
            <p className="text-sm text-muted-foreground">
              O utilizador @{username} que tentou aceder não existe ou a sua conta foi desativada.
            </p>
            <Link
              href="/feed"
              className="inline-flex items-center gap-2 text-sm text-coffee hover:underline"
            >
              <ChevronLeft className="h-4 w-4" />
              Voltar ao feed
            </Link>
          </div>
        </main>
      </div>
    )
  }

  const user = profileRes.data
  const authorName = user.name || user.username || "Autor"
  const bio = user.bio || "Este utilizador prefere manter a sua biografia misteriosa por enquanto."
  const avatarUrl = user.avatarUrl || user.avatar_url
  const initials = authorName.charAt(0).toUpperCase()
  const entryDate = user.createdAt || user.created_at

  // 2. Fetch public articles of this author
  const articlesRes = await getPublicArticlesAction({ author: decodedUsername })
  const articles = articlesRes.success && articlesRes.data ? articlesRes.data : []

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <main className="lg:pl-64">
        {/* Profile Header Block */}
        <div className="border-b border-border bg-secondary/10">
          <div className="max-w-4xl mx-auto px-6 py-12">
            <Link 
              href="/feed" 
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-coffee transition-colors mb-8 group"
            >
              <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
              Voltar ao feed
            </Link>

            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Large Avatar */}
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={authorName}
                  className="h-24 w-24 rounded-full object-cover border-2 border-border shadow-sm"
                />
              ) : (
                <div className="h-24 w-24 rounded-full bg-secondary border border-border flex items-center justify-center text-3xl font-mono uppercase font-bold text-muted-foreground shadow-sm">
                  {initials}
                </div>
              )}

              {/* Identity & Metadata */}
              <div className="space-y-2 flex-1 min-w-0">
                <h1 className="text-3xl font-bold tracking-tight text-foreground leading-none">
                  {authorName}
                </h1>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-mono text-muted-foreground">
                  <span className="text-coffee font-medium">@{user.username}</span>
                  {entryDate && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      Membro desde {formatDate(entryDate)}
                    </span>
                  )}
                </div>
                <p className="text-base text-foreground/90 max-w-2xl leading-relaxed mt-2">
                  {bio}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Content / Articles List */}
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="flex items-center gap-2 mb-6 border-b border-border pb-3">
            <FileText className="h-5 w-5 text-coffee" />
            <h2 className="font-semibold text-lg">Publicações ({articles.length})</h2>
          </div>

          <div className="space-y-1 border border-border rounded-md divide-y divide-border bg-card overflow-hidden">
            {articles.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground text-sm space-y-2">
                <p>Este autor ainda não publicou nenhum artigo.</p>
                <p className="text-xs text-muted-foreground/75">
                  Volte mais tarde para ler novos conteúdos.
                </p>
              </div>
            ) : (
              articles.map((article: any) => (
                <ArticleCard key={article.id} article={article} />
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
