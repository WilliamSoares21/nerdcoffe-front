"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  LogOut,
  Coffee,
  Menu,
  X,
  Flame,
  Hash
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useState } from "react"
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
  const { user, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 p-2 bg-card border border-border rounded-sm lg:hidden"
        aria-label="Abrir menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border flex flex-col transition-transform duration-200 lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-sidebar-border">
          <Link href="/" className="flex items-center gap-2.5 group">
            <Coffee className="h-5 w-5 text-coffee transition-colors group-hover:text-coffee-light" />
            <span className="font-semibold tracking-tight">morning.dev</span>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1.5 rounded-sm hover:bg-sidebar-accent lg:hidden"
            aria-label="Fechar menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="px-3 py-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen(false)}
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

        {/* User section */}
        <div className="mt-auto border-t border-sidebar-border p-4">
          {user ? (
            <>
              <div className="flex items-center gap-3 px-2 mb-3">
                <div className="h-8 w-8 rounded-sm bg-secondary flex items-center justify-center border border-border">
                  <span className="text-xs font-mono uppercase text-muted-foreground">
                    {user?.name?.charAt(0) || "U"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user?.name || "Usuário"}</p>
                  <p className="text-xs font-mono text-muted-foreground truncate">{user?.email || ""}</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-foreground rounded-sm transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Sair
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-coffee text-accent-foreground text-sm font-medium rounded-sm hover:bg-coffee-light transition-colors"
            >
              Entrar
            </Link>
          )}
        </div>
      </aside>
    </>
  )
}
