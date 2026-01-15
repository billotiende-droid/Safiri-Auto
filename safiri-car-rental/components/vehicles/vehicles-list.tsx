"use client"

import { useState, useEffect } from "react"
import { VehicleCard } from "./vehicle-card"
import { Loader2 } from "lucide-react"

// API endpoint placeholders - replace with your actual API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api"

export type Vehicle = {
  id: string
  name: string
  category: string
  price: number
  image: string
  seats: number
  transmission: string
  fuel: string
  status: "available" | "rented" | "maintenance"
  rating: number
}

export function VehiclesList() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchVehicles()
  }, [])

  const fetchVehicles = async () => {
    try {
      setLoading(true)
      // GET vehicle list from your API
      const response = await fetch(`${API_BASE_URL}/vehicles`)

      if (!response.ok) {
        throw new Error("Failed to fetch vehicles")
      }

      const data = await response.json()
      setVehicles(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      // Demo data for UI purposes
      setVehicles(getDemoVehicles())
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteVehicle = async (id: string) => {
    try {
      // DELETE vehicle by id from your API
      const response = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete vehicle")
      }

      // Refresh list after delete
      fetchVehicles()
    } catch (err) {
      console.error("Error deleting vehicle:", err)
    }
  }

  const handleUpdateStatus = async (id: string, status: Vehicle["status"]) => {
    try {
      // PATCH vehicle status by id from your API
      const response = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        throw new Error("Failed to update vehicle status")
      }

      // Refresh list after update
      fetchVehicles()
    } catch (err) {
      console.error("Error updating vehicle:", err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error && vehicles.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Unable to load vehicles. Please try again later.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">{vehicles.length} vehicles available</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {vehicles.map((vehicle) => (
          <VehicleCard
            key={vehicle.id}
            vehicle={vehicle}
            onDelete={handleDeleteVehicle}
            onUpdateStatus={handleUpdateStatus}
          />
        ))}
      </div>
    </div>
  )
}

// Demo data for UI purposes
function getDemoVehicles(): Vehicle[] {
  return [
    {
      id: "1",
      name: "Toyota Camry",
      category: "Sedan",
      price: 45,
      image: "/toyota-camry.png",
      seats: 5,
      transmission: "Automatic",
      fuel: "Petrol",
      status: "available",
      rating: 4.5,
    },
    {
      id: "2",
      name: "Honda CR-V",
      category: "SUV",
      price: 65,
      image: "/honda-crv.png",
      seats: 7,
      transmission: "Automatic",
      fuel: "Hybrid",
      status: "available",
      rating: 4.8,
    },
    {
      id: "3",
      name: "BMW 3 Series",
      category: "Luxury",
      price: 95,
      image: "/bmw-3-series.png",
      seats: 5,
      transmission: "Automatic",
      fuel: "Petrol",
      status: "rented",
      rating: 4.9,
    },
    {
      id: "4",
      name: "Mazda CX-5",
      category: "SUV",
      price: 55,
      image: "/mazda-cx5.png",
      seats: 5,
      transmission: "Automatic",
      fuel: "Diesel",
      status: "available",
      rating: 4.6,
    },
  ]
}
