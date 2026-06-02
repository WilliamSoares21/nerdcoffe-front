"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Bookmark, ChevronUp, Edit3, MessageSquare, Share2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { deleteArticleAction, upvoteArticleAction, saveArticleAction } from "@/app/actions/articles"
import { useAuth } from "@/lib/auth-context"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


interface HeaderActionsProps {
  articleId: string
  title: string
  excerpt?: string
  isBookmarkedInitial?: boolean
}

export function ArticleHeaderActions({
  articleId,
  title,
  excerpt,
  isBookmarkedInitial = false,
}: HeaderActionsProps) {
  const [isBookmarked, setIsBookmarked] = useState(isBookmarkedInitial)
  const [isSaving, setIsSaving] = useState(false)

  const handleShare = async () => {
    const shareData = {
      title: title,
      text: excerpt || "Veja este artigo incrível no morning.dev!",
      url: window.location.href,
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
        toast.success("Artigo compartilhado com sucesso!")
      } else {
        // Fallback directly to clipboard
        await navigator.clipboard.writeText(window.location.href)
        toast.success("Link copiado para a área de transferência!")
      }
    } catch (e: any) {
      // Fallback in case navigator.share aborts or fails silently on localhost
      try {
        await navigator.clipboard.writeText(window.location.href)
        toast.success("Link copiado!")
      } catch (clipErr) {
        console.error("Clipboard copy failed:", clipErr)
        toast.error("Falha ao compartilhar o artigo.")
      }
    }
  }

  const handleBookmark = async () => {
    if (isSaving) return
    setIsSaving(true)
    
    const previousState = isBookmarked
    setIsBookmarked(!previousState)
    toast.success(!previousState ? "Artigo favoritado com sucesso!" : "Artigo removido dos favoritos!")
    
    const res = await saveArticleAction(articleId)
    if (res.error) {
      toast.error(`Falha ao salvar artigo: ${res.error}`)
      setIsBookmarked(previousState)
    }
    setIsSaving(false)
  }

  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={handleShare}
        className="text-muted-foreground hover:text-coffee transition-colors"
        title="Compartilhar"
      >
        <Share2 className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={handleBookmark}
        className="text-muted-foreground hover:text-coffee transition-colors"
        title={isBookmarked ? "Remover dos favoritos" : "Salvar nos favoritos"}
      >
        <Bookmark className={`h-4 w-4 transition-all ${isBookmarked ? "fill-coffee text-coffee" : ""}`} />
      </Button>
    </div>
  )
}

interface FooterActionsProps {
  articleId: string
  initialUpvotes: number
  commentsCount: number
  isAuthor?: boolean
  author?: {
    id: string | number
    email?: string
    username?: string
  }
  initialIsUpvoted?: boolean
  initialIsBookmarked?: boolean
}

