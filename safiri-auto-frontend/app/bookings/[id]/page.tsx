import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BookingDetailClient } from "@/components/booking-detail-client"

export default async function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <BookingDetailClient bookingId={Number(id)} />
      </main>
      <Footer />
    </div>
  )
}
