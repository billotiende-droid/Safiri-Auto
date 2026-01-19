"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { bookingAPI, type Booking } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Car, CreditCard, LogOut, Plus, Eye, BookOpen } from "lucide-react"

export function UserDashboardClient() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        // Get user info from localStorage
        const userStr = localStorage.getItem("safiri_user")
        const role = localStorage.getItem("safiri_role")

        if (!userStr || role !== "user") {
          router.push("/login")
          return
        }

        const userData = JSON.parse(userStr)
        setUser(userData)

        // Fetch bookings
        const bookingsData = await bookingAPI.getAll()
        setBookings(bookingsData)
      } catch (err) {
        console.error("Failed to fetch data:", err)
        setError(err instanceof Error ? err.message : "Failed to load dashboard")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("safiri_token")
    localStorage.removeItem("safiri_user")
    localStorage.removeItem("safiri_role")
    router.push("/login")
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-KE", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const stats = [
    {
      label: "Total Bookings",
      value: bookings.length,
      icon: BookOpen,
    },
    {
      label: "Pending",
      value: bookings.filter((b) => b.status === "pending").length,
      icon: Calendar,
    },
    {
      label: "Completed",
      value: bookings.filter((b) => b.status === "completed").length,
      icon: Car,
    },
  ]

  if (loading) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with Logout */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Welcome, {user?.name}!</h1>
          <p className="text-muted-foreground mt-1">Manage your vehicle bookings</p>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                </div>
                <stat.icon className="w-10 h-10 text-primary/20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Actions */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <Link href="/vehicles">
          <Button className="w-full bg-primary text-primary-foreground" size="lg">
            <Car className="w-4 h-4 mr-2" />
            Browse Vehicles
          </Button>
        </Link>
        <Link href="/bookings">
          <Button className="w-full bg-secondary text-secondary-foreground" size="lg">
            <BookOpen className="w-4 h-4 mr-2" />
            View All Bookings
          </Button>
        </Link>
      </div>

      {/* Recent Bookings */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Recent Bookings</h2>
          <Link href="/bookings">
            <Button variant="outline" size="sm">
              View All
            </Button>
          </Link>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive rounded-lg p-4 mb-6">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {bookings.length === 0 ? (
          <Card className="border-border text-center py-16">
            <CardContent>
              <Car className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No bookings yet</h3>
              <p className="text-muted-foreground mb-4">Start by browsing and booking a vehicle</p>
              <Link href="/vehicles">
                <Button>Browse Vehicles</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {bookings.slice(0, 5).map((booking) => (
              <Card key={booking.id} className="border-border">
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">Booking #{booking.id}</h3>
                        <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(booking.start_date)} - {formatDate(booking.end_date)}
                        </div>
                        <div className="flex items-center gap-1">
                          <CreditCard className="w-4 h-4" />
                          KES {(booking.total_amount || 0).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <Link href={`/bookings/${booking.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
