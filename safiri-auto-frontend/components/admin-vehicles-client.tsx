"use client"

import { useState, useEffect } from "react"
import { vehicleAPI, categoryAPI, type Vehicle, type Category } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Car, Pencil, Trash2, Power, CheckCircle, Loader2, AlertTriangle } from "lucide-react"



export function AdminVehiclesClient() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [formLoading, setFormLoading] = useState(false)

  const [formData, setFormData] = useState({
    owner_id: 1,
    category_id: "",
    registration_number: "",
    brand: "",
    model: "",
    price_per_day: "",
  })

  useEffect(() => {
    async function fetchData() {
      try {
        const [vehiclesData, categoriesData] = await Promise.all([vehicleAPI.getAll(), categoryAPI.getAll()])
        setVehicles(vehiclesData)
        setCategories(categoriesData)
      } catch (error) {
        console.error("Failed to fetch data:", error)
        throw error
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const resetForm = () => {
    setFormData({
      owner_id: 1,
      category_id: "",
      registration_number: "",
      brand: "",
      model: "",
      price_per_day: "",
    })
    setEditingVehicle(null)
  }

  const handleAddVehicle = async () => {
    setFormLoading(true)
    try {
      const newVehicle = await vehicleAPI.create({
        owner_id: formData.owner_id,
        category_id: Number(formData.category_id),
        registration_number: formData.registration_number,
        brand: formData.brand,
        model: formData.model,
        price_per_day: Number(formData.price_per_day),
      })
      setVehicles((prev) => [...prev, newVehicle])
    } catch (error) {
      console.error("Failed to create vehicle:", error)
      throw error
    } finally {
      setFormLoading(false)
      setShowAddDialog(false)
      resetForm()
    }
  }

  const handleUpdateVehicle = async () => {
    if (!editingVehicle) return

    setFormLoading(true)
    try {
      const updated = await vehicleAPI.update(editingVehicle.id, {
        category_id: Number(formData.category_id),
        price_per_day: Number(formData.price_per_day),
      })
      setVehicles((prev) => prev.map((v) => (v.id === editingVehicle.id ? { ...v, ...updated } : v)))
    } catch (error) {
      console.error("Failed to update vehicle:", error)
      throw error
    } finally {
      setFormLoading(false)
      setEditingVehicle(null)
      resetForm()
    }
  }

  const handleDeleteVehicle = async (id: number) => {
    setDeletingId(id)
    try {
      await vehicleAPI.delete(id)
      setVehicles((prev) => prev.filter((v) => v.id !== id))
    } catch {
      setVehicles((prev) => prev.filter((v) => v.id !== id))
    } finally {
      setDeletingId(null)
    }
  }

  const handleToggleStatus = async (id: number) => {
    try {
      const result = await vehicleAPI.toggleStatus(id)
      setVehicles((prev) => prev.map((v) => (v.id === id ? { ...v, status: result.status as Vehicle["status"] } : v)))
    } catch (error) {
      console.error("Failed to toggle vehicle status:", error)
      throw error
    }
  }

  const openEditDialog = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle)
    setFormData({
      owner_id: vehicle.owner_id,
      category_id: String(vehicle.category_id),
      registration_number: vehicle.registration_number,
      brand: vehicle.brand,
      model: vehicle.model,
      price_per_day: String(vehicle.price_per_day),
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Manage Vehicles</h1>
          <p className="text-muted-foreground mt-1">Add, edit, and manage your vehicle fleet</p>
        </div>

        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" />
              Add Vehicle
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Vehicle</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Brand</label>
                  <Input
                    placeholder="Toyota"
                    value={formData.brand}
                    onChange={(e) => setFormData((prev) => ({ ...prev, brand: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Model</label>
                  <Input
                    placeholder="Corolla"
                    value={formData.model}
                    onChange={(e) => setFormData((prev) => ({ ...prev, model: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Registration Number</label>
                <Input
                  placeholder="KAA123A"
                  value={formData.registration_number}
                  onChange={(e) => setFormData((prev) => ({ ...prev, registration_number: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <Select
                    value={formData.category_id}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, category_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.category_id} value={String(cat.category_id)}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Price Per Day (KES)</label>
                  <Input
                    type="number"
                    placeholder="2500"
                    value={formData.price_per_day}
                    onChange={(e) => setFormData((prev) => ({ ...prev, price_per_day: e.target.value }))}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </DialogClose>
              <Button onClick={handleAddVehicle} disabled={formLoading} className="bg-primary text-primary-foreground">
                {formLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add Vehicle"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Vehicles Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="w-5 h-5 text-primary" />
            Your Vehicles ({vehicles.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />
              ))}
            </div>
          ) : vehicles.length === 0 ? (
            <div className="text-center py-12">
              <Car className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No vehicles added yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Vehicle</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Registration</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Category</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Price/Day</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicles.map((vehicle) => {
                    const category = categories.find((c) => c.category_id === vehicle.category_id)
                    return (
                      <tr key={vehicle.id} className="border-b border-border hover:bg-accent/50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-8 rounded bg-accent overflow-hidden">
                              <img
                                src={`/.jpg?height=32&width=48&query=${vehicle.brand} ${vehicle.model}`}
                                alt={`${vehicle.brand} ${vehicle.model}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">
                                {vehicle.brand} {vehicle.model}
                              </p>
                              {vehicle.is_verified && (
                                <span className="text-xs text-secondary flex items-center gap-1">
                                  <CheckCircle className="w-3 h-3" /> Verified
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">{vehicle.registration_number}</td>
                        <td className="py-3 px-4">{category?.name || "Unknown"}</td>
                        <td className="py-3 px-4 font-medium">KES {vehicle.price_per_day.toLocaleString()}</td>
                        <td className="py-3 px-4">
                          <Badge
                            className={
                              vehicle.status === "available"
                                ? "bg-secondary/20 text-secondary"
                                : vehicle.status === "booked"
                                  ? "bg-primary/20 text-primary"
                                  : "bg-muted text-muted-foreground"
                            }
                          >
                            {vehicle.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleToggleStatus(vehicle.id)}
                              title={vehicle.status === "available" ? "Deactivate" : "Activate"}
                            >
                              <Power
                                className={`w-4 h-4 ${vehicle.status === "available" ? "text-secondary" : "text-muted-foreground"}`}
                              />
                            </Button>

                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={() => openEditDialog(vehicle)}>
                                  <Pencil className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Edit Vehicle</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                  <div>
                                    <label className="block text-sm font-medium mb-2">Category</label>
                                    <Select
                                      value={formData.category_id}
                                      onValueChange={(value) =>
                                        setFormData((prev) => ({ ...prev, category_id: value }))
                                      }
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {categories.map((cat) => (
                                          <SelectItem key={cat.category_id} value={String(cat.category_id)}>
                                            {cat.name}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium mb-2">Price Per Day (KES)</label>
                                    <Input
                                      type="number"
                                      value={formData.price_per_day}
                                      onChange={(e) =>
                                        setFormData((prev) => ({ ...prev, price_per_day: e.target.value }))
                                      }
                                    />
                                  </div>
                                </div>
                                <DialogFooter>
                                  <DialogClose asChild>
                                    <Button variant="outline" onClick={resetForm}>
                                      Cancel
                                    </Button>
                                  </DialogClose>
                                  <Button
                                    onClick={handleUpdateVehicle}
                                    disabled={formLoading}
                                    className="bg-primary text-primary-foreground"
                                  >
                                    {formLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>

                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-destructive">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle className="flex items-center gap-2">
                                    <AlertTriangle className="w-5 h-5 text-destructive" />
                                    Delete Vehicle
                                  </DialogTitle>
                                </DialogHeader>
                                <p className="text-muted-foreground">
                                  Are you sure you want to delete this vehicle? This action cannot be undone.
                                </p>
                                <DialogFooter>
                                  <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                  </DialogClose>
                                  <Button
                                    variant="destructive"
                                    onClick={() => handleDeleteVehicle(vehicle.id)}
                                    disabled={deletingId === vehicle.id}
                                  >
                                    {deletingId === vehicle.id ? (
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                      "Delete"
                                    )}
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
