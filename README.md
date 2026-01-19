# Safiri Auto - Peer-to-Peer Vehicle Rental Platform

![Node.js Version](https://img.shields.io/badge/Node.js-v22.22.0-green)
![Python Version](https://img.shields.io/badge/Python-3.8+-blue)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![Flask](https://img.shields.io/badge/Flask-3.0.3-lightblue)
![License](https://img.shields.io/badge/License-MIT-green)

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Authentication](#authentication)
- [Environment Setup](#environment-setup)
- [Development Workflow](#development-workflow)
- [Contributing](#contributing)

---

## 🚗 Overview

**Safiri Auto** is a modern peer-to-peer vehicle rental platform built with **Next.js 16** (React 19) on the frontend and **Flask** with SQLAlchemy on the backend. The platform enables vehicle owners to list their cars for rent and allows customers to browse and book available vehicles.

### Live URLs
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5555/api

---

## ✨ Key Features

### For Customers
- 🔐 **User Registration & Authentication** - Secure signup with JWT tokens
- 🏎️ **Browse Vehicles** - Filter by category, availability, and price
- 📸 **Vehicle Details** - View vehicle photos, descriptions, and pricing
- 📅 **Book Vehicles** - Reserve vehicles for specific date ranges
- 💳 **Make Payments** - Secure payment processing
- 📊 **View Bookings** - Track active and historical bookings
- ⭐ **Leave Reviews** - Rate and comment on rental experiences

### For Vehicle Owners
- 🏪 **Owner Dashboard** - Manage vehicles and bookings
- ➕ **Add Vehicles** - List new vehicles with photos and pricing
- 📝 **Manage Fleet** - Edit vehicle details, pricing, and status
- 💰 **Track Revenue** - Monitor earnings from bookings
- ✓ **Verify Status** - Track vehicle verification status
- 📊 **Analytics** - View booking history and performance metrics

### General Features
- 🔒 **Role-Based Access Control** - Separate dashboards for users and owners
- 🎨 **Responsive Design** - Works on desktop, tablet, and mobile
- 🌐 **RESTful API** - Clean, well-documented API endpoints
- 📱 **Dynamic Navigation** - Header updates based on authentication status
- 🖼️ **Vehicle Images** - Display photos from local storage (`Auto-Safiris` folder)

---

## 🏗️ Architecture

### System Design

```
┌─────────────────────────────────────────────────────────┐
│                    Client (Browser)                     │
│          Next.js 16 Frontend @ localhost:3000           │
│  (React 19, TypeScript, Radix UI, React-Hook-Form)     │
└──────────────────┬──────────────────────────────────────┘
                   │ HTTP/CORS
                   ↓
┌─────────────────────────────────────────────────────────┐
│              API Server (Flask)                         │
│       Running on localhost:5555                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Routes:                                          │  │
│  │ • /api/vehicles (GET, POST, PATCH, DELETE)     │  │
│  │ • /api/bookings (GET, POST, PATCH, DELETE)     │  │
│  │ • /api/payments (GET, POST, PATCH)             │  │
│  │ • /api/login (POST)                            │  │
│  │ • /api/signup (POST)                           │  │
│  │ • /api/profile (GET)                           │  │
│  │ • /uploads/* (Static file serving)             │  │
│  └──────────────────────────────────────────────────┘  │
└──────────────────┬──────────────────────────────────────┘
                   │ SQLAlchemy ORM
                   ↓
┌─────────────────────────────────────────────────────────┐
│            Database (SQLite)                            │
│              safiri.db                                  │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Tables:                                          │  │
│  │ • users (Customers)                             │  │
│  │ • owners (Vehicle owners)                       │  │
│  │ • vehicles (Car inventory)                      │  │
│  │ • categories (Vehicle types)                    │  │
│  │ • bookings (Rental reservations)                │  │
│  │ • payments (Transaction records)                │  │
│  │ • reviews (Customer feedback)                   │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Data Flow

1. **User authenticates** → Token stored in localStorage
2. **Frontend sends requests** → Authorization header includes Bearer token
3. **Backend validates token** → Protected routes checked via ProtectedResource
4. **Database operations** → ORM handles CRUD operations
5. **Response returned** → Frontend updates UI with data

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| **Next.js 16** | React framework for SSR/SSG |
| **React 19** | UI library |
| **TypeScript** | Type safety |
| **Radix UI** | Accessible component library |
| **React-Hook-Form** | Form state management |
| **TailwindCSS** | Utility-first CSS |
| **Lucide React** | Icon library |

### Backend
| Technology | Purpose |
|-----------|---------|
| **Flask 3.0** | Python web framework |
| **Flask-RESTful** | REST API extension |
| **SQLAlchemy 2.0** | ORM |
| **Flask-SQLAlchemy** | SQLAlchemy integration |
| **Flask-Migrate** | Database migrations |
| **Flask-CORS** | Cross-origin requests |
| **PyJWT** | JWT token generation |
| **Werkzeug** | Security utilities |

### Database
| Technology | Purpose |
|-----------|---------|
| **SQLite** | Lightweight database for development |
| **Alembic** | Database schema versioning |

---

## 📁 Project Structure

```
Safiri-Auto/
├── server/                          # Flask backend
│   ├── app.py                       # Main application entry point
│   ├── models.py                    # SQLAlchemy database models
│   ├── seed.py                      # Database seeding script
│   ├── routes/                      # API endpoint handlers
│   │   ├── vehicles.py              # Vehicle CRUD operations
│   │   ├── bookings.py              # Booking management
│   │   ├── payments.py              # Payment processing
│   │   ├── categories.py            # Vehicle categories
│   │   ├── logins.py                # Authentication
│   │   └── user_profile.py          # User profile management
│   ├── services/                    # Business logic
│   │   ├── auth.py                  # JWT token generation
│   │   └── protected_resource.py    # Auth middleware
│   ├── migrations/                  # Database migrations
│   ├── safiri.db                    # SQLite database
│   └── Pipfile                      # Python dependencies
│
├── safiri-auto-frontend/            # Next.js frontend
│   ├── app/                         # Next.js app directory
│   │   ├── page.tsx                 # Landing page
│   │   ├── layout.tsx               # Root layout
│   │   ├── login/                   # Login page
│   │   ├── signup/                  # Signup page
│   │   ├── dashboard/               # User dashboard
│   │   ├── admin/                   # Owner dashboard
│   │   ├── vehicles/                # Vehicle browsing
│   │   ├── bookings/                # Booking management
│   │   ├── payments/                # Payment tracking
│   │   └── categories/              # Category browsing
│   ├── components/                  # Reusable React components
│   │   ├── vehicle-card.tsx         # Vehicle display component
│   │   ├── vehicle-listing-client.tsx # Vehicles list with filters
│   │   ├── login-form.tsx           # Login form
│   │   ├── signup-form.tsx          # Signup form
│   │   ├── header.tsx               # Navigation header
│   │   ├── footer.tsx               # Footer
│   │   ├── user-dashboard-client.tsx # User dashboard
│   │   ├── admin-dashboard-client.tsx # Owner dashboard
│   │   └── ui/                      # Radix UI components
│   ├── hooks/                       # React hooks
│   │   └── use-auth.ts              # Authentication hook
│   ├── lib/                         # Utilities
│   │   ├── api.ts                   # API client with TypeScript interfaces
│   │   └── utils.ts                 # Helper functions
│   ├── styles/                      # Global styles
│   ├── public/                      # Static assets
│   ├── next.config.mjs              # Next.js configuration
│   ├── tsconfig.json                # TypeScript configuration
│   ├── package.json                 # npm dependencies
│   └── postcss.config.mjs           # PostCSS configuration
│
├── Auto-Safiris/                    # Vehicle image storage
│   ├── civic.jpg
│   ├── 2005_toyota_corolla-pic-8721495962592854439-1024x768.jpeg
│   ├── 2017-Nissan-X-Trail-2.0-4WD-NT32-a.jpg
│   ├── 2020-toyota-land-cruiser-001.webp
│   ├── Mercedes-Benz-S-Class-wallpaper-1920x960.jpg.webp
│   ├── audi a8.jpg
│   └── Nissan Sunny.jpeg
│
├── .github/                         # GitHub configuration
│   └── copilot-instructions.md      # AI guidelines
│
├── README.md                        # This file
├── Pipfile                          # Python environment
└── start-backend.sh                 # Backend startup script
```

---

## 📋 Prerequisites

### System Requirements
- **Node.js**: v22.22.0 or higher
- **Python**: 3.8 or higher
- **npm**: v10.9.4 or higher
- **Git**: For version control

### Required Knowledge
- Basic REST API concepts
- React/Next.js fundamentals
- Python and Flask basics
- SQL and database concepts

---

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/billotiende-droid/Safiri-Auto.git
cd Safiri-Auto
```

### 2. Backend Setup

#### Install Python Dependencies
```bash
cd server
pip install pipenv
pipenv install
pipenv shell
```

#### Initialize Database
```bash
# Create database and apply migrations
flask db upgrade

# Seed with sample data
python seed.py
```

#### Verify Setup
```bash
# Should output: ✓ SQLite database initialized
python -c "from app import db; print('✓ Database connection successful')"
```

### 3. Frontend Setup

#### Install Node Dependencies
```bash
cd safiri-auto-frontend

# Using npm (nvm recommended for Node version management)
npm install

# Or using pnpm (if installed)
pnpm install
```

---

## ▶️ Running the Application

### Quick Start (Both Servers)

#### Option 1: Using the Startup Script
```bash
cd /home/user/Development/python-phase3/se-python/Safiri-Auto
bash start-backend.sh
# Then in another terminal:
bash start-frontend.sh
```

#### Option 2: Manual Startup

**Terminal 1 - Backend:**
```bash
cd server
source /path/to/venv/bin/activate  # Activate Python venv
python app.py
# Output: Running on http://127.0.0.1:5555
```

**Terminal 2 - Frontend:**
```bash
cd safiri-auto-frontend
npm run dev
# Output: ▲ Next.js 16 ready on http://localhost:3000
```

### Access the Application

| Component | URL |
|-----------|-----|
| Frontend (Landing) | http://localhost:3000 |
| Vehicles Listing | http://localhost:3000/vehicles |
| Login | http://localhost:3000/login |
| Signup | http://localhost:3000/signup |
| User Dashboard | http://localhost:3000/dashboard |
| Owner Dashboard | http://localhost:3000/admin/dashboard |
| API Base | http://localhost:5555/api |

### Test Credentials

**User Account:**
- Email: `hanan@example.com`
- Password: `123456`

**Owner Account:**
- Email: `owner1@example.com`
- Password: `ownerpass`

---

## 📡 API Documentation

### Authentication Endpoints

#### POST /api/signup
**Register a new user or owner**
```json
Request:
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone_number": "0722000000",
  "id_number": "12345678",
  "residence": "Nairobi",
  "password": "password123",
  "role": "user",  // or "owner"
  "company_name": "Optional for owners"
}

Response (201):
{
  "message": "User created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "user",
  "account": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### POST /api/login
**Authenticate user and get token**
```json
Request:
{
  "email": "john@example.com",
  "password": "password123"
}

Response (200):
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "user",
  "account": { ... }
}
```

### Vehicle Endpoints

#### GET /api/vehicles
**Fetch all vehicles with optional filters**
```
Query Parameters:
- status: "available" | "booked" | "inactive"
- category_id: <integer>

Response (200):
[
  {
    "id": 1,
    "owner_id": 1,
    "category_id": 1,
    "registration_number": "KAA123A",
    "brand": "Toyota",
    "model": "Corolla",
    "price_per_day": 2500,
    "status": "available",
    "is_verified": true,
    "image_path": "2005_toyota_corolla-pic-8721495962592854439-1024x768.jpeg"
  }
]
```

#### POST /api/vehicles
**Create a new vehicle (Owner only)**
```json
Request (Auth required):
{
  "owner_id": 1,
  "category_id": 1,
  "registration_number": "KAA999A",
  "brand": "Honda",
  "model": "Civic",
  "price_per_day": 3000,
  "image_path": "civic.jpg"
}

Response (201): Vehicle object
```

#### GET /api/vehicles/<id>
**Get vehicle details**
```
Response (200): Vehicle object with all fields
```

#### PATCH /api/vehicles/<id>
**Update vehicle details (Owner only)**
```json
Request (Auth required):
{
  "price_per_day": 3500,
  "status": "inactive",
  "image_path": "new_image.jpg"
}

Response (200): Updated vehicle object
```

#### DELETE /api/vehicles/<id>
**Delete a vehicle (Owner only)**
```
Response (200): { "message": "Vehicle deleted successfully" }
```

### Booking Endpoints

#### GET /api/bookings
**Fetch user's bookings (Auth required)**
```
Response (200): Array of booking objects
```

#### POST /api/bookings
**Create a new booking (Auth required)**
```json
Request:
{
  "vehicle_id": 1,
  "start_date": "2026-01-20",
  "end_date": "2026-01-25",
  "customer_id": 1
}

Response (201):
{
  "id": 1,
  "vehicle_id": 1,
  "customer_id": 1,
  "start_date": "2026-01-20T00:00:00",
  "end_date": "2026-01-25T00:00:00",
  "total_amount": 12500,
  "status": "pending"
}
```

#### PATCH /api/bookings/<id>
**Update booking status (Auth required)**
```json
Request:
{
  "status": "confirmed"  // or "completed", "cancelled"
}

Response (200): Updated booking object
```

### Payment Endpoints

#### GET /api/payments
**Fetch payments (Auth required)**
```
Query Parameters:
- booking_id: <integer>
- status: "pending" | "paid" | "failed"

Response (200): Array of payment objects
```

#### POST /api/payments
**Create a payment for confirmed booking (Auth required)**
```json
Request:
{
  "booking_id": 1,
  "payment_method": "mpesa"  // or "card", "bank_transfer"
}

Response (201):
{
  "id": 1,
  "booking_id": 1,
  "amount_paid": 12500,
  "payment_status": "pending",
  "payment_method": "mpesa",
  "platform_commission": 1250,
  "owner_amount": 11250
}
```

### Category Endpoints

#### GET /categories
**Fetch all vehicle categories**
```
Response (200):
[
  { "category_id": 1, "name": "Sedan" },
  { "category_id": 2, "name": "SUV" }
]
```

---

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(120) UNIQUE NOT NULL,
  phone_number VARCHAR(20) UNIQUE NOT NULL,
  id_number VARCHAR(20) UNIQUE NOT NULL,
  residence VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Owners Table
```sql
CREATE TABLE owners (
  id INTEGER PRIMARY KEY,
  user_id INTEGER UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(120) UNIQUE NOT NULL,
  phone_number VARCHAR(20) UNIQUE NOT NULL,
  company_name VARCHAR(100),
  id_number VARCHAR(20) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Vehicles Table
```sql
CREATE TABLE vehicles (
  id INTEGER PRIMARY KEY,
  owner_id INTEGER NOT NULL,
  category_id INTEGER NOT NULL,
  registration_number VARCHAR(50) UNIQUE NOT NULL,
  brand VARCHAR(50) NOT NULL,
  model VARCHAR(50) NOT NULL,
  price_per_day INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'available',
  is_verified BOOLEAN DEFAULT FALSE,
  image_path VARCHAR(255),
  FOREIGN KEY (owner_id) REFERENCES owners(id),
  FOREIGN KEY (category_id) REFERENCES categories(id)
);
```

### Bookings Table
```sql
CREATE TABLE bookings (
  id INTEGER PRIMARY KEY,
  vehicle_id INTEGER NOT NULL,
  customer_id INTEGER NOT NULL,
  start_date DATETIME NOT NULL,
  end_date DATETIME NOT NULL,
  total_amount INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id),
  FOREIGN KEY (customer_id) REFERENCES users(id)
);
```

### Payments Table
```sql
CREATE TABLE payments (
  id INTEGER PRIMARY KEY,
  booking_id INTEGER UNIQUE NOT NULL,
  amount_paid INTEGER NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  platform_commission INTEGER NOT NULL,
  owner_amount INTEGER NOT NULL,
  payment_status VARCHAR(20) DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES bookings(id)
);
```

---

## 🔐 Authentication

### JWT Token Structure

Tokens are generated on signup/login and valid for 24 hours.

```
Header: {
  "alg": "HS256",
  "typ": "JWT"
}

Payload: {
  "sub": 1,              // User ID
  "role": "user",        // "user" or "owner"
  "iat": 1768634153,     // Issued at
  "exp": 1768720553      // Expires at (24 hours)
}
```

### Protected Resources

Routes requiring authentication use the `ProtectedResource` base class:
- `/api/profile` - Get authenticated user's profile
- `/api/bookings` - Get user's bookings
- `/api/payments` - Get payments
- `/admin/dashboard` - Owner-only dashboard

### Token Storage

- **Storage Location**: Browser localStorage as `safiri_token`
- **Sent In**: Authorization header as `Bearer <token>`
- **Cleared On**: User logout
- **HttpOnly**: Not implemented (use in production)

---

## 🔧 Environment Setup

### Frontend Environment Variables

Create `.env.local` in `safiri-auto-frontend/`:
```
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:5555/api
```

### Backend Environment Variables

Create `.env` in `server/`:
```
FLASK_ENV=development
FLASK_DEBUG=True
DATABASE_URL=sqlite:///safiri.db
JWT_SECRET=your-secret-key-here
```

### Database Configuration

Flask uses SQLite for development:
```python
# server/app.py
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{os.path.abspath("./safiri.db")}'
```

---

## 📊 Development Workflow

### 1. Creating New Database Models

1. Add model to `server/models.py`
2. Create migration: `flask db migrate -m "description"`
3. Apply migration: `flask db upgrade`

### 2. Adding New API Endpoints

1. Create route file in `server/routes/`
2. Register in `server/app.py`: `api.add_resource(YourResource, '/api/endpoint')`
3. Update frontend API client in `safiri-auto-frontend/lib/api.ts`

### 3. Creating Frontend Pages

1. Create page in `safiri-auto-frontend/app/path/page.tsx`
2. Create client component if needed: `components/name-client.tsx`
3. Use `useAuth` hook for auth checks
4. Call API methods from `lib/api.ts`

### 4. Testing Endpoints

Use curl or Postman:
```bash
# Test vehicle listing
curl http://localhost:5555/api/vehicles?status=available

# Test signup
curl -X POST http://localhost:5555/api/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com",...}'
```

---

## 🤝 Contributing

### Workflow
1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make changes and commit: `git commit -m "feat(scope): description"`
3. Push to branch: `git push origin feature/your-feature`
4. Open a Pull Request

### Commit Message Format
```
<type>(<scope>): <subject>

<body>
<footer>
```

**Types**: feat, fix, docs, style, refactor, test, chore
**Scopes**: frontend, backend, database, api

### Code Standards
- Use TypeScript for frontend
- Use type hints for Python backend
- Follow PEP 8 for Python code
- Use ESLint for JavaScript/TypeScript

---

## 📝 License

This project is licensed under the MIT License - see LICENSE file for details.

---

## 👥 Team

- **Project Owner**: billotiende-droid
- **Repository**: https://github.com/billotiende-droid/Safiri-Auto

---

## 📞 Support & Issues

For bugs, feature requests, or questions:
1. Check existing GitHub issues
2. Create a new issue with detailed description
3. Include steps to reproduce for bugs
4. Attach logs/screenshots when relevant

---

## 🔄 Recent Updates

### Latest Commits (Dev Branch)
- ✅ Authentication system implementation
- ✅ Backend signup endpoint fixes
- ✅ Vehicle image support with static file serving
- ✅ Role-based dashboards (user vs owner)
- ✅ Protected routes and authorization

### Roadmap
- [ ] Email verification for signup
- [ ] Payment gateway integration (M-Pesa, Stripe)
- [ ] Push notifications for bookings
- [ ] Advanced analytics dashboard
- [ ] SMS notifications
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Deployment to production servers

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [SQLAlchemy ORM](https://docs.sqlalchemy.org/)
- [Radix UI Components](https://www.radix-ui.com/)
- [React-Hook-Form](https://react-hook-form.com/)
- [JWT Introduction](https://jwt.io/introduction)

---

**Last Updated**: January 19, 2026
**Status**: 🟢 Active Development
