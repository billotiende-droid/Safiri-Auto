"use client"

import { Button } from "@/components/ui/button"
import { LayoutGrid, CheckCircle, XCircle, Clock } from "lucide-react"
import type { Category } from "@/lib/api"

interface VehicleFiltersProps {
  categories: Category[]
  selectedCategory: number | null
  onCategoryChange: (categoryId: number | null) => void
  selectedStatus: string
  onStatusChange: (status: string) => void
}

export function VehicleFilters({
  categories,
  selectedCategory,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
}: VehicleFiltersProps) {
  const statuses = [
    { value: "", label: "All Status", icon: LayoutGrid },
    { value: "available", label: "Available", icon: CheckCircle },
    { value: "booked", label: "Booked", icon: Clock },
    { value: "inactive", label: "Inactive", icon: XCircle },
  ]

  return (
    <div className="bg-card border border-border rounded-xl p-4 mb-8">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Category Filter */}
        <div className="flex-1">
          <h3 className="text-sm font-medium text-foreground mb-3">Category</h3>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => onCategoryChange(null)}
              className={selectedCategory === null ? "bg-primary text-primary-foreground" : ""}
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category.category_id}
                variant={selectedCategory === category.category_id ? "default" : "outline"}
                size="sm"
                onClick={() => onCategoryChange(category.category_id)}
                className={selectedCategory === category.category_id ? "bg-primary text-primary-foreground" : ""}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Status Filter */}
        <div className="lg:border-l lg:border-border lg:pl-6">
          <h3 className="text-sm font-medium text-foreground mb-3">Status</h3>
          <div className="flex flex-wrap gap-2">
            {statuses.map((status) => (
              <Button
                key={status.value}
                variant={selectedStatus === status.value ? "default" : "outline"}
                size="sm"
                onClick={() => onStatusChange(status.value)}
                className={selectedStatus === status.value ? "bg-primary text-primary-foreground" : ""}
              >
                <status.icon className="w-4 h-4 mr-1" />
                {status.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
