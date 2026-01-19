"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MapPin, Calendar, Search, ChevronRight } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  const [searchExpanded, setSearchExpanded] = useState(false)
  const [pickupLocation, setPickupLocation] = useState("")
  const [pickupDate, setPickupDate] = useState("")
  const [returnDate, setReturnDate] = useState("")

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      {/* Map-like Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('/african-savanna-safari-landscape-with-golden-sunse.jpg')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />
      </div>

      {/* Expanded Map Background (when search is focused) */}
      {searchExpanded && (
        <div
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-500"
          style={{
            backgroundImage: `url('/satellite-map-view-african-roads-terrain.jpg')`,
          }}
        >
          <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />
        </div>
      )}

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero Text */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 text-balance">
            Rent a car
            <span className="block text-primary">like a local</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto text-pretty">
            Discover the freedom of the open road with Safiri Auto. Book verified vehicles from trusted owners across
            Kenya in just a few taps.
          </p>

          {/* Search Card */}
          <div
            className={`bg-card border border-border rounded-2xl shadow-2xl p-6 md:p-8 transition-all duration-300 ${
              searchExpanded ? "scale-105 shadow-primary/20" : ""
            }`}
          >
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              {/* Pickup Location */}
              <div className="relative">
                <label className="block text-sm font-medium text-muted-foreground mb-2 text-left">
                  Pickup Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                  <Input
                    type="text"
                    placeholder="Nairobi, Mombasa..."
                    className="pl-10 h-12 bg-background border-border"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    onFocus={() => setSearchExpanded(true)}
                    onBlur={() => setSearchExpanded(false)}
                  />
                </div>
              </div>

              {/* Pickup Date */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2 text-left">Pickup Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                  <Input
                    type="date"
                    className="pl-10 h-12 bg-background border-border"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                  />
                </div>
              </div>

              {/* Return Date */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2 text-left">Return Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                  <Input
                    type="date"
                    className="pl-10 h-12 bg-background border-border"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <Link href={`/vehicles?location=${pickupLocation}&start=${pickupDate}&end=${returnDate}`}>
              <Button className="w-full md:w-auto h-12 px-8 bg-primary text-primary-foreground hover:bg-primary/90 text-lg font-semibold">
                <Search className="w-5 h-5 mr-2" />
                Search Available Cars
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-12 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary">500+</div>
              <div className="text-sm text-muted-foreground">Verified Cars</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary">47</div>
              <div className="text-sm text-muted-foreground">Counties</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary">4.8</div>
              <div className="text-sm text-muted-foreground">Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Safari Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  )
}
