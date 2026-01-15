"use client"

import { useState, useEffect } from "react"
import { PaymentCard } from "./payment-card"
import { Loader2 } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api"

export type Payment = {
  id: string
  bookingIds: string[] // Changed from single bookingId to array
  bookings: {
    bookingId: string
    vehicleName: string
    vehicleId: string
    startDate: string
    endDate: string
    cost: number
  }[]
  customerName: string
  totalAmount: number // Total amount for all bookings
  status: "pending" | "processing" | "completed" | "failed" | "refunded"
  paymentMethod: string
  transactionId?: string
  createdAt: string
  completedAt?: string
}

export function PaymentsList() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | Payment["status"]>("all")

  useEffect(() => {
    fetchPayments()
  }, [])

  const fetchPayments = async () => {
    try {
      setLoading(true)
      // GET payments from your API - can filter by booking status
      const response = await fetch(`${API_BASE_URL}/payments`)

      if (!response.ok) {
        throw new Error("Failed to fetch payments")
      }

      const data = await response.json()
      setPayments(data)
    } catch (err) {
      console.error("Error fetching payments:", err)
      // Demo data for UI purposes
      setPayments(getDemoPayments())
    } finally {
      setLoading(false)
    }
  }

  const filteredPayments = filter === "all" ? payments : payments.filter((p) => p.status === filter)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div>
      <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All ({payments.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="failed">Failed</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-4">
        {filteredPayments.map((payment) => (
          <PaymentCard key={payment.id} payment={payment} onUpdate={fetchPayments} />
        ))}

        {filteredPayments.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">No payments found for this filter.</div>
        )}
      </div>
    </div>
  )
}

function getDemoPayments(): Payment[] {
  return [
    {
      id: "PAY001",
      bookingIds: ["BK001", "BK005"],
      bookings: [
        {
          bookingId: "BK001",
          vehicleName: "Toyota Camry",
          vehicleId: "V001",
          startDate: "2026-01-20",
          endDate: "2026-01-23",
          cost: 180,
        },
        {
          bookingId: "BK005",
          vehicleName: "Honda CR-V",
          vehicleId: "V002",
          startDate: "2026-01-20",
          endDate: "2026-01-22",
          cost: 200,
        },
      ],
      customerName: "John Doe",
      totalAmount: 380,
      status: "completed",
      paymentMethod: "Credit Card",
      transactionId: "TXN-20260115-001",
      createdAt: "2026-01-15T10:30:00Z",
      completedAt: "2026-01-15T10:30:15Z",
    },
    {
      id: "PAY002",
      bookingIds: ["BK002"],
      bookings: [
        {
          bookingId: "BK002",
          vehicleName: "BMW 3 Series",
          vehicleId: "V003",
          startDate: "2026-01-18",
          endDate: "2026-01-25",
          cost: 325,
        },
      ],
      customerName: "Jane Smith",
      totalAmount: 325,
      status: "pending",
      paymentMethod: "Credit Card",
      createdAt: "2026-01-14T14:20:00Z",
    },
    {
      id: "PAY003",
      bookingIds: ["BK003", "BK006", "BK007"],
      bookings: [
        {
          bookingId: "BK003",
          vehicleName: "Mazda CX-5",
          vehicleId: "V004",
          startDate: "2026-01-22",
          endDate: "2026-01-26",
          cost: 220,
        },
        {
          bookingId: "BK006",
          vehicleName: "Toyota Camry",
          vehicleId: "V001",
          startDate: "2026-01-24",
          endDate: "2026-01-26",
          cost: 120,
        },
        {
          bookingId: "BK007",
          vehicleName: "Honda Accord",
          vehicleId: "V005",
          startDate: "2026-01-22",
          endDate: "2026-01-25",
          cost: 180,
        },
      ],
      customerName: "Mike Johnson",
      totalAmount: 520,
      status: "processing",
      paymentMethod: "Debit Card",
      transactionId: "TXN-20260115-002",
      createdAt: "2026-01-13T09:15:00Z",
    },
    {
      id: "PAY004",
      bookingIds: ["BK004"],
      bookings: [
        {
          bookingId: "BK004",
          vehicleName: "BMW X5",
          vehicleId: "V006",
          startDate: "2026-01-19",
          endDate: "2026-01-23",
          cost: 400,
        },
      ],
      customerName: "Sarah Williams",
      totalAmount: 400,
      status: "failed",
      paymentMethod: "Credit Card",
      createdAt: "2026-01-12T16:45:00Z",
    },
  ]
}
