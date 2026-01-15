import { Navigation } from "@/components/navigation"
import { CategoriesList } from "@/components/categories/categories-list"
import { CreateCategoryForm } from "@/components/categories/create-category-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function CategoriesPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
                Vehicle <span className="text-primary">Categories</span>
              </h1>
              <p className="text-lg text-muted-foreground text-pretty">
                Organize your fleet by category. Manage vehicle types and classifications.
              </p>
            </div>

            <Tabs defaultValue="categories" className="w-full">
              <TabsList className="mb-8">
                <TabsTrigger value="categories">All Categories</TabsTrigger>
                <TabsTrigger value="create">Create Category</TabsTrigger>
              </TabsList>

              <TabsContent value="categories">
                <CategoriesList />
              </TabsContent>

              <TabsContent value="create">
                <CreateCategoryForm />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}
