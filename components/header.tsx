"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Coffee, LogOut, User as UserIcon, Menu, Flame, FileText, Users } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { logoutAction } from "@/app/actions/auth"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const navigation = [
  { name: "Feed", href: "/feed", icon: Flame },
  { name: "Artigos", href: "/articles", icon: FileText },
  { name: "Patrocinadores", href: "/sponsors", icon: Users },
]

export function Header() {
  const { user, isAuthenticated } = useAuth()
  const pathname = usePathname()
  const isLandingPage = pathname === "/"

  const handleLogout = async () => {
    await logoutAction()
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        {/* Left Side: Brand & Mobile Menu */}
        <div className="flex items-center gap-2 shrink-0">
          {!isLandingPage && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden mr-1">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 bg-background p-0 border-r border-border">
                <SheetHeader className="p-6 border-b border-border text-left">
                  <SheetTitle className="flex items-center gap-2">
                    <Coffee className="h-5 w-5 text-coffee" />
                    <span>morning.dev</span>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col p-4 space-y-2">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-sm transition-colors ${
                        pathname === item.href
                          ? "bg-coffee/10 text-coffee"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.name}
                    </Link>
                  ))}
                </div>
                {!isAuthenticated && (
                  <div className="mt-auto p-4 border-t border-border grid gap-2">
                    <Button variant="outline" asChild className="w-full">
                      <Link href="/login">Entrar</Link>
                    </Button>
                    <Button asChild className="w-full bg-coffee hover:bg-coffee-light">
                      <Link href="/register">Criar conta</Link>
                    </Button>
                  </div>
                )}
              </SheetContent>
            </Sheet>
          )}

          <Link href="/" className="flex items-center gap-2.5 group">
            <Coffee className="h-5 w-5 text-coffee transition-colors group-hover:text-coffee-light" />
            <span className="font-semibold tracking-tight">morning.dev</span>
          </Link>
        </div>

        {/* Right Side: Navigation & User */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Desktop Navigation */}
          {!isLandingPage && (
            <nav className="hidden md:flex items-center gap-6 mr-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium transition-colors hover:text-coffee ${
                    pathname === item.href ? "text-coffee" : "text-muted-foreground"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          )}

          {/* User Auth Section */}
          {!isLandingPage && isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0 overflow-hidden border border-border">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatarUrl || ""} alt={user?.name || "User"} />
                    <AvatarFallback className="bg-secondary text-xs font-mono">
                      {user?.name?.charAt(0) || <UserIcon className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name || "Usuário"}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/feed" className="cursor-pointer w-full">Feed</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/articles" className="cursor-pointer w-full">Meus Artigos</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-destructive focus:text-destructive cursor-pointer"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : !isAuthenticated && (
            <div className="hidden md:flex items-center gap-3">
              <Button variant="ghost" asChild size="sm">
                <Link href="/login">Entrar</Link>
              </Button>
              <Button size="sm" className="bg-coffee hover:bg-coffee-light text-accent-foreground" asChild>
                <Link href="/register">Criar conta</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
