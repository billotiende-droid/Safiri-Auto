import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { VehicleDetailClient } from "@/components/vehicle-detail-client"

export default async function VehicleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <VehicleDetailClient vehicleId={Number(id)} />
      </main>
      <Footer />
    </div>
  )
}
