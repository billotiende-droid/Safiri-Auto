"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { authAPI } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Car, Mail, Lock, Phone, Loader2, Eye, EyeOff } from "lucide-react"

export function LoginForm() {
  const router = useRouter()
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [usePhone, setUsePhone] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const credentials = usePhone ? { phone_number: identifier, password } : { email: identifier, password }

      const response = await authAPI.login(credentials)

      // Store token (in a real app, use secure storage)
      localStorage.setItem("safiri_token", response.token)
      localStorage.setItem("safiri_user", JSON.stringify(response.account))
      localStorage.setItem("safiri_role", response.role)

      // Redirect based on role
      if (response.role === "owner") {
        router.push("/admin/dashboard")
      } else {
        router.push("/dashboard")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed. Please check your credentials.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Car className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>Sign in to your Safiri Auto account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Toggle Email/Phone */}
            <div className="flex rounded-lg bg-accent p-1">
              <button
                type="button"
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  !usePhone ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                }`}
                onClick={() => setUsePhone(false)}
              >
                Email
              </button>
              <button
                type="button"
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  usePhone ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                }`}
                onClick={() => setUsePhone(true)}
              >
                Phone
              </button>
            </div>

            {/* Identifier Input */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {usePhone ? "Phone Number" : "Email Address"}
              </label>
              <div className="relative">
                {usePhone ? (
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                ) : (
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                )}
                <Input
                  type={usePhone ? "tel" : "email"}
                  placeholder={usePhone ? "0722000000" : "you@example.com"}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="pl-10 bg-background"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 bg-background"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && <div className="bg-destructive/10 text-destructive rounded-lg p-3 text-sm">{error}</div>}

            {/* Submit Button */}
            <Button type="submit" className="w-full bg-primary text-primary-foreground" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>

            {/* Forgot Password */}
            <div className="text-center">
              <a href="#" className="text-sm text-primary hover:underline">
                Forgot your password?
              </a>
            </div>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 pt-6 border-t border-border text-center">
            <p className="text-muted-foreground text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-primary font-medium hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
