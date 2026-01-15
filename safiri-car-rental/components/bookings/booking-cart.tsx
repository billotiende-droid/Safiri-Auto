"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Car, Calendar, Trash2, ShoppingCart, CreditCard, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api"

type CartItem = {
  id: string
  vehicleId: string
  vehicleName: string
  startDate: string
  endDate: string
  cost: number
}

export function BookingCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)
  const [customerName, setCustomerName] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("credit-card")

  // Form for adding new booking to cart
  const [newBooking, setNewBooking] = useState({
    vehicleId: "",
    vehicleName: "",
    startDate: "",
    endDate: "",
    cost: "",
  })

  const addToCart = () => {
    if (
      !newBooking.vehicleId ||
      !newBooking.vehicleName ||
      !newBooking.startDate ||
      !newBooking.endDate ||
      !newBooking.cost
    ) {
      alert("Please fill in all fields")
      return
    }

    const item: CartItem = {
      id: `CART-${Date.now()}`,
      vehicleId: newBooking.vehicleId,
      vehicleName: newBooking.vehicleName,
      startDate: newBooking.startDate,
      endDate: newBooking.endDate,
      cost: Number.parseFloat(newBooking.cost),
    }

    setCartItems([...cartItems, item])
    setNewBooking({
      vehicleId: "",
      vehicleName: "",
      startDate: "",
      endDate: "",
      cost: "",
    })
  }

  const removeFromCart = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id))
  }

  const totalCost = cartItems.reduce((sum, item) => sum + item.cost, 0)

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty")
      return
    }

    if (!customerName || !customerEmail) {
      alert("Please enter customer details")
      return
    }

    setLoading(true)

    try {
      // POST all bookings as one payment to your API
      const response = await fetch(`${API_BASE_URL}/payments/multi-booking`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookings: cartItems.map((item) => ({
            vehicleId: item.vehicleId,
            vehicleName: item.vehicleName,
            startDate: item.startDate,
            endDate: item.endDate,
            cost: item.cost,
          })),
          customerName,
          customerEmail,
          paymentMethod,
          totalAmount: totalCost,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to process checkout")
      }

      const data = await response.json()
      alert(`Payment created successfully! Payment ID: ${data.paymentId}`)

      // Clear cart after successful checkout
      setCartItems([])
      setCustomerName("")
      setCustomerEmail("")
    } catch (err) {
      console.error("Error processing checkout:", err)
      alert("Failed to process checkout. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Add to Cart Section */}
      <div className="lg:col-span-1">
        <Card className="p-6 sticky top-24">
          <div className="flex items-center gap-2 mb-4">
            <ShoppingCart className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-foreground">Add to Cart</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="vehicleId">Vehicle ID</Label>
              <Input
                id="vehicleId"
                value={newBooking.vehicleId}
                onChange={(e) => setNewBooking({ ...newBooking, vehicleId: e.target.value })}
                placeholder="V001"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vehicleName">Vehicle Name</Label>
              <Input
                id="vehicleName"
                value={newBooking.vehicleName}
                onChange={(e) => setNewBooking({ ...newBooking, vehicleName: e.target.value })}
                placeholder="Toyota Camry"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={newBooking.startDate}
                onChange={(e) => setNewBooking({ ...newBooking, startDate: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={newBooking.endDate}
                onChange={(e) => setNewBooking({ ...newBooking, endDate: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cost">Rental Cost ($)</Label>
              <Input
                id="cost"
                type="number"
                value={newBooking.cost}
                onChange={(e) => setNewBooking({ ...newBooking, cost: e.target.value })}
                placeholder="150"
              />
            </div>

            <Button onClick={addToCart} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              Add to Cart
            </Button>
          </div>
        </Card>
      </div>

      {/* Cart and Checkout Section */}
      <div className="lg:col-span-2 space-y-6">
        {/* Cart Items */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Your Cart</h2>
            <Badge variant="secondary" className="text-base px-3 py-1">
              {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
            </Badge>
          </div>

          {cartItems.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Your cart is empty. Add bookings above to get started.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-muted/30 rounded-lg p-4 border border-border flex items-start justify-between"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Car className="w-4 h-4 text-primary" />
                      <span className="font-semibold text-foreground">{item.vehicleName}</span>
                      <span className="text-xs text-muted-foreground">({item.vehicleId})</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {new Date(item.startDate).toLocaleDateString()} - {new Date(item.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-lg font-bold text-primary">${item.cost}</div>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => removeFromCart(item.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}

              <div className="border-t border-border pt-4 mt-4">
                <div className="flex items-center justify-between text-xl font-bold">
                  <span className="text-foreground">Total Amount:</span>
                  <span className="text-primary">${totalCost.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Checkout Section */}
        {cartItems.length > 0 && (
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <CreditCard className="w-5 h-5 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">Checkout</h2>
            </div>

            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Customer Name</Label>
                  <Input
                    id="customerName"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="John Doe"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customerEmail">Customer Email</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger id="paymentMethod">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="credit-card">Credit Card</SelectItem>
                    <SelectItem value="debit-card">Debit Card</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="mobile-money">Mobile Money</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-muted/30 rounded-lg p-4 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-muted-foreground">Number of vehicles:</span>
                  <span className="font-semibold text-foreground">{cartItems.length}</span>
                </div>
                <div className="flex items-center justify-between text-lg">
                  <span className="font-bold text-foreground">Total to pay:</span>
                  <span className="font-bold text-primary">${totalCost.toFixed(2)}</span>
                </div>
              </div>

              <Button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5 mr-2" />
                    Complete Payment (${totalCost.toFixed(2)})
                  </>
                )}
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
