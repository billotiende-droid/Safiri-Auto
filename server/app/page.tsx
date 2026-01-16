"use client"

import { AuthProvider } from "@/lib/auth-context"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Car, Shield, CreditCard, ArrowRight } from "lucide-react"
import Link from "next/link"

function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary/5 to-background py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight text-balance">
                Find Your Perfect
                <span className="text-primary"> Rental Car</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                Rent a car for a weekend getaway or even a month. Compare and book vehicles from trusted owners across
                Kenya with ease.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link href="/vehicles">
                  <Button size="lg" className="w-full sm:w-auto">
                    Browse Cars <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/auth?mode=signup&role=owner">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                    List Your Car
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <img src="/luxury-car-rental-hero-image-safari-kenya.jpg" alt="Car rental" className="rounded-2xl shadow-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-card">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">Why Choose Safiri?</h2>
            <p className="mt-4 text-muted-foreground">Travel just got easier with our trusted platform</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-6">
              <CardContent className="pt-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Car className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg text-foreground">Wide Selection</h3>
                <p className="mt-2 text-muted-foreground text-sm">
                  Choose from hundreds of vehicles - sedans, SUVs, vans, and more
                </p>
              </CardContent>
            </Card>
            <Card className="text-center p-6">
              <CardContent className="pt-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg text-foreground">Verified Owners</h3>
                <p className="mt-2 text-muted-foreground text-sm">
                  All vehicle owners are verified for your safety and peace of mind
                </p>
              </CardContent>
            </Card>
            <Card className="text-center p-6">
              <CardContent className="pt-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg text-foreground">Easy M-Pesa Payment</h3>
                <p className="mt-2 text-muted-foreground text-sm">
                  Pay securely with M-Pesa - Kenya's most trusted payment method
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">How It Works</h2>
            <p className="mt-4 text-muted-foreground">Book a rental car in just a few simple steps</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Search", desc: "Browse available vehicles in your area" },
              { step: "2", title: "Select", desc: "Choose the car that fits your needs" },
              { step: "3", title: "Book", desc: "Pick your dates and confirm booking" },
              { step: "4", title: "Pay", desc: "Pay via M-Pesa and hit the road" },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                  {item.step}
                </div>
                <h3 className="font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA for Owners */}
      <section className="py-20 bg-primary">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-primary-foreground">Have a Car to Rent Out?</h2>
          <p className="mt-4 text-primary-foreground/80 max-w-2xl mx-auto">
            Join Safiri as an owner and start earning from your vehicle. We handle the bookings, payments, and customer
            support - you just provide the car.
          </p>
          <Link href="/auth?mode=signup&role=owner">
            <Button size="lg" variant="secondary" className="mt-8">
              Become an Owner <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground py-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Car className="h-6 w-6 text-primary-foreground" />
              <span className="text-lg font-bold text-primary-foreground">Safiri</span>
            </div>
            <p className="text-muted text-sm">© 2025 Safiri. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default function Page() {
  return (
    <AuthProvider>
      <HomePage />
    </AuthProvider>
  )
}
