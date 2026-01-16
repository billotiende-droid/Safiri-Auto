"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Smartphone, CheckCircle, Loader2 } from "lucide-react"

interface MpesaPaymentModalProps {
  open: boolean
  onClose: () => void
  amount: number
  bookingId: number
  onPaymentComplete: () => void
}

export function MpesaPaymentModal({ open, onClose, amount, bookingId, onPaymentComplete }: MpesaPaymentModalProps) {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [step, setStep] = useState<"input" | "processing" | "success">("input")

  const handlePayment = async () => {
    if (!phoneNumber) return

    setStep("processing")

    // Simulate M-Pesa payment processing (dummy)
    await new Promise((resolve) => setTimeout(resolve, 3000))

    setStep("success")

    // Call the payment completion callback
    setTimeout(() => {
      onPaymentComplete()
      onClose()
      setStep("input")
      setPhoneNumber("")
    }, 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Smartphone className="h-5 w-5 text-primary" />
            </div>
            M-Pesa Payment
          </DialogTitle>
          <DialogDescription>Complete your booking payment via M-Pesa</DialogDescription>
        </DialogHeader>

        {step === "input" && (
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Amount to Pay</p>
              <p className="text-2xl font-bold text-foreground">KES {amount.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-1">Booking ID: #{bookingId}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">M-Pesa Phone Number</Label>
              <Input
                id="phone"
                placeholder="e.g., 0712345678"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Enter the phone number registered with M-Pesa</p>
            </div>

            <Button onClick={handlePayment} className="w-full" disabled={!phoneNumber}>
              Pay KES {amount.toLocaleString()}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              A payment prompt will be sent to your phone. Enter your M-Pesa PIN to complete.
            </p>
          </div>
        )}

        {step === "processing" && (
          <div className="py-8 text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
            <div>
              <p className="font-semibold text-foreground">Processing Payment...</p>
              <p className="text-sm text-muted-foreground">Check your phone for the M-Pesa prompt</p>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm">
                Sending STK push to <span className="font-mono">{phoneNumber}</span>
              </p>
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="py-8 text-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <CheckCircle className="h-10 w-10 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground text-lg">Payment Successful!</p>
              <p className="text-sm text-muted-foreground">Your booking has been confirmed</p>
            </div>
            <div className="p-3 bg-muted rounded-lg text-sm">
              <p>
                Transaction Reference: <span className="font-mono">QKR43W21Z</span>
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
