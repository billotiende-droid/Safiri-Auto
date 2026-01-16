"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AuthProvider, useAuth } from "@/lib/auth-context"
import { Navbar } from "@/components/navbar"
import { VehicleCard } from "@/components/vehicle-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Car,
  CreditCard,
  Calendar,
  Loader2,
  CheckCircle,
  Clock,
  XCircle,
  Shield,
  TrendingUp,
  AlertCircle,
} from "lucide-react"
import { getVehicles, getBookings, getPayments, updateVehicle, updateBooking } from "@/lib/api"

interface Vehicle {
  id?: number
  owner_id: number
  category_id: number
  registration_number: string
  brand: string
  model: string
  price_per_day: number
  status: string
  is_verified?: boolean
}

interface Booking {
  id: number
  vehicle_id: number
  vehicle?: { id: number; registration_number?: string; brand?: string; model?: string }
  customer_id?: number
  customer_name?: string
  start_date: string
  end_date: string
  status: string
  total_amount?: number
}

interface Payment {
  id: number
  booking_id: number
  amount_paid: number
  payment_status: string
  payment_method: string
}

function AdminDashboardContent() {
  const router = useRouter()
  const { isAuthenticated, role } = useAuth()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isAuthenticated === undefined) return
    if (!isAuthenticated) {
      router.push("/auth")
      return
    }
    if (role !== "admin") {
      router.push("/dashboard")
      return
    }
    fetchData()
  }, [isAuthenticated, role, router])

  const fetchData = async () => {
    try {
      setError(null)
      const [vehiclesRes, bookingsRes, paymentsRes] = await Promise.all([getVehicles(), getBookings(), getPayments()])
      if (!vehiclesRes.ok || !bookingsRes.ok || !paymentsRes.ok) {
        throw new Error("Failed to fetch dashboard data")
      }
      const [vehiclesData, bookingsData, paymentsData] = await Promise.all([
        vehiclesRes.json(),
        bookingsRes.json(),
        paymentsRes.json(),
      ])
      setVehicles(vehiclesData)
      setBookings(bookingsData)
      setPayments(paymentsData)
    } catch (err) {
      setVehicles([])
      setBookings([])
      setPayments([])
      setError(err instanceof Error ? err.message : "Unable to load data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleApproveVehicle = async (vehicleId: number) => {
    try {
      const res = await updateVehicle(vehicleId, { is_verified: true })
      if (!res.ok) throw new Error("Failed to approve vehicle")
      setVehicles((prev) => prev.map((v) => (v.id === vehicleId ? { ...v, is_verified: true } : v)))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to approve vehicle")
    }
  }

  const handleRejectVehicle = async (vehicleId: number) => {
    try {
      const res = await updateVehicle(vehicleId, { is_verified: false, status: "inactive" })
      if (!res.ok) throw new Error("Failed to reject vehicle")
      setVehicles((prev) => prev.filter((v) => v.id !== vehicleId))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reject vehicle")
    }
  }

  const handleUpdateBookingStatus = async (bookingId: number, status: string) => {
    try {
      const booking = bookings.find((b) => b.id === bookingId)
      const vehicleId = booking?.vehicle_id
      const res = await updateBooking(bookingId, { status })
      if (!res.ok) throw new Error("Failed to update booking status")
      if (status === "completed") {
        setBookings((prev) => prev.filter((b) => b.id !== bookingId))
        if (vehicleId) {
          setVehicles((prev) => prev.map((v) => (v.id === vehicleId ? { ...v, status: "available" } : v)))
        }
        return
      }
      setBookings((prev) => prev.map((b) => (b.id === bookingId ? { ...(b as Booking), status } : b)))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update booking status")
    }
  }

  if (!isAuthenticated || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const pendingVehicles = vehicles.filter((v) => v.is_verified === false)
  const totalVehicles = vehicles.length
  const activeVehicles = vehicles.filter((v) => v.is_verified === true).length
  const pendingPayments = payments.filter((p) => p.payment_status === "pending")
  const totalRevenue = payments.filter((p) => p.payment_status === "paid").reduce((sum, p) => sum + p.amount_paid * 0.1, 0)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
            <Shield className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage vehicles, bookings, and payments</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Car className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{totalVehicles}</p>
                  <p className="text-sm text-muted-foreground">Total Vehicles</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{bookings.length}</p>
                  <p className="text-sm text-muted-foreground">Total Bookings</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{pendingVehicles.length}</p>
                  <p className="text-sm text-muted-foreground">Pending Approvals</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">KES {totalRevenue.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Platform Revenue</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="vehicles">
          <TabsList>
            <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
            <TabsTrigger value="bookings">Bookings ({bookings.length})</TabsTrigger>
            <TabsTrigger value="payments">Payments ({payments.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="vehicles" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {vehicles.map((vehicle, index) => (
                <VehicleCard key={vehicle.id || index} vehicle={vehicle} showAdminActions={true} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="bookings" className="mt-6">
            <div className="space-y-4">
              {bookings.map((booking) => (
                <Card key={booking.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center">
                          <Car className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {booking.vehicle ? `${booking.vehicle.brand} ${booking.vehicle.model}` : `Vehicle #${booking.vehicle_id}`}
                          </h3>
                          <p className="text-sm text-muted-foreground">Booked by: {booking.customer_name || "Unknown"}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(booking.start_date).toLocaleDateString()} - {new Date(booking.end_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="font-semibold text-foreground">KES {(booking.total_amount || 0).toLocaleString()}</p>
                        <Button size="sm" onClick={() => handleUpdateBookingStatus(booking.id, "completed")}>
                          Mark Completed
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="payments" className="mt-6">
            <div className="space-y-4">
              {payments.map((payment) => (
                <Card key={payment.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground">Payment #{payment.id}</h3>
                        <p className="text-sm text-muted-foreground">Booking #{payment.booking_id}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="font-semibold text-foreground">KES {payment.amount_paid.toLocaleString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default function AdminPage() {
  return (
    <AuthProvider>
      <AdminDashboardContent />
    </AuthProvider>
  )
}
