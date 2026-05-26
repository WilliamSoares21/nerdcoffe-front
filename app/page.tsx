"use client"

import Link from "next/link"
import { Coffee, ArrowRight, Flame, BookOpen, Users, Mail } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

const trendingTags = [
  { name: "typescript", color: "text-blue-400" },
  { name: "react", color: "text-cyan-400" },
  { name: "nextjs", color: "text-foreground" },
  { name: "rust", color: "text-orange-400" },
  { name: "golang", color: "text-cyan-300" },
  { name: "nginx", color: "text-green-400" },
  { name: "docker", color: "text-blue-300" },
  { name: "kubernetes", color: "text-blue-400" },
]

export default function LandingPage() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <Coffee className="h-5 w-5 text-coffee transition-colors group-hover:text-coffee-light" />
            <span className="font-semibold tracking-tight">morning.dev</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/feed" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Feed
            </Link>
            <Link href="/articles" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Artigos
            </Link>
            {isAuthenticated ? (
              <Link
                href="/feed"
                className="px-4 py-2 bg-coffee text-accent-foreground text-sm font-medium rounded-sm hover:bg-coffee-light transition-colors"
              >
                Ir para o Feed
              </Link>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 bg-coffee text-accent-foreground text-sm font-medium rounded-sm hover:bg-coffee-light transition-colors"
              >
                Entrar
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-coffee mb-6">
              <Coffee className="h-4 w-4" />
              <span className="font-mono text-xs uppercase tracking-wider">Daily Tech Briefing</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight leading-tight mb-6 text-balance">
              Seu briefing tech matinal, com café.
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8 text-pretty">
              Uma curadoria diária das melhores notícias, artigos e discussões do mundo dev. 
              Feito para desenvolvedores que querem começar o dia informados.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href={isAuthenticated ? "/feed" : "/login"}
                className="inline-flex items-center gap-2 px-6 py-3 bg-coffee text-accent-foreground font-medium rounded-sm hover:bg-coffee-light transition-colors"
              >
                Começar a ler
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/sponsors"
                className="inline-flex items-center gap-2 px-6 py-3 border border-border text-foreground font-medium rounded-sm hover:bg-secondary transition-colors"
              >
                Patrocinar
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Tags */}
      <section className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex items-center gap-3 mb-6">
            <Flame className="h-4 w-4 text-coffee" />
            <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Trending agora</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {trendingTags.map((tag) => (
              <Link
                key={tag.name}
                href={`/feed?tag=${tag.name}`}
                className="px-4 py-2 bg-secondary border border-border rounded-sm font-mono text-sm hover:border-coffee/50 transition-colors group"
              >
                <span className="text-muted-foreground group-hover:text-coffee transition-colors">#</span>
                <span className={tag.color}>{tag.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Preview */}
      <section className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <div className="flex items-center gap-2 text-coffee mb-4">
                <Mail className="h-4 w-4" />
                <span className="font-mono text-xs uppercase tracking-wider">Newsletter</span>
              </div>
              <h2 className="text-2xl font-semibold tracking-tight mb-4">
                Receba o melhor da tech toda manhã
              </h2>
              <p className="text-muted-foreground mb-6 text-pretty">
                Um resumo curado das notícias mais importantes, direto no seu email às 7h. 
                Sem spam, apenas conteúdo relevante.
              </p>
              <form className="flex gap-2">
                <input
                  type="email"
                  placeholder="seu@email.dev"
                  className="flex-1 px-4 py-2.5 bg-input border border-border rounded-sm text-sm font-mono placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-coffee focus:border-coffee"
                />
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-coffee text-accent-foreground text-sm font-medium rounded-sm hover:bg-coffee-light transition-colors"
                >
                  Assinar
                </button>
              </form>
            </div>
            
            {/* Newsletter Preview Card */}
            <div className="border border-border rounded-sm overflow-hidden">
              <div className="bg-secondary/50 px-4 py-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <Coffee className="h-4 w-4 text-coffee" />
                  <span className="font-mono text-xs text-muted-foreground">morning.dev — Daily Digest</span>
                </div>
              </div>
              <div className="p-4 space-y-4">
                <div className="space-y-2">
                  <div className="font-mono text-xs text-coffee">TOP STORIES</div>
                  <div className="space-y-3">
                    {[
                      "TypeScript 6.0 Release Candidate anunciado",
                      "Rust supera C++ em benchmark de performance",
                      "OpenAI libera novo modelo para desenvolvedores"
                    ].map((title, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className="font-mono text-xs text-muted-foreground w-4">{i + 1}.</span>
                        <span className="text-sm">{title}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="pt-3 border-t border-border">
                  <div className="font-mono text-xs text-muted-foreground">
                    + 12 mais artigos no digest completo
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Flame,
                title: "Trending em tempo real",
                description: "Algoritmo que identifica as discussões mais relevantes da comunidade dev."
              },
              {
                icon: BookOpen,
                title: "Leitura focada",
                description: "Interface limpa e minimalista, feita para ler sem distrações."
              },
              {
                icon: Users,
                title: "Comunidade ativa",
                description: "Discussões técnicas de qualidade com desenvolvedores de todo o Brasil."
              }
            ].map((feature) => (
              <div key={feature.title} className="space-y-3">
                <feature.icon className="h-5 w-5 text-coffee" />
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground text-pretty">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Coffee className="h-4 w-4 text-coffee" />
            <span className="font-mono text-xs">morning.dev</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/sponsors" className="hover:text-foreground transition-colors">Patrocinadores</Link>
            <a href="https://github.com" className="hover:text-foreground transition-colors">GitHub</a>
            <a href="https://twitter.com" className="hover:text-foreground transition-colors">Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
