// "use client"

// import { useState, useEffect } from "react"
// import { AuthProvider } from "@/lib/auth-context"
// import { Navbar } from "@/components/navbar"
// import { VehicleCard } from "@/components/vehicle-card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Search, Filter, Loader2, Car } from "lucide-react"
// import { getVehicles } from "@/lib/api"

// interface Vehicle {
//   id?: number
//   owner_id: number
//   category_id: number
//   registration_number: string
//   brand: string
//   model: string
//   price_per_day: number
//   status: string
//   is_verified?: boolean
// }

// // Demo vehicles for when API isn't available
// // const demoVehicles: Vehicle[] = [
// //   {
// //     id: 1,
// //     owner_id: 1,
// //     category_id: 1,
// //     registration_number: "KDA 123A",
// //     brand: "Toyota",
// //     model: "Camry",
// //     price_per_day: 5000,
// //     status: "available",
// //     is_verified: true,
// //   },
// //   {
// //     id: 2,
// //     owner_id: 1,
// //     category_id: 1,
// //     registration_number: "KDB 456B",
// //     brand: "Honda",
// //     model: "Civic",
// //     price_per_day: 4500,
// //     status: "available",
// //     is_verified: true,
// //   },
// //   {
// //     id: 3,
// //     owner_id: 2,
// //     category_id: 2,
// //     registration_number: "KDC 789C",
// //     brand: "Nissan",
// //     model: "X-Trail",
// //     price_per_day: 7500,
// //     status: "booked",
// //     is_verified: true,
// //   },
// //   {
// //     id: 4,
// //     owner_id: 2,
// //     category_id: 2,
// //     registration_number: "KDD 012D",
// //     brand: "Mercedes",
// //     model: "E-Class",
// //     price_per_day: 15000,
// //     status: "available",
// //     is_verified: true,
// //   },
// //   {
// //     id: 5,
// //     owner_id: 3,
// //     category_id: 1,
// //     registration_number: "KDE 345E",
// //     brand: "BMW",
// //     model: "3 Series",
// //     price_per_day: 12000,
// //     status: "available",
// //     is_verified: true,
// //   },
// //   {
// //     id: 6,
// //     owner_id: 3,
// //     category_id: 3,
// //     registration_number: "KDF 678F",
// //     brand: "Ford",
// //     model: "Ranger",
// //     price_per_day: 8000,
// //     status: "available",
// //     is_verified: true,
// //   },
// //   {
// //     id: 7,
// //     owner_id: 1,
// //     category_id: 1,
// //     registration_number: "KDG 901G",
// //     brand: "Mazda",
// //     model: "CX-5",
// //     price_per_day: 6500,
// //     status: "available",
// //     is_verified: true,
// //   },
// //   {
// //     id: 8,
// //     owner_id: 2,
// //     category_id: 2,
// //     registration_number: "KDH 234H",
// //     brand: "Subaru",
// //     model: "Forester",
// //     price_per_day: 7000,
// //     status: "inactive",
// //     is_verified: true,
// //   },
// // ]

// function VehiclesContent() {
//   const [vehicles, setVehicles] = useState<Vehicle[]>([])
//   const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([])
//   const [loading, setLoading] = useState(true)
//   const [searchQuery, setSearchQuery] = useState("")
//   const [statusFilter, setStatusFilter] = useState("all")
//   const [showAvailableOnly, setShowAvailableOnly] = useState(false)
//   const [priceRange, setPriceRange] = useState("all")
//   // Added
//   const [error, setError] = useState<string | null>(null)

//   useEffect(() => {
//     fetchVehicles()
//   }, [])

//   useEffect(() => {
//     applyFilters()
//   }, [vehicles, searchQuery, statusFilter, showAvailableOnly, priceRange])

//   // const fetchVehicles = async () => {
//   //   try {
//   //     const response = await getVehicles()
//   //     if (response.ok) {
//   //       const data = await response.json()
//   //       // Filter to only show verified vehicles
//   //       const verifiedVehicles = data.filter((v: Vehicle) => v.is_verified !== false)
//   //       setVehicles(verifiedVehicles)
//   //     } else {
//   //       // Use demo data if API fails
//   //       setVehicles(demoVehicles)
//   //     }
//   //   } catch {
//   //     // Use demo data if API fails
//   //     setVehicles(demoVehicles)
//   //   } finally {
//   //     setLoading(false)
//   //   }
//   // }

