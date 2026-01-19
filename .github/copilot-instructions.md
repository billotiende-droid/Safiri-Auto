# Safiri-Auto AI Coding Agent Instructions

## Architecture Overview

**Safiri-Auto** is a peer-to-peer vehicle rental platform with a **Next.js 16 frontend** (React 19) and **Flask backend** (SQLAlchemy ORM).

### Services & Data Flow
- **Backend** (`/server`): Flask REST API on `localhost:5555` with SQLite database (`safiri.db`)
  - Routes: `/api/vehicles`, `/api/bookings`, `/api/payments`, `/categories`, `/api/profile`, `/api/login`
  - Models: `User`, `Owner`, `Category`, `Vehicle`, `Booking`, `Payment` (see `models.py`)
- **Frontend** (`/safiri-auto-frontend`): Next.js app on `localhost:3000` using Radix UI components
  - Components marked with `"use client"` handle client-side data fetching
  - API wrapper in `lib/api.ts` handles auth tokens and CORS

### Key Integration Points
- **CORS**: Frontend communicates to Flask via `http://localhost:5555/api`; token stored in `localStorage` as `safiri_token`
- **Authentication**: Bearer token in `Authorization` header; login route returns token
- **Database Relations**: User→Bookings, Owner→Vehicles, Category→Vehicles

## Development Workflows

### Setup & Running
```bash
# Backend setup
cd server && pipenv install && pipenv shell
python seed.py  # Populate test data
python app.py   # Runs on port 5555 (debug=True)

# Frontend setup (separate terminal)
cd safiri-auto-frontend && pnpm install
pnpm dev        # Runs on port 3000
```

### Database Migrations
```bash
cd server && flask db migrate -m "description"
flask db upgrade
```

### Common Commands
- **Lint frontend**: `pnpm lint`
- **Build frontend**: `pnpm build`

## Project-Specific Patterns

### Backend (Flask)
- **Route classes inherit from `Resource`**: Use `get()`, `post()`, `put()`, `delete()` methods (Flask-RESTful pattern)
- **Response format**: Always return tuples `(data, status_code)` e.g., `return {"id": 1}, 201`
- **Serialization**: Models use `SerializerMixin` with `serialize_rules` to exclude sensitive data (`-password`, `-relationships`)
- **Query filters**: Use `request.args.get()` for query params (e.g., `/vehicles?category_id=2&status=available`)

### Frontend (Next.js)
- **Client components**: Mark data-fetching components with `"use client"` (see `vehicle-listing-client.tsx`)
- **Server components**: Use Server Components for metadata and layout (see `layout.tsx`)
- **API calls**: Use typed functions from `lib/api.ts` (e.g., `vehicleAPI.getAll()`, `bookingAPI.create()`)
- **Token management**: `fetchAPI()` wrapper automatically appends `Authorization` header from localStorage
- **UI Components**: Use Radix UI primitives from `components/ui/` (Button, Card, Dialog, Form, etc.)
- **Forms**: Use `react-hook-form` with `@hookform/resolvers` for validation (see `signup-form.tsx`, `login-form.tsx`)

### Naming Conventions
- **Components**: PascalCase files ending with `-client.tsx` for client components (e.g., `vehicle-listing-client.tsx`)
- **Routes**: Dynamic routes use brackets (e.g., `app/bookings/[id]/page.tsx`)
- **Endpoints**: REST endpoints follow pattern `/api/{resource}` and `/api/{resource}/<id>`

## Critical Patterns to Preserve

1. **Token-based auth**: Always include token from localStorage in `Authorization` header for protected routes
2. **Relationship exclusions**: Prevent circular serialization by excluding relationships in `serialize_rules`
3. **Query parameters**: Backend filters via query params (not path params) for list endpoints
4. **Error handling**: Frontend wraps API calls in try-catch; backend returns JSON error messages

## Files to Reference
- **Models & DB schema**: [server/models.py](../server/models.py)
- **API client wrapper**: [safiri-auto-frontend/lib/api.ts](../safiri-auto-frontend/lib/api.ts)
- **Example client component**: [safiri-auto-frontend/components/vehicle-listing-client.tsx](../safiri-auto-frontend/components/vehicle-listing-client.tsx)
- **Example form**: [safiri-auto-frontend/components/login-form.tsx](../safiri-auto-frontend/components/login-form.tsx)
- **Backend setup**: [server/app.py](../server/app.py)
