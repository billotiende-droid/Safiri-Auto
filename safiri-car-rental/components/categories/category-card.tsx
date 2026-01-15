"use client"

import { Car, DollarSign, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Category } from "./categories-list"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api"

type CategoryCardProps = {
  category: Category
  onUpdate: () => void
}

export function CategoryCard({ category, onUpdate }: CategoryCardProps) {
  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete the ${category.name} category?`)) {
      return
    }

    try {
      // DELETE category from your API
      const response = await fetch(`${API_BASE_URL}/categories/${category.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete category")
      }

      onUpdate()
    } catch (err) {
      console.error("Error deleting category:", err)
      alert("Failed to delete category. Please try again.")
    }
  }

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-shadow group">
      <div className="bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 p-8">
        <div className="text-6xl mb-4">{category.icon}</div>
        <h3 className="text-2xl font-bold text-foreground mb-2">{category.name}</h3>
      </div>

      <div className="p-6">
        <p className="text-sm text-muted-foreground leading-relaxed mb-6">{category.description}</p>

        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Car className="w-4 h-4" />
              <span>Vehicles</span>
            </div>
            <span className="font-semibold text-foreground">{category.vehicleCount}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <DollarSign className="w-4 h-4" />
              <span>Price Range</span>
            </div>
            <span className="font-semibold text-foreground">
              ${category.priceRange.min} - ${category.priceRange.max}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {category.features.map((feature, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {feature}
            </Badge>
          ))}
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 bg-transparent">
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            className="text-destructive hover:text-destructive bg-transparent"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
