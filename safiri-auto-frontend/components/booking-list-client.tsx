"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { bookingAPI, type Booking } from "@/lib/api"
import { useRequireAuth } from "@/hooks/use-auth"
import { BookingCard } from "@/components/booking-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Clock, CheckCircle, XCircle, LayoutGrid, LogIn } from "lucide-react"
import Link from "next/link"

export function BookingListClient() {
  const router = useRouter()
  const { isAuthenticated, loading: authLoading } = useRequireAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<string>("")

  useEffect(() => {
    if (authLoading) return

    async function fetchBookings() {
      try {
        const data = await bookingAPI.getAll()
        setBookings(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch bookings")
        setBookings([])
      } finally {
        setLoading(false)
      }
    }

    if (isAuthenticated) {
      fetchBookings()
    }
  }, [authLoading, isAuthenticated])

  const handleStatusUpdate = async (bookingId: number, newStatus: string) => {
    try {
      await bookingAPI.updateStatus(bookingId, newStatus)
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus as Booking["status"] } : b)),
      )
    } catch (error) {
      console.error("Failed to update booking status:", error)
    }
  }

  const filteredBookings = selectedStatus ? bookings.filter((b) => b.status === selectedStatus) : bookings

  const statusFilters = [
    { value: "", label: "All Bookings", icon: LayoutGrid },
    { value: "pending", label: "Pending", icon: Clock },
    { value: "confirmed", label: "Confirmed", icon: CheckCircle },
    { value: "completed", label: "Completed", icon: CheckCircle },
    { value: "cancelled", label: "Cancelled", icon: XCircle },
  ]

  if (authLoading) {
    return null
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-primary/30 bg-primary/5 text-center py-16">
          <CardContent>
            <LogIn className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">Sign In Required</h3>
            <p className="text-muted-foreground mb-6">
              Please sign in to view your bookings
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/login">
                <Button className="bg-primary text-primary-foreground">Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button variant="outline">Create Account</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-destructive/10 border border-destructive rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-destructive mb-2">Failed to Load Bookings</h3>
          <p className="text-destructive/80">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">My Bookings</h1>
        <p className="text-muted-foreground mt-1">{loading ? "Loading..." : `${filteredBookings.length} bookings found`}</p>
      </div>

      {/* Status Filters */}
      <div className="bg-card border border-border rounded-xl p-4 mb-8">
        <div className="flex flex-wrap gap-2">
          {statusFilters.map((filter) => (
            <Button
              key={filter.value}
              variant={selectedStatus === filter.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedStatus(filter.value)}
              className={selectedStatus === filter.value ? "bg-primary text-primary-foreground" : ""}
            >
              <filter.icon className="w-4 h-4 mr-2" />
              {filter.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-6 animate-pulse">
              <div className="flex gap-4">
                <div className="w-32 h-24 bg-muted rounded-lg" />
                <div className="flex-1 space-y-3">
                  <div className="h-6 w-48 bg-muted rounded" />
                  <div className="h-4 w-32 bg-muted rounded" />
                  <div className="h-4 w-24 bg-muted rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
            <Calendar className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">No bookings found</h3>
          <p className="text-muted-foreground">
            {selectedStatus ? "No bookings with this status" : "You haven't made any bookings yet"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} onStatusUpdate={handleStatusUpdate} />
          ))}
        </div>
      )}
    </div>
  )
}
