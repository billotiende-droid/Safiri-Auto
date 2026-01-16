"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AuthProvider, useAuth } from "@/lib/auth-context"
import { Navbar } from "@/components/navbar"
import { VehicleCard } from "@/components/vehicle-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Car, Plus, DollarSign, Calendar, Loader2, CheckCircle, Clock } from "lucide-react"
import { getVehicles, createVehicle, getBookings } from "@/lib/api"

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
  start_date: string
  end_date: string
  status: string
  total_amount?: number
}

// Demo data
const demoVehicles: Vehicle[] = [
  {
    id: 1,
    owner_id: 1,
    category_id: 1,
    registration_number: "KDA 123A",
    brand: "Toyota",
    model: "Camry",
    price_per_day: 5000,
    status: "available",
    is_verified: true,
  },
  {
    id: 2,
    owner_id: 1,
    category_id: 2,
    registration_number: "KDB 456B",
    brand: "Honda",
    model: "CR-V",
    price_per_day: 6500,
    status: "booked",
    is_verified: true,
  },
  {
    id: 3,
    owner_id: 1,
    category_id: 1,
    registration_number: "KDC 789C",
    brand: "Mazda",
    model: "CX-5",
    price_per_day: 7000,
    status: "available",
    is_verified: false,
  },
]

const demoBookings: Booking[] = [
  { id: 1, vehicle_id: 2, start_date: "2025-01-20", end_date: "2025-01-25", status: "confirmed", total_amount: 32500 },
  { id: 2, vehicle_id: 1, start_date: "2025-01-10", end_date: "2025-01-12", status: "completed", total_amount: 15000 },
]

