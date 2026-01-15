"use client"

import type React from "react"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api"

export function CreateCategoryForm() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "",
    priceRangeMin: "",
    priceRangeMax: "",
    features: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // POST category to your API
      const categoryData = {
        name: formData.name,
        description: formData.description,
        icon: formData.icon,
        priceRange: {
          min: Number.parseFloat(formData.priceRangeMin),
          max: Number.parseFloat(formData.priceRangeMax),
        },
        features: formData.features.split(",").map((f) => f.trim()),
      }

      const response = await fetch(`${API_BASE_URL}/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryData),
      })

      if (!response.ok) {
        throw new Error("Failed to create category")
      }

      const data = await response.json()
      console.log("[v0] Category created:", data)
      alert("Category created successfully!")

      // Reset form
      setFormData({
        name: "",
        description: "",
        icon: "",
        priceRangeMin: "",
        priceRangeMax: "",
        features: "",
      })
    } catch (err) {
      console.error("Error creating category:", err)
      alert("Failed to create category. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-foreground mb-6">Create New Category</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Category Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Sedan, SUV, Luxury"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe this vehicle category..."
            rows={3}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="icon">Icon (Emoji)</Label>
          <Input
            id="icon"
            value={formData.icon}
            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
            placeholder="🚗"
            maxLength={2}
            required
          />
          <p className="text-xs text-muted-foreground">Use an emoji to represent this category</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="priceRangeMin">Min Price (per day)</Label>
            <Input
              id="priceRangeMin"
              type="number"
              value={formData.priceRangeMin}
              onChange={(e) => setFormData({ ...formData, priceRangeMin: e.target.value })}
              placeholder="35"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="priceRangeMax">Max Price (per day)</Label>
            <Input
              id="priceRangeMax"
              type="number"
              value={formData.priceRangeMax}
              onChange={(e) => setFormData({ ...formData, priceRangeMax: e.target.value })}
              placeholder="85"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="features">Features (comma-separated)</Label>
          <Input
            id="features"
            value={formData.features}
            onChange={(e) => setFormData({ ...formData, features: e.target.value })}
            placeholder="5 Seats, Automatic, Fuel Efficient"
            required
          />
          <p className="text-xs text-muted-foreground">Separate features with commas</p>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating Category...
            </>
          ) : (
            "Create Category"
          )}
        </Button>
      </form>
    </Card>
  )
}
