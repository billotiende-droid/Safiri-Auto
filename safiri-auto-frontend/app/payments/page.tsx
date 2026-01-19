import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PaymentListClient } from "@/components/payment-list-client"
import { Suspense } from "react"

export default function PaymentsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <Suspense fallback={<PaymentsSkeleton />}>
          <PaymentListClient />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}

function PaymentsSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="h-8 w-48 bg-muted rounded animate-pulse mb-8" />
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-6 animate-pulse">
            <div className="flex gap-4">
              <div className="w-16 h-16 bg-muted rounded-full" />
              <div className="flex-1 space-y-3">
                <div className="h-6 w-32 bg-muted rounded" />
                <div className="h-4 w-48 bg-muted rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
