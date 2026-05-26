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
    avatar_url?: string
  }
  tags: string[]
  upvotes: number
  comments_count: number
  reading_time_minutes: number
  published_at: string
  is_bookmarked?: boolean
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

export interface ApiResponse<T> {
  data: T
  meta?: {
    total: number
    page: number
    per_page: number
  }
}

export interface ApiError {
  status: number
  code: string
  message: string
}

export interface AuthCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  token: string
  expires_at: string
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
