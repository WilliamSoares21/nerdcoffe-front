import Link from "next/link"
import { Coffee, CheckCircle2, XCircle, ArrowRight, Terminal } from "lucide-react"

// Define API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1"

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function VerifyEmailPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams
  const token = typeof resolvedParams.token === "string" ? resolvedParams.token : undefined

  let status: "success" | "error" = "success"
  let errorMessage = ""

  if (!token) {
    status = "error"
    errorMessage = "Token de verificação ausente na requisição."
  } else {
    try {
      // Realizar chamada GET para o endpoint do backend
      const response = await fetch(`${API_URL}/auth/verify-email?token=${encodeURIComponent(token)}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        status = "error"
        const result = await response.json().catch(() => ({}))
        errorMessage = result.message || "O token expirou ou é inválido."
      }
    } catch (error) {
      status = "error"
      errorMessage = "Erro de conexão com o servidor. Tente novamente mais tarde."
    }
  }

  return (
    <div className="min-h-screen bg-background flex-col flex">
      {/* Verification Card */}
      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="border border-border rounded-sm overflow-hidden bg-card shadow-xl">
            {/* Card Header */}
            <div className="bg-secondary/30 px-6 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-coffee animate-pulse" />
                <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  Verificação de Conta
                </span>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-8 text-center">
              {status === "success" ? (
                <div className="space-y-6">
                  {/* Glowing success circle */}
                  <div className="mx-auto w-16 h-16 rounded-full bg-success/10 border border-success/30 flex items-center justify-center">
                    <CheckCircle2 className="h-8 w-8 text-success animate-bounce" />
                  </div>

                  <div className="space-y-2">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                      E-mail Verificado!
                    </h1>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Sua conta Nerdcoffe foi ativada com sucesso. Agora você faz parte da nossa comunidade de desenvolvedores.
                    </p>
                  </div>

                  {/* Terminal output mockup for extra geeky flavor */}
                  <div className="bg-secondary/20 rounded-sm p-4 font-mono text-xs text-left border border-border space-y-1">
                    <div className="flex gap-2">
                      <span className="text-success select-none">$</span>
                      <span className="text-foreground/80">nerdcoffe-cli auth verify --token=***</span>
                    </div>
                    <div className="text-success flex gap-2">
                      <span>✓</span>
                      <span>Conta ativada com sucesso. Código 200 OK.</span>
                    </div>
                  </div>

                  <Link
                    href="/login"
                    className="inline-flex w-full items-center justify-center gap-2 px-4 py-2.5 bg-coffee text-accent-foreground font-semibold rounded-sm hover:bg-coffee-light transition-colors group shadow-md"
                  >
                    Ir para o Login
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Glowing error circle */}
                  <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 border border-destructive/30 flex items-center justify-center">
                    <XCircle className="h-8 w-8 text-destructive animate-pulse" />
                  </div>

                  <div className="space-y-2">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                      Falha na Verificação
                    </h1>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {errorMessage}
                    </p>
                  </div>

                  {/* Terminal output mockup for failure */}
                  <div className="bg-secondary/20 rounded-sm p-4 font-mono text-xs text-left border border-border space-y-1">
                    <div className="flex gap-2">
                      <span className="text-destructive select-none">$</span>
                      <span className="text-foreground/80">nerdcoffe-cli auth verify --token=***</span>
                    </div>
                    <div className="text-destructive flex gap-2">
                      <span>✗</span>
                      <span>status: Token expirado ou inválido.</span>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground leading-relaxed bg-warning/5 border border-warning/10 p-3 rounded-sm text-left">
                    <span className="text-warning font-semibold">Dica:</span> Tente realizar o login na sua conta para que possamos verificar suas credenciais ou enviar um novo link de ativação caso necessário.
                  </div>

                  <Link
                    href="/login"
                    className="inline-flex w-full items-center justify-center gap-2 px-4 py-2.5 bg-secondary text-secondary-foreground font-medium rounded-sm border border-border hover:bg-secondary/80 transition-colors"
                  >
                    Voltar para o Login
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Logo / Footer branding */}
          <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Coffee className="h-4 w-4 text-coffee" />
            <span className="font-semibold tracking-wider uppercase text-xs">Nerdcoffe</span>
          </div>
        </div>
      </main>
    </div>
  )
}
