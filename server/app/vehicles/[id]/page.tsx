// "use client"

// import { useState, useEffect, use } from "react"
// import { useRouter } from "next/navigation"
// import { AuthProvider, useAuth } from "@/lib/auth-context"
// import { Navbar } from "@/components/navbar"
// import { MpesaPaymentModal } from "@/components/mpesa-payment-modal"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Badge } from "@/components/ui/badge"
// import { Calendar, Car, Check, ArrowLeft, Loader2, User } from "lucide-react"
// import Link from "next/link"
// import { getVehicle, createBooking, createPayment, updatePayment, updateBooking } from "@/lib/api"

// interface Vehicle {
//   id: number
//   owner_id: number
//   category_id: number
//   registration_number: string
//   brand: string
//   model: string
//   price_per_day: number
//   status: string
//   is_verified?: boolean
// }

// const carImages: Record<string, string> = {
//   Toyota: "/toyota-car-sedan-silver-detailed.jpg",
//   Honda: "/honda-car-sedan-white-detailed.jpg",
//   Nissan: "/nissan-car-suv-black-detailed.jpg",
//   Mercedes: "/placeholder.svg?height=400&width=600",
//   BMW: "/placeholder.svg?height=400&width=600",
//   Audi: "/placeholder.svg?height=400&width=600",
//   Ford: "/placeholder.svg?height=400&width=600",
//   Mazda: "/placeholder.svg?height=400&width=600",
//   Subaru: "/placeholder.svg?height=400&width=600",
//   Volkswagen: "/placeholder.svg?height=400&width=600",
// }


// function VehicleDetailContent({ id }: { id: string }) {
//   const router = useRouter()
//   const { user, isAuthenticated } = useAuth()
//   const [vehicle, setVehicle] = useState<Vehicle | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [startDate, setStartDate] = useState("")
//   const [endDate, setEndDate] = useState("")
//   const [booking, setBooking] = useState<{ id: number; total_amount: number } | null>(null)
//   const [bookingLoading, setBookingLoading] = useState(false)
//   const [paymentModalOpen, setPaymentModalOpen] = useState(false)
//   const [error, setError] = useState("")

//   useEffect(() => {
//     fetchVehicle()
//   }, [id])

//   const fetchVehicle = async () => {
//     try {
//       const response = await getVehicle(Number(id))
//       if (response.ok) {
//         const data = await response.json()
//         setVehicle(data)
//       } else {
//         setVehicle({ ...demoVehicle, id: Number(id) })
//       }
//     } catch {
//       setVehicle({ ...demoVehicle, id: Number(id) })
//     } finally {
//       setLoading(false)
//     }
//   }

//   const calculateTotal = () => {
//     if (!startDate || !endDate || !vehicle) return 0
//     const start = new Date(startDate)
//     const end = new Date(endDate)
//     const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
//     return days > 0 ? days * vehicle.price_per_day : 0
//   }

//   const handleBooking = async () => {
//     if (!isAuthenticated) {
//       router.push("/auth")
//       return
//     }

//     if (!startDate || !endDate) {
//       setError("Please select start and end dates")
//       return
//     }

//     setBookingLoading(true)
//     setError("")

//     try {
//       const response = await createBooking({
//         vehicle_id: Number(id),
//         customer_id: user!.id,
//         start_date: startDate,
//         end_date: endDate,
//       })

//       if (response.ok) {
//         const data = await response.json()
//         // First confirm the booking so payment can be initiated
//         await updateBooking(data.id, { status: "confirmed" })
//         setBooking({ id: data.id, total_amount: data.total_cost || calculateTotal() })
//         setPaymentModalOpen(true)
//       } else {
//         const data = await response.json()
//         setError(data.error || "Failed to create booking")
//       }
//     } catch {
//       // Demo mode - create fake booking
//       const fakeBooking = { id: Math.floor(Math.random() * 1000), total_amount: calculateTotal() }
//       setBooking(fakeBooking)
//       setPaymentModalOpen(true)
//     } finally {
//       setBookingLoading(false)
//     }
//   }

//   const handlePaymentComplete = async () => {
//     if (!booking) return

//     try {
//       // Create payment record
//       const paymentResponse = await createPayment({
//         booking_id: booking.id,
//         payment_method: "mpesa",
//       })

//       if (paymentResponse.ok) {
//         const paymentData = await paymentResponse.json()
//         // Mark payment as paid
//         await updatePayment(paymentData.id, { payment_status: "paid" })
//       }
//     } catch {
//       // Demo mode - just show success
//     }

//     router.push("/dashboard?booking=success")
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center">
//         <Loader2 className="h-8 w-8 animate-spin text-primary" />
//       </div>
//     )
//   }

