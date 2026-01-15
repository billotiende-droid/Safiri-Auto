import { Navigation } from "@/components/navigation"
import { VehiclesList } from "@/components/vehicles/vehicles-list"
import { VehicleFilters } from "@/components/vehicles/vehicle-filters"

export default function VehiclesPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
                Explore Our <span className="text-primary">Fleet</span>
              </h1>
              <p className="text-lg text-muted-foreground text-pretty">
                From compact city cars to luxury SUVs. Find the perfect vehicle for your journey.
              </p>
            </div>

            <div className="grid lg:grid-cols-4 gap-8">
              <aside className="lg:col-span-1">
                <VehicleFilters />
              </aside>
              <div className="lg:col-span-3">
                <VehiclesList />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
