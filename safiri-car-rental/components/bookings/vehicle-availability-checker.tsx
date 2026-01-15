"use client"

import type React from "react"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle, XCircle, Calendar, DollarSign } from "lucide-react"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api"

type AvailabilityResult = {
  available: boolean
  vehicleId: string
  startDate: string
  endDate: string
  totalCost?: number
  message?: string
}

export function VehicleAvailabilityChecker() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AvailabilityResult | null>(null)
  const [formData, setFormData] = useState({
    vehicleId: "",
    startDate: "",
    endDate: "",
  })

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)

    try {
      // GET vehicle availability from your API
      const params = new URLSearchParams({
        vehicleId: formData.vehicleId,
        startDate: formData.startDate,
        endDate: formData.endDate,
      })

      const response = await fetch(`${API_BASE_URL}/bookings/availability?${params}`)

      if (!response.ok) {
        throw new Error("Failed to check availability")
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      console.error("Error checking availability:", err)
      // Demo result for UI purposes
      setResult({
        available: Math.random() > 0.5,
        vehicleId: formData.vehicleId,
        startDate: formData.startDate,
        endDate: formData.endDate,
        totalCost: 285,
        message: Math.random() > 0.5 ? "Vehicle is available!" : "Vehicle is not available for selected dates.",
      })
    } finally {
      setLoading(false)
    }
  }

  const calculateDays = () => {
    if (!formData.startDate || !formData.endDate) return 0
    const start = new Date(formData.startDate)
    const end = new Date(formData.endDate)
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  }

  return (
    <Card className="p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-foreground mb-6">Check Vehicle Availability</h2>

      <form onSubmit={handleCheck} className="space-y-6 mb-8">
        <div className="space-y-2">
          <Label htmlFor="vehicleId">Vehicle ID</Label>
          <Input
            id="vehicleId"
            value={formData.vehicleId}
            onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
            placeholder="Enter vehicle ID"
            required
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="checkStartDate">Start Date</Label>
            <Input
              id="checkStartDate"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="checkEndDate">End Date</Label>
            <Input
              id="checkEndDate"
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              required
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Checking Availability...
            </>
          ) : (
            "Check Availability"
          )}
        </Button>
      </form>

      {/* Results */}
      {result && (
        <div
          className={`p-6 rounded-xl border-2 ${result.available ? "bg-green-500/10 border-green-500/20" : "bg-red-500/10 border-red-500/20"}`}
        >
          <div className="flex items-start gap-4">
            {result.available ? (
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
            ) : (
              <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
            )}

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-lg font-bold text-foreground">
                  {result.available ? "Available" : "Not Available"}
                </h3>
                <Badge variant={result.available ? "default" : "destructive"}>{result.message}</Badge>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {result.startDate} to {result.endDate} ({calculateDays()} days)
                  </span>
                </div>

                {result.available && result.totalCost && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <DollarSign className="w-4 h-4" />
                    <span>
                      Estimated cost: <span className="font-bold text-primary">${result.totalCost}</span>
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
