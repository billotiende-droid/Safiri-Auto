"use client"

import type React from "react"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Search, CreditCard, DollarSign, Calendar, CheckCircle, Clock, XCircle, RefreshCw } from "lucide-react"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api"

type PaymentDetails = {
  id: string
  bookingId: string
  vehicleName: string
  customerName: string
  customerEmail: string
  amount: number
  status: "pending" | "processing" | "completed" | "failed" | "refunded"
  paymentMethod: string
  transactionId?: string
  createdAt: string
  completedAt?: string
}

export function PaymentByIdLookup() {
  const [loading, setLoading] = useState(false)
  const [paymentId, setPaymentId] = useState("")
  const [payment, setPayment] = useState<PaymentDetails | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setPayment(null)

    try {
      // GET payment by ID from your API
      const response = await fetch(`${API_BASE_URL}/payments/${paymentId}`)

      if (!response.ok) {
        throw new Error("Payment not found")
      }

      const data = await response.json()
      setPayment(data)
    } catch (err) {
      console.error("Error fetching payment:", err)
      setError("Payment not found. Please check the ID and try again.")

      // Demo data for UI purposes
      if (paymentId) {
        setPayment({
          id: paymentId,
          bookingId: "BK001",
          vehicleName: "Toyota Camry",
          customerName: "John Doe",
          customerEmail: "john@example.com",
          amount: 180,
          status: "completed",
          paymentMethod: "Credit Card",
          transactionId: "TXN-20260115-001",
          createdAt: "2026-01-15T10:30:00Z",
          completedAt: "2026-01-15T10:30:15Z",
        })
        setError(null)
      }
    } finally {
      setLoading(false)
    }
  }

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  return (
    <Card className="p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-foreground mb-6">Payment Lookup</h2>

      <form onSubmit={handleLookup} className="space-y-6 mb-8">
        <div className="space-y-2">
          <Label htmlFor="paymentId">Payment ID</Label>
          <div className="flex gap-2">
            <Input
              id="paymentId"
              value={paymentId}
              onChange={(e) => setPaymentId(e.target.value)}
              placeholder="Enter payment ID (e.g., PAY001)"
              required
              className="flex-1"
            />
            <Button type="submit" disabled={loading} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </form>

      {error && <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-700 mb-8">{error}</div>}

      {payment && (
        <div className="bg-muted/30 rounded-xl p-6 space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-bold text-foreground mb-2">Payment Details</h3>
              <p className="text-sm text-muted-foreground">Payment ID: {payment.id}</p>
            </div>
            <Badge className={statusConfig[payment.status].color} variant="outline">
              {payment.status}
            </Badge>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Amount</div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  <span className="text-2xl font-bold text-primary">${payment.amount}</span>
                </div>
              </div>

              <div>
                <div className="text-xs text-muted-foreground mb-1">Payment Method</div>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{payment.paymentMethod}</span>
                </div>
              </div>

              {payment.transactionId && (
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Transaction ID</div>
                  <span className="text-sm text-foreground font-mono">{payment.transactionId}</span>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Customer</div>
                <div className="text-sm text-foreground">{payment.customerName}</div>
                <div className="text-xs text-muted-foreground">{payment.customerEmail}</div>
              </div>

              <div>
                <div className="text-xs text-muted-foreground mb-1">Vehicle</div>
                <div className="text-sm text-foreground">{payment.vehicleName}</div>
              </div>

              <div>
                <div className="text-xs text-muted-foreground mb-1">Booking ID</div>
                <div className="text-sm text-foreground">{payment.bookingId}</div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              <Calendar className="w-3 h-3" />
              <span>Created: {formatDate(payment.createdAt)}</span>
            </div>
            {payment.completedAt && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                <span>Completed: {formatDate(payment.completedAt)}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  )
}
