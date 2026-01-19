"use client"

import { useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Calendar, Car, CreditCard, MoreVertical, CheckCircle, XCircle, Eye } from "lucide-react"
import type { Booking } from "@/lib/api"

interface BookingCardProps {
  booking: Booking
  onStatusUpdate: (bookingId: number, newStatus: string) => void
}



export function BookingCard({ booking, onStatusUpdate }: BookingCardProps) {
  const [updating, setUpdating] = useState(false)

  const statusConfig: Record<string, { color: string; label: string; allowedTransitions: string[] }> = {
    pending: {
      color: "bg-chart-4/20 text-chart-4 border-chart-4/30",
      label: "Pending",
      allowedTransitions: ["confirmed", "cancelled"],
    },
    confirmed: {
      color: "bg-primary/20 text-primary border-primary/30",
      label: "Confirmed",
      allowedTransitions: ["completed", "cancelled"],
    },
    completed: {
      color: "bg-secondary/20 text-secondary border-secondary/30",
      label: "Completed",
      allowedTransitions: [],
    },
    cancelled: {
      color: "bg-destructive/20 text-destructive border-destructive/30",
      label: "Cancelled",
      allowedTransitions: [],
    },
  }

  const status = statusConfig[booking.status] || statusConfig.pending

  const handleStatusChange = async (newStatus: string) => {
    setUpdating(true)
    await onStatusUpdate(booking.id, newStatus)
    setUpdating(false)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-KE", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/30 transition-colors">
      <div className="flex flex-col md:flex-row">
        {/* Vehicle Image */}
        <div className="w-full md:w-48 h-32 md:h-auto relative overflow-hidden bg-accent flex items-center justify-center">
          <Car className="w-12 h-12 text-muted-foreground" />
        </div>

        {/* Content */}
        <div className="flex-1 p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            {/* Main Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold text-foreground">
                  Vehicle Booking #{booking.id}
                </h3>
                <Badge className={`${status.color} border`}>{status.label}</Badge>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {formatDate(booking.start_date)} - {formatDate(booking.end_date)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Car className="w-4 h-4" />
                  <span>Vehicle #{booking.vehicle_id}</span>
                </div>
              </div>

              {/* Total Amount */}
              <div className="mt-4 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-primary" />
                <span className="font-semibold text-foreground">
                  KES {(booking.total_amount || booking.total_cost || 0).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Link href={`/bookings/${booking.id}`}>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </Button>
              </Link>

              {status.allowedTransitions.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" disabled={updating}>
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {status.allowedTransitions.includes("confirmed") && (
                      <DropdownMenuItem onClick={() => handleStatusChange("confirmed")}>
                        <CheckCircle className="w-4 h-4 mr-2 text-secondary" />
                        Confirm Booking
                      </DropdownMenuItem>
                    )}
                    {status.allowedTransitions.includes("completed") && (
                      <DropdownMenuItem onClick={() => handleStatusChange("completed")}>
                        <CheckCircle className="w-4 h-4 mr-2 text-secondary" />
                        Mark Completed
                      </DropdownMenuItem>
                    )}
                    {status.allowedTransitions.includes("cancelled") && (
                      <DropdownMenuItem onClick={() => handleStatusChange("cancelled")} className="text-destructive">
                        <XCircle className="w-4 h-4 mr-2" />
                        Cancel Booking
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {booking.status === "confirmed" && (
                <Link href={`/payments?booking_id=${booking.id}`}>
                  <Button size="sm" className="bg-primary text-primary-foreground">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Pay Now
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
