"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  FileText, 
  Coffee,
  Flame,
  Users,
  Hash
} from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Feed", href: "/feed", icon: Flame },
  { name: "Artigos", href: "/articles", icon: FileText },
  { name: "Patrocinadores", href: "/sponsors", icon: Users },
]

const trendingTags = [
  { name: "typescript", count: 1420 },
  { name: "react", count: 980 },
  { name: "nextjs", count: 756 },
  { name: "rust", count: 542 },
  { name: "golang", count: 489 },
]

export function Sidebar() {
  const pathname = usePathname()
  const isLandingPage = pathname === "/"

  if (isLandingPage) return null

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-sidebar border-r border-sidebar-border flex flex-col -translate-x-full lg:translate-x-0 transition-transform duration-200"
      )}
    >
      {/* Sidebar Header */}
      <div className="h-16 flex items-center px-5 border-b border-sidebar-border">
        <Link href="/" className="flex items-center gap-2.5 group">
          <Coffee className="h-5 w-5 text-coffee transition-colors group-hover:text-coffee-light" />
          <span className="font-semibold tracking-tight">morning.dev</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="px-3 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-sm transition-colors",
                isActive
                  ? "bg-coffee text-accent-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Trending Tags */}
      <div className="px-5 py-4 border-t border-sidebar-border">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
          Trending
        </h3>
        <div className="space-y-1.5">
          {trendingTags.map((tag) => (
            <Link
              key={tag.name}
              href={`/feed?tag=${tag.name}`}
              className="flex items-center justify-between py-1.5 px-2 text-sm text-muted-foreground hover:text-foreground hover:bg-sidebar-accent rounded-sm transition-colors group"
            >
              <span className="flex items-center gap-1.5">
                <Hash className="h-3 w-3 text-coffee opacity-60" />
                <span className="font-mono text-xs">{tag.name}</span>
              </span>
              <span className="font-mono text-xs text-muted-foreground/60 group-hover:text-muted-foreground">
                {tag.count}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  )
}
