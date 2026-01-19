import { Shield, Clock, Smartphone, CreditCard } from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "Verified Owners",
    description: "Every vehicle owner is thoroughly vetted for your safety and peace of mind.",
  },
  {
    icon: Clock,
    title: "24/7 Availability",
    description: "Book a car anytime, anywhere. Our platform never sleeps.",
  },
  {
    icon: Smartphone,
    title: "Easy Booking",
    description: "Reserve your perfect ride in just a few taps from your phone.",
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    description: "Pay safely with M-Pesa or card. Your money is always protected.",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20 bg-accent">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Why Choose Safiri Auto?</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Experience the new way to rent a car - simple, secure, and always at your fingertips.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl p-6 border border-border hover:border-primary/50 transition-all hover:shadow-lg group"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
