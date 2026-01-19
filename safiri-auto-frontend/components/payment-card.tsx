"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CreditCard, CheckCircle, Clock, XCircle, ExternalLink, Smartphone } from "lucide-react"
import type { Payment } from "@/lib/api"

interface PaymentCardProps {
  payment: Payment
  onPaymentComplete: (paymentId: number) => void
}

export function PaymentCard({ payment, onPaymentComplete }: PaymentCardProps) {
  const [processing, setProcessing] = useState(false)

  const statusConfig: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
    pending: {
      color: "bg-chart-4/20 text-chart-4 border-chart-4/30",
      icon: <Clock className="w-4 h-4" />,
      label: "Pending",
    },
    paid: {
      color: "bg-secondary/20 text-secondary border-secondary/30",
      icon: <CheckCircle className="w-4 h-4" />,
      label: "Paid",
    },
    failed: {
      color: "bg-destructive/20 text-destructive border-destructive/30",
      icon: <XCircle className="w-4 h-4" />,
      label: "Failed",
    },
  }

  const status = statusConfig[payment.payment_status] || statusConfig.pending

  const handleCompletePayment = async () => {
    setProcessing(true)
    await onPaymentComplete(payment.id)
    setProcessing(false)
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/30 transition-colors">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Payment Info */}
        <div className="flex items-start gap-4">
          <div
            className={`w-14 h-14 rounded-full flex items-center justify-center ${
              payment.payment_status === "paid"
                ? "bg-secondary/10"
                : payment.payment_status === "failed"
                  ? "bg-destructive/10"
                  : "bg-primary/10"
            }`}
          >
            {payment.payment_method === "mpesa" ? (
              <Smartphone
                className={`w-7 h-7 ${
                  payment.payment_status === "paid"
                    ? "text-secondary"
                    : payment.payment_status === "failed"
                      ? "text-destructive"
                      : "text-primary"
                }`}
              />
            ) : (
              <CreditCard
                className={`w-7 h-7 ${
                  payment.payment_status === "paid"
                    ? "text-secondary"
                    : payment.payment_status === "failed"
                      ? "text-destructive"
                      : "text-primary"
                }`}
              />
            )}
          </div>

          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-foreground">Payment #{payment.id}</h3>
              <Badge className={`${status.color} border flex items-center gap-1`}>
                {status.icon}
                {status.label}
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm mt-1">Booking #{payment.booking_id}</p>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <span>Method: {payment.payment_method.toUpperCase()}</span>
              {payment.payment_reference && <span>Ref: {payment.payment_reference}</span>}
            </div>
          </div>
        </div>

        {/* Amount & Actions */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Amount</p>
            <p className="text-2xl font-bold text-primary">KES {payment.amount_paid.toLocaleString()}</p>
          </div>

          <div className="flex items-center gap-2">
            <Link href={`/bookings/${payment.booking_id}`}>
              <Button variant="outline" size="sm">
                <ExternalLink className="w-4 h-4 mr-2" />
                View Booking
              </Button>
            </Link>

            {payment.payment_status === "pending" && (
              <Button
                size="sm"
                className="bg-primary text-primary-foreground"
                onClick={handleCompletePayment}
                disabled={processing}
              >
                {processing ? "Processing..." : "Complete Payment"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
