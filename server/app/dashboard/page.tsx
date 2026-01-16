// "use client"

// import { useState, useEffect, Suspense } from "react"
// import { useRouter, useSearchParams } from "next/navigation"
// import { AuthProvider, useAuth } from "@/lib/auth-context"
// import { Navbar } from "@/components/navbar"
// import { MpesaPaymentModal } from "@/components/mpesa-payment-modal"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Car, Calendar, CreditCard, CheckCircle, Clock, XCircle, Loader2 } from "lucide-react"
// import Link from "next/link"
// import { getBookings, updatePayment, createPayment } from "@/lib/api"

// interface Booking {
//   id: number
//   vehicle_id: number
//   start_date: string
//   end_date: string
//   status: string
//   total_amount?: number
// }

// // Demo bookings
// const demoBookings: Booking[] = [
//   { id: 1, vehicle_id: 1, start_date: "2025-01-20", end_date: "2025-01-25", status: "confirmed", total_amount: 25000 },
//   { id: 2, vehicle_id: 3, start_date: "2025-01-15", end_date: "2025-01-18", status: "completed", total_amount: 22500 },
//   { id: 3, vehicle_id: 5, start_date: "2025-02-01", end_date: "2025-02-03", status: "pending", total_amount: 36000 },
// ]

// function DashboardContent() {
//   const router = useRouter()
//   const searchParams = useSearchParams()
//   const { user, isAuthenticated, role } = useAuth()
//   const [bookings, setBookings] = useState<Booking[]>([])
//   const [loading, setLoading] = useState(true)
//   const [paymentModalOpen, setPaymentModalOpen] = useState(false)
//   const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
//   const [showSuccess, setShowSuccess] = useState(false)

//   useEffect(() => {
//     if (!isAuthenticated) {
//       router.push("/auth")
//       return
//     }
//     if (role === "owner") {
//       router.push("/owner")
//       return
//     }
//     if (role === "admin") {
//       router.push("/admin")
//       return
//     }

//     fetchBookings()

//     if (searchParams.get("booking") === "success") {
//       setShowSuccess(true)
//       setTimeout(() => setShowSuccess(false), 5000)
//     }
//   }, [isAuthenticated, role, router, searchParams])

//   const fetchBookings = async () => {
//     try {
//       const response = await getBookings()
//       if (response.ok) {
//         const data = await response.json()
//         // Filter bookings for current user (in real app this would be done server-side)
//         setBookings(data)
//       } else {
//         setBookings(demoBookings)
//       }
//     } catch {
//       setBookings(demoBookings)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handlePayment = (booking: Booking) => {
//     setSelectedBooking(booking)
//     setPaymentModalOpen(true)
//   }

//   const handlePaymentComplete = async () => {
//     if (!selectedBooking) return

//     try {
//       // Create payment and mark as paid
//       const paymentResponse = await createPayment({
//         booking_id: selectedBooking.id,
//         payment_method: "mpesa",
//       })

//       if (paymentResponse.ok) {
//         const paymentData = await paymentResponse.json()
//         await updatePayment(paymentData.id, { payment_status: "paid" })
//       }
//     } catch {
//       // Demo mode
//     }

//     // Update local state
//     setBookings((prev) => prev.map((b) => (b.id === selectedBooking.id ? { ...b, status: "confirmed" } : b)))
//     setPaymentModalOpen(false)
//     setSelectedBooking(null)
//   }

//   const getStatusBadge = (status: string) => {
//     switch (status) {
//       case "confirmed":
//       case "paid":
//         return (
//           <Badge className="bg-primary text-primary-foreground">
//             <CheckCircle className="h-3 w-3 mr-1" /> Confirmed
//           </Badge>
//         )
//       case "pending":
//         return (
//           <Badge variant="secondary">
//             <Clock className="h-3 w-3 mr-1" /> Pending Payment
//           </Badge>
//         )
//       case "completed":
//         return (
//           <Badge variant="outline">
//             <CheckCircle className="h-3 w-3 mr-1" /> Completed
//           </Badge>
//         )
//       case "cancelled":
//         return (
//           <Badge variant="destructive">
//             <XCircle className="h-3 w-3 mr-1" /> Cancelled
//           </Badge>
//         )
//       default:
//         return <Badge variant="outline">{status}</Badge>
//     }
//   }

//   if (!isAuthenticated || loading) {
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center">
//         <Loader2 className="h-8 w-8 animate-spin text-primary" />
//       </div>
//     )
//   }

