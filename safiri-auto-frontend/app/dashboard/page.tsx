import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { UserDashboardClient } from "@/components/user-dashboard-client"
import { Suspense } from "react"

export const metadata = {
  title: "User Dashboard - Safiri Auto",
  description: "Manage your vehicle bookings and payments",
}

export default function UserDashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <Suspense fallback={<DashboardSkeleton />}>
          <UserDashboardClient />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="h-10 w-48 bg-muted rounded animate-pulse mb-8" />
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-6 animate-pulse">
            <div className="h-4 w-24 bg-muted rounded mb-2" />
            <div className="h-8 w-32 bg-muted rounded" />
          </div>
        ))}
      </div>
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-6 animate-pulse">
            <div className="h-6 w-32 bg-muted rounded mb-4" />
            <div className="space-y-3">
              <div className="h-4 w-full bg-muted rounded" />
              <div className="h-4 w-3/4 bg-muted rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
