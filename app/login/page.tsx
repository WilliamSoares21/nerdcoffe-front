"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Coffee, Eye, EyeOff, Lock, CheckCircle2 } from "lucide-react"
import { loginAction } from "@/app/actions/auth"

export default function LoginPage() {
  const searchParams = useSearchParams()
  const registered = searchParams.get("registered")
  
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<{ message: string; isUnverified?: boolean } | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)

  useEffect(() => {
    if (registered) {
      setSuccess("Conta criada com sucesso! Faça login para continuar.")
    }
  }, [registered])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setIsPending(true)

    const result = await loginAction({ email, password })
    
    if (result?.error) {
      setError({ message: result.error, isUnverified: result.isUnverified })
      setIsPending(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex-col flex">
      {/* Login Form */}
      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          {/* Card */}
          <div className="border border-border rounded-sm overflow-hidden">
            {/* Card Header */}
            <div className="bg-secondary/30 px-6 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-coffee" />
                <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  Autenticação
                </span>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-6">
              <h1 className="text-xl font-semibold mb-1">Bem-vindo de volta</h1>
              <p className="text-sm text-muted-foreground mb-6">
                Entre para acessar seu feed personalizado
              </p>

              {/* Success Alert */}
              {success && (
                <div className="mb-6 p-3 bg-success/10 border border-success/20 rounded-sm font-mono text-sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                    <span className="text-foreground/80">{success}</span>
                  </div>
                </div>
              )}

              {/* Terminal-style Error Alert */}
              {error && (
                <div className={`mb-6 p-3 rounded-sm font-mono text-sm ${
                  error.isUnverified 
                    ? "bg-warning/10 border border-warning/20 text-warning" 
                    : "bg-destructive/10 border border-destructive/20 text-destructive"
                }`}>
                  <div className="flex items-start gap-2">
                    <span className="select-none">$</span>
                    <div>
                      <span className="font-semibold">
                        {error.isUnverified ? "warning:" : "error:"}
                      </span>{" "}
                      <span className="text-foreground/80">
                        {error.isUnverified ? (
                          <>
                            Sua conta ainda não está ativa. Por favor, verifique sua caixa de entrada e spam para encontrar o e-mail de ativação.
                          </>
                        ) : (
                          error.message
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="dev@email.com"
                    autoComplete="email"
                    required
                    className="w-full px-3 py-2.5 bg-input border border-border rounded-sm text-sm font-mono placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-coffee focus:border-coffee transition-colors"
                  />
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">
                    Senha
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      required
                      className="w-full px-3 py-2.5 pr-10 bg-input border border-border rounded-sm text-sm font-mono placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-coffee focus:border-coffee transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full px-4 py-2.5 bg-coffee text-accent-foreground font-medium rounded-sm hover:bg-coffee-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isPending ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="h-4 w-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
                      Entrando...
                    </span>
                  ) : (
                    "Entrar"
                  )}
                </button>
              </form>
            </div>

            {/* Card Footer */}
            <div className="px-6 py-4 bg-secondary/20 border-t border-border">
              <p className="text-sm text-muted-foreground text-center">
                Não tem conta?{" "}
                <Link href="/register" className="text-coffee hover:text-coffee-light transition-colors">
                  Criar agora
                </Link>
              </p>
            </div>
          </div>

          {/* Security Note */}
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Lock className="h-3 w-3" />
            <span className="font-mono">Conexão segura TLS 1.3</span>
          </div>

          {/* Demo info */}
          <p className="mt-4 text-xs text-center text-muted-foreground">
            Demo: use qualquer email válido e senha com 6+ caracteres
          </p>
        </div>
      </main>
    </div>
  )
}
