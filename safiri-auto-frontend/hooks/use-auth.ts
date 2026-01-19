import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export function useAuth() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [role, setRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("safiri_token")
    const userStr = localStorage.getItem("safiri_user")
    const userRole = localStorage.getItem("safiri_role")

    if (token && userStr) {
      setIsAuthenticated(true)
      setUser(JSON.parse(userStr))
      setRole(userRole)
    }
    setLoading(false)
  }, [])

  const logout = () => {
    localStorage.removeItem("safiri_token")
    localStorage.removeItem("safiri_user")
    localStorage.removeItem("safiri_role")
    setIsAuthenticated(false)
    setUser(null)
    setRole(null)
    router.push("/login")
  }

  return { isAuthenticated, user, role, loading, logout }
}

export function useRequireAuth() {
  const router = useRouter()
  const { isAuthenticated, user, role, loading } = useAuth()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login")
    }
  }, [loading, isAuthenticated, router])

  return { isAuthenticated, user, role, loading }
}
