import { Zap, Shield, Clock, Smartphone } from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "Instant Booking",
    description: "Book your car in seconds with our streamlined process. No paperwork, no hassle.",
  },
  {
    icon: Shield,
    title: "Fully Insured",
    description: "All rentals include comprehensive insurance coverage for your peace of mind.",
  },
  {
    icon: Clock,
    title: "Flexible Hours",
    description: "Pick up and drop off 24/7. Rent by the hour or by the day - your choice.",
  },
  {
    icon: Smartphone,
    title: "Mobile First",
    description: "Unlock your car with your phone. Everything you need is in the app.",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
            Why Choose <span className="text-primary">Safiri Auto?</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground text-pretty">
            We make car rental simple, fast, and reliable. Your adventure is our priority.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-card rounded-xl p-8 hover:shadow-lg transition-shadow border border-border">
              <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
