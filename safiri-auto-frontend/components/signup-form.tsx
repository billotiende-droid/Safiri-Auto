"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { authAPI } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Car, Mail, Lock, Phone, User, MapPin, Building, CreditCard, Loader2, Eye, EyeOff } from "lucide-react"

export function SignupForm() {
  const router = useRouter()
  const [role, setRole] = useState<"user" | "owner">("user")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    id_number: "",
    residence: "",
    password: "",
    confirmPassword: "",
    company_name: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setLoading(true)

    try {
      const response = await authAPI.signup({
        name: formData.name,
        email: formData.email,
        phone_number: formData.phone_number,
        id_number: formData.id_number,
        residence: formData.residence,
        password: formData.password,
        role: role,
        company_name: role === "owner" ? formData.company_name : undefined,
      })

      // Store token
      localStorage.setItem("safiri_token", response.token)
      localStorage.setItem("safiri_user", JSON.stringify(response.account))
      localStorage.setItem("safiri_role", response.role)

      router.push("/")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Car className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <CardDescription>Join Safiri Auto and start your journey</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Role Selection */}
          <div className="flex rounded-lg bg-accent p-1 mb-6">
            <button
              type="button"
              className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors ${
                role === "user" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
              }`}
              onClick={() => setRole("user")}
            >
              <User className="w-4 h-4 inline-block mr-2" />
              Rent a Car
            </button>
            <button
              type="button"
              className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors ${
                role === "owner" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
              }`}
              onClick={() => setRole("owner")}
            >
              <Building className="w-4 h-4 inline-block mr-2" />
              List My Car
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className="pl-10 bg-background"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 bg-background"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  name="phone_number"
                  type="tel"
                  placeholder="0722000000"
                  value={formData.phone_number}
                  onChange={handleChange}
                  className="pl-10 bg-background"
                  required
                />
              </div>
            </div>

            {/* ID Number */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">ID Number</label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  name="id_number"
                  type="text"
                  placeholder="12345678"
                  value={formData.id_number}
                  onChange={handleChange}
                  className="pl-10 bg-background"
                  required
                />
              </div>
            </div>

            {/* Residence */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Residence</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  name="residence"
                  type="text"
                  placeholder="Nairobi"
                  value={formData.residence}
                  onChange={handleChange}
                  className="pl-10 bg-background"
                  required
                />
              </div>
            </div>

            {/* Company Name (Owner only) */}
            {role === "owner" && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Company Name (Optional)</label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    name="company_name"
                    type="text"
                    placeholder="Safiri Motors"
                    value={formData.company_name}
                    onChange={handleChange}
                    className="pl-10 bg-background"
                  />
                </div>
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
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

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="pl-10 bg-background"
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            {error && <div className="bg-destructive/10 text-destructive rounded-lg p-3 text-sm">{error}</div>}

            {/* Submit Button */}
            <Button type="submit" className="w-full bg-primary text-primary-foreground" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating account...
                </>
              ) : (
                `Create ${role === "owner" ? "Owner" : "User"} Account`
              )}
            </Button>

            {/* Terms */}
            <p className="text-xs text-muted-foreground text-center">
              By signing up, you agree to our{" "}
              <a href="#" className="text-primary hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-primary hover:underline">
                Privacy Policy
              </a>
            </p>
          </form>

          {/* Login Link */}
          <div className="mt-6 pt-6 border-t border-border text-center">
            <p className="text-muted-foreground text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-primary font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
