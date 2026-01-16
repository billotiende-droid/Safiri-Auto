const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555"

export async function apiRequest(endpoint: string, options?: RequestInit) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options?.headers as Record<string, string> || {}),
  }

  // Include token when available (client-side)
  let token = null
  try {
    if (typeof window !== "undefined") {
      token = localStorage.getItem("safiri_token")
    }
  } catch (e) {
    token = null
  }
  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  })
  return response
}

// Auth
export async function login(credentials: { email?: string; phone_number?: string; password: string }) {
  return apiRequest("/api/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  })
}

export async function signup(data: {
  name: string
  email: string
  phone_number: string
  id_number: string
  residence: string
  password: string
  role: "user" | "owner"
  company_name?: string
}) {
  return apiRequest("/api/signup", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

// Vehicles
export async function getVehicles(params?: { category_id?: number; status?: string }) {
  const searchParams = new URLSearchParams()
  if (params?.category_id) searchParams.set("category_id", params.category_id.toString())
  if (params?.status) searchParams.set("status", params.status)
  const query = searchParams.toString() ? `?${searchParams.toString()}` : ""
  return apiRequest(`/api/vehicles${query}`)
}

export async function getVehicle(id: number) {
  return apiRequest(`/api/vehicles/${id}`)
}

export async function createVehicle(data: {
  owner_id: number
  category_id: number
  registration_number: string
  brand: string
  model: string
  price_per_day: number
}) {
  return apiRequest("/api/vehicles", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function updateVehicle(
  id: number,
  data: Partial<{
    category_id: number
    price_per_day: number
    status: string
    is_verified: boolean
  }>,
) {
  return apiRequest(`/api/vehicles/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  })
}

export async function deleteVehicle(id: number) {
  return apiRequest(`/api/vehicles/${id}`, {
    method: "DELETE",
  })
}

// Bookings
export async function getBookings() {
  return apiRequest("/api/bookings")
}

export async function getBooking(id: number) {
  return apiRequest(`/api/bookings/${id}`)
}

export async function createBooking(data: {
  vehicle_id: number
  customer_id: number
  start_date: string
  end_date: string
}) {
  return apiRequest("/api/bookings", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function updateBooking(id: number, data: { status: string }) {
  return apiRequest(`/api/bookings/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  })
}

// Payments
export async function getPayments(params?: { booking_id?: number; status?: string }) {
  const searchParams = new URLSearchParams()
  if (params?.booking_id) searchParams.set("booking_id", params.booking_id.toString())
  if (params?.status) searchParams.set("status", params.status)
  const query = searchParams.toString() ? `?${searchParams.toString()}` : ""
  return apiRequest(`/api/payments${query}`)
}

export async function createPayment(data: { booking_id: number; payment_method?: string }) {
  return apiRequest("/api/payments", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function updatePayment(id: number, data: { payment_status: string; amount_paid?: number }) {
  return apiRequest(`/api/payment/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  })
}
