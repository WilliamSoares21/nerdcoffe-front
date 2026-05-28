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
