"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  Coffee,
  Shield, 
  CheckCircle2, 
  AlertCircle, 
  Send,
  Building2,
  Mail,
  Globe,
  MessageSquare,
  DollarSign
} from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { cn } from "@/lib/utils"
import type { SponsorFormData } from "@/lib/types"

type FormState = "idle" | "loading" | "success" | "error"

interface FormErrors {
  company_name?: string
  contact_email?: string
  website_url?: string
  budget_range?: string
  message?: string
}

const budgetOptions = [
  { value: "", label: "Selecione uma faixa" },
  { value: "1k-5k", label: "R$ 1.000 - R$ 5.000 / mês" },
  { value: "5k-10k", label: "R$ 5.000 - R$ 10.000 / mês" },
  { value: "10k-25k", label: "R$ 10.000 - R$ 25.000 / mês" },
  { value: "25k+", label: "R$ 25.000+ / mês" },
]

export default function SponsorsPage() {
  const [formState, setFormState] = useState<FormState>("idle")
  const [formData, setFormData] = useState<SponsorFormData>({
    company_name: "",
    contact_email: "",
    website_url: "",
    budget_range: "",
    message: "",
    newsletter_interest: true,
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [submitError, setSubmitError] = useState<string | null>(null)

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case "company_name":
        return value.length < 2 ? "Nome da empresa é obrigatório" : undefined
      case "contact_email":
        return !value.includes("@") ? "Email inválido" : undefined
      case "website_url":
        return value.length > 0 && !value.includes(".") ? "URL inválida" : undefined
      case "budget_range":
        return !value ? "Selecione uma faixa de orçamento" : undefined
      case "message":
        return value.length < 20 ? "Mensagem muito curta (mín. 20 caracteres)" : undefined
      default:
        return undefined
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    
    setFormData((prev) => ({ 
      ...prev, 
      [name]: type === "checkbox" ? checked : value 
    }))
    
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }))
    }
  }

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)
    
    // Validate all fields
    const newErrors: FormErrors = {}
    let hasErrors = false
    
    const fieldsToValidate: (keyof SponsorFormData)[] = [
      "company_name", "contact_email", "website_url", "budget_range", "message"
    ]
    
    fieldsToValidate.forEach((key) => {
      const error = validateField(key, formData[key] as string)
      if (error) {
        newErrors[key as keyof FormErrors] = error
        hasErrors = true
      }
    })
    
    setErrors(newErrors)
    setTouched({
      company_name: true,
      contact_email: true,
      website_url: true,
      budget_range: true,
      message: true,
    })
    
    if (hasErrors) return
    
    setFormState("loading")
    
    // Simulate POST to /api/v1/sponsors
    await new Promise((resolve) => setTimeout(resolve, 1200))
    
    // Simulate success (95% chance) or error (5% chance)
    if (Math.random() > 0.05) {
      setFormState("success")
    } else {
      setFormState("error")
      setSubmitError("Erro de conexão. Tente novamente.")
    }
  }

  const resetForm = () => {
    setFormState("idle")
    setFormData({
      company_name: "",
      contact_email: "",
      website_url: "",
      budget_range: "",
      message: "",
      newsletter_interest: true,
    })
    setTouched({})
    setErrors({})
    setSubmitError(null)
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <main className="lg:pl-64">
        <div className="max-w-4xl mx-auto px-4 py-8 pt-20 lg:pt-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-coffee mb-2">
              <Coffee className="h-4 w-4" />
              <span className="font-mono text-xs uppercase tracking-wider">Parcerias</span>
            </div>
            <h1 className="text-2xl font-semibold mb-2">Patrocine o morning.dev</h1>
            <p className="text-muted-foreground">
              Alcance milhares de desenvolvedores brasileiros com nosso newsletter diário.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <div className="border border-border rounded-sm overflow-hidden">
                <div className="bg-secondary/30 px-5 py-3 border-b border-border">
                  <div className="flex items-center gap-2">
                    <Send className="h-4 w-4 text-coffee" />
                    <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                      Formulário de Contato
                    </span>
                  </div>
                </div>

                {formState === "success" ? (
                  <div className="p-8 text-center">
                    <CheckCircle2 className="h-12 w-12 text-success mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Mensagem Enviada</h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      Recebemos sua proposta. Nossa equipe entrará em contato em até 48h úteis.
                    </p>
                    <button
                      onClick={resetForm}
                      className="text-sm text-coffee hover:text-coffee-light transition-colors"
                    >
                      Enviar outra mensagem
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="p-5 space-y-5">
                    {/* Submit Error */}
                    {submitError && (
                      <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-sm font-mono text-sm">
                        <div className="flex items-start gap-2">
                          <span className="text-destructive select-none">$</span>
                          <div>
                            <span className="text-destructive">error</span>
                            <span className="text-muted-foreground">:</span>{" "}
                            <span className="text-foreground/80">{submitError}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="grid sm:grid-cols-2 gap-5">
                      {/* Company Name */}
                      <div className="space-y-2">
                        <label htmlFor="company_name" className="flex items-center gap-1.5 text-sm font-medium">
                          <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                          Empresa
                        </label>
                        <input
                          id="company_name"
                          name="company_name"
                          type="text"
                          value={formData.company_name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Acme Inc."
                          className={cn(
                            "w-full px-3 py-2.5 bg-input border rounded-sm text-sm font-mono placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-coffee focus:border-coffee transition-colors",
                            errors.company_name && touched.company_name ? "border-destructive" : "border-border"
                          )}
                        />
                        {errors.company_name && touched.company_name && (
                          <p className="text-xs text-destructive flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.company_name}
                          </p>
                        )}
                      </div>

                      {/* Email */}
                      <div className="space-y-2">
                        <label htmlFor="contact_email" className="flex items-center gap-1.5 text-sm font-medium">
                          <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                          Email
                        </label>
                        <input
                          id="contact_email"
                          name="contact_email"
                          type="email"
                          value={formData.contact_email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="contato@empresa.com"
                          className={cn(
                            "w-full px-3 py-2.5 bg-input border rounded-sm text-sm font-mono placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-coffee focus:border-coffee transition-colors",
                            errors.contact_email && touched.contact_email ? "border-destructive" : "border-border"
                          )}
                        />
                        {errors.contact_email && touched.contact_email && (
                          <p className="text-xs text-destructive flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.contact_email}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      {/* Website */}
                      <div className="space-y-2">
                        <label htmlFor="website_url" className="flex items-center gap-1.5 text-sm font-medium">
                          <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                          Website
                        </label>
                        <input
                          id="website_url"
                          name="website_url"
                          type="url"
                          value={formData.website_url}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="https://empresa.com"
                          className={cn(
                            "w-full px-3 py-2.5 bg-input border rounded-sm text-sm font-mono placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-coffee focus:border-coffee transition-colors",
                            errors.website_url && touched.website_url ? "border-destructive" : "border-border"
                          )}
                        />
                        {errors.website_url && touched.website_url && (
                          <p className="text-xs text-destructive flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.website_url}
                          </p>
                        )}
                      </div>

                      {/* Budget Range */}
                      <div className="space-y-2">
                        <label htmlFor="budget_range" className="flex items-center gap-1.5 text-sm font-medium">
                          <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                          Orçamento mensal
                        </label>
                        <select
                          id="budget_range"
                          name="budget_range"
                          value={formData.budget_range}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={cn(
                            "w-full px-3 py-2.5 bg-input border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-coffee focus:border-coffee transition-colors",
                            errors.budget_range && touched.budget_range ? "border-destructive" : "border-border",
                            !formData.budget_range && "text-muted-foreground"
                          )}
                        >
                          {budgetOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        {errors.budget_range && touched.budget_range && (
                          <p className="text-xs text-destructive flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.budget_range}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                      <label htmlFor="message" className="flex items-center gap-1.5 text-sm font-medium">
                        <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
                        Mensagem
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Descreva seus objetivos com o patrocínio..."
                        className={cn(
                          "w-full px-3 py-2.5 bg-input border rounded-sm text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-coffee focus:border-coffee transition-colors resize-none",
                          errors.message && touched.message ? "border-destructive" : "border-border"
                        )}
                      />
                      {errors.message && touched.message && (
                        <p className="text-xs text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.message}
                        </p>
                      )}
                    </div>

                    {/* Newsletter Interest */}
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="newsletter_interest"
                        checked={formData.newsletter_interest}
                        onChange={handleChange}
                        className="mt-1 h-4 w-4 rounded-sm border-border bg-input text-coffee focus:ring-coffee focus:ring-offset-0"
                      />
                      <span className="text-sm text-muted-foreground">
                        Tenho interesse específico em patrocinar o newsletter diário
                      </span>
                    </label>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={formState === "loading"}
                      className="w-full px-4 py-3 bg-coffee text-accent-foreground font-medium rounded-sm hover:bg-coffee-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                    >
                      {formState === "loading" ? (
                        <>
                          <span className="h-4 w-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          Enviar proposta
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-6">
              {/* Privacy */}
              <div className="border border-border rounded-sm p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="h-4 w-4 text-coffee" />
                  <h3 className="font-medium">Privacidade</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Temos um firme compromisso com a privacidade e a não comercialização de dados de nossos usuários e parceiros.
                </p>
              </div>

              {/* Contact */}
              <div className="text-center text-sm text-muted-foreground">
                <p>Dúvidas? Entre em contato:</p>
                <a href="mailto:sponsors@morning.dev" className="text-coffee hover:text-coffee-light transition-colors">
                  sponsors@morning.dev
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
