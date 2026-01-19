"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { bookingAPI, paymentAPI, type Booking, type Payment } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Calendar, Car, CreditCard, CheckCircle, Clock, MapPin, Phone, User, Trash2 } from "lucide-react"



interface BookingDetailClientProps {
  bookingId: number
}

export function BookingDetailClient({ bookingId }: BookingDetailClientProps) {
  const router = useRouter()
  const [booking, setBooking] = useState<Booking | null>(null)
  const [payment, setPayment] = useState<Payment | null>(null)
  const [loading, setLoading] = useState(true)
  const [processingPayment, setProcessingPayment] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        const bookingData = await bookingAPI.getById(bookingId)
        setBooking(bookingData)

        // Try to get payment for this booking
        try {
          const payments = await paymentAPI.getAll({ booking_id: bookingId })
          console.log(`[Booking ${bookingId}] Payments fetched:`, payments)
          if (payments.length > 0) {
            setPayment(payments[0])
          }
        } catch (paymentError) {
          console.warn(`[Booking ${bookingId}] Failed to fetch payments:`, paymentError)
        }
      } catch (error) {
        console.error("Failed to fetch booking data:", error)
        throw error
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [bookingId])

  const handleInitiatePayment = async () => {
    if (!booking) return

    setProcessingPayment(true)
    try {
      console.log(`[Payment] Creating payment for booking ${booking.id}...`)
      const newPayment = await paymentAPI.create({
        booking_id: booking.id,
        payment_method: "mpesa",
      })
      console.log(`[Payment] Payment created:`, newPayment)
      setPayment(newPayment)
      // Redirect to payments page after creating payment
      const redirectUrl = `/payments?booking_id=${booking.id}`
      console.log(`[Payment] Redirecting to: ${redirectUrl}`)
      router.push(redirectUrl)
    } catch (error) {
      console.error("Failed to initiate payment:", error)
    } finally {
      setProcessingPayment(false)
    }
  }

  const handleConfirmBooking = async () => {
    if (!booking) return

    setProcessingPayment(true)
    try {
      const updatedBooking = await bookingAPI.updateStatus(booking.id, "confirmed")
      setBooking(updatedBooking)
    } catch (error) {
      console.error("Failed to confirm booking:", error)
    } finally {
      setProcessingPayment(false)
    }
  }

  const handleDeleteBooking = async () => {
    if (!booking) return

    if (!confirm("Are you sure you want to delete this booking?")) return

    setProcessingPayment(true)
    try {
      await bookingAPI.delete(booking.id)
      router.push("/bookings")
    } catch (error) {
      console.error("Failed to delete booking:", error)
    } finally {
      setProcessingPayment(false)
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-KE", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const statusConfig: Record<string, { color: string; label: string }> = {
    pending: { color: "bg-chart-4/20 text-chart-4 border-chart-4/30", label: "Pending" },
    confirmed: { color: "bg-primary/20 text-primary border-primary/30", label: "Confirmed" },
    completed: { color: "bg-secondary/20 text-secondary border-secondary/30", label: "Completed" },
    cancelled: { color: "bg-destructive/20 text-destructive border-destructive/30", label: "Cancelled" },
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-32 bg-muted rounded" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-64 bg-muted rounded-xl" />
              <div className="h-48 bg-muted rounded-xl" />
            </div>
            <div className="h-96 bg-muted rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-foreground">Booking not found</h1>
        <Link href="/bookings" className="text-primary hover:underline mt-4 inline-block">
          Back to bookings
        </Link>
      </div>
    )
  }

  const status = statusConfig[booking.status] || statusConfig.pending

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Link
        href="/bookings"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to bookings
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-foreground">Booking #{booking.id}</h1>
            <Badge className={`${status.color} border`}>{status.label}</Badge>
          </div>
          <p className="text-muted-foreground mt-1">View and manage your booking details</p>
        </div>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDeleteBooking}
          disabled={processingPayment}
          className="md:self-start"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Booking
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Vehicle Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="w-5 h-5 text-primary" />
                Vehicle Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-6">
                <div className="w-40 h-28 rounded-lg overflow-hidden bg-accent">
                  <img src="/toyota-corolla-rental-car.jpg" alt="Vehicle" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Toyota Corolla</h3>
                  <p className="text-muted-foreground text-sm">Sedan • KAA123A</p>
                  <div className="flex items-center gap-2 mt-2">
                    <CheckCircle className="w-4 h-4 text-secondary" />
                    <span className="text-sm text-secondary">Verified Vehicle</span>
                  </div>
                  <Link
                    href={`/vehicles/${booking.vehicle_id}`}
                    className="text-primary text-sm hover:underline mt-2 inline-block"
                  >
                    View vehicle details →
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rental Period */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Rental Period
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="bg-accent rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">Pickup</p>
                  <p className="font-semibold text-foreground">{formatDate(booking.start_date)}</p>
                  <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>9:00 AM</span>
                  </div>
                </div>
                <div className="bg-accent rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">Return</p>
                  <p className="font-semibold text-foreground">{formatDate(booking.end_date)}</p>
                  <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>6:00 PM</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>Pickup Location: Nairobi CBD, Kenya</span>
              </div>
            </CardContent>
          </Card>

          {/* Owner Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Owner Contact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Owner One</p>
                  <p className="text-sm text-muted-foreground">Safiri Motors</p>
                </div>
                <Button variant="outline" size="sm" className="ml-auto bg-transparent">
                  <Phone className="w-4 h-4 mr-2" />
                  Contact
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                Payment Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Daily Rate</span>
                  <span className="text-foreground">KES 2,500</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Number of Days</span>
                  <span className="text-foreground">
                    {Math.ceil(
                      (new Date(booking.end_date).getTime() - new Date(booking.start_date).getTime()) /
                        (1000 * 60 * 60 * 24),
                    ) + 1}
                  </span>
                </div>
                <div className="border-t border-border pt-2 mt-2">
                  <div className="flex justify-between font-semibold">
                    <span className="text-foreground">Total Amount</span>
                    <span className="text-primary">
                      KES {(booking.total_amount || booking.total_cost || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Status */}
              {payment && (
                <div className="bg-accent rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Payment Status</span>
                    <Badge
                      className={
                        payment.payment_status === "paid"
                          ? "bg-secondary/20 text-secondary"
                          : payment.payment_status === "pending"
                            ? "bg-chart-4/20 text-chart-4"
                            : "bg-destructive/20 text-destructive"
                      }
                    >
                      {payment.payment_status.charAt(0).toUpperCase() + payment.payment_status.slice(1)}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Method: {payment.payment_method.toUpperCase()}</p>
                </div>
              )}

              {/* Payment Actions */}
              {booking.status === "pending" && (
                <Button
                  className="w-full bg-primary text-primary-foreground"
                  onClick={handleConfirmBooking}
                  disabled={processingPayment}
                >
                  {processingPayment ? "Confirming..." : "Confirm Booking"}
                </Button>
              )}

              {booking.status === "confirmed" && !payment && (
                <Button
                  className="w-full bg-primary text-primary-foreground"
                  onClick={handleInitiatePayment}
                  disabled={processingPayment}
                >
                  {processingPayment ? "Processing..." : "Pay Now via M-Pesa"}
                </Button>
              )}

              {booking.status === "confirmed" && payment && payment.payment_status === "pending" && (
                <Link href={`/payments?booking_id=${booking.id}`}>
                  <Button className="w-full bg-primary text-primary-foreground">Complete Payment</Button>
                </Link>
              )}

              {payment && payment.payment_status === "paid" && (
                <div className="text-center py-4">
                  <CheckCircle className="w-10 h-10 text-secondary mx-auto mb-2" />
                  <p className="font-semibold text-foreground">Payment Complete</p>
                  <p className="text-sm text-muted-foreground">Thank you for your payment</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Help Card */}
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Need help with your booking?</p>
              <Button variant="outline" className="w-full mt-3 bg-transparent">
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
