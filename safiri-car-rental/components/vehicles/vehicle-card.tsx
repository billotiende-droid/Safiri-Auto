"use client"

import { Users, Settings, Fuel, Star, Trash2, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Vehicle } from "./vehicles-list"

type VehicleCardProps = {
  vehicle: Vehicle
  onDelete: (id: string) => void
  onUpdateStatus: (id: string, status: Vehicle["status"]) => void
}

export function VehicleCard({ vehicle, onDelete, onUpdateStatus }: VehicleCardProps) {
  const statusColors = {
    available: "bg-green-500/10 text-green-700 border-green-500/20",
    rented: "bg-amber-500/10 text-amber-700 border-amber-500/20",
    maintenance: "bg-red-500/10 text-red-700 border-red-500/20",
  }

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-shadow group">
      <div className="relative aspect-video overflow-hidden bg-muted">
        <img
          src={vehicle.image || "/placeholder.svg"}
          alt={vehicle.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3 flex gap-2">
          <Badge className={statusColors[vehicle.status]} variant="outline">
            {vehicle.status}
          </Badge>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-foreground mb-1">{vehicle.name}</h3>
            <p className="text-sm text-muted-foreground">{vehicle.category}</p>
          </div>
          <div className="flex items-center gap-1 text-amber-500">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm font-semibold text-foreground">{vehicle.rating}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>{vehicle.seats}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Settings className="w-4 h-4" />
            <span>{vehicle.transmission}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Fuel className="w-4 h-4" />
            <span>{vehicle.fuel}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div>
            <div className="text-2xl font-bold text-primary">${vehicle.price}</div>
            <div className="text-xs text-muted-foreground">per day</div>
          </div>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-1" />
                  Manage
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onUpdateStatus(vehicle.id, "available")}>
                  Set Available
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onUpdateStatus(vehicle.id, "rented")}>Set Rented</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onUpdateStatus(vehicle.id, "maintenance")}>
                  Set Maintenance
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete(vehicle.id)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Book Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
