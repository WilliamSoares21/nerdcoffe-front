"use client"

import { useState, useEffect, use } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Coffee, Loader2, Save, Send } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { 
  createArticleAction, 
  updateArticleAction, 
  getArticleAction 
} from "@/app/actions/articles"

export default function ArticleEditorPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get("edit")
  const { isAuthenticated, isLoading: authLoading } = useAuth()

  const [title, setTitle] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [content, setContent] = useState("")
  const [tagsInput, setTagsInput] = useState("")
  
  const [isPending, setIsPending] = useState(false)
  const [fetchingArticle, setFetchingArticle] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(`/login?from=/articles/new`)
    }
  }, [isAuthenticated, authLoading, router])

  // Fetch article if in Edit Mode
  useEffect(() => {
    if (!editId || !isAuthenticated) return

    async function loadArticle() {
      setFetchingArticle(true)
      setError(null)
      const res = await getArticleAction(editId!)
      
      if (res.error) {
        // Fallback or display error
        setError(`Não foi possível carregar o artigo: ${res.error}`)
        setFetchingArticle(false)
      } else if (res.data) {
        const art = res.data
        setTitle(art.title)
        setExcerpt(art.excerpt || "")
        setContent(art.content || "")
        setTagsInput(art.tags ? art.tags.join(", ") : "")
        setFetchingArticle(false)
      }
    }

    loadArticle()
  }, [editId, isAuthenticated])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) {
      setError("Título e Conteúdo são obrigatórios.")
      return
    }

    setError(null)
    setIsPending(true)

    // Parse comma-separated tags into array
    const tags = tagsInput
      .split(",")
      .map(tag => tag.trim().toLowerCase())
      .filter(tag => tag !== "")

    const articleData = {
      title: title.trim(),
      excerpt: excerpt.trim(),
      content: content.trim(),
      tags,
    }

    let result
    if (editId) {
      result = await updateArticleAction(editId, articleData)
    } else {
      result = await createArticleAction(articleData)
    }

    if (result.error) {
      setError(result.error)
      setIsPending(false)
    } else {
      // Success: redirect to feed
      router.push("/feed")
      router.refresh()
    }
  }

  if (authLoading || (!isAuthenticated && !authLoading)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-6 w-6 text-coffee animate-spin" />
          <span className="font-mono text-xs text-muted-foreground">checking credentials...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />

      <main className="flex-1 lg:pl-64 min-w-0">
        <div className="max-w-3xl mx-auto px-6 py-12">
          {/* Top Bar Navigation */}
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/feed"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-coffee transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
              Voltar ao feed
            </Link>

            <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest bg-secondary/50 px-2.5 py-1 rounded-sm border border-border">
              {editId ? "Modo de Edição" : "Novo Artigo"}
            </span>
          </div>

          <div className="border border-border rounded-sm bg-card overflow-hidden">
            {/* Header decoration */}
            <div className="bg-secondary/30 px-6 py-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Coffee className="h-4 w-4 text-coffee" />
                <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  {editId ? "atualizar_conteudo.sh" : "criar_publicacao.sh"}
                </span>
              </div>
            </div>

            {/* Editor Body */}
            <div className="p-6">
              <h1 className="text-2xl font-bold tracking-tight mb-2">
                {editId ? "Editar Artigo" : "Publicar Novo Artigo"}
              </h1>
              <p className="text-sm text-muted-foreground mb-8">
                Escreva para a comunidade dev. Compartilhe insights, tutoriais ou discussões de tecnologia.
              </p>

              {fetchingArticle ? (
                <div className="py-20 flex flex-col items-center gap-3">
                  <Loader2 className="h-8 w-8 text-coffee animate-spin" />
                  <span className="font-mono text-xs text-muted-foreground">carregando dados do artigo...</span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Error Alert */}
                  {error && (
                    <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-sm font-mono text-sm">
                      <div className="flex items-start gap-2">
                        <span className="text-destructive select-none">$</span>
                        <div>
                          <span className="text-destructive">erro:</span>{" "}
                          <span className="text-foreground/80">{error}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Title */}
                  <div className="space-y-2">
                    <label htmlFor="title" className="text-sm font-medium flex justify-between">
                      <span>Título</span>
                      <span className="text-xs text-muted-foreground font-mono">obrigatório</span>
                    </label>
                    <input
                      id="title"
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Ex: Primeiros Passos com o Turbopack no Next.js"
                      required
                      className="w-full px-3 py-2.5 bg-input border border-border rounded-sm text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-coffee focus:border-coffee transition-colors"
                    />
                  </div>

                  {/* Excerpt */}
                  <div className="space-y-2">
                    <label htmlFor="excerpt" className="text-sm font-medium">
                      Resumo
                    </label>
                    <input
                      id="excerpt"
                      type="text"
                      value={excerpt}
                      onChange={(e) => setExcerpt(e.target.value)}
                      placeholder="Uma frase curta que resume o artigo no feed..."
                      className="w-full px-3 py-2.5 bg-input border border-border rounded-sm text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-coffee focus:border-coffee transition-colors"
                    />
                  </div>

                  {/* Tags */}
                  <div className="space-y-2">
                    <label htmlFor="tags" className="text-sm font-medium flex justify-between">
                      <span>Tags</span>
                      <span className="text-xs text-muted-foreground">Separadas por vírgula</span>
                    </label>
                    <input
                      id="tags"
                      type="text"
                      value={tagsInput}
                      onChange={(e) => setTagsInput(e.target.value)}
                      placeholder="Ex: nextjs, react, typescript, performance"
                      className="w-full px-3 py-2.5 bg-input border border-border rounded-sm text-sm font-mono placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-coffee focus:border-coffee transition-colors"
                    />
                  </div>

                  {/* Content (HTML supported) */}
                  <div className="space-y-2">
                    <label htmlFor="content" className="text-sm font-medium flex justify-between">
                      <span>Conteúdo</span>
                      <span className="text-xs text-muted-foreground font-mono">Suporta tags HTML para formatação</span>
                    </label>
                    <textarea
                      id="content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="<p>Escreva seu artigo aqui...</p>\n\n<p>Use tags HTML básicas como <strong>, <em>, <code> para formatação simples.</p>"
                      required
                      rows={12}
                      className="w-full px-3 py-2.5 bg-input border border-border rounded-sm text-sm font-mono placeholder:text-muted-foreground/30 focus:outline-none focus:ring-1 focus:ring-coffee focus:border-coffee transition-colors resize-y leading-relaxed"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.back()}
                      disabled={isPending}
                    >
                      Cancelar
                    </Button>

                    <Button
                      type="submit"
                      disabled={isPending}
                      className="bg-coffee text-accent-foreground hover:bg-coffee-light font-medium"
                    >
                      {isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Salvando...
                        </>
                      ) : editId ? (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Salvar Alterações
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Publicar Artigo
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
