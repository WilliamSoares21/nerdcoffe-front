import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateReadingTime(text: string | null | undefined): number {
  if (!text) return 1
  // Strip HTML tags to count only actual text content words
  const cleanText = text.replace(/<[^>]*>/g, '')
  const words = cleanText.trim().split(/\s+/)
  const wordCount = words[0] === '' ? 0 : words.length
  return Math.max(1, Math.ceil(wordCount / 200))
}

export function formatRelativeTime(dateString: string | null | undefined): string {
  if (!dateString) return ""
  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffSecs = Math.floor(diffMs / 1000)
    const diffMins = Math.floor(diffSecs / 60)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffSecs < 60) {
      return "agora mesmo"
    } else if (diffMins < 60) {
      return `há ${diffMins} ${diffMins === 1 ? 'minuto' : 'minutos'}`
    } else if (diffHours < 24) {
      return `há ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`
    } else if (diffDays < 30) {
      return `há ${diffDays} ${diffDays === 1 ? 'dia' : 'dias'}`
    } else {
      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      })
    }
  } catch (e) {
    return dateString
  }
}