//   if (!vehicle) {
//     return (
//       <div className="min-h-screen bg-background">
//         <Navbar />
//         <div className="text-center py-20">
//           <Car className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
//           <h3 className="text-lg font-medium text-foreground">Vehicle not found</h3>
//           <Link href="/vehicles">
//             <Button variant="outline" className="mt-4 bg-transparent">
//               <ArrowLeft className="h-4 w-4 mr-2" /> Back to Vehicles
//             </Button>
//           </Link>
//         </div>
//       </div>
//     )
//   }

//   const imageUrl = carImages[vehicle.brand] || "/placeholder.svg?height=400&width=600"
//   const totalAmount = calculateTotal()

//   return (
//     <div className="min-h-screen bg-background">
//       <Navbar />

//       <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
//         <Link href="/vehicles" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
//           <ArrowLeft className="h-4 w-4 mr-2" /> Back to Vehicles
//         </Link>

//         <div className="grid lg:grid-cols-2 gap-8">
//           {/* Vehicle Info */}
//           <div>
//             <div className="relative rounded-xl overflow-hidden mb-6">
//               <img
//                 src={imageUrl || "/placeholder.svg"}
//                 alt={`${vehicle.brand} ${vehicle.model}`}
//                 className="w-full h-80 object-cover"
//               />
//               <div className="absolute top-4 right-4">
//                 <Badge
//                   className={
//                     vehicle.status === "available"
//                       ? "bg-primary text-primary-foreground"
//                       : "bg-secondary text-secondary-foreground"
//                   }
//                 >
//                   {vehicle.status === "available" ? (
//                     <>
//                       <Check className="h-3 w-3 mr-1" /> Available
//                     </>
//                   ) : (
//                     vehicle.status
//                   )}
//                 </Badge>
//               </div>
//             </div>

//             <h1 className="text-3xl font-bold text-foreground">
//               {vehicle.brand} {vehicle.model}
//             </h1>
//             <p className="text-muted-foreground mt-2">{vehicle.registration_number}</p>

//             <div className="mt-6 grid grid-cols-2 gap-4">
//               <Card>
//                 <CardContent className="p-4 flex items-center gap-3">
//                   <Car className="h-5 w-5 text-primary" />
//                   <div>
//                     <p className="text-sm text-muted-foreground">Category</p>
//                     <p className="font-medium text-foreground">Sedan</p>
//                   </div>
//                 </CardContent>
//               </Card>
//               <Card>
//                 <CardContent className="p-4 flex items-center gap-3">
//                   <User className="h-5 w-5 text-primary" />
//                   <div>
//                     <p className="text-sm text-muted-foreground">Owner ID</p>
//                     <p className="font-medium text-foreground">#{vehicle.owner_id}</p>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>