//   const fetchVehicles = async () => {
//   try {
//     setError(null)

//     const response = await getVehicles()

//     if (!response.ok) {
//       throw new Error(`Failed to fetch vehicles (${response.status})`)
//     }

//     const data = await response.json()

//     // Filter to only show verified vehicles
//     const verifiedVehicles = data.filter(
//       (v: Vehicle) => v.is_verified !== false
//     )

//     setVehicles(verifiedVehicles)
//   } catch (err) {
//     setVehicles([])
//     setError(
//       err instanceof Error
//         ? err.message
//         : "Unable to load vehicles. Please try again later."
//     )
//   } finally {
//     setLoading(false)
//   }
// }

//   const applyFilters = () => {
//     let result = [...vehicles]

//     // Search filter
//     if (searchQuery) {
//       const query = searchQuery.toLowerCase()
//       result = result.filter(
//         (v) =>
//           v.brand.toLowerCase().includes(query) ||
//           v.model.toLowerCase().includes(query) ||
//           v.registration_number.toLowerCase().includes(query),
//       )
//     }

//     // Status filter
//     if (statusFilter !== "all") {
//       result = result.filter((v) => v.status === statusFilter)
//     }

//     // Available only
//     if (showAvailableOnly) {
//       result = result.filter((v) => v.status === "available")
//     }

//     // Price range
//     if (priceRange !== "all") {
//       const [min, max] = priceRange.split("-").map(Number)
//       result = result.filter((v) => v.price_per_day >= min && (max ? v.price_per_day <= max : true))
//     }

//     setFilteredVehicles(result)
//   }

//   const availableCount = vehicles.filter((v) => v.status === "available").length
//   const bookedCount = vehicles.filter((v) => v.status === "booked").length

//   return (
//     <div className="min-h-screen bg-background">
//       <Navbar />

//       <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-foreground">Browse Vehicles</h1>
//           <p className="mt-2 text-muted-foreground">Find the perfect car for your next trip</p>
//           <div className="mt-4 flex gap-4 text-sm">
//             <span className="text-primary font-medium">{availableCount} Available</span>
//             <span className="text-muted-foreground">{bookedCount} Booked</span>
//           </div>
//         </div>

//         {/* Filters */}
//         <div className="bg-card border border-border rounded-lg p-4 mb-8">
//           <div className="flex items-center gap-2 mb-4">
//             <Filter className="h-5 w-5 text-muted-foreground" />
//             <span className="font-medium text-foreground">Filters</span>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="search">Search</Label>
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                 <Input
//                   id="search"
//                   placeholder="Brand, model, or plate..."
//                   className="pl-9"
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                 />
//               </div>
//             </div>

//             <div className="space-y-2">
//               <Label>Status</Label>
//               <Select value={statusFilter} onValueChange={setStatusFilter}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="All statuses" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All Statuses</SelectItem>
//                   <SelectItem value="available">Available</SelectItem>
//                   <SelectItem value="booked">Booked</SelectItem>
//                   <SelectItem value="inactive">Inactive</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="space-y-2">
//               <Label>Price Range (KES/day)</Label>
//               <Select value={priceRange} onValueChange={setPriceRange}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="All prices" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All Prices</SelectItem>
//                   <SelectItem value="0-5000">Under 5,000</SelectItem>
//                   <SelectItem value="5000-10000">5,000 - 10,000</SelectItem>
//                   <SelectItem value="10000-20000">10,000 - 20,000</SelectItem>
//                   <SelectItem value="20000-999999">Above 20,000</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="flex items-end">
//               <div className="flex items-center space-x-2">
//                 <Checkbox
//                   id="available"
//                   checked={showAvailableOnly}
//                   onCheckedChange={(checked) => setShowAvailableOnly(checked === true)}
//                 />
//                 <Label htmlFor="available" className="text-sm cursor-pointer">
//                   Show available only
//                 </Label>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Results */}
//         {loading ? (
//           <div className="flex items-center justify-center py-20">
//             <Loader2 className="h-8 w-8 animate-spin text-primary" />
//           </div>
//         ) : filteredVehicles.length === 0 ? (
//           <div className="text-center py-20">
//             <Car className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
//             <h3 className="text-lg font-medium text-foreground">No vehicles found</h3>
//             <p className="text-muted-foreground mt-2">Try adjusting your filters</p>
//             <Button
//               variant="outline"
//               className="mt-4 bg-transparent"
//               onClick={() => {
//                 setSearchQuery("")
//                 setStatusFilter("all")
//                 setShowAvailableOnly(false)
//                 setPriceRange("all")
//               }}
//             >
//               Clear Filters
//             </Button>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//             {filteredVehicles.map((vehicle, index) => (
//               <VehicleCard key={vehicle.id || index} vehicle={{ ...vehicle, id: vehicle.id || index + 1 }} />
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// export default function VehiclesPage() {
//   return (
//     <AuthProvider>
//       <VehiclesContent />
//     </AuthProvider>
//   )
// }


