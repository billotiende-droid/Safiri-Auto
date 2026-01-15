"use client"

import { Calendar, User, Mail, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Booking } from "./bookings-list"

type BookingCardProps = {
  booking: Booking
  onUpdate: () => void
}

export function BookingCard({ booking, onUpdate }: BookingCardProps) {
  const statusColors = {
    pending: "bg-amber-500/10 text-amber-700 border-amber-500/20",
    confirmed: "bg-green-500/10 text-green-700 border-green-500/20",
    completed: "bg-blue-500/10 text-blue-700 border-blue-500/20",
    cancelled: "bg-red-500/10 text-red-700 border-red-500/20",
  }

  const calculateDays = () => {
    const start = new Date(booking.startDate)
    const end = new Date(booking.endDate)
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  }

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-shadow">
      <div className="grid md:grid-cols-[200px_1fr] gap-6 p-6">
        {/* Vehicle Image */}
        <div className="relative aspect-video md:aspect-square rounded-lg overflow-hidden bg-muted">
          <img
            src={booking.vehicleImage || "/placeholder.svg"}
            alt={booking.vehicleName}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Booking Details */}
        <div className="flex flex-col">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-foreground mb-1">{booking.vehicleName}</h3>
              <p className="text-sm text-muted-foreground">Booking ID: {booking.id}</p>
            </div>
            <Badge className={statusColors[booking.status]} variant="outline">
              {booking.status}
            </Badge>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground">{booking.customerName}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground">{booking.customerEmail}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground">
                  {booking.startDate} to {booking.endDate}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground font-semibold">
                  ${booking.totalCost} ({calculateDays()} days)
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-auto">
            <Button variant="outline" size="sm">
              View Details
            </Button>
            {booking.status === "pending" && (
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Confirm Booking
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
