"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { getCommentsAction, createCommentAction } from "@/app/actions/articles"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { formatRelativeTime } from "@/lib/utils"
import { MessageSquare, Send } from "lucide-react"
import Link from "next/link"
import type { Comment } from "@/lib/types"


interface CommentsSectionProps {
  articleId: string
}

export function CommentsSection({ articleId }: CommentsSectionProps) {
  const { isAuthenticated, user } = useAuth()
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)

  const fetchComments = async () => {
    try {
      const res = await getCommentsAction(articleId)
      if (res.success && res.data) {
        setComments(res.data)
      } else if (res.error) {
        toast.error(`Falha ao carregar comentários: ${res.error}`)
      }
    } catch (err) {
      console.error("Error fetching comments:", err)
    } finally {
      setIsFetching(false)
    }
  }

  useEffect(() => {
    fetchComments()
  }, [articleId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setIsLoading(true)
    
    // Optimistic comment creation
    const tempId = `temp-${Date.now()}`
    const optimisticComment: Comment = {
      id: tempId,
      content: newComment,
      createdAt: new Date().toISOString(),
      author: {
        id: user?.id || "temp-user",
        username: (user as any)?.username || user?.name || "Você",
        name: user?.name,
        avatarUrl: user?.avatarUrl,
      }
    }

    // Temporarily add to list
    setComments(prev => [optimisticComment, ...prev])
    const currentText = newComment
    setNewComment("")

    try {
      const res = await createCommentAction(articleId, currentText)
      if (res.error) {
        toast.error(`Erro ao enviar comentário: ${res.error}`)
        // Rollback optimistic comment
        setComments(prev => prev.filter(c => c.id !== tempId))
        setNewComment(currentText)
      } else {
        toast.success("Comentário adicionado com sucesso!")
        // Re-fetch all comments to sync with database
        fetchComments()
      }
    } catch (err) {
      toast.error("Erro de conexão ao enviar comentário.")
      setComments(prev => prev.filter(c => c.id !== tempId))
      setNewComment(currentText)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mt-12 border-t border-border pt-8 space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="h-5 w-5 text-coffee" />
        <h3 className="font-semibold text-lg">Discussão ({comments.length})</h3>
      </div>

      {/* Formulario */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <Textarea
            placeholder="O que você achou deste artigo? Compartilhe seus pensamentos..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={isLoading}
            className="w-full min-h-[100px] bg-secondary/20 border-border focus:border-coffee"
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isLoading || !newComment.trim()}
              className="bg-coffee hover:bg-coffee-light text-accent-foreground gap-1.5 text-xs font-medium"
            >
              <Send className="h-3.5 w-3.5" />
              {isLoading ? "Enviando..." : "Comentar"}
            </Button>
          </div>
        </form>
      ) : (
        <div className="bg-secondary/20 border border-border rounded-md p-4 text-center">
          <p className="text-sm text-muted-foreground">
            Você precisa estar logado para comentar.
          </p>
        </div>
      )}

      {/* Lista de Comentarios */}
      <div className="space-y-4 mt-6">
        {isFetching && comments.length === 0 ? (
          <div className="flex items-center justify-center py-6 text-sm text-muted-foreground">
            Carregando comentários...
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-border rounded-md text-muted-foreground text-sm">
            Nenhum comentário ainda. Seja o primeiro a comentar!
          </div>
        ) : (
          comments.map((comment) => {
            const authorUsername = comment.author.username
            const authorName = comment.author.name || (authorUsername ? `@${authorUsername}` : "Usuário")
            const avatarUrl = comment.author.avatarUrl || comment.author.avatar_url
            const initials = (comment.author.name || authorUsername || "Usuário").charAt(0).toUpperCase()
            
            return (
              <div 
                key={comment.id} 
                className="flex items-start gap-3 p-3 rounded-md bg-secondary/10 border border-border/50 hover:bg-secondary/20 transition-all"
              >
                {authorUsername ? (
                  <>
                    <Link href={`/user/${encodeURIComponent(authorUsername)}`}>
                      <Avatar className="h-8 w-8 border border-border hover:opacity-80 transition-opacity">
                        {avatarUrl ? (
                          <AvatarImage src={avatarUrl} alt={authorName} />
                        ) : null}
                        <AvatarFallback className="text-[10px] font-mono font-bold bg-secondary text-muted-foreground uppercase">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                    </Link>
                    
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <Link href={`/user/${encodeURIComponent(authorUsername)}`} className="hover:text-coffee transition-colors">
                          <span className="text-sm font-semibold text-foreground">
                            {authorName}
                          </span>
                        </Link>
                        <span className="text-xs text-muted-foreground">
                          {formatRelativeTime(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-foreground/90 whitespace-pre-wrap">
                        {comment.content}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <Avatar className="h-8 w-8 border border-border">
                      {avatarUrl ? (
                        <AvatarImage src={avatarUrl} alt={authorName} />
                      ) : null}
                      <AvatarFallback className="text-[10px] font-mono font-bold bg-secondary text-muted-foreground uppercase">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-foreground">
                          {authorName}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatRelativeTime(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-foreground/90 whitespace-pre-wrap">
                        {comment.content}
                      </p>
                    </div>
                  </>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
