"use client"

import { CreditCard, Calendar, CheckCircle, Clock, XCircle, RefreshCw, Car } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Payment } from "./payments-list"

type PaymentCardProps = {
  payment: Payment
  onUpdate: () => void
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api"

export function PaymentCard({ payment, onUpdate }: PaymentCardProps) {
  const statusConfig = {
    pending: {
      color: "bg-amber-500/10 text-amber-700 border-amber-500/20",
      icon: Clock,
    },
    processing: {
      color: "bg-blue-500/10 text-blue-700 border-blue-500/20",
      icon: RefreshCw,
    },
    completed: {
      color: "bg-green-500/10 text-green-700 border-green-500/20",
      icon: CheckCircle,
    },
    failed: {
      color: "bg-red-500/10 text-red-700 border-red-500/20",
      icon: XCircle,
    },
    refunded: {
      color: "bg-gray-500/10 text-gray-700 border-gray-500/20",
      icon: RefreshCw,
    },
  }

  const config = statusConfig[payment.status]
  const StatusIcon = config.icon

  const handleProcessPayment = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/${payment.id}/process`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingIds: payment.bookingIds,
          totalAmount: payment.totalAmount,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to process payment")
      }

      onUpdate()
    } catch (err) {
      console.error("Error processing payment:", err)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  return (
    <div className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-bold text-foreground">Payment {payment.id}</h3>
            <Badge className={config.color} variant="outline">
              <StatusIcon className="w-3 h-3 mr-1" />
              {payment.status}
            </Badge>
            <Badge variant="secondary" className="bg-secondary/50">
              <Car className="w-3 h-3 mr-1" />
              {payment.bookings.length} {payment.bookings.length === 1 ? "Vehicle" : "Vehicles"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">Customer: {payment.customerName}</p>
        </div>

        <div className="text-right">
          <div className="text-2xl font-bold text-primary">${payment.totalAmount}</div>
          <p className="text-xs text-muted-foreground">Total</p>
        </div>
      </div>

      <div className="mb-4 pb-4 border-b border-border">
        <h4 className="text-sm font-semibold text-foreground mb-3">Bookings in this receipt:</h4>
        <div className="space-y-3">
          {payment.bookings.map((booking) => (
            <div key={booking.bookingId} className="bg-muted/30 rounded-lg p-3 border border-border/50">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Car className="w-4 h-4 text-primary" />
                    <span className="font-semibold text-foreground">{booking.vehicleName}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Booking ID: {booking.bookingId}</p>
                </div>
                <div className="text-right">
                  <div className="font-bold text-foreground">${booking.cost}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                <span>
                  {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-4 pb-4 border-b border-border">
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <CreditCard className="w-4 h-4" />
            <span>Method: {payment.paymentMethod}</span>
          </div>
          {payment.transactionId && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <span>Transaction: {payment.transactionId}</span>
            </div>
          )}
        </div>

        <div className="space-y-2 text-sm">
          <div className="text-muted-foreground">
            <span className="font-medium">Booking IDs: </span>
            {payment.bookingIds.join(", ")}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="w-3 h-3" />
          <span>Created: {formatDate(payment.createdAt)}</span>
          {payment.completedAt && <span className="ml-2">• Completed: {formatDate(payment.completedAt)}</span>}
        </div>

        <div className="flex gap-2">
          {payment.status === "pending" && (
            <Button
              size="sm"
              onClick={handleProcessPayment}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Process Payment
            </Button>
          )}
          {payment.status === "failed" && (
            <Button size="sm" variant="outline" onClick={handleProcessPayment}>
              Retry
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
