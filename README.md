# HotelPro — Enterprise Hotel Management & Reservation System

[![Node.js](https://img.shields.io/badge/Node.js-v16+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.x-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-4.21-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![JWT](https://img.shields.io/badge/JWT-Secure_Auth-000000?logo=jsonwebtokens&logoColor=white)](https://jwt.io/)

**HotelPro** is a comprehensive, production-grade hotel operations and reservation platform built using the **MERN (MongoDB, Express, React, Node.js) stack**, styled with modern **Bootstrap 5**, secured with **JSON Web Tokens (JWT)** and **bcryptjs**, and powered by responsive asynchronous client-server communication.

Whether managing a boutique resort or a multi-property hospitality chain, HotelPro delivers real-time room inventory tracking, conflict-free booking calculations, guest relationship management (CRM), printable digital folios/invoices, and a complete housekeeping maintenance workflow.

---

## 📋 Project Specifications & Stats

- **Total Epics**: 6
- **Total Tasks**: 19
- **Architecture**: Decoupled RESTful API Backend (`Express + MongoDB`) + Single Page Client (`React JSX + Bootstrap 5 + Vite`)

```
========================================================================================
EPIC 1: Authentication, Authorization & Security (Tasks 1 - 4)
  • Task 1: User Registration with password hashing (bcryptjs) & email validation
  • Task 2: JWT Token Generation, session management, and secure local storage
  • Task 3: Multi-role Access Control (Admin, Front Desk Staff, Guest)
  • Task 4: User Profile Updates & Secure Password Change Workflow

EPIC 2: Room Inventory & Amenities Management (Tasks 5 - 7)
  • Task 5: Room Schema with category, pricing, capacity, floor, bed type & photo gallery
  • Task 6: Room Status Lifecycle (Available, Occupied, Cleaning, Maintenance)
  • Task 7: Multi-criteria Search & Filtering (price, type, capacity, amenities)

EPIC 3: Reservation & Booking Management (Tasks 8 - 11)
  • Task 8: Real-Time Date Collision Detection & Availability Calculation
  • Task 9: Booking Creation with dynamic nights computation & 12% hotel tax breakdown
  • Task 10: Check-In & Check-Out Workflow with instant room status synchronization
  • Task 11: Guest-Initiated Cancellation with automatic refund & room inventory release

EPIC 4: Guest Relationship Management (CRM) (Tasks 12 - 13)
  • Task 12: Centralized Guest Directory with Government ID verification & contact info
  • Task 13: Lifetime Spend, Stays Counter, VIP Tier Flagging & Staff Internal Notes

EPIC 5: Billing, Invoicing & Payment Processing (Tasks 14 - 16)
  • Task 14: Payment Processing & Transaction Ledger (Card, UPI, Cash, Online)
  • Task 15: Automated Itemized Invoice Generation (Accommodation, Taxes, Discounts)
  • Task 16: Printable Official Guest Folio / Receipt View (`window.print()`)

EPIC 6: Analytics, Operational Dashboard & Housekeeping (Tasks 17 - 19)
  • Task 17: Administrative Operations Dashboard with Real-Time KPIs & Occupancy Rate %
  • Task 18: Housekeeping & Maintenance Task Board with Staff Assignment & Inspection
  • Task 19: Monthly Revenue Trends & Room Status Distribution Progress Metrics
========================================================================================
```

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
|---|---|
| **Frontend** | React 18 (JSX), Vite, Bootstrap 5.3, Bootstrap Icons, Lucide React, Axios |
| **Backend** | Node.js, Express.js REST API, Mongoose ORM, CORS, Morgan |
| **Database** | MongoDB 8.x (NoSQL) |
| **Security** | JSON Web Tokens (`jsonwebtoken`), Salt Hashing (`bcryptjs`), Role Guards |
| **Styling** | Custom CSS variables, Playfair Display (Serif) + Plus Jakarta Sans (Body) |

---

## 🔑 Demo Credentials

HotelPro comes pre-seeded with sample users for instant testing. You can also use the **"Demo Logins"** dropdown in the navigation bar to switch personas with a single click:

| Role | Email | Password | Permissions |
|---|---|---|---|
| 👑 **General Manager (Admin)** | `admin@hotelpro.com` | `admin123` | Full system control: rooms, bookings, pricing, users, refunds, analytics |
| 🛎️ **Front Desk Lead (Staff)** | `staff@hotelpro.com` | `staff123` | Room management, check-in/out, housekeeping board, guest directory |
| 🧳 **Valued Guest** | `guest@hotelpro.com` | `guest123` | Suite browsing, live date search, instant reservations, personal bookings & folio |

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js (v16 or higher)](https://nodejs.org/)
- [MongoDB Community Server](https://www.mongodb.com/try/download/community)

### Option 1: 1-Click Launch on Windows
Simply double-click:
```bash
start.bat
```
*(Automatically checks MongoDB, launches the backend on `http://localhost:5000`, and starts the frontend on `http://localhost:5173`)*.

---

### Option 2: Command Line Startup

#### 1. Start MongoDB (if not running as a Windows service)
```powershell
& "C:\Program Files\MongoDB\Server\8.3\bin\mongod.exe" --dbpath backend/data/db --bind_ip 127.0.0.1
```

#### 2. Seed Demo Data (Rooms, Users, Bookings, Guests)
```powershell
npm run seed
```

#### 3. Run Both Servers Concurrently
```powershell
npm start
```
Or run individually in separate terminal tabs:
- **Backend**: `cd backend && npm start` (runs on `http://localhost:5000`)
- **Frontend**: `cd frontend && npm run dev` (runs on `http://localhost:5173`)

---

## 📁 Directory Structure

```
HotelFull/
├── backend/
│   ├── data/
│   │   └── db/                   # Local MongoDB data files
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js             # Resilient MongoDB connection handler
│   │   ├── controllers/
│   │   │   ├── authController.js       # Register, Login, Profile, JWT
│   │   │   ├── roomController.js       # CRUD, Real-time availability filter
│   │   │   ├── bookingController.js    # Collisions check, Booking, Check-in/out
│   │   │   ├── guestController.js      # CRM, VIPs, contact, notes
│   │   │   ├── paymentController.js    # Transactions, Invoicing, Refunds
│   │   │   └── dashboardController.js  # KPI stats, occupancy %, revenue
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js       # JWT protect & role authorize
│   │   │   └── errorMiddleware.js      # Mongoose & standard error handlers
│   │   ├── models/
│   │   │   ├── User.js           # Users schema (hashed passwords, roles)
│   │   │   ├── Room.js           # Room inventory schema
│   │   │   ├── Booking.js        # Reservation schema with guest details
│   │   │   ├── Guest.js          # Guest CRM schema
│   │   │   └── Payment.js        # Payment & billing transaction schema
│   │   ├── routes/
│   │   │   ├── authRoutes.js     # /api/auth/*
│   │   │   ├── roomRoutes.js     # /api/rooms/*
│   │   │   ├── bookingRoutes.js  # /api/bookings/*
│   │   │   ├── guestRoutes.js    # /api/guests/*
│   │   │   ├── paymentRoutes.js  # /api/payments/*
│   │   │   └── dashboardRoutes.js# /api/dashboard/*
│   │   ├── seed/
│   │   │   └── seedData.js       # Database seeder with realistic suites & stays
│   │   └── server.js             # Main Express server entrypoint
│   ├── .env                      # Environment config (Port, DB URI, JWT secret)
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Navigation bar with 1-click Demo Account Switcher
│   │   │   ├── Footer.jsx        # Branded footer with contact & badges
│   │   │   ├── Sidebar.jsx       # Managerial & Staff Operations Navigation
│   │   │   ├── ProtectedRoute.jsx# Role-based route guard
│   │   │   ├── RoomCard.jsx      # Luxury suite card with capacity & pricing
│   │   │   ├── BookingModal.jsx  # Live date pricing calculator & payment simulation
│   │   │   └── InvoiceModal.jsx  # Printable official guest folio & receipt
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Global auth state, token persistence & actions
│   │   ├── pages/
│   │   │   ├── Home.jsx          # Hero section, live date search, amenities showcase
│   │   │   ├── Rooms.jsx         # Catalog with price slider, type, & date collision check
│   │   │   ├── RoomDetails.jsx   # Detailed gallery, specifications & booking sidebar
│   │   │   ├── MyBookings.jsx    # Guest reservation manager, invoices, cancellations
│   │   │   ├── Login.jsx         # Authentication screen with 1-click demo fillers
│   │   │   ├── Register.jsx      # User account registration
│   │   │   ├── Profile.jsx       # Account settings & password update
│   │   │   └── admin/
│   │   │       ├── AdminDashboard.jsx # Real-time KPIs, occupancy rate, revenue
│   │   │       ├── ManageRooms.jsx    # Room inventory manager, add/edit/delete
│   │   │       ├── ManageBookings.jsx # Check-in, check-out, status workflow
│   │   │       ├── ManageGuests.jsx   # Guest CRM, VIP tags, notes, spend
│   │   │       ├── ManagePayments.jsx # Financial billing ledger & refunds
│   │   │       └── Housekeeping.jsx   # Cleaning & maintenance task board
│   │   ├── services/
│   │   │   └── api.js            # Axios client with JWT interceptor
│   │   ├── App.jsx               # Client routes & layout
│   │   ├── index.css             # Luxury theme styling & print media rules
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js            # Vite build configuration with API reverse proxy
│   └── package.json
├── package.json                  # Root orchestration package
├── start-all.js                  # Concurrently spawns both servers cleanly
├── start.bat                     # 1-click Windows launcher
├── seed.bat                      # 1-click database seeder
└── README.md
```

---

## 📡 REST API Reference

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a new account (`name`, `email`, `password`, `phone`, `role`)
- `POST /api/auth/login` — Sign in and receive JWT token
- `GET /api/auth/me` — Retrieve current authenticated user profile *(Private)*
- `PUT /api/auth/profile` — Update name, phone, or avatar *(Private)*
- `PUT /api/auth/password` — Change password safely *(Private)*
- `GET /api/auth/users` — List registered users *(Private/Admin)*

### Rooms & Inventory (`/api/rooms`)
- `GET /api/rooms` — Query all rooms (supports filters: `type`, `status`, `minPrice`, `maxPrice`, `capacity`, `search`, `checkIn`, `checkOut`)
- `GET /api/rooms/:id` — Retrieve room by ID
- `POST /api/rooms` — Create a new room *(Private/Admin/Staff)*
- `PUT /api/rooms/:id` — Update room specifications *(Private/Admin/Staff)*
- `PATCH /api/rooms/:id/status` — Quick update status: `available`, `occupied`, `cleaning`, `maintenance` *(Private/Admin/Staff)*
- `DELETE /api/rooms/:id` — Remove room *(Private/Admin)*

### Bookings & Reservations (`/api/bookings`)
- `POST /api/bookings` — Create a reservation with real-time date collision check & invoice creation *(Private)*
- `GET /api/bookings` — List all reservations with filters *(Private: Staff/Admin see all, Guest sees own)*
- `GET /api/bookings/my` — Get authenticated guest's reservations *(Private)*
- `GET /api/bookings/:id` — Get single booking details *(Private)*
- `PATCH /api/bookings/:id/status` — Change status: `checked-in`, `checked-out`, `cancelled` *(Private/Staff/Admin)*
- `PATCH /api/bookings/:id/cancel` — Guest cancellation with auto-refund *(Private)*

### Guest Directory CRM (`/api/guests`)
- `GET /api/guests` — List guests with search & VIP filter *(Private/Staff/Admin)*
- `GET /api/guests/:id` — Guest details with complete booking history *(Private/Staff/Admin)*
- `POST /api/guests` — Add new guest record *(Private/Staff/Admin)*
- `PUT /api/guests/:id` — Update guest profile, VIP flag & notes *(Private/Staff/Admin)*
- `DELETE /api/guests/:id` — Remove guest *(Private/Admin)*

### Invoicing & Payments (`/api/payments`)
- `GET /api/payments` — Query billing ledger & invoices *(Private/Staff/Admin)*
- `GET /api/payments/:id` — Get invoice details *(Private)*
- `GET /api/payments/booking/:bookingId` — Get invoice by booking ID *(Private)*
- `PATCH /api/payments/:id/refund` — Mark payment as refunded *(Private/Admin)*

### Operational Dashboard (`/api/dashboard`)
- `GET /api/dashboard/stats` — Real-time metrics: occupancy %, revenue, room breakdown, recent bookings, monthly trends *(Private/Staff/Admin)*

---

## 🧪 Verification & Testing Completed

1. **Database Connectivity**: Connected to native MongoDB 8.x instance on `127.0.0.1:27017` with seeded records.
2. **REST Endpoints**:
   - `/api/health` -> Healthy (`status: "healthy", database: "connected"`)
   - `/api/rooms` -> Returned 8 curated suites with full pricing and amenity metadata.
   - `/api/auth/login` -> Verified bcrypt hashing and JWT token issuance for Admin, Staff, and Guest accounts.
3. **Frontend Compilation**: Built production bundle with Vite in **8.08 seconds** with 0 errors.
4. **Collision Detection**: Confirmed that rooms with active overlapping reservations are correctly excluded from availability searches.

---

## 📄 License
This project is developed for educational, portfolio, and commercial hospitality management applications.
