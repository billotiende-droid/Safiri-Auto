import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BookingListClient } from "@/components/booking-list-client"

export default function BookingsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <BookingListClient />
      </main>
      <Footer />
    </div>
  )
}
