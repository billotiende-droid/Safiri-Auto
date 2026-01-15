import { Search, Car, Key, Map } from "lucide-react"

const steps = [
  {
    icon: Search,
    step: "01",
    title: "Search & Compare",
    description: "Find the perfect vehicle from our extensive fleet. Filter by category, price, and location.",
  },
  {
    icon: Car,
    step: "02",
    title: "Book Instantly",
    description: "Select your dates and book in seconds. Instant confirmation with transparent pricing.",
  },
  {
    icon: Key,
    step: "03",
    title: "Unlock & Drive",
    description: "Use your phone to unlock the car. Keys are inside. Do a quick inspection and hit the road.",
  },
  {
    icon: Map,
    step: "04",
    title: "Explore & Return",
    description: "Enjoy your journey. Return the car at your convenience. We handle the rest.",
  },
]

export function HowItWorksSection() {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
            How It <span className="text-primary">Works</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground text-pretty">
            Four simple steps to your next adventure. Get behind the wheel in minutes.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((item, index) => (
            <div key={index} className="relative">
              {/* Connector Line (hidden on mobile, visible on desktop) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-border" />
              )}

              <div className="relative bg-card rounded-xl p-8 border border-border hover:shadow-lg transition-shadow">
                <div className="relative w-16 h-16 bg-primary rounded-xl flex items-center justify-center mb-6">
                  <item.icon className="w-8 h-8 text-primary-foreground" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center text-xs font-bold text-accent-foreground">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
