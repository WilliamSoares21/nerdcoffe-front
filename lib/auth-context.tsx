"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  email: string
  name: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate checking for existing session
    const storedToken = typeof window !== "undefined" ? sessionStorage.getItem("auth_token") : null
    const storedUser = typeof window !== "undefined" ? sessionStorage.getItem("auth_user") : null
    
    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Demo: accept any valid email/password combo
    if (email && password.length >= 6) {
      const mockUser = {
        id: "usr_" + Math.random().toString(36).substr(2, 9),
        email,
        name: email.split("@")[0],
      }
      const mockToken = "tok_" + Math.random().toString(36).substr(2, 32)
      
      setUser(mockUser)
      setToken(mockToken)
      sessionStorage.setItem("auth_token", mockToken)
      sessionStorage.setItem("auth_user", JSON.stringify(mockUser))
      setIsLoading(false)
      return true
    }
    
    setIsLoading(false)
    return false
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    sessionStorage.removeItem("auth_token")
    sessionStorage.removeItem("auth_user")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        logout,
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
