"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: number
  name: string
  email: string
  phone_number: string
}

interface AuthContextType {
  user: User | null
  role: "user" | "owner" | "admin" | null
  token: string | null
  login: (user: User, role: "user" | "owner" | "admin", token: string) => void
  logout: () => void
  // undefined while initializing, boolean afterwards
  isAuthenticated: boolean | undefined
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<"user" | "owner" | "admin" | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem("safiri_user")
    const storedRole = localStorage.getItem("safiri_role")
    const storedToken = localStorage.getItem("safiri_token")
    if (storedUser && storedRole && storedToken) {
      setUser(JSON.parse(storedUser))
      setRole(storedRole as "user" | "owner" | "admin")
      setToken(storedToken)
    }
    setInitialized(true)
  }, [])

  const login = (user: User, role: "user" | "owner" | "admin", token: string) => {
    setUser(user)
    setRole(role)
    setToken(token)
    localStorage.setItem("safiri_user", JSON.stringify(user))
    localStorage.setItem("safiri_role", role)
    localStorage.setItem("safiri_token", token)
  }

  const logout = () => {
    setUser(null)
    setRole(null)
    setToken(null)
    localStorage.removeItem("safiri_user")
    localStorage.removeItem("safiri_role")
    localStorage.removeItem("safiri_token")
  }

  const isAuthenticated = initialized ? !!token : undefined

  return (
    <AuthContext.Provider value={{ user, role, token, login, logout, isAuthenticated }}>
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
