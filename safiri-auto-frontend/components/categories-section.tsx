import Link from "next/link"
import { ChevronRight } from "lucide-react"

const categories = [
  {
    name: "Sedan",
    image: "/modern-sedan-car-white-background.jpg",
    count: 120,
    startPrice: 2500,
  },
  {
    name: "SUV",
    image: "/suv-4x4-vehicle-white-background.jpg",
    count: 85,
    startPrice: 4000,
  },
  {
    name: "Hatchback",
    image: "/compact-hatchback-car-white-background.jpg",
    count: 95,
    startPrice: 2000,
  },
  {
    name: "Van",
    image: "/passenger-van-vehicle-white-background.jpg",
    count: 40,
    startPrice: 5000,
  },
]

export function CategoriesSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Browse by Category</h2>
            <p className="text-muted-foreground">Find the perfect vehicle for your journey</p>
          </div>
          <Link
            href="/categories"
            className="hidden md:flex items-center gap-2 text-primary font-semibold hover:underline"
          >
            View All
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Link
              key={index}
              href={`/vehicles?category=${category.name}`}
              className="group bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all hover:shadow-xl"
            >
              <div className="aspect-[4/3] relative overflow-hidden bg-accent">
                <img
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">{category.count} vehicles</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">From</p>
                    <p className="text-lg font-bold text-primary">KES {category.startPrice.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <Link
          href="/categories"
          className="md:hidden flex items-center justify-center gap-2 text-primary font-semibold mt-8"
        >
          View All Categories
          <ChevronRight className="w-5 h-5" />
        </Link>
      </div>
    </section>
  )
}
