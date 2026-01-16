"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Car, Check, Clock, X } from "lucide-react"
import Link from "next/link"

interface Vehicle {
  id?: number
  owner_id: number
  category_id: number
  registration_number: string
  brand: string
  model: string
  price_per_day: number
  status: string
  is_verified?: boolean
}

interface VehicleCardProps {
  vehicle: Vehicle
  showBookButton?: boolean
  showAdminActions?: boolean
  onApprove?: () => void
  onReject?: () => void
}

const carImages: Record<string, string> = {
  Toyota: "/toyota-car-sedan-silver.jpg",
  Honda: "/honda-car-sedan-white.jpg",
  Nissan: "/nissan-car-suv-black.jpg",
  Mercedes: "/mercedes-benz-luxury-car-silver.jpg",
  BMW: "/bmw-luxury-sedan-blue.jpg",
  Audi: "/audi-car-sedan-black.jpg",
  Ford: "/ford-car-suv-red.jpg",
  Mazda: "/mazda-car-sedan-red.jpg",
  Subaru: "/subaru-car-hatchback-blue.jpg",
  Volkswagen: "/volkswagen-car-sedan-white.jpg",
}

export function VehicleCard({
  vehicle,
  showBookButton = true,
  showAdminActions = false,
  onApprove,
  onReject,
}: VehicleCardProps) {
  const imageUrl = carImages[vehicle.brand] || "/car-rental-vehicle.jpg"

  const getStatusBadge = () => {
    switch (vehicle.status) {
      case "available":
        return (
          <Badge className="bg-primary text-primary-foreground">
            <Check className="h-3 w-3 mr-1" /> Available
          </Badge>
        )
      case "booked":
        return (
          <Badge variant="secondary">
            <Clock className="h-3 w-3 mr-1" /> Booked
          </Badge>
        )
      case "inactive":
        return (
          <Badge variant="outline">
            <X className="h-3 w-3 mr-1" /> Inactive
          </Badge>
        )
      default:
        return <Badge variant="outline">{vehicle.status}</Badge>
    }
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 bg-muted">
        <img
          src={imageUrl || "/placeholder.svg"}
          alt={`${vehicle.brand} ${vehicle.model}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3">{getStatusBadge()}</div>
        {vehicle.is_verified === false && (
          <div className="absolute top-3 left-3">
            <Badge variant="destructive">Pending Approval</Badge>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-lg text-foreground">
              {vehicle.brand} {vehicle.model}
            </h3>
            <p className="text-sm text-muted-foreground">{vehicle.registration_number}</p>
          </div>
          <Car className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="mt-3">
          <p className="text-2xl font-bold text-primary">
            KES {vehicle.price_per_day.toLocaleString()}
            <span className="text-sm font-normal text-muted-foreground">/day</span>
          </p>
        </div>
      </CardContent>
      {(showBookButton || showAdminActions) && (
        <CardFooter className="p-4 pt-0 gap-2">
          {showAdminActions ? (
            <>
              <Button onClick={onApprove} className="flex-1" size="sm">
                <Check className="h-4 w-4 mr-1" /> Approve
              </Button>
              <Button onClick={onReject} variant="destructive" className="flex-1" size="sm">
                <X className="h-4 w-4 mr-1" /> Reject
              </Button>
            </>
          ) : (
            vehicle.status === "available" &&
            vehicle.is_verified !== false && (
              <Link href={`/vehicles/${vehicle.id || vehicle.registration_number}`} className="w-full">
                <Button className="w-full">Book Now</Button>
              </Link>
            )
          )}
        </CardFooter>
      )}
    </Card>
  )
}
