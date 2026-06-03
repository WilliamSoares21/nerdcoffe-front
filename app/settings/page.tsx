"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { updateProfileAction, getUserProfileAction } from "@/app/actions/users"
import { Sidebar } from "@/components/sidebar"
import { User as UserIcon, Settings, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react"

export default function SettingsPage() {
  const { user, isAuthenticated } = useAuth()
  const [name, setName] = useState("")
  const [bio, setBio] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("")
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)

  useEffect(() => {
    async function loadProfile() {
      const username = user ? ((user as any).username || user.email) : null
      if (username) {
        setIsLoadingProfile(true)
        const res = await getUserProfileAction(username)
        if (res.success && res.data) {
          setName(res.data.name || "")
          setBio(res.data.bio || "")
          setAvatarUrl(res.data.avatarUrl || res.data.avatar_url || "")
        }
        setIsLoadingProfile(false)
      } else if (user) {
        setName(user.name || "")
        setAvatarUrl(user.avatarUrl || "")
        setIsLoadingProfile(false)
      }
    }
    if (user) {
      loadProfile()
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setIsPending(true)

    const result = await updateProfileAction({ name, bio, avatarUrl })
    
    if (result.success) {
      setSuccess("Perfil atualizado com sucesso!")
    } else {
      setError(result.error || "Erro ao atualizar perfil")
    }
    setIsPending(false)
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex">
        <Sidebar />
        <main className="lg:pl-64 flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center space-y-4 border border-border p-8 rounded-lg bg-secondary/10">
            <AlertTriangle className="h-8 w-8 text-destructive mx-auto" />
            <h2 className="text-xl font-bold">Acesso restrito</h2>
            <p className="text-sm text-muted-foreground">
              Por favor, faça login para aceder às configurações do seu perfil.
            </p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />

      <main className="lg:pl-64 flex-1">
        <div className="max-w-3xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8 border-b border-border pb-4">
            <Settings className="h-6 w-6 text-coffee" />
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Configurações</h1>
              <p className="text-sm text-muted-foreground">Gerencie as informações públicas do seu perfil</p>
            </div>
          </div>

          {isLoadingProfile ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-coffee" />
            </div>
          ) : (
            <div className="border border-border rounded-sm bg-card overflow-hidden">
              {/* Form Title Banner */}
              <div className="bg-secondary/30 px-6 py-4 border-b border-border flex items-center gap-2">
                <UserIcon className="h-4 w-4 text-coffee" />
                <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  Editar Perfil
                </span>
              </div>

              {/* Form body */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {success && (
                  <div className="p-3 bg-success/10 border border-success/20 rounded-sm font-mono text-sm">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-foreground/80">{success}</span>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-sm font-mono text-sm">
                    <div className="flex items-start gap-2">
                      <span className="text-destructive select-none">$</span>
                      <div>
                        <span className="text-destructive">error:</span>{" "}
                        <span className="text-foreground/80">{error}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Name */}
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Nome Completo
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome exibido"
                    required
                    className="w-full px-3 py-2.5 bg-input border border-border rounded-sm text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-coffee focus:border-coffee transition-colors"
                  />
                </div>

                {/* Avatar URL */}
                <div className="space-y-2">
                  <label htmlFor="avatarUrl" className="text-sm font-medium">
                    URL da Imagem do Avatar
                  </label>
                  <input
                    id="avatarUrl"
                    type="url"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://exemplo.com/sua-foto.jpg"
                    className="w-full px-3 py-2.5 bg-input border border-border rounded-sm text-sm font-mono placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-coffee focus:border-coffee transition-colors"
                  />
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <label htmlFor="bio" className="text-sm font-medium">
                    Biografia (Bio)
                  </label>
                  <textarea
                    id="bio"
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    maxLength={1000}
                    placeholder="Fale um pouco sobre você, suas tecnologias favoritas, hobbies, etc."
                    className="w-full px-3 py-2.5 bg-input border border-border rounded-sm text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-coffee focus:border-coffee transition-colors resize-y min-h-[100px]"
                  />
                  <div className="text-xs text-muted-foreground text-right mt-1">
                    {bio.length}/1000
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                  <button
                    type="submit"
                    disabled={isPending}
                    className="px-4 py-2 bg-coffee text-accent-foreground font-medium rounded-sm hover:bg-coffee-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                  >
                    {isPending ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Salvando...
                      </span>
                    ) : (
                      "Salvar Alterações"
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
