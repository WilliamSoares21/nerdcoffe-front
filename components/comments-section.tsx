"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { 
  getCommentsAction, 
  createCommentAction, 
  toggleCommentLikeAction, 
  deleteCommentAction 
} from "@/app/actions/articles"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { formatRelativeTime } from "@/lib/utils"
import { MessageSquare, Send, Heart, Trash } from "lucide-react"
import Link from "next/link"
import type { Comment } from "@/lib/types"

interface CommentsSectionProps {
  articleId: string
}

export function CommentsSection({ articleId }: CommentsSectionProps) {
  const router = useRouter()
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
    if (!isAuthenticated) {
      router.push("/login")
      return
    }
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
            disabled={isLoading || (isAuthenticated && !newComment.trim())}
            className="bg-coffee hover:bg-coffee-light text-accent-foreground gap-1.5 text-xs font-medium"
          >
            <Send className="h-3.5 w-3.5" />
            {isLoading ? "Enviando..." : "Comentar"}
          </Button>
        </div>
      </form>

      {/* Lista de Comentarios */}
      <div className="space-y-6 mt-6">
        {isFetching && comments.length === 0 ? (
          <div className="flex items-center justify-center py-6 text-sm text-muted-foreground">
            Carregando comentários...
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-border rounded-md text-muted-foreground text-sm">
            Nenhum comentário ainda. Seja o primeiro a comentar!
          </div>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              articleId={articleId}
              currentUser={user}
              isAuthenticated={isAuthenticated}
              onActionSuccess={fetchComments}
              router={router}
            />
          ))
        )}
      </div>
    </div>
  )
}

interface CommentItemProps {
  comment: Comment
  articleId: string
  currentUser: any
  isAuthenticated: boolean
  onActionSuccess: () => void
  router: any
}

