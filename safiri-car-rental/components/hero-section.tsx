"use client"

import { useState } from "react"
import { Search, MapPin, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function HeroSection() {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img src="/african-savanna-sunset-road-landscape.jpg" alt="Safari landscape" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background/80" />
      </div>

      {/* Map Background when Search is Expanded */}
      {isSearchExpanded && (
        <div className="absolute inset-0 z-10 animate-in fade-in duration-500">
          <img src="/modern-city-map-roads-aerial-view.jpg" alt="Map view" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" />
        </div>
      )}

      {/* Content */}
      <div
        className={`relative z-20 container mx-auto px-4 transition-all duration-500 ${isSearchExpanded ? "mt-[-10vh]" : ""}`}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 text-balance leading-tight">
            Your Journey Starts <span className="text-primary">Here</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 text-pretty">
            Book your perfect ride in seconds. Adventure awaits on every road.
          </p>

          {/* Search Box */}
          <div
            className={`bg-card rounded-2xl shadow-2xl p-6 md:p-8 transition-all duration-500 ${isSearchExpanded ? "scale-105" : ""}`}
          >
            <div className="flex flex-col md:flex-row gap-4">
              {/* Location Input */}
              <div className="flex-1 relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Where do you want to go?"
                  className="pl-12 h-14 text-base bg-muted border-0"
                  onFocus={() => setIsSearchExpanded(true)}
                />
              </div>

              {/* Date Inputs */}
              {isSearchExpanded && (
                <div className="flex flex-col md:flex-row gap-4 animate-in slide-in-from-top duration-300">
                  <div className="flex-1 relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input type="date" placeholder="Pickup date" className="pl-12 h-14 text-base bg-muted border-0" />
                  </div>
                  <div className="flex-1 relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input type="date" placeholder="Return date" className="pl-12 h-14 text-base bg-muted border-0" />
                  </div>
                </div>
              )}

              {/* Search Button */}
              <Button
                size="lg"
                className="h-14 px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                onClick={() => setIsSearchExpanded(true)}
              >
                <Search className="w-5 h-5 mr-2" />
                Search
              </Button>
            </div>

            {isSearchExpanded && (
              <div className="mt-6 flex items-center justify-center gap-2 animate-in fade-in duration-300">
                <button
                  onClick={() => setIsSearchExpanded(false)}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Close search
                </button>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 md:gap-8 mt-12 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary">500+</div>
              <div className="text-sm md:text-base text-muted-foreground mt-1">Vehicles</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary">50K+</div>
              <div className="text-sm md:text-base text-muted-foreground mt-1">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary">24/7</div>
              <div className="text-sm md:text-base text-muted-foreground mt-1">Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
