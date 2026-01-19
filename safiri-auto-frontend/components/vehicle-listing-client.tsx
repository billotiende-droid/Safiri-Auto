"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { vehicleAPI, categoryAPI, type Vehicle, type Category } from "@/lib/api"
import { VehicleCard } from "@/components/vehicle-card"
import { VehicleFilters } from "@/components/vehicle-filters"
import { Input } from "@/components/ui/input"
import { Search, Car } from "lucide-react"



export function VehicleListingClient() {
  const searchParams = useSearchParams()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<string>("available")

  useEffect(() => {
    async function fetchData() {
      try {
        const [vehiclesData, categoriesData] = await Promise.all([
          vehicleAPI.getAll({ status: selectedStatus || undefined, category_id: selectedCategory || undefined }),
          categoryAPI.getAll(),
        ])
        setVehicles(vehiclesData)
        setCategories(categoriesData)
      } catch (error) {
        console.error("Failed to fetch data:", error)
        throw error
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [selectedCategory, selectedStatus])

  // Apply client-side search filter
  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch =
      searchQuery === "" ||
      vehicle.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = selectedCategory === null || vehicle.category_id === selectedCategory
    const matchesStatus = selectedStatus === "" || vehicle.status === selectedStatus

    return matchesSearch && matchesCategory && matchesStatus
  })

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Browse Vehicles</h1>
          <p className="text-muted-foreground mt-1">{filteredVehicles.length} vehicles available for rent</p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by brand or model..."
            className="pl-10 h-11 bg-card"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Filters */}
      <VehicleFilters
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
      />

      {/* Vehicle Grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-card rounded-2xl overflow-hidden border border-border animate-pulse">
              <div className="aspect-[4/3] bg-muted" />
              <div className="p-5 space-y-3">
                <div className="h-6 w-32 bg-muted rounded" />
                <div className="h-4 w-24 bg-muted rounded" />
                <div className="h-8 w-20 bg-muted rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredVehicles.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
            <Car className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">No vehicles found</h3>
          <p className="text-muted-foreground">Try adjusting your filters or search query</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} categories={categories} />
          ))}
        </div>
      )}
    </div>
  )
}
