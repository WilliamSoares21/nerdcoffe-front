"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { getAuthToken } from "./auth-actions"

interface User {
  id: string
  email: string
  name: string
  avatarUrl?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ 
  children, 
  initialSession = false,
  initialUser = null
}: { 
  children: ReactNode
  initialSession?: boolean
  initialUser?: User | null
}) {
  const [user, setUser] = useState<User | null>(initialUser)
  const [isAuthenticated, setIsAuthenticated] = useState(initialSession)
  const [isLoading, setIsLoading] = useState(false)

  // Sync state dynamically when server-side initial props change
  useEffect(() => {
    setIsAuthenticated(initialSession)
    setUser(initialUser)
  }, [initialSession, initialUser])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