//   const pendingBookings = bookings.filter((b) => b.status === "pending")
//   const activeBookings = bookings.filter((b) => ["confirmed", "paid"].includes(b.status))
//   const pastBookings = bookings.filter((b) => ["completed", "cancelled"].includes(b.status))

//   return (
//     <div className="min-h-screen bg-background">
//       <Navbar />

//       <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
//         {showSuccess && (
//           <div className="mb-6 p-4 bg-primary/10 border border-primary rounded-lg flex items-center gap-3">
//             <CheckCircle className="h-5 w-5 text-primary" />
//             <p className="text-foreground">Booking confirmed successfully! Your payment has been processed.</p>
//           </div>
//         )}

//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-foreground">Welcome back, {user?.name}</h1>
//           <p className="mt-2 text-muted-foreground">Manage your bookings and payments</p>
//         </div>

//         {/* Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//           <Card>
//             <CardContent className="pt-6">
//               <div className="flex items-center gap-4">
//                 <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
//                   <Car className="h-6 w-6 text-primary" />
//                 </div>
//                 <div>
//                   <p className="text-2xl font-bold text-foreground">{bookings.length}</p>
//                   <p className="text-sm text-muted-foreground">Total Bookings</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardContent className="pt-6">
//               <div className="flex items-center gap-4">
//                 <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
//                   <Calendar className="h-6 w-6 text-accent" />
//                 </div>
//                 <div>
//                   <p className="text-2xl font-bold text-foreground">{activeBookings.length}</p>
//                   <p className="text-sm text-muted-foreground">Active Rentals</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardContent className="pt-6">
//               <div className="flex items-center gap-4">
//                 <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center">
//                   <CreditCard className="h-6 w-6 text-secondary-foreground" />
//                 </div>
//                 <div>
//                   <p className="text-2xl font-bold text-foreground">{pendingBookings.length}</p>
//                   <p className="text-sm text-muted-foreground">Pending Payments</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Bookings Tabs */}
//         <Tabs defaultValue="active">
//           <TabsList>
//             <TabsTrigger value="active">Active ({activeBookings.length})</TabsTrigger>
//             <TabsTrigger value="pending">Pending ({pendingBookings.length})</TabsTrigger>
//             <TabsTrigger value="past">Past ({pastBookings.length})</TabsTrigger>
//           </TabsList>

//           <TabsContent value="active" className="mt-6">
//             {activeBookings.length === 0 ? (
//               <Card>
//                 <CardContent className="py-12 text-center">
//                   <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
//                   <h3 className="font-medium text-foreground">No active bookings</h3>
//                   <p className="text-sm text-muted-foreground mt-1">Browse vehicles to make a new booking</p>
//                   <Link href="/vehicles">
//                     <Button className="mt-4">Browse Vehicles</Button>
//                   </Link>
//                 </CardContent>
//               </Card>
//             ) : (
//               <div className="space-y-4">
//                 {activeBookings.map((booking) => (
//                   <Card key={booking.id}>
//                     <CardContent className="p-6">
//                       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//                         <div className="flex items-center gap-4">
//                           <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center">
//                             <Car className="h-8 w-8 text-muted-foreground" />
//                           </div>
//                           <div>
//                             <h3 className="font-semibold text-foreground">Vehicle #{booking.vehicle_id}</h3>
//                             <p className="text-sm text-muted-foreground">
//                               {new Date(booking.start_date).toLocaleDateString()} -{" "}
//                               {new Date(booking.end_date).toLocaleDateString()}
//                             </p>
//                           </div>
//                         </div>
//                         <div className="flex items-center gap-4">
//                           {getStatusBadge(booking.status)}
//                           <p className="font-semibold text-foreground">
//                             KES {(booking.total_amount || 0).toLocaleString()}
//                           </p>
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </div>
//             )}
//           </TabsContent>

