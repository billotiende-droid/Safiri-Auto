"use client"

import { useState, useEffect } from "react"
import { CategoryCard } from "./category-card"
import { Loader2 } from "lucide-react"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api"

export type Category = {
  id: string
  name: string
  description: string
  icon: string
  vehicleCount: number
  priceRange: {
    min: number
    max: number
  }
  features: string[]
}

export function CategoriesList() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      // GET category list from your API
      const response = await fetch(`${API_BASE_URL}/categories`)

      if (!response.ok) {
        throw new Error("Failed to fetch categories")
      }

      const data = await response.json()
      setCategories(data)
    } catch (err) {
      console.error("Error fetching categories:", err)
      // Demo data for UI purposes
      setCategories(getDemoCategories())
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">{categories.length} categories available</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} onUpdate={fetchCategories} />
        ))}
      </div>
    </div>
  )
}

function getDemoCategories(): Category[] {
  return [
    {
      id: "1",
      name: "Sedan",
      description: "Comfortable and fuel-efficient cars perfect for city driving and daily commutes.",
      icon: "🚗",
      vehicleCount: 45,
      priceRange: { min: 35, max: 65 },
      features: ["5 Seats", "Automatic", "Fuel Efficient"],
    },
    {
      id: "2",
      name: "SUV",
      description: "Spacious and versatile vehicles ideal for families and outdoor adventures.",
      icon: "🚙",
      vehicleCount: 32,
      priceRange: { min: 55, max: 95 },
      features: ["7 Seats", "4WD Available", "High Clearance"],
    },
    {
      id: "3",
      name: "Luxury",
      description: "Premium vehicles with top-tier features and exceptional comfort.",
      icon: "💎",
      vehicleCount: 18,
      priceRange: { min: 85, max: 150 },
      features: ["Premium Interior", "Advanced Tech", "High Performance"],
    },
    {
      id: "4",
      name: "Van",
      description: "Large capacity vehicles perfect for group travel and cargo transport.",
      icon: "🚐",
      vehicleCount: 12,
      priceRange: { min: 65, max: 110 },
      features: ["8+ Seats", "Large Cargo Space", "Sliding Doors"],
    },
    {
      id: "5",
      name: "Sports",
      description: "High-performance vehicles designed for speed and driving excitement.",
      icon: "🏎️",
      vehicleCount: 8,
      priceRange: { min: 120, max: 250 },
      features: ["2 Seats", "High Speed", "Premium Sound"],
    },
    {
      id: "6",
      name: "Electric",
      description: "Eco-friendly electric vehicles with zero emissions and modern technology.",
      icon: "⚡",
      vehicleCount: 15,
      priceRange: { min: 45, max: 120 },
      features: ["Zero Emissions", "Fast Charging", "Silent Drive"],
    },
  ]
}