function OwnerDashboardContent() {
  const router = useRouter()
  const { user, isAuthenticated, role } = useAuth()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [addVehicleOpen, setAddVehicleOpen] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)

  const [newVehicle, setNewVehicle] = useState({
    registration_number: "",
    brand: "",
    model: "",
    price_per_day: "",
    category_id: "1",
  })

  useEffect(() => {
    // Wait for auth initialization (isAuthenticated === undefined means still initializing)
    if (isAuthenticated === undefined) {
      return
    }

    if (!isAuthenticated) {
      router.push("/auth")
      return
    }
    if (role !== "owner") {
      router.push("/dashboard")
      return
    }

    fetchData()
  }, [isAuthenticated, role, router])

  const fetchData = async () => {
    try {
      const [vehiclesRes, bookingsRes] = await Promise.all([getVehicles(), getBookings()])

      if (vehiclesRes.ok) {
        const data = await vehiclesRes.json()
        // Filter for owner's vehicles (in real app this would be done server-side)
        setVehicles(data.filter((v: Vehicle) => v.owner_id === user?.id) || data.slice(0, 3))
      } else {
        setVehicles(demoVehicles)
      }

      if (bookingsRes.ok) {
        const data = await bookingsRes.json()
        setBookings(data)
      } else {
        setBookings(demoBookings)
      }
    } catch {
      setVehicles(demoVehicles)
      setBookings(demoBookings)
    } finally {
      setLoading(false)
    }
  }

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitLoading(true)

    try {
      const response = await createVehicle({
        owner_id: user!.id,
        category_id: Number(newVehicle.category_id),
        registration_number: newVehicle.registration_number,
        brand: newVehicle.brand,
        model: newVehicle.model,
        price_per_day: Number(newVehicle.price_per_day),
      })

      if (response.ok) {
        const data = await response.json()
        setVehicles((prev) => [...prev, { ...data, is_verified: false }])
        setAddVehicleOpen(false)
        setNewVehicle({ registration_number: "", brand: "", model: "", price_per_day: "", category_id: "1" })
      }
    } catch {
      // Demo mode - add locally
      const newVeh: Vehicle = {
        id: vehicles.length + 10,
        owner_id: user!.id,
        category_id: Number(newVehicle.category_id),
        registration_number: newVehicle.registration_number,
        brand: newVehicle.brand,
        model: newVehicle.model,
        price_per_day: Number(newVehicle.price_per_day),
        status: "available",
        is_verified: false,
      }
      setVehicles((prev) => [...prev, newVeh])
      setAddVehicleOpen(false)
      setNewVehicle({ registration_number: "", brand: "", model: "", price_per_day: "", category_id: "1" })
    } finally {
      setSubmitLoading(false)
    }
  }

  if (isAuthenticated === undefined || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const verifiedVehicles = vehicles.filter((v) => v.is_verified !== false)
  const pendingVehicles = vehicles.filter((v) => v.is_verified === false)
  const totalEarnings = bookings
    .filter((b) => ["confirmed", "completed", "paid"].includes(b.status))
    .reduce((sum, b) => sum + (b.total_amount || 0) * 0.9, 0) // 90% after platform commission

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Owner Dashboard</h1>
            <p className="mt-2 text-muted-foreground">Manage your fleet and track earnings</p>
          </div>
          <Dialog open={addVehicleOpen} onOpenChange={setAddVehicleOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" /> Add Vehicle
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>List a New Vehicle</DialogTitle>
                <DialogDescription>
                  Add your vehicle details. It will be reviewed by admin before listing.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddVehicle} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="brand">Brand</Label>
                    <Select value={newVehicle.brand} onValueChange={(v) => setNewVehicle({ ...newVehicle, brand: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select brand" />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          "Toyota",
                          "Honda",
                          "Nissan",
                          "Mercedes",
                          "BMW",
                          "Audi",
                          "Ford",
                          "Mazda",
                          "Subaru",
                          "Volkswagen",
                        ].map((brand) => (
                          <SelectItem key={brand} value={brand}>
                            {brand}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model">Model</Label>
                    <Input
                      id="model"
                      value={newVehicle.model}
                      onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
                      placeholder="e.g., Camry"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reg">Registration Number</Label>
                  <Input
                    id="reg"
                    value={newVehicle.registration_number}
                    onChange={(e) => setNewVehicle({ ...newVehicle, registration_number: e.target.value })}
                    placeholder="e.g., KDA 123A"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={newVehicle.category_id}
                      onValueChange={(v) => setNewVehicle({ ...newVehicle, category_id: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Sedan</SelectItem>
                        <SelectItem value="2">SUV</SelectItem>
                        <SelectItem value="3">Pickup</SelectItem>
                        <SelectItem value="4">Van</SelectItem>
                        <SelectItem value="5">Luxury</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price per Day (KES)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={newVehicle.price_per_day}
                      onChange={(e) => setNewVehicle({ ...newVehicle, price_per_day: e.target.value })}
                      placeholder="5000"
                      required
                    />
                  </div>
                </div>

                <div className="p-3 bg-muted rounded-lg text-sm text-muted-foreground">
                  <Clock className="inline h-4 w-4 mr-1" />
                  Your vehicle will be reviewed by our team within 24-48 hours before it's listed.
                </div>

                <Button type="submit" className="w-full" disabled={submitLoading}>
                  {submitLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Submit for Review
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Car className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{vehicles.length}</p>
                  <p className="text-sm text-muted-foreground">Total Vehicles</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{verifiedVehicles.length}</p>
                  <p className="text-sm text-muted-foreground">Active Listings</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-secondary-foreground" />
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
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">KES {totalEarnings.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Total Earnings</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="vehicles">
          <TabsList>
            <TabsTrigger value="vehicles">My Vehicles ({vehicles.length})</TabsTrigger>
            <TabsTrigger value="pending">Pending Approval ({pendingVehicles.length})</TabsTrigger>
            <TabsTrigger value="bookings">Bookings ({bookings.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="vehicles" className="mt-6">
            {verifiedVehicles.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium text-foreground">No active vehicles</h3>
                  <p className="text-sm text-muted-foreground mt-1">Add your first vehicle to start earning</p>
                  <Button className="mt-4" onClick={() => setAddVehicleOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" /> Add Vehicle
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {verifiedVehicles.map((vehicle, index) => (
                  <VehicleCard key={vehicle.id || index} vehicle={vehicle} showBookButton={false} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="pending" className="mt-6">
            {pendingVehicles.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium text-foreground">No pending vehicles</h3>
                  <p className="text-sm text-muted-foreground mt-1">All your vehicles have been approved</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pendingVehicles.map((vehicle, index) => (
                  <VehicleCard key={vehicle.id || index} vehicle={vehicle} showBookButton={false} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="bookings" className="mt-6">
            {bookings.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium text-foreground">No bookings yet</h3>
                  <p className="text-sm text-muted-foreground mt-1">Bookings for your vehicles will appear here</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <Card key={booking.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                            <Car className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">Vehicle #{booking.vehicle_id}</h3>
                            <p className="text-sm text-muted-foreground">
                              {new Date(booking.start_date).toLocaleDateString()} -{" "}
                              {new Date(booking.end_date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-semibold text-foreground">
                              KES {((booking.total_amount || 0) * 0.9).toLocaleString()}
                            </p>
                            <p className="text-xs text-muted-foreground">Your earnings (90%)</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default function OwnerDashboardPage() {
  return (
    <AuthProvider>
      <OwnerDashboardContent />
    </AuthProvider>
  )
}