//           <TabsContent value="pending" className="mt-6">
//             {pendingBookings.length === 0 ? (
//               <Card>
//                 <CardContent className="py-12 text-center">
//                   <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
//                   <h3 className="font-medium text-foreground">All caught up!</h3>
//                   <p className="text-sm text-muted-foreground mt-1">No pending payments</p>
//                 </CardContent>
//               </Card>
//             ) : (
//               <div className="space-y-4">
//                 {pendingBookings.map((booking) => (
//                   <Card key={booking.id}>
//                     <CardContent className="p-6">
//                       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//                         <div className="flex items-center gap-4">
//                           <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center">
//                             <Car className="h-8 w-8 text-muted-foreground" />
//                           </div>
//                           <div>
//                             <h3 className="font-semibold text-foreground">Vehicle #{booking.vehicle_id}</h3>
//                             <p className="text-sm text-muted-foreground">
//                               {new Date(booking.start_date).toLocaleDateString()} -{" "}
//                               {new Date(booking.end_date).toLocaleDateString()}
//                             </p>
//                           </div>
//                         </div>
//                         <div className="flex items-center gap-4">
//                           {getStatusBadge(booking.status)}
//                           <div className="text-right">
//                             <p className="font-semibold text-foreground">
//                               KES {(booking.total_amount || 0).toLocaleString()}
//                             </p>
//                             <Button size="sm" className="mt-2" onClick={() => handlePayment(booking)}>
//                               Pay with M-Pesa
//                             </Button>
//                           </div>
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </div>
//             )}
//           </TabsContent>

//           <TabsContent value="past" className="mt-6">
//             {pastBookings.length === 0 ? (
//               <Card>
//                 <CardContent className="py-12 text-center">
//                   <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
//                   <h3 className="font-medium text-foreground">No past bookings</h3>
//                   <p className="text-sm text-muted-foreground mt-1">Your completed rentals will appear here</p>
//                 </CardContent>
//               </Card>
//             ) : (
//               <div className="space-y-4">
//                 {pastBookings.map((booking) => (
//                   <Card key={booking.id}>
//                     <CardContent className="p-6">
//                       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//                         <div className="flex items-center gap-4">
//                           <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center">
//                             <Car className="h-8 w-8 text-muted-foreground" />
//                           </div>
//                           <div>
//                             <h3 className="font-semibold text-foreground">Vehicle #{booking.vehicle_id}</h3>
//                             <p className="text-sm text-muted-foreground">
//                               {new Date(booking.start_date).toLocaleDateString()} -{" "}
//                               {new Date(booking.end_date).toLocaleDateString()}
//                             </p>
//                           </div>
//                         </div>
//                         <div className="flex items-center gap-4">
//                           {getStatusBadge(booking.status)}
//                           <p className="font-semibold text-foreground">
//                             KES {(booking.total_amount || 0).toLocaleString()}
//                           </p>
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </div>
//             )}
//           </TabsContent>
//         </Tabs>
//       </div>

//       {selectedBooking && (
//         <MpesaPaymentModal
//           open={paymentModalOpen}
//           onClose={() => {
//             setPaymentModalOpen(false)
//             setSelectedBooking(null)
//           }}
//           amount={selectedBooking.total_amount || 0}
//           bookingId={selectedBooking.id}
//           onPaymentComplete={handlePaymentComplete}
//         />
//       )}
//     </div>
//   )
// }

// export default function DashboardPage() {
//   return (
//     <AuthProvider>
//       <Suspense
//         fallback={
//           <div className="min-h-screen flex items-center justify-center">
//             <Loader2 className="h-8 w-8 animate-spin" />
//           </div>
//         }
//       >
//         <DashboardContent />
//       </Suspense>
//     </AuthProvider>
//   )
// }

"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { AuthProvider, useAuth } from "@/lib/auth-context"
import { Navbar } from "@/components/navbar"
import { MpesaPaymentModal } from "@/components/mpesa-payment-modal"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Car, Calendar, CreditCard, CheckCircle, Clock, XCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { getBookings, updatePayment, createPayment } from "@/lib/api"

interface Booking {
  id: number
  vehicle_id: number
  start_date: string
  end_date: string
  status: string
  total_amount?: number
}

function DashboardContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isAuthenticated, role } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth")
      return
    }
    if (role === "owner") {
      router.push("/owner")
      return
    }
    if (role === "admin") {
      router.push("/admin")
      return
    }

    fetchBookings()

    if (searchParams.get("booking") === "success") {
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 5000)
    }
  }, [isAuthenticated, role, router, searchParams])

  const fetchBookings = async () => {
    try {
      const response = await getBookings()
      if (response.ok) {
        const data = await response.json()
        setBookings(data)
      } else {
        setBookings([])
        setError("Failed to fetch bookings")
      }
    } catch (err) {
      setBookings([])
      setError(err instanceof Error ? err.message : "Network error. Failed to load bookings.")
    } finally {
      setLoading(false)
    }
  }

  const handlePayment = (booking: Booking) => {
    setSelectedBooking(booking)
    setPaymentModalOpen(true)
  }

  const handlePaymentComplete = async () => {
    if (!selectedBooking) return

    try {
      // Create payment and mark as paid
      const paymentResponse = await createPayment({
        booking_id: selectedBooking.id,
        payment_method: "mpesa",
      })

      if (paymentResponse.ok) {
        const paymentData = await paymentResponse.json()
        await updatePayment(paymentData.id, { payment_status: "paid" })
      }
    } catch {
      // no demo fallback: show error or ignore based on UX
    }

    // Update local state
    setBookings((prev) => prev.map((b) => (b.id === selectedBooking.id ? { ...b, status: "confirmed" } : b)))
    setPaymentModalOpen(false)
    setSelectedBooking(null)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
      case "paid":
        return (
          <Badge className="bg-primary text-primary-foreground">
            <CheckCircle className="h-3 w-3 mr-1" /> Confirmed
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="secondary">
            <Clock className="h-3 w-3 mr-1" /> Pending Payment
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline">
            <CheckCircle className="h-3 w-3 mr-1" /> Completed
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" /> Cancelled
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (!isAuthenticated || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const pendingBookings = bookings.filter((b) => b.status === "pending")
  const activeBookings = bookings.filter((b) => ["confirmed", "paid"].includes(b.status))
  const pastBookings = bookings.filter((b) => ["completed", "cancelled"].includes(b.status))

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
        {showSuccess && (
          <div className="mb-6 p-4 bg-primary/10 border border-primary rounded-lg flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-primary" />
            <p className="text-foreground">Booking confirmed successfully! Your payment has been processed.</p>
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Welcome back, {user?.name}</h1>
          <p className="mt-2 text-muted-foreground">Manage your bookings and payments</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Car className="h-6 w-6 text-primary" />
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
                <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{activeBookings.length}</p>
                  <p className="text-sm text-muted-foreground">Active Rentals</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-secondary-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{pendingBookings.length}</p>
                  <p className="text-sm text-muted-foreground">Pending Payments</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bookings Tabs */}
        <Tabs defaultValue="active">
          <TabsList>
            <TabsTrigger value="active">Active ({activeBookings.length})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({pendingBookings.length})</TabsTrigger>
            <TabsTrigger value="past">Past ({pastBookings.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-6">
            {activeBookings.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium text-foreground">No active bookings</h3>
                  <p className="text-sm text-muted-foreground mt-1">Browse vehicles to make a new booking</p>
                  <Link href="/vehicles">
                    <Button className="mt-4">Browse Vehicles</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {activeBookings.map((booking) => (
                  <Card key={booking.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center">
                            <Car className="h-8 w-8 text-muted-foreground" />
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
                          {getStatusBadge(booking.status)}
                          <p className="font-semibold text-foreground">
                            KES {(booking.total_amount || 0).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="pending" className="mt-6">
            {pendingBookings.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium text-foreground">All caught up!</h3>
                  <p className="text-sm text-muted-foreground mt-1">No pending payments</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {pendingBookings.map((booking) => (
                  <Card key={booking.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center">
                            <Car className="h-8 w-8 text-muted-foreground" />
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
                          {getStatusBadge(booking.status)}
                          <div className="text-right">
                            <p className="font-semibold text-foreground">
                              KES {(booking.total_amount || 0).toLocaleString()}
                            </p>
                            <Button size="sm" className="mt-2" onClick={() => handlePayment(booking)}>
                              Pay with M-Pesa
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="past" className="mt-6">
            {pastBookings.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium text-foreground">No past bookings</h3>
                  <p className="text-sm text-muted-foreground mt-1">Your completed rentals will appear here</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {pastBookings.map((booking) => (
                  <Card key={booking.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center">
                            <Car className="h-8 w-8 text-muted-foreground" />
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
                          {getStatusBadge(booking.status)}
                          <p className="font-semibold text-foreground">
                            KES {(booking.total_amount || 0).toLocaleString()}
                          </p>
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

      {selectedBooking && (
        <MpesaPaymentModal
          open={paymentModalOpen}
          onClose={() => {
            setPaymentModalOpen(false)
            setSelectedBooking(null)
          }}
          amount={selectedBooking.total_amount || 0}
          bookingId={selectedBooking.id}
          onPaymentComplete={handlePaymentComplete}
        />
      )}
    </div>
  )
}

export default function DashboardPage() {
  return (
    <AuthProvider>
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        }
      >
        <DashboardContent />
      </Suspense>
    </AuthProvider>
  )
}