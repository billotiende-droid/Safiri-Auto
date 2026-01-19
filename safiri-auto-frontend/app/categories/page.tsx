import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CategoriesClient } from "@/components/categories-client"

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <CategoriesClient />
      </main>
      <Footer />
    </div>
  )
}
