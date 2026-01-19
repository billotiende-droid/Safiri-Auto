import { Search, CalendarCheck, Car, Star } from "lucide-react"

const steps = [
  {
    icon: Search,
    step: "01",
    title: "Search",
    description: "Enter your location and dates to find available cars near you.",
  },
  {
    icon: CalendarCheck,
    step: "02",
    title: "Book",
    description: "Select your preferred vehicle and complete your reservation.",
  },
  {
    icon: Car,
    step: "03",
    title: "Drive",
    description: "Pick up your car and hit the road for your adventure.",
  },
  {
    icon: Star,
    step: "04",
    title: "Review",
    description: "Return the car and share your experience with the community.",
  },
]

export function HowItWorksSection() {
  return (
    <section className="py-20 bg-primary/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">How It Works</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Renting a car has never been easier. Get on the road in four simple steps.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8 relative">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-16 left-[12%] right-[12%] h-0.5 bg-border" />

          {steps.map((step, index) => (
            <div key={index} className="relative text-center">
              <div className="w-16 h-16 mx-auto bg-primary rounded-full flex items-center justify-center mb-6 relative z-10">
                <step.icon className="w-8 h-8 text-primary-foreground" />
              </div>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 bg-secondary text-secondary-foreground text-xs font-bold px-2 py-1 rounded">
                {step.step}
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
