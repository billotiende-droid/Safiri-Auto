"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { paymentAPI, bookingAPI, type Payment, type Booking } from "@/lib/api"
import { useAuth } from "@/hooks/use-auth"
import { PaymentCard } from "@/components/payment-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CreditCard, CheckCircle, Clock, XCircle, LayoutGrid, Loader2, LogIn } from "lucide-react"
import Link from "next/link"

export function PaymentListClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { isAuthenticated, loading: authLoading } = useAuth()
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<string>("")
  const [creatingPayment, setCreatingPayment] = useState(false)
  const [booking, setBooking] = useState<Booking | null>(null)

  const bookingIdFilter = searchParams.get("booking_id")

  useEffect(() => {
    if (authLoading || !isAuthenticated) return

    async function fetchData() {
      setLoading(true)
      setError(null)
      try {
        // If booking_id is provided, fetch the booking details
        if (bookingIdFilter) {
          const bookingData = await bookingAPI.getById(Number(bookingIdFilter))
          setBooking(bookingData)
        }

        console.log("Fetching payments with params:", { booking_id: bookingIdFilter, status: selectedStatus })
        const data = await paymentAPI.getAll({
          booking_id: bookingIdFilter ? Number(bookingIdFilter) : undefined,
          status: selectedStatus || undefined,
        })
        console.log("Payments fetched:", data)
        setPayments(data)
      } catch (err) {
        console.error("Error fetching data:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch data")
        setPayments([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [bookingIdFilter, selectedStatus, authLoading, isAuthenticated])

  const handleCreatePayment = async () => {
    if (!bookingIdFilter || !booking) return

    setCreatingPayment(true)
    try {
      console.log("Creating payment for booking:", bookingIdFilter)
      const payment = await paymentAPI.create({ booking_id: Number(bookingIdFilter) })
      console.log("Payment created:", payment)
      setPayments([payment, ...payments])
      setBooking(null)
      router.push(`/payments?booking_id=${bookingIdFilter}`)
    } catch (err) {
      console.error("Failed to create payment:", err)
      setError(err instanceof Error ? err.message : "Failed to create payment")
    } finally {
      setCreatingPayment(false)
    }
  }

  const handlePaymentComplete = async (paymentId: number) => {
    try {
      await paymentAPI.updateStatus(paymentId, "paid")
      setPayments((prev) => prev.map((p) => (p.id === paymentId ? { ...p, payment_status: "paid" } : p)))
    } catch (error) {
      console.error("Failed to update payment:", error)
    }
  }

  const statusFilters = [
    { value: "", label: "All Payments", icon: LayoutGrid },
    { value: "pending", label: "Pending", icon: Clock },
    { value: "paid", label: "Paid", icon: CheckCircle },
    { value: "failed", label: "Failed", icon: XCircle },
  ]

  const filteredPayments = selectedStatus ? payments.filter((p) => p.payment_status === selectedStatus) : payments

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
              Please sign in to manage your payments
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
          <h3 className="text-lg font-semibold text-destructive mb-2">Failed to Load Payments</h3>
          <p className="text-destructive/80">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Payment Creation Form - Show when booking_id is present and no payments exist */}
      {bookingIdFilter && loading === false && payments.length === 0 && booking && (
        <Card className="mb-8 border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-2xl">Complete Your Payment</CardTitle>
            <CardDescription>Create a payment for your booking</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div className="bg-card border border-border rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">Booking ID</p>
                <p className="text-lg font-semibold text-foreground">#{booking.id}</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
                <p className="text-2xl font-bold text-primary">KES {(booking.total_amount || 0).toLocaleString()}</p>
              </div>
            </div>
            <Button
              onClick={handleCreatePayment}
              disabled={creatingPayment}
              size="lg"
              className="w-full bg-primary text-primary-foreground"
            >
              {creatingPayment ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Payment...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Create Payment
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Payments</h1>
        <p className="text-muted-foreground mt-1">
          {bookingIdFilter ? `Payments for Booking #${bookingIdFilter}` : `${loading ? "Loading..." : `${filteredPayments.length} payments found`}`}
        </p>
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

      {/* Payments List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-6 animate-pulse">
              <div className="flex gap-4">
                <div className="w-16 h-16 bg-muted rounded-full" />
                <div className="flex-1 space-y-3">
                  <div className="h-6 w-32 bg-muted rounded" />
                  <div className="h-4 w-48 bg-muted rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredPayments.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
            <CreditCard className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">No payments found</h3>
          <p className="text-muted-foreground">
            {bookingIdFilter ? `No payments for booking #${bookingIdFilter}` : selectedStatus ? "No payments with this status" : "No payment records yet"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPayments.map((payment) => (
            <PaymentCard key={payment.id} payment={payment} onPaymentComplete={handlePaymentComplete} />
          ))}
        </div>
      )}
    </div>
  )
}