function CommentItem({ 
  comment, 
  articleId, 
  currentUser, 
  isAuthenticated, 
  onActionSuccess, 
  router 
}: CommentItemProps) {
  const [isReplying, setIsReplying] = useState(false)
  const [replyContent, setReplyContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLiking, setIsLiking] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleLike = async () => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }
    setIsLiking(true)
    try {
      const res = await toggleCommentLikeAction(comment.id)
      if (res.success) {
        toast.success(comment.userUpvoted ? "Curtida removida" : "Comentário curtido")
        onActionSuccess()
      } else {
        toast.error(res.error || "Erro ao curtir comentário")
      }
    } catch (err) {
      toast.error("Erro ao curtir comentário")
    } finally {
      setIsLiking(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm("Deseja realmente apagar este comentário?")) {
      return
    }
    setIsDeleting(true)
    try {
      const res = await deleteCommentAction(comment.id)
      if (res.success) {
        toast.success("Comentário apagado com sucesso!")
        onActionSuccess()
      } else {
        toast.error(res.error || "Erro ao apagar comentário")
      }
    } catch (err) {
      toast.error("Erro ao apagar comentário")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAuthenticated) {
      router.push("/login")
      return
    }
    if (!replyContent.trim()) return

    setIsSubmitting(true)
    try {
      const res = await createCommentAction(articleId, replyContent, comment.id)
      if (res.success) {
        toast.success("Resposta enviada com sucesso!")
        setReplyContent("")
        setIsReplying(false)
        onActionSuccess()
      } else {
        toast.error(res.error || "Erro ao enviar resposta")
      }
    } catch (err) {
      toast.error("Erro ao enviar resposta")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReplyToggle = () => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }
    setIsReplying(!isReplying)
  }

  const authorUsername = comment.author.username
  const authorName = comment.author.name || (authorUsername ? `@${authorUsername}` : "Usuário")
  const avatarUrl = comment.author.avatarUrl || comment.author.avatar_url
  const initials = (comment.author.name || authorUsername || "Usuário").charAt(0).toUpperCase()

  const isAuthor = isAuthenticated && currentUser && (
    (currentUser.email && comment.author.email && currentUser.email === comment.author.email) ||
    ((currentUser as any).username && comment.author.username && (currentUser as any).username === comment.author.username)
  )

  return (
    <div className="space-y-3 w-full animate-fade-in">
      <div 
        className="flex items-start gap-3 p-4 rounded-[16px] bg-secondary/10 border border-border/50 hover:bg-secondary/20 transition-all w-full"
      >
        {authorUsername && authorUsername.trim() !== "" ? (
          <Link href={`/user/${authorUsername}`}>
            <Avatar className="h-8 w-8 border border-border hover:opacity-80 transition-opacity">
              {avatarUrl ? (
                <AvatarImage src={avatarUrl} alt={authorName} />
              ) : null}
              <AvatarFallback className="text-[10px] font-mono font-bold bg-secondary text-muted-foreground uppercase">
                {initials}
              </AvatarFallback>
            </Avatar>
          </Link>
        ) : (
          <Avatar className="h-8 w-8 border border-border">
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} alt={authorName} />
            ) : null}
            <AvatarFallback className="text-[10px] font-mono font-bold bg-secondary text-muted-foreground uppercase">
              {initials}
            </AvatarFallback>
          </Avatar>
        )}
        
        <div className="flex-1 space-y-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            {authorUsername && authorUsername.trim() !== "" ? (
              <Link href={`/user/${authorUsername}`} className="hover:text-coffee transition-colors">
                <span className="text-sm font-semibold text-foreground">
                  {authorName}
                </span>
              </Link>
            ) : (
              <span className="text-sm font-semibold text-foreground">
                {authorName}
              </span>
            )}
            <span className="text-xs text-muted-foreground">
              {formatRelativeTime(comment.createdAt)}
            </span>
          </div>
          <p className="text-sm text-foreground/90 whitespace-pre-wrap break-words">
            {comment.content}
          </p>

          {/* Action Bar */}
          <div className="flex items-center gap-4 pt-3 text-xs text-muted-foreground select-none">
            <button 
              onClick={handleLike} 
              disabled={isLiking}
              className={`flex items-center gap-1.5 transition-colors ${comment.userUpvoted ? "text-coffee font-medium" : "hover:text-foreground"}`}
            >
              <Heart className={`h-3.5 w-3.5 ${comment.userUpvoted ? "fill-coffee text-coffee" : ""}`} />
              <span className="font-mono">{comment.upvoteCount || 0}</span>
            </button>
            
            <button 
              onClick={handleReplyToggle}
              className="flex items-center gap-1.5 hover:text-foreground transition-colors"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              <span>Responder</span>
            </button>

            {isAuthor && (
              <button 
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center gap-1.5 hover:text-destructive transition-colors ml-auto text-muted-foreground/60 hover:text-destructive"
              >
                <Trash className="h-3.5 w-3.5" />
                <span>Apagar</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Reply Textarea below the comment */}
      {isReplying && (
        <form onSubmit={handleReplySubmit} className="ml-8 space-y-2">
          <Textarea
            placeholder="Escreva sua resposta..."
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            disabled={isSubmitting}
            className="w-full min-h-[80px] bg-secondary/15 border-border focus:border-coffee text-sm"
          />
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsReplying(false)}
              className="text-xs"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !replyContent.trim()}
              className="bg-coffee hover:bg-coffee-light text-accent-foreground text-xs font-medium"
            >
              {isSubmitting ? "Enviando..." : "Responder"}
            </Button>
          </div>
        </form>
      )}

      {/* Render replies recursively */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-6 pl-4 border-l border-zinc-800 space-y-4 mt-2">
          {comment.replies.map((reply) => (
            <CommentItem 
              key={reply.id} 
              comment={reply} 
              articleId={articleId} 
              currentUser={currentUser} 
              isAuthenticated={isAuthenticated} 
              onActionSuccess={onActionSuccess}
              router={router}
            />
          ))}
        </div>
      )}
    </div>
  )
}
