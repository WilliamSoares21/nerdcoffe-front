// TypeScript interfaces for backend data structures

export interface User {
  id: string
  email: string
  username: string
  avatar_url?: string
  created_at: string
}

export interface Article {
  id: string
  title: string
  slug: string
  excerpt?: string
  content?: string
  author: {
    id: string
    username: string
    avatarUrl?: string
  }
  tags?: string[]
  upvotes: number
  commentsCount: number
  readingTimeMinutes: number
  publishedAt: string
  isBookmarked?: boolean
}

export interface Tag {
  id: string
  name: string
  slug: string
  articles_count: number
  color?: string
}

export interface SponsorFormData {
  company_name: string
  contact_email: string
  website_url: string
  budget_range: string
  message: string
  newsletter_interest: boolean
}

export interface ApiResponseDto<T> {
  success: boolean
  message: string
  data: T
  timestamp: string
}

export interface PageResponseDto<T> {
  content: T[]
  pageNumber: number
  pageSize: number
  totalElements: number
  totalPages: number
  last: boolean
}

export interface AuthResponse {
  token: string
  user: User
}

// Feed/Hub specific types
export interface FeedFilters {
  tag?: string
  sort: 'recent' | 'trending' | 'top'
  time_range?: 'day' | 'week' | 'month' | 'all'
}

export interface SystemStatus {
  api: 'operational' | 'degraded' | 'down'
  database: 'operational' | 'degraded' | 'down'
  latency_ms: number
}
