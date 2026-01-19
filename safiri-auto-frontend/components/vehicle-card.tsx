import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, Calendar, Car } from "lucide-react"
import type { Vehicle, Category } from "@/lib/api"

interface VehicleCardProps {
  vehicle: Vehicle
  categories: Category[]
}

// Get image URL from database or fallback to placeholder
function getCarImage(vehicle: Vehicle): string {
  if (vehicle.image_path) {
    return `http://localhost:5555/uploads/${vehicle.image_path}`
  }
  const query = encodeURIComponent(`${vehicle.brand} ${vehicle.model} car`)
  return `/placeholder.svg?height=300&width=400&query=${query}`
}

export function VehicleCard({ vehicle, categories }: VehicleCardProps) {
  const category = categories.find((c) => c.category_id === vehicle.category_id)

  const statusColors: Record<string, string> = {
    available: "bg-secondary text-secondary-foreground",
    booked: "bg-primary/20 text-primary",
    inactive: "bg-muted text-muted-foreground",
  }

  return (
    <div className="group bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all hover:shadow-lg">
      {/* Image */}
      <div className="aspect-[4/3] relative overflow-hidden bg-accent">
        <img
          src={getCarImage(vehicle) || "/placeholder.svg"}
          alt={`${vehicle.brand} ${vehicle.model}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Verification Badge */}
        {vehicle.is_verified && (
          <div className="absolute top-3 right-3 bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Verified
          </div>
        )}
        {/* Status Badge */}
        <Badge className={`absolute top-3 left-3 ${statusColors[vehicle.status]}`}>
          {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
        </Badge>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              {vehicle.brand} {vehicle.model}
            </h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <Car className="w-4 h-4" />
              {category?.name || "Unknown"}
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Per day</p>
            <p className="text-xl font-bold text-primary">KES {vehicle.price_per_day.toLocaleString()}</p>
          </div>
        </div>

        {/* Registration */}
        <p className="text-xs text-muted-foreground mb-4">Reg: {vehicle.registration_number}</p>

        {/* Action */}
        <Link href={`/vehicles/${vehicle.id}`}>
          <Button
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={vehicle.status !== "available"}
          >
            <Calendar className="w-4 h-4 mr-2" />
            {vehicle.status === "available" ? "Book Now" : "View Details"}
          </Button>
        </Link>
      </div>
    </div>
  )
}
