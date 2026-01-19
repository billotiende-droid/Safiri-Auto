import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { VehicleListingClient } from "@/components/vehicle-listing-client"
import { Suspense } from "react"

export default function VehiclesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <Suspense fallback={<VehicleListingSkeleton />}>
          <VehicleListingClient />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}

function VehicleListingSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="h-8 w-48 bg-muted rounded animate-pulse mb-8" />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-card rounded-2xl overflow-hidden border border-border">
            <div className="aspect-[4/3] bg-muted animate-pulse" />
            <div className="p-5 space-y-3">
              <div className="h-6 w-32 bg-muted rounded animate-pulse" />
              <div className="h-4 w-24 bg-muted rounded animate-pulse" />
              <div className="h-8 w-20 bg-muted rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
