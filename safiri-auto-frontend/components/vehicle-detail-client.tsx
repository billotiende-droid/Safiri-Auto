"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { vehicleAPI, categoryAPI, bookingAPI, type Vehicle, type Category } from "@/lib/api"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Calendar, CheckCircle, Car, MapPin, Shield, Clock, CreditCard, LogIn } from "lucide-react"
import Link from "next/link"

interface VehicleDetailClientProps {
  vehicleId: number
}

export function VehicleDetailClient({ vehicleId }: VehicleDetailClientProps) {
  const router = useRouter()
  const { isAuthenticated, loading: authLoading } = useAuth()
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState(false)
  const [bookingError, setBookingError] = useState<string | null>(null)
  const [bookingSuccess, setBookingSuccess] = useState(false)

  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  useEffect(() => {
    async function fetchData() {
      try {
        const [vehicleData, categoriesData] = await Promise.all([vehicleAPI.getById(vehicleId), categoryAPI.getAll()])
        setVehicle(vehicleData)
        setCategories(categoriesData)
      } catch (error) {
        console.error("Failed to fetch data:", error)
        throw error
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [vehicleId])

  const calculateTotalCost = () => {
    if (!startDate || !endDate || !vehicle) return 0
    const start = new Date(startDate)
    const end = new Date(endDate)
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
    return days > 0 ? days * vehicle.price_per_day : 0
  }

  const handleBooking = async () => {
    if (!startDate || !endDate) {
      setBookingError("Please select pickup and return dates")
      return
    }

    if (new Date(startDate) > new Date(endDate)) {
      setBookingError("Return date must be after pickup date")
      return
    }

    setBooking(true)
    setBookingError(null)

    try {
      await bookingAPI.create({
        vehicle_id: vehicleId,
        start_date: startDate,
        end_date: endDate,
      })
      setBookingSuccess(true)
      setTimeout(() => {
        router.push("/bookings")
      }, 2000)
    } catch (error) {
      setBookingError(error instanceof Error ? error.message : "Booking failed")
    } finally {
      setBooking(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-32 bg-muted rounded" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="aspect-video bg-muted rounded-2xl" />
            </div>
            <div className="space-y-4">
              <div className="h-48 bg-muted rounded-2xl" />
              <div className="h-32 bg-muted rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!vehicle) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-foreground">Vehicle not found</h1>
        <Link href="/vehicles" className="text-primary hover:underline mt-4 inline-block">
          Back to vehicles
        </Link>
      </div>
    )
  }

  const category = categories.find((c) => c.category_id === vehicle.category_id)
  const totalCost = calculateTotalCost()

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Link
        href="/vehicles"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to vehicles
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Vehicle Image */}
          <div className="aspect-video relative overflow-hidden rounded-2xl bg-accent">
            <img
              src={`/.jpg?height=500&width=800&query=${vehicle.brand} ${vehicle.model} car interior exterior`}
              alt={`${vehicle.brand} ${vehicle.model}`}
              className="w-full h-full object-cover"
            />
            {vehicle.is_verified && (
              <div className="absolute top-4 right-4 bg-secondary text-secondary-foreground px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Verified Vehicle
              </div>
            )}
          </div>

          {/* Vehicle Info */}
          <div>
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  {vehicle.brand} {vehicle.model}
                </h1>
                <div className="flex items-center gap-4 mt-2">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Car className="w-3 h-3" />
                    {category?.name || "Unknown"}
                  </Badge>
                  <span className="text-muted-foreground text-sm">Reg: {vehicle.registration_number}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Per day</p>
                <p className="text-3xl font-bold text-primary">KES {vehicle.price_per_day.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle>Features & Benefits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Insurance Included</p>
                    <p className="text-sm text-muted-foreground">Full coverage protection</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Flexible Pickup</p>
                    <p className="text-sm text-muted-foreground">24/7 availability</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Free Delivery</p>
                    <p className="text-sm text-muted-foreground">Within Nairobi CBD</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Easy Payment</p>
                    <p className="text-sm text-muted-foreground">M-Pesa & Card accepted</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Booking Sidebar */}
        <div className="space-y-4">
          {!authLoading && !isAuthenticated ? (
            <Card className="border-primary/30 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <LogIn className="w-5 h-5" />
                  Sign In to Book
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-foreground">
                  You need to be logged in to make bookings. Please sign in or create an account.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <Link href="/login">
                    <Button className="w-full bg-primary text-primary-foreground">Sign In</Button>
                  </Link>
                  <Link href="/signup">
                    <Button className="w-full border border-primary text-primary" variant="outline">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Book This Vehicle
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {bookingSuccess ? (
                  <div className="text-center py-6">
                    <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-secondary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">Booking Created!</h3>
                    <p className="text-muted-foreground mt-2">Redirecting to your bookings...</p>
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Pickup Date</label>
                      <Input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                        className="bg-background"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Return Date</label>
                      <Input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        min={startDate || new Date().toISOString().split("T")[0]}
                        className="bg-background"
                      />
                    </div>

                    {totalCost > 0 && (
                      <div className="bg-accent rounded-lg p-4">
                        <div className="flex justify-between text-sm text-muted-foreground mb-2">
                          <span>
                            KES {vehicle.price_per_day.toLocaleString()} x{" "}
                            {Math.ceil(
                              (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24),
                            ) + 1}{" "}
                            days
                          </span>
                        </div>
                        <div className="flex justify-between font-semibold text-foreground">
                          <span>Total</span>
                          <span className="text-primary">KES {totalCost.toLocaleString()}</span>
                        </div>
                      </div>
                    )}

                    {bookingError && (
                      <div className="bg-destructive/10 text-destructive rounded-lg p-3 text-sm">{bookingError}</div>
                    )}

                    <Button
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                      size="lg"
                      disabled={vehicle.status !== "available" || booking}
                      onClick={handleBooking}
                    >
                      {booking ? "Creating Booking..." : vehicle.status === "available" ? "Book Now" : "Not Available"}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* Status Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge
                  className={
                    vehicle.status === "available"
                      ? "bg-secondary text-secondary-foreground"
                      : "bg-muted text-muted-foreground"
                  }
                >
                  {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
