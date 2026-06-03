import Link from "next/link"
import { ChevronUp, Clock, MessageSquare } from "lucide-react"
import { type Article } from "@/lib/schemas"
import { calculateReadingTime, formatRelativeTime } from "@/lib/utils"

export function ArticleCard({ article }: { article: Article }) {
  const authorName = article.author.name || article.author.username || "Autor"
  const initials = authorName.charAt(0)

  return (
    <article className="p-4 border-b border-border hover:bg-secondary/30 transition-colors">
      <div className="flex items-start gap-4">
        {/* Upvote (Static for now in Server Component) */}
        <div className="flex flex-col items-center gap-0.5 pt-1 text-muted-foreground">
          <ChevronUp className="h-5 w-5" />
          <span className="font-mono text-xs">{article.upvoteCount}</span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <Link href={`/articles/${article.id}`} className="group">
            <h2 className="font-semibold text-foreground group-hover:text-coffee transition-colors mb-1.5 leading-snug">
              {article.title}
            </h2>
          </Link>
          
          {article.summary && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {article.summary}
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

          {/* Meta with Standardized Author */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <Link href={`/user/${encodeURIComponent(article.author.username || article.author.email || '')}`} className="flex items-center gap-1.5 hover:text-coffee transition-colors">
              {article.author.avatarUrl ? (
                <img 
                  src={article.author.avatarUrl} 
                  alt={authorName} 
                  className="h-5 w-5 rounded-full object-cover border border-border"
                />
              ) : (
                <div className="h-5 w-5 rounded-full bg-secondary flex items-center justify-center border border-border text-[10px] font-mono uppercase font-bold text-muted-foreground">
                  {initials}
                </div>
              )}
              <span className="font-mono font-medium text-foreground/85">
                {article.author.name || `@${article.author.username || article.author.email}`}
              </span>
            </Link>

            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {calculateReadingTime(article.content || "")} min
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              {article.commentsCount}
            </span>
            <span className="font-mono">{article.publishedAt ? formatRelativeTime(article.publishedAt) : "Rascunho"}</span>
          </div>
        </div>
      </div>
    </article>
  )
}
