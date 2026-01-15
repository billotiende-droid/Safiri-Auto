import { Navigation } from "@/components/navigation"
import { BookingsList } from "@/components/bookings/bookings-list"
import { CreateBookingForm } from "@/components/bookings/create-booking-form"
import { VehicleAvailabilityChecker } from "@/components/bookings/vehicle-availability-checker"
import { BookingCart } from "@/components/bookings/booking-cart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function BookingsPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
                Manage Your <span className="text-primary">Bookings</span>
              </h1>
              <p className="text-lg text-muted-foreground text-pretty">
                Check availability, create new bookings, and track rental costs.
              </p>
            </div>

            <Tabs defaultValue="bookings" className="w-full">
              <TabsList className="mb-8">
                <TabsTrigger value="bookings">All Bookings</TabsTrigger>
                <TabsTrigger value="create">Create Booking</TabsTrigger>
                <TabsTrigger value="cart">Booking Cart</TabsTrigger>
                <TabsTrigger value="availability">Check Availability</TabsTrigger>
              </TabsList>

              <TabsContent value="bookings">
                <BookingsList />
              </TabsContent>

              <TabsContent value="create">
                <CreateBookingForm />
              </TabsContent>

              <TabsContent value="cart">
                <BookingCart />
              </TabsContent>

              <TabsContent value="availability">
                <VehicleAvailabilityChecker />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}
