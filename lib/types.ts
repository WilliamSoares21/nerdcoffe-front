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
  summary?: string
  content?: string
  author: {
    id: string
    username: string
    avatarUrl?: string
  }
  tags?: string[]
  upvoteCount: number
  commentsCount: number
  readingTimeMinutes: number
  publishedAt?: string | null
  isBookmarked?: boolean
  userUpvoted?: boolean
  published?: boolean
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

export interface AuthCredentials {
  email: string
  password: string
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

export interface Comment {
  id: string | number
  content: string
  createdAt: string
  parentId?: string | number | null
  upvoteCount?: number
  userUpvoted?: boolean
  replies?: Comment[]
  author: {
    id: string | number
    username?: string
    email?: string
    name?: string
    avatarUrl?: string
    avatar_url?: string
  }
}

