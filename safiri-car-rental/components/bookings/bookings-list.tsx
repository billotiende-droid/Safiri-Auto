"use client"

import { useState, useEffect } from "react"
import { BookingCard } from "./booking-card"
import { Loader2 } from "lucide-react"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api"

export type Booking = {
  id: string
  vehicleId: string
  vehicleName: string
  vehicleImage: string
  customerName: string
  customerEmail: string
  startDate: string
  endDate: string
  totalCost: number
  status: "pending" | "confirmed" | "completed" | "cancelled"
  createdAt: string
}

export function BookingsList() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      // GET bookings from your API
      const response = await fetch(`${API_BASE_URL}/bookings`)

      if (!response.ok) {
        throw new Error("Failed to fetch bookings")
      }

      const data = await response.json()
      setBookings(data)
    } catch (err) {
      console.error("Error fetching bookings:", err)
      // Demo data for UI purposes
      setBookings(getDemoBookings())
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{bookings.length} total bookings</p>
      </div>

      <div className="grid gap-6">
        {bookings.map((booking) => (
          <BookingCard key={booking.id} booking={booking} onUpdate={fetchBookings} />
        ))}
      </div>
    </div>
  )
}

function getDemoBookings(): Booking[] {
  return [
    {
      id: "BK001",
      vehicleId: "1",
      vehicleName: "Toyota Camry",
      vehicleImage: "/toyota-camry.png",
      customerName: "John Doe",
      customerEmail: "john@example.com",
      startDate: "2026-02-01",
      endDate: "2026-02-05",
      totalCost: 180,
      status: "confirmed",
      createdAt: "2026-01-15",
    },
    {
      id: "BK002",
      vehicleId: "2",
      vehicleName: "Honda CR-V",
      vehicleImage: "/honda-crv.png",
      customerName: "Jane Smith",
      customerEmail: "jane@example.com",
      startDate: "2026-01-20",
      endDate: "2026-01-25",
      totalCost: 325,
      status: "pending",
      createdAt: "2026-01-14",
    },
    {
      id: "BK003",
      vehicleId: "3",
      vehicleName: "BMW 3 Series",
      vehicleImage: "/bmw-3-series.png",
      customerName: "Mike Johnson",
      customerEmail: "mike@example.com",
      startDate: "2026-01-10",
      endDate: "2026-01-13",
      totalCost: 285,
      status: "completed",
      createdAt: "2026-01-08",
    },
  ]
}