//             <div className="mt-6">
//               <h3 className="font-semibold text-foreground mb-3">Features</h3>
//               <div className="flex flex-wrap gap-2">
//                 {["Air Conditioning", "GPS Navigation", "Bluetooth", "USB Charging", "Spare Tire"].map((feature) => (
//                   <Badge key={feature} variant="secondary">
//                     {feature}
//                   </Badge>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Booking Card */}
//           <div>
//             <Card className="sticky top-24">
//               <CardHeader>
//                 <CardTitle className="flex items-center justify-between">
//                   <span>Book This Vehicle</span>
//                   <span className="text-2xl text-primary">
//                     KES {vehicle.price_per_day.toLocaleString()}
//                     <span className="text-sm font-normal text-muted-foreground">/day</span>
//                   </span>
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="start">Pick-up Date</Label>
//                     <div className="relative">
//                       <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                       <Input
//                         id="start"
//                         type="date"
//                         className="pl-9"
//                         value={startDate}
//                         onChange={(e) => setStartDate(e.target.value)}
//                         min={new Date().toISOString().split("T")[0]}
//                       />
//                     </div>
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="end">Return Date</Label>
//                     <div className="relative">
//                       <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                       <Input
//                         id="end"
//                         type="date"
//                         className="pl-9"
//                         value={endDate}
//                         onChange={(e) => setEndDate(e.target.value)}
//                         min={startDate || new Date().toISOString().split("T")[0]}
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 {totalAmount > 0 && (
//                   <div className="p-4 bg-muted rounded-lg space-y-2">
//                     <div className="flex justify-between text-sm">
//                       <span className="text-muted-foreground">
//                         KES {vehicle.price_per_day.toLocaleString()} x{" "}
//                         {Math.ceil(
//                           (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24),
//                         ) + 1}{" "}
//                         days
//                       </span>
//                       <span className="text-foreground">KES {totalAmount.toLocaleString()}</span>
//                     </div>
//                     <div className="flex justify-between text-sm">
//                       <span className="text-muted-foreground">Service fee (10%)</span>
//                       <span className="text-foreground">KES {(totalAmount * 0.1).toLocaleString()}</span>
//                     </div>
//                     <div className="border-t border-border pt-2 flex justify-between font-semibold">
//                       <span>Total</span>
//                       <span className="text-primary">KES {(totalAmount * 1.1).toLocaleString()}</span>
//                     </div>
//                   </div>
//                 )}

//                 {error && <p className="text-sm text-destructive">{error}</p>}

//                 <Button
//                   className="w-full"
//                   size="lg"
//                   onClick={handleBooking}
//                   disabled={vehicle.status !== "available" || bookingLoading}
//                 >
//                   {bookingLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
//                   {vehicle.status === "available" ? "Book & Pay with M-Pesa" : "Not Available"}
//                 </Button>

//                 {!isAuthenticated && (
//                   <p className="text-sm text-center text-muted-foreground">
//                     You'll need to{" "}
//                     <Link href="/auth" className="text-primary hover:underline">
//                       sign in
//                     </Link>{" "}
//                     to book
//                   </p>
//                 )}
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>

//       {booking && (
//         <MpesaPaymentModal
//           open={paymentModalOpen}
//           onClose={() => setPaymentModalOpen(false)}
//           amount={Math.round(totalAmount * 1.1)}
//           bookingId={booking.id}
//           onPaymentComplete={handlePaymentComplete}
//         />
//       )}
//     </div>
//   )
// }

// export default function VehicleDetailPage({ params }: { params: Promise<{ id: string }> }) {
//   const resolvedParams = use(params)

//   return (
//     <AuthProvider>
//       <VehicleDetailContent id={resolvedParams.id} />
//     </AuthProvider>
//   )
// }

"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { AuthProvider, useAuth } from "@/lib/auth-context"
import { Navbar } from "@/components/navbar"
import { MpesaPaymentModal } from "@/components/mpesa-payment-modal"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Calendar, Car, Check, ArrowLeft, Loader2, User } from "lucide-react"
import Link from "next/link"
import { getVehicle, createBooking, createPayment, updatePayment, updateBooking } from "@/lib/api"

interface Vehicle {
  id: number
  owner_id: number
  category_id: number
  registration_number: string
  brand: string
  model: string
  price_per_day: number
  status: string
  is_verified?: boolean
}

const carImages: Record<string, string> = {
  Toyota: "/toyota-car-sedan-silver-detailed.jpg",
  Honda: "/honda-car-sedan-white-detailed.jpg",
  Nissan: "/nissan-car-suv-black-detailed.jpg",
  Mercedes: "/placeholder.svg?height=400&width=600",
  BMW: "/placeholder.svg?height=400&width=600",
  Audi: "/placeholder.svg?height=400&width=600",
  Ford: "/placeholder.svg?height=400&width=600",
  Mazda: "/placeholder.svg?height=400&width=600",
  Subaru: "/placeholder.svg?height=400&width=600",
  Volkswagen: "/placeholder.svg?height=400&width=600",
}

function VehicleDetailContent({ id }: { id: string }) {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [loading, setLoading] = useState(true)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [booking, setBooking] = useState<{ id: number; total_amount: number } | null>(null)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchVehicle()
  }, [id])

  const fetchVehicle = async () => {
    try {
      setError("")
      setLoading(true)
      const response = await getVehicle(Number(id))
      if (!response.ok) {
        setVehicle(null)
        setError("Vehicle not found")
        return
      }
      const data = await response.json()
      setVehicle(data)
    } catch (err) {
      setVehicle(null)
      setError(err instanceof Error ? err.message : "Failed to load vehicle")
    } finally {
      setLoading(false)
    }
  }

  const calculateTotal = () => {
    if (!startDate || !endDate || !vehicle) return 0
    const start = new Date(startDate)
    const end = new Date(endDate)
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
    return days > 0 ? days * vehicle.price_per_day : 0
  }

  const handleBooking = async () => {
    if (!isAuthenticated) {
      router.push("/auth")
      return
    }

    if (!startDate || !endDate) {
      setError("Please select start and end dates")
      return
    }

    setBookingLoading(true)
    setError("")

    try {
      const response = await createBooking({
        vehicle_id: Number(id),
        customer_id: user!.id,
        start_date: startDate,
        end_date: endDate,
      })

      if (response.ok) {
        const data = await response.json()
        // First confirm the booking so payment can be initiated
        await updateBooking(data.id, { status: "confirmed" })
        setBooking({ id: data.id, total_amount: data.total_cost || calculateTotal() })
        setPaymentModalOpen(true)
      } else {
        const data = await response.json()
        setError(data.error || "Failed to create booking")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error. Failed to create booking.")
    } finally {
      setBookingLoading(false)
    }
  }

  const handlePaymentComplete = async () => {
    if (!booking) return

    try {
      // Create payment record
      const paymentResponse = await createPayment({
        booking_id: booking.id,
        payment_method: "mpesa",
      })

      if (paymentResponse.ok) {
        const paymentData = await paymentResponse.json()
        // Mark payment as paid
        await updatePayment(paymentData.id, { payment_status: "paid" })
      } else {
        // handle non-ok response if needed
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment processing failed.")
    }

    router.push("/dashboard?booking=success")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="text-center py-20">
          <Car className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground">Vehicle not found</h3>
          <p className="text-muted-foreground mt-2">{error}</p>
          <Link href="/vehicles">
            <Button variant="outline" className="mt-4 bg-transparent">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Vehicles
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const imageUrl = carImages[vehicle.brand] || "/placeholder.svg?height=400&width=600"
  const totalAmount = calculateTotal()

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
        <Link href="/vehicles" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Vehicles
        </Link>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Vehicle Info */}
          <div>
            <div className="relative rounded-xl overflow-hidden mb-6">
              <img
                src={imageUrl || "/placeholder.svg"}
                alt={`${vehicle.brand} ${vehicle.model}`}
                className="w-full h-80 object-cover"
              />
              <div className="absolute top-4 right-4">
                <Badge
                  className={
                    vehicle.status === "available"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }
                >
                  {vehicle.status === "available" ? (
                    <>
                      <Check className="h-3 w-3 mr-1" /> Available
                    </>
                  ) : (
                    vehicle.status
                  )}
                </Badge>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-foreground">
              {vehicle.brand} {vehicle.model}
            </h1>
            <p className="text-muted-foreground mt-2">{vehicle.registration_number}</p>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <Car className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Category</p>
                    <p className="font-medium text-foreground">Sedan</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <User className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Owner ID</p>
                    <p className="font-medium text-foreground">#{vehicle.owner_id}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold text-foreground mb-3">Features</h3>
              <div className="flex flex-wrap gap-2">
                {["Air Conditioning", "GPS Navigation", "Bluetooth", "USB Charging", "Spare Tire"].map((feature) => (
                  <Badge key={feature} variant="secondary">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Book This Vehicle</span>
                  <span className="text-2xl text-primary">
                    KES {vehicle.price_per_day.toLocaleString()}
                    <span className="text-sm font-normal text-muted-foreground">/day</span>
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start">Pick-up Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="start"
                        type="date"
                        className="pl-9"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end">Return Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="end"
                        type="date"
                        className="pl-9"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        min={startDate || new Date().toISOString().split("T")[0]}
                      />
                    </div>
                  </div>
                </div>

                {totalAmount > 0 && (
                  <div className="p-4 bg-muted rounded-lg space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        KES {vehicle.price_per_day.toLocaleString()} x{" "}
                        {Math.ceil(
                          (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24),
                        ) + 1}{" "}
                        days
                      </span>
                      <span className="text-foreground">KES {totalAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Service fee (10%)</span>
                      <span className="text-foreground">KES {(totalAmount * 0.1).toLocaleString()}</span>
                    </div>
                    <div className="border-t border-border pt-2 flex justify-between font-semibold">
                      <span>Total</span>
                      <span className="text-primary">KES {(totalAmount * 1.1).toLocaleString()}</span>
                    </div>
                  </div>
                )}

                {error && <p className="text-sm text-destructive">{error}</p>}

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleBooking}
                  disabled={vehicle.status !== "available" || bookingLoading}
                >
                  {bookingLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  {vehicle.status === "available" ? "Book & Pay with M-Pesa" : "Not Available"}
                </Button>

                {!isAuthenticated && (
                  <p className="text-sm text-center text-muted-foreground">
                    You'll need to{" "}
                    <Link href="/auth" className="text-primary hover:underline">
                      sign in
                    </Link>{" "}
                    to book
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {booking && (
        <MpesaPaymentModal
          open={paymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
          amount={Math.round(totalAmount * 1.1)}
          bookingId={booking.id}
          onPaymentComplete={handlePaymentComplete}
        />
      )}
    </div>
  )
}

export default function VehicleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)

  return (
    <AuthProvider>
      <VehicleDetailContent id={resolvedParams.id} />
    </AuthProvider>
  )
}