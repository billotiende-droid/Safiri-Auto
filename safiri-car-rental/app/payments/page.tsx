import { Navigation } from "@/components/navigation"
import { PaymentsList } from "@/components/payments/payments-list"
import { PaymentByIdLookup } from "@/components/payments/payment-by-id-lookup"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function PaymentsPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
                Payment <span className="text-primary">Management</span>
              </h1>
              <p className="text-lg text-muted-foreground text-pretty">
                Track payment status, process transactions, and manage billing.
              </p>
            </div>

            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-8">
                <TabsTrigger value="all">All Payments</TabsTrigger>
                <TabsTrigger value="lookup">Payment Lookup</TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <PaymentsList />
              </TabsContent>

              <TabsContent value="lookup">
                <PaymentByIdLookup />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}
