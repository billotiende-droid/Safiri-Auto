"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, Car, Calendar, CreditCard, LayoutGrid, User, LogOut } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export function Header() {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [role, setRole] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("safiri_token")
    const userStr = localStorage.getItem("safiri_user")
    const userRole = localStorage.getItem("safiri_role")

    if (token && userStr) {
      setIsAuthenticated(true)
      setUser(JSON.parse(userStr))
      setRole(userRole)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("safiri_token")
    localStorage.removeItem("safiri_user")
    localStorage.removeItem("safiri_role")
    setIsAuthenticated(false)
    setUser(null)
    setRole(null)
    router.push("/login")
  }

  const publicNavLinks = [
    { href: "/vehicles", label: "Vehicles", icon: Car },
  ]

  const protectedNavLinks = [
    { href: "/bookings", label: "Bookings", icon: Calendar },
    { href: "/payments", label: "Payments", icon: CreditCard },
  ]

  const navLinks = isAuthenticated ? [...publicNavLinks, ...protectedNavLinks] : publicNavLinks

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Car className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl text-foreground">Safiri Auto</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-medium"
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-accent text-sm">
                  <User className="w-4 h-4" />
                  <span className="font-medium">{user?.name}</span>
                </div>
                {role === "owner" ? (
                  <Link href="/admin/dashboard">
                    <Button variant="outline" className="text-foreground">
                      Dashboard
                    </Button>
                  </Link>
                ) : (
                  <Link href="/dashboard">
                    <Button variant="outline" className="text-foreground">
                      Dashboard
                    </Button>
                  </Link>
                )}
                <Button variant="ghost" onClick={handleLogout} className="text-foreground">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-foreground">
                    <User className="w-4 h-4 mr-2" />
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Sign Up</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
            {mobileMenuOpen ? <X className="w-6 h-6 text-foreground" /> : <Menu className="w-6 h-6 text-foreground" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 px-4 py-3 text-foreground hover:bg-accent rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <link.icon className="w-5 h-5" />
                  {link.label}
                </Link>
              ))}
              <div className="flex gap-2 px-4 pt-4 border-t border-border mt-2 flex-col">
                {isAuthenticated ? (
                  <>
                    {role === "owner" ? (
                      <Link href="/admin/dashboard" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full bg-transparent">
                          Owner Dashboard
                        </Button>
                      </Link>
                    ) : (
                      <Link href="/dashboard" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full bg-transparent">
                          User Dashboard
                        </Button>
                      </Link>
                    )}
                    <Button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="w-full bg-destructive text-destructive-foreground">
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full bg-transparent">
                        Login
                      </Button>
                    </Link>
                    <Link href="/signup" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full bg-primary">Sign Up</Button>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
