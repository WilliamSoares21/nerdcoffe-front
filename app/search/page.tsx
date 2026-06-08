import { Sidebar } from "@/components/sidebar"
import { ArticleCard } from "@/components/article-card"
import { searchArticlesAction } from "@/app/actions/articles"
import { AlertCircle, FileText, Search } from "lucide-react"

export default async function SearchResultsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const resolvedSearchParams = await searchParams
  const q = resolvedSearchParams.q || ""

  let articles: any[] = []
  let errorMsg: string | null = null

  if (q.trim()) {
    const res = await searchArticlesAction(q)
    if (res.success && res.data) {
      articles = res.data
    } else {
      errorMsg = res.error || "Erro ao carregar os resultados da busca."
    }
  }

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />

      <main className="flex-1 lg:pl-64 min-w-0">
        <div className="max-w-3xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="border-b border-border pb-6 mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Search className="h-5 w-5 text-coffee" />
              <span>Resultados para:</span>
              <span className="text-coffee italic font-serif">"{q}"</span>
            </h1>
            <p className="text-xs text-muted-foreground font-mono mt-1.5 uppercase tracking-wider">
              {articles.length} {articles.length === 1 ? "artigo encontrado" : "artigos encontrados"}
            </p>
          </div>

          {errorMsg && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-sm font-mono text-sm mb-6 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
              <div>
                <span className="text-destructive font-bold">erro:</span>{" "}
                <span className="text-foreground/80">{errorMsg}</span>
              </div>
            </div>
          )}

          {articles.length > 0 ? (
            <div className="border border-border rounded-sm bg-card divide-y divide-border overflow-hidden">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-border rounded-sm bg-card/30 py-20 text-center px-6">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-secondary mb-4">
                <FileText className="h-5 w-5 text-muted-foreground/80" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-1">Nenhum resultado encontrado</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                Não encontramos artigos contendo "{q}". Tente buscar por outros termos ou verifique a grafia.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
