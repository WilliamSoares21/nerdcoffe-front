import { z } from "zod"

// User Schema
export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  username: z.string(),
  avatarUrl: z.string().optional(),
})

// Author Schema (nested in Article)
export const AuthorSchema = z.object({
  id: z.coerce.string(),
  name: z.string().optional(),
  username: z.string().optional(),
  email: z.string().email().optional(),
  avatarUrl: z.string().optional().nullable(),
})

// Article Schema
export const ArticleSchema = z.object({
  id: z.coerce.string(),
  title: z.string(),
  excerpt: z.string().optional().nullable(),
  content: z.string().optional().nullable(),
  author: AuthorSchema,
  tags: z.array(z.string()).default([]).or(z.null().transform(() => [])), 
  upvotes: z.number().default(0).or(z.null().transform(() => 0)),
  upvoteCount: z.number().default(0).or(z.null().transform(() => 0)),
  commentsCount: z.number().default(0).or(z.null().transform(() => 0)),
  readingTimeMinutes: z.number().default(0).or(z.null().transform(() => 0)),
  publishedAt: z.string().nullable().optional().default(null),
  isBookmarked: z.boolean().optional().default(false),
  isUpvoted: z.boolean().optional().default(false),
})

// Generic ApiResponse Wrapper Schema
export function createApiResponseSchema<T extends z.ZodTypeAny>(dataSchema: T) {
  return z.object({
    success: z.boolean(),
    message: z.string(),
    data: dataSchema,
    timestamp: z.string(),
  })
}

// PageResponse Schema
export function createPageResponseSchema<T extends z.ZodTypeAny>(itemSchema: T) {
  return z.object({
    content: z.array(itemSchema).default([]),
    currentPage: z.number().optional().default(0),
    totalElements: z.number().optional().default(0),
    totalPages: z.number().optional().default(0),
  })
}

// Export Types derived from Schemas
export type Article = z.infer<typeof ArticleSchema>
export type User = z.infer<typeof UserSchema>