"use client"

import { useState, useEffect } from "react"
import { AuthProvider } from "@/lib/auth-context"
import { Navbar } from "@/components/navbar"
import { VehicleCard } from "@/components/vehicle-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Filter, Loader2, Car } from "lucide-react"
import { getVehicles } from "@/lib/api"

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

function VehiclesContent() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showAvailableOnly, setShowAvailableOnly] = useState(false)
  const [priceRange, setPriceRange] = useState("all")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchVehicles()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [vehicles, searchQuery, statusFilter, showAvailableOnly, priceRange])

  const fetchVehicles = async () => {
    try {
      setError(null)

      const response = await getVehicles()

      if (!response.ok) {
        throw new Error(`Failed to fetch vehicles (${response.status})`)
      }

      const data = await response.json()

      // Filter to only show verified vehicles
      const verifiedVehicles = data.filter(
        (v: Vehicle) => v.is_verified !== false
      )

      setVehicles(verifiedVehicles)
    } catch (err) {
      setVehicles([])
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load vehicles. Please try again later."
      )
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let result = [...vehicles]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (v) =>
          v.brand.toLowerCase().includes(query) ||
          v.model.toLowerCase().includes(query) ||
          v.registration_number.toLowerCase().includes(query),
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((v) => v.status === statusFilter)
    }

    // Available only
    if (showAvailableOnly) {
      result = result.filter((v) => v.status === "available")
    }

    // Price range
    if (priceRange !== "all") {
      const [min, max] = priceRange.split("-").map(Number)
      result = result.filter((v) => v.price_per_day >= min && (max ? v.price_per_day <= max : true))
    }

    setFilteredVehicles(result)
  }

  const availableCount = vehicles.filter((v) => v.status === "available").length
  const bookedCount = vehicles.filter((v) => v.status === "booked").length

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Browse Vehicles</h1>
          <p className="mt-2 text-muted-foreground">Find the perfect car for your next trip</p>
          <div className="mt-4 flex gap-4 text-sm">
            <span className="text-primary font-medium">{availableCount} Available</span>
            <span className="text-muted-foreground">{bookedCount} Booked</span>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-card border border-border rounded-lg p-4 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium text-foreground">Filters</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Brand, model, or plate..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="booked">Booked</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Price Range (KES/day)</Label>
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger>
                  <SelectValue placeholder="All prices" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="0-5000">Under 5,000</SelectItem>
                  <SelectItem value="5000-10000">5,000 - 10,000</SelectItem>
                  <SelectItem value="10000-20000">10,000 - 20,000</SelectItem>
                  <SelectItem value="20000-999999">Above 20,000</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="available"
                  checked={showAvailableOnly}
                  onCheckedChange={(checked) => setShowAvailableOnly(checked === true)}
                />
                <Label htmlFor="available" className="text-sm cursor-pointer">
                  Show available only
                </Label>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredVehicles.length === 0 ? (
          <div className="text-center py-20">
            <Car className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground">No vehicles found</h3>
            <p className="text-muted-foreground mt-2">Try adjusting your filters</p>
            <Button
              variant="outline"
              className="mt-4 bg-transparent"
              onClick={() => {
                setSearchQuery("")
                setStatusFilter("all")
                setShowAvailableOnly(false)
                setPriceRange("all")
              }}
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredVehicles.map((vehicle, index) => (
              <VehicleCard key={vehicle.id || index} vehicle={{ ...vehicle, id: vehicle.id || index + 1 }} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function VehiclesPage() {
  return (
    <AuthProvider>
      <VehiclesContent />
    </AuthProvider>
  )
}
