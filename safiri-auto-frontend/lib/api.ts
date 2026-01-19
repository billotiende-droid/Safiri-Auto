// API Configuration and Helper Functions
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:5555/api"

// Generic fetch wrapper with credentials for CORS
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  // Get token from localStorage for protected routes
  const token = typeof window !== "undefined" ? localStorage.getItem("safiri_token") : null

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options?.headers,
    },
    credentials: "include",
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Request failed" }))
    throw new Error(error.error || "Something went wrong")
  }

  return response.json()
}

async function fetchRoot<T>(endpoint: string, options?: RequestInit): Promise<T> {
  // Remove /api from base URL for root-level routes
  const baseUrl = API_BASE_URL.replace("/api", "")
  const url = `${baseUrl}${endpoint}`

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    credentials: "include",
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Request failed" }))
    throw new Error(error.error || "Something went wrong")
  }

  return response.json()
}

// Vehicle Types - matches backend Vehicle model
export interface Vehicle {
  id: number
  owner_id: number
  category_id: number
  registration_number: string
  brand: string
  model: string
  price_per_day: number
  status: "available" | "booked" | "inactive"
  is_verified: boolean
  image_path?: string
}

export interface Booking {
  id: number
  vehicle_id: number
  customer_id?: number
  start_date: string
  end_date: string
  total_cost?: number
  total_amount?: number
  status: "pending" | "confirmed" | "completed" | "cancelled" | "paid"
}

// Payment Types - matches backend Payment model
export interface Payment {
  id: number
  booking_id: number
  amount_paid: number
  payment_status: "pending" | "paid" | "failed"
  payment_method: string
  payment_reference?: string
  platform_commission?: number
  owner_amount?: number
  message?: string
}

// Category Types - matches backend response
export interface Category {
  category_id: number
  name: string
}

// User/Owner Types
export interface Account {
  id: number
  name: string
  email: string
  phone_number: string
  residence?: string
  company_name?: string
}

// Auth Response Types
export interface AuthResponse {
  message: string
  token: string
  role: "user" | "owner"
  account: Account
}

// Vehicle API - matches Flask routes
export const vehicleAPI = {
  // GET /api/vehicles with optional filters
  getAll: (params?: { category_id?: number; status?: string }) => {
    const queryParams = new URLSearchParams()
    if (params?.category_id) queryParams.set("category_id", String(params.category_id))
    if (params?.status) queryParams.set("status", params.status)
    const query = queryParams.toString()
    return fetchAPI<Vehicle[]>(`/vehicles${query ? `?${query}` : ""}`)
  },

  // GET /api/vehicles/<id>
  getById: (id: number) => fetchAPI<Vehicle>(`/vehicles/${id}`),

  // POST /api/vehicles
  create: (data: {
    owner_id: number
    category_id: number
    registration_number: string
    brand: string
    model: string
    price_per_day: number
  }) =>
    fetchAPI<Vehicle>("/vehicles", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // PATCH /api/vehicles/<id>
  update: (
    id: number,
    data: Partial<{ category_id: number; price_per_day: number; status: string; is_verified: boolean }>,
  ) =>
    fetchAPI<{ vehicle_id: number; category_id: number; price_per_day: number; status: string; is_verified: boolean }>(
      `/vehicles/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(data),
      },
    ),

  // DELETE /api/vehicles/<id>
  delete: (id: number) =>
    fetchAPI<{ message: string }>(`/vehicles/${id}`, {
      method: "DELETE",
    }),

  toggleStatus: (id: number) =>
    fetchRoot<{ id: number; status: string }>(`/vehicles/${id}/status`, {
      method: "PATCH",
    }),
}

// Booking API - matches Flask routes
export const bookingAPI = {
  // GET /api/bookings
  getAll: () => fetchAPI<Booking[]>("/bookings"),

  // GET /api/bookings/<id>
  getById: (id: number) => fetchAPI<Booking>(`/bookings/${id}`),

  // POST /api/bookings - creates booking and calculates total_cost
  create: (data: { vehicle_id: number; start_date: string; end_date: string; customer_id?: number }) =>
    fetchAPI<Booking>("/bookings", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // PATCH /api/bookings/<id> - status transitions: pending->confirmed/cancelled, confirmed->completed/cancelled
  updateStatus: (id: number, status: string) =>
    fetchAPI<Booking>(`/bookings/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  // DELETE /api/bookings/<id>
  delete: (id: number) =>
    fetchAPI<{ message: string }>(`/bookings/${id}`, {
      method: "DELETE",
    }),
}

// Payment API - matches Flask routes
export const paymentAPI = {
  // GET /api/payments with optional filters
  getAll: (params?: { booking_id?: number; status?: string }) => {
    const queryParams = new URLSearchParams()
    if (params?.booking_id) queryParams.set("booking_id", String(params.booking_id))
    if (params?.status) queryParams.set("status", params.status)
    const query = queryParams.toString()
    return fetchAPI<Payment[]>(`/payments${query ? `?${query}` : ""}`)
  },

  getById: (id: number) => fetchAPI<Payment>(`/payment/${id}`),

  // POST /api/payments - only for confirmed bookings
  create: (data: { booking_id: number; payment_method?: string }) =>
    fetchAPI<Payment>("/payments", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateStatus: (id: number, payment_status: string, amount_paid?: number) =>
    fetchAPI<Payment>(`/payment/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ payment_status, ...(amount_paid !== undefined && { amount_paid }) }),
    }),
}

export const categoryAPI = {
  // GET /categories
  getAll: () => fetchRoot<Category[]>("/categories"),

  // POST /categories
  create: (name: string) =>
    fetchRoot<Category>("/categories", {
      method: "POST",
      body: JSON.stringify({ name }),
    }),
}

// Auth API - matches Flask routes
export const authAPI = {
  // POST /api/login
  login: (credentials: { email?: string; phone_number?: string; password: string }) =>
    fetchAPI<AuthResponse>("/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  // POST /api/signup
  signup: (data: {
    name: string
    email: string
    phone_number: string
    id_number: string
    residence: string
    password: string
    role: "user" | "owner"
    company_name?: string
  }) =>
    fetchAPI<AuthResponse>("/signup", {
      method: "POST",
      body: JSON.stringify(data),
    }),
}
