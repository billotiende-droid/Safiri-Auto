import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AdminVehiclesClient } from "@/components/admin-vehicles-client"

export default function AdminVehiclesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <AdminVehiclesClient />
      </main>
      <Footer />
    </div>
  )
}
