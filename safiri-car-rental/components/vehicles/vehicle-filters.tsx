"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"

export function VehicleFilters() {
  const [priceRange, setPriceRange] = useState([0, 200])

  const categories = ["Sedan", "SUV", "Luxury", "Van", "Sports"]
  const transmissions = ["Automatic", "Manual"]
  const fuelTypes = ["Petrol", "Diesel", "Electric", "Hybrid"]

  return (
    <div className="bg-card rounded-xl border border-border p-6 sticky top-24">
      <h2 className="text-lg font-bold text-foreground mb-6">Filters</h2>

      {/* Price Range */}
      <div className="mb-8">
        <Label className="text-sm font-semibold text-foreground mb-3 block">Price per Day</Label>
        <Slider value={priceRange} onValueChange={setPriceRange} max={200} step={5} className="mb-3" />
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>

      {/* Category */}
      <div className="mb-8">
        <Label className="text-sm font-semibold text-foreground mb-3 block">Category</Label>
        <div className="space-y-3">
          {categories.map((category) => (
            <div key={category} className="flex items-center gap-2">
              <Checkbox id={category} />
              <label htmlFor={category} className="text-sm text-foreground cursor-pointer">
                {category}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Transmission */}
      <div className="mb-8">
        <Label className="text-sm font-semibold text-foreground mb-3 block">Transmission</Label>
        <div className="space-y-3">
          {transmissions.map((transmission) => (
            <div key={transmission} className="flex items-center gap-2">
              <Checkbox id={transmission} />
              <label htmlFor={transmission} className="text-sm text-foreground cursor-pointer">
                {transmission}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Fuel Type */}
      <div className="mb-8">
        <Label className="text-sm font-semibold text-foreground mb-3 block">Fuel Type</Label>
        <div className="space-y-3">
          {fuelTypes.map((fuel) => (
            <div key={fuel} className="flex items-center gap-2">
              <Checkbox id={fuel} />
              <label htmlFor={fuel} className="text-sm text-foreground cursor-pointer">
                {fuel}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Apply Filters</Button>
    </div>
  )
}
