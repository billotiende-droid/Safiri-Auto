"use client"

import type React from "react"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { AuthProvider, useAuth } from "@/lib/auth-context"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Car, User, Building2, Shield, Loader2 } from "lucide-react"
import { login as apiLogin, signup as apiSignup } from "@/lib/api"

function AuthContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()

  const initialMode = searchParams.get("mode") === "signup" ? "signup" : "login"
  const initialRole = searchParams.get("role") as "user" | "owner" | undefined

  const [mode, setMode] = useState<"login" | "signup">(initialMode)
  const [role, setRole] = useState<"user" | "owner" | "admin">(initialRole || "user")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Login form state
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")

  // Signup form state
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    phone_number: "",
    id_number: "",
    residence: "",
    password: "",
    company_name: "",
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Admin login check (demo)
    if (loginEmail === "admin@safiri.co.ke" && loginPassword === "admin123") {
      login({ id: 0, name: "Admin", email: "admin@safiri.co.ke", phone_number: "" }, "admin", "admin-token")
      router.push("/admin")
      return
    }

    try {
      const response = await apiLogin({ email: loginEmail, password: loginPassword })
      const data = await response.json()

      if (response.ok) {
        login(data.account, data.role, data.token)
        if (data.role === "owner") {
          router.push("/owner")
        } else if (data.role === "admin") {
          router.push("/admin")
        } else {
          router.push("/vehicles")
        }
      } else {
        setError(data.error || "Login failed")
      }
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await apiSignup({ ...signupData, role })
      const data = await response.json()

      if (response.ok) {
        login(data.account, data.role, data.token)
        if (data.role === "owner") {
          router.push("/owner")
        } else if (data.role === "admin") {
          router.push("/admin")
        } else {
          router.push("/vehicles")
        }
      } else {
        setError(data.error || "Signup failed")
      }
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="mx-auto max-w-lg px-4 py-12">
        <div className="text-center mb-8">
          <Car className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground">Welcome to Safiri</h1>
          <p className="text-muted-foreground mt-2">
            {mode === "login" ? "Sign in to your account" : "Create your account"}
          </p>
        </div>

        <Tabs value={mode} onValueChange={(v) => setMode(v as "login" | "signup")}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>Enter your credentials to access your account</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email or Phone</Label>
                    <Input
                      id="email"
                      type="text"
                      placeholder="you@example.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                  </div>

                  {error && <p className="text-sm text-destructive">{error}</p>}

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Sign In
                  </Button>
                </form>

                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground text-center">
                    <Shield className="inline h-4 w-4 mr-1" />
                    Admin login: admin@safiri.co.ke / admin123
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Create Account</CardTitle>
                <CardDescription>Choose your account type and fill in your details</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignup} className="space-y-4">
                  {/* Role Selection */}
                  <div className="space-y-3">
                    <Label>I want to</Label>
                    <RadioGroup value={role} onValueChange={(v) => setRole(v as "user" | "owner")}>
                      <div className="flex items-center space-x-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-muted transition-colors">
                        <RadioGroupItem value="user" id="user" />
                        <Label htmlFor="user" className="flex items-center gap-3 cursor-pointer flex-1">
                          <User className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-medium">Rent a Car</p>
                            <p className="text-sm text-muted-foreground">Browse and book vehicles</p>
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-muted transition-colors">
                        <RadioGroupItem value="owner" id="owner" />
                        <Label htmlFor="owner" className="flex items-center gap-3 cursor-pointer flex-1">
                          <Building2 className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-medium">List My Car</p>
                            <p className="text-sm text-muted-foreground">Earn by renting out your vehicle</p>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={signupData.name}
                        onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-email">Email</Label>
                        <Input
                          id="signup-email"
                          type="email"
                          value={signupData.email}
                          onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={signupData.phone_number}
                          onChange={(e) => setSignupData({ ...signupData, phone_number: e.target.value })}
                          placeholder="0712345678"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="id_number">ID Number</Label>
                        <Input
                          id="id_number"
                          value={signupData.id_number}
                          onChange={(e) => setSignupData({ ...signupData, id_number: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="residence">Residence</Label>
                        <Input
                          id="residence"
                          value={signupData.residence}
                          onChange={(e) => setSignupData({ ...signupData, residence: e.target.value })}
                          placeholder="e.g., Nairobi"
                          required
                        />
                      </div>
                    </div>

                    {role === "owner" && (
                      <div className="space-y-2">
                        <Label htmlFor="company">Company Name (Optional)</Label>
                        <Input
                          id="company"
                          value={signupData.company_name}
                          onChange={(e) => setSignupData({ ...signupData, company_name: e.target.value })}
                          placeholder="Your business name"
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        value={signupData.password}
                        onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  {error && <p className="text-sm text-destructive">{error}</p>}

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Create Account
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default function AuthPage() {
  return (
    <AuthProvider>
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        }
      >
        <AuthContent />
      </Suspense>
    </AuthProvider>
  )
}