export function ArticleFooterActions({
  articleId,
  initialUpvotes,
  commentsCount,
  isAuthor,
  author,
  initialIsUpvoted = false,
  initialIsBookmarked = false,
}: FooterActionsProps) {
  const router = useRouter()
  const { user } = useAuth()
  
  const [count, setCount] = useState(initialUpvotes || 0)
  const [active, setActive] = useState(initialIsUpvoted)
  const [isLoading, setIsLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked)
  const [isSaving, setIsSaving] = useState(false)

  const handleBookmark = async () => {
    if (isSaving) return
    setIsSaving(true)
    
    const previousState = isBookmarked
    setIsBookmarked(!previousState)
    toast.success(!previousState ? "Artigo favoritado com sucesso!" : "Artigo removido dos favoritos!")
    
    const res = await saveArticleAction(articleId)
    if (res.error) {
      toast.error(`Falha ao salvar artigo: ${res.error}`)
      setIsBookmarked(previousState)
    }
    setIsSaving(false)
    router.refresh()
  }

  // Strictly check ownership using useAuth context (id or email)
  const isOwner = !!(
    user && 
    author && 
    (String(user.id) === String(author.id) || 
     (user.email && author.email && user.email === author.email))
  )

  const hasAccess = author ? isOwner : isAuthor

  const handleUpvote = async () => {
    if (isLoading) return
    setIsLoading(true)

    const res = await upvoteArticleAction(articleId)

    if (res.error) {
      toast.error(`Falha ao registrar upvote: ${res.error}`)
      setIsLoading(false)
      return
    }

    // Toggle states on successful API response
    if (active) {
      setCount(prev => Math.max(0, prev - 1))
      setActive(false)
      toast.success("Voto removido.")
    } else {
      setCount(prev => prev + 1)
      setActive(true)
      toast.success("Voto computado com sucesso!")
    }

    setIsLoading(false)
    router.refresh()
  }

  const handleDelete = async () => {
    setDeleting(true)
    const result = await deleteArticleAction(articleId)

    if (result && result.error) {
      toast.error(`Falha ao excluir o artigo: ${result.error}`)
      setDeleting(false)
    } else {
      toast.success("Artigo excluído com sucesso.")
    }
  }

  return (
    <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-6 border-t border-border mt-12">
      <div className="flex items-center gap-6">
        {/* Upvotes */}
        <button 
          onClick={handleUpvote}
          disabled={isLoading}
          className={`flex items-center gap-2 text-sm font-mono transition-colors group disabled:opacity-70 disabled:cursor-not-allowed ${
            active ? "text-coffee" : "text-muted-foreground hover:text-coffee"
          }`}
        >
          <div className={`p-2 rounded-full transition-colors ${
            active ? "bg-coffee/20" : "bg-secondary group-hover:bg-coffee/10"
          }`}>
            <ChevronUp className={`h-5 w-5 transition-transform ${
              active ? "scale-110 animate-pulse" : "group-hover:-translate-y-0.5"
            }`} />
          </div>
          <span>{count} upvotes</span>
        </button>

        {/* Comments Count */}
        <div className="flex items-center gap-2 text-muted-foreground text-sm font-mono">
          <div className="p-2 bg-secondary rounded-full">
            <MessageSquare className="h-5 w-5" />
          </div>
          <span>{commentsCount} comentários</span>
        </div>

        {/* Bookmark */}
        <button 
          onClick={handleBookmark}
          disabled={isSaving}
          className={`flex items-center gap-2 text-sm font-mono transition-colors group disabled:opacity-70 disabled:cursor-not-allowed ${
            isBookmarked ? "text-coffee" : "text-muted-foreground hover:text-coffee"
          }`}
        >
          <div className={`p-2 rounded-full transition-colors ${
            isBookmarked ? "bg-coffee/20" : "bg-secondary group-hover:bg-coffee/10"
          }`}>
            <Bookmark className={`h-5 w-5 transition-transform ${
              isBookmarked ? "scale-110 fill-coffee text-coffee animate-pulse" : "group-hover:scale-105"
            }`} />
          </div>
          <span>{isBookmarked ? "Salvo" : "Salvar"}</span>
        </button>
      </div>

      {/* Author specific actions (Edit/Delete) */}
      {hasAccess && (
        <div className="flex items-center gap-2">
          <Button 
            asChild
            variant="outline"
            size="sm"
            className="gap-1.5 border-border hover:bg-secondary text-xs"
          >
            <Link href={`/articles/new?edit=${articleId}`}>
              <Edit3 className="h-3.5 w-3.5" />
              Editar
            </Link>
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline"
                size="sm"
                disabled={deleting}
                className="gap-1.5 border-destructive/20 text-destructive hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 text-xs"
              >
                <Trash2 className="h-3.5 w-3.5" />
                {deleting ? "Excluindo..." : "Excluir"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir Artigo?</AlertDialogTitle>
                <AlertDialogDescription>
                  Deseja realmente excluir este artigo permanentemente? Essa ação não poderá ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDelete}
                  className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                >
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>
  )
}
