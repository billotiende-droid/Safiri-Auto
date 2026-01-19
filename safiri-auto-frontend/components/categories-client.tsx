"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { categoryAPI, type Category } from "@/lib/api"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, LayoutGrid, Loader2, CheckCircle, LogIn } from "lucide-react"
import Link from "next/link"

export function CategoriesClient() {
  const router = useRouter()
  const { isAuthenticated, loading: authLoading } = useAuth()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [newCategory, setNewCategory] = useState("")
  const [adding, setAdding] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await categoryAPI.getAll()
        setCategories(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch categories")
        setCategories([])
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newCategory.trim()) {
      setError("Category name is required")
      return
    }

    setAdding(true)
    setError(null)

    try {
      const created = await categoryAPI.create(newCategory.trim())
      setCategories((prev) => [...prev, created])
      setNewCategory("")
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create category")
    } finally {
      setAdding(false)
    }
  }

  // Category icons mapping
  const categoryIcons: Record<string, string> = {
    Sedan: "/modern-sedan-car-white-background.jpg",
    SUV: "/suv-4x4-vehicle-white-background.jpg",
    Hatchback: "/compact-hatchback-car-white-background.jpg",
    Van: "/passenger-van-vehicle-white-background.jpg",
    Pickup: "/pickup-truck-white-background.jpg",
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Vehicle Categories</h1>
        <p className="text-muted-foreground mt-1">Manage vehicle categories for your fleet</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Categories List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LayoutGrid className="w-5 h-5 text-primary" />
                All Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-accent rounded-xl p-4 animate-pulse">
                      <div className="w-12 h-12 bg-muted rounded-lg mb-3" />
                      <div className="h-5 w-24 bg-muted rounded" />
                    </div>
                  ))}
                </div>
              ) : categories.length === 0 ? (
                <div className="text-center py-12">
                  <LayoutGrid className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No categories yet</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {categories.map((category) => (
                    <Link
                      key={category.category_id}
                      href={`/vehicles?category=${category.name}`}
                      className="group bg-accent hover:bg-accent/80 rounded-xl p-4 transition-all hover:shadow-md border border-transparent hover:border-primary/20"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-12 rounded-lg overflow-hidden bg-card">
                          <img
                            src={categoryIcons[category.name] || "/placeholder.svg?height=48&width=64&query=car"}
                            alt={category.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {category.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">View vehicles →</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Add Category Form */}
        <div>
          {!authLoading && !isAuthenticated ? (
            <Card className="border-primary/30 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <LogIn className="w-5 h-5" />
                  Sign In Required
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-foreground">
                  You need to be logged in to add categories.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <Link href="/login">
                    <Button className="w-full bg-primary text-primary-foreground">Sign In</Button>
                  </Link>
                  <Link href="/signup">
                    <Button className="w-full border border-primary text-primary" variant="outline">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-primary" />
                  Add New Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddCategory} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Category Name</label>
                    <Input
                      type="text"
                      placeholder="e.g., Luxury, Sports Car"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="bg-background"
                    />
                  </div>

                  {error && <div className="bg-destructive/10 text-destructive rounded-lg p-3 text-sm">{error}</div>}

                  {success && (
                    <div className="bg-secondary/10 text-secondary rounded-lg p-3 text-sm flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Category added successfully!
                    </div>
                  )}

                  <Button type="submit" className="w-full bg-primary text-primary-foreground" disabled={adding}>
                    {adding ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Category
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-3">Popular categories:</p>
                  <div className="flex flex-wrap gap-2">
                    {["Luxury", "Sports", "Electric", "Convertible"].map((cat) => (
                      <Button
                        key={cat}
                        variant="outline"
                        size="sm"
                        onClick={() => setNewCategory(cat)}
                        disabled={categories.some((c) => c.name.toLowerCase() === cat.toLowerCase())}
                      >
                        {cat}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
