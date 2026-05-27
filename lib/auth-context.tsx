"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { getAuthToken } from "./auth-actions"

interface User {
  id: string
  email: string
  name: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ 
  children, 
  initialSession = false 
}: { 
  children: ReactNode
  initialSession?: boolean
}) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(initialSession)
  const [isLoading, setIsLoading] = useState(!initialSession)

  useEffect(() => {
    async function checkAuth() {
      // If we already have initialSession, we might still want to fetch user data
      // but we don't necessarily need to re-validate the token immediately if it's already there
      try {
        const token = await getAuthToken()
        
        if (token) {
          setIsAuthenticated(true)
          const storedUser = typeof window !== "undefined" ? sessionStorage.getItem("auth_user") : null
          if (storedUser) {
            setUser(JSON.parse(storedUser))
          }
        } else {
          setIsAuthenticated(false)
          setUser(null)
        }
      } catch (error) {
        console.error("Failed to check auth status:", error)
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }
    
    checkAuth()
  }, [])

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
