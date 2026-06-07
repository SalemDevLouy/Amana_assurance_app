# Amana Assurance — Technical Documentation

> Version 1.0 · June 2026

---

## Table of Contents

1. [Application Overview](#1-application-overview)
2. [Technical Stack](#2-technical-stack)
3. [Architecture](#3-architecture)
4. [Database Schema](#4-database-schema)
5. [API Reference](#5-api-reference)
6. [User Flows](#6-user-flows)
7. [Use Case Diagrams](#7-use-case-diagrams)
8. [Environment Variables](#8-environment-variables)
9. [Project Structure](#9-project-structure)
10. [Security Model](#10-security-model)

---

## 1. Application Overview

**Amana Assurance** (also branded as *Amaneka*) is a full-stack automobile insurance management platform built for the Algerian market. It digitizes the entire insurance lifecycle — from policy subscription and document upload to accident declaration and contract verification.

### Core Capabilities

| Domain | Features |
|---|---|
| **Insurance** | Online subscription with 4-step wizard, 3 coverage tiers, configurable guarantee packages |
| **Contracts** | Digital contract card with QR code, PDF export/print, real-time status tracking |
| **Accidents** | Guided constat form (vehicle A/B, circumstances, sketches), photo upload, towing partner finder |
| **Verification** | Public QR-scannable contract verification page (no login required) |
| **Partners** | Directory of 11 partner categories (towing, mechanics, body shops, legal, etc.) filtered by wilaya |
| **Notifications** | In-app reminders for technical inspection, oil change, tyre rotation |
| **Admin** | Full back-office: user management, contract approval/rejection, accident review, guarantee catalog, partner CRUD |

### Target Users

- **End Users** — Algerian vehicle owners who want to buy and manage auto insurance digitally.
- **Administrators** — Insurance agency staff who review applications, approve contracts, and manage the platform.
- **Third Parties** — Police, other drivers, or anyone scanning a QR code to verify contract authenticity.

---

## 2. Technical Stack

### Frontend

| Technology | Version | Role |
|---|---|---|
| **Next.js** | 16.x (App Router) | Full-stack React framework, SSR + API routes |
| **React** | 19.x | UI library |
| **TypeScript** | 5.x | Static typing |
| **Tailwind CSS** | 4.x | Utility-first styling |
| **HeroUI** | 3.x | Component library (cards, checkboxes, radio groups, inputs) |
| **Framer Motion** | 12.x | Animation |
| **AOS** | 2.x | Scroll-reveal animations on landing page |

### Backend

| Technology | Version | Role |
|---|---|---|
| **Next.js API Routes** | 16.x | REST API (serverless functions) |
| **Prisma ORM** | 6.x | Database client and schema management |
| **NextAuth.js** | 4.x | Authentication (JWT strategy, credentials provider) |
| **bcrypt** | 5.x | Password hashing with automatic legacy-password upgrade |

### Infrastructure & Services

| Service | Purpose |
|---|---|
| **MongoDB Atlas** | Primary database (document store) |
| **Cloudinary** | Photo and document storage (vehicle photos, accident images) |
| **Vercel / Node.js** | Deployment target |

### Key Libraries

| Library | Purpose |
|---|---|
| `qrcode.react` | QR code generation for digital contract cards |
| `react-to-print` | PDF/print export of contract cards |
| `uuid` | Unique case number generation for accident declarations |
| `sonner` | Toast notifications |
| `react-icons` | Icon set (FontAwesome subset) |
| `react-markdown` + `remark-gfm` | Admin notes rendering |
| `@google/generative-ai` | Gemini AI integration (future/consulting feature) |
| `canvas` (browser API) | Client-side image compression before upload |

---

## 3. Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT BROWSER                       │
│                                                             │
│  ┌──────────────┐  ┌─────────────────┐  ┌───────────────┐  │
│  │  Landing     │  │  User App       │  │  Admin        │  │
│  │  Page (SSG)  │  │  /main/*        │  │  Dashboard    │  │
│  │              │  │  (CSR + SSR)    │  │  /dashboard/* │  │
│  └──────────────┘  └────────┬────────┘  └───────┬───────┘  │
└───────────────────────────  │  ──────────────── │ ─────────┘
                              │ HTTPS             │
┌─────────────────────────────▼───────────────────▼──────────┐
│                      NEXT.JS SERVER                         │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                   API Routes (/api/*)                │   │
│  │                                                      │   │
│  │  /auth/[...nextauth]   → NextAuth JWT               │   │
│  │  /contracts            → Contract CRUD              │   │
│  │  /accidents            → Accident declarations      │   │
│  │  /guarantees           → Coverage catalog           │   │
│  │  /partners             → Partner directory          │   │
│  │  /upload               → Cloudinary proxy           │   │
│  │  /admin/*              → Admin-only operations      │   │
│  │  /users                → Profile management         │   │
│  └──────────────┬─────────────────────────┬────────────┘   │
└─────────────────│─────────────────────────│────────────────┘
                  │ Prisma ORM              │ SDK
         ┌────────▼────────┐      ┌─────────▼─────────┐
         │  MongoDB Atlas  │      │    Cloudinary CDN  │
         │  (Database)     │      │  (Media Storage)   │
         └─────────────────┘      └───────────────────-┘
```

### Application Layers

```
src/
├── app/
│   ├── (auth)/            ← Public: login, signup
│   ├── api/               ← REST API (serverless)
│   ├── components/        ← Shared UI components
│   ├── dashboard/         ← Admin pages (role-gated)
│   ├── main/              ← Authenticated user pages
│   ├── verify/[id]/       ← Public contract verification
│   ├── lib/               ← Auth options, client cache, profile utils
│   └── page.tsx           ← Public landing page
├── lib/
│   ├── db.ts              ← Prisma singleton
│   ├── cloudinary.ts      ← Cloudinary upload utility
│   └── compressImage.ts   ← Client-side canvas compression
```

### Request Flow — New Contract Submission

```
User fills 4-step form
        │
        ▼
Step 1: Coverage type selected
        │
        ▼
Step 2: Vehicle info + photos captured/uploaded
  │
  ├─ Canvas API compresses images client-side (max 1600px, 82% JPEG)
  │
  ▼
Step 3: Guarantee packages selected
        │
        ▼
Step 4: Personal info + payment method + terms accepted
        │
        ▼
Submit → POST /api/upload
  │       ├─ Compress remaining files
  │       ├─ Promise.all() parallel Cloudinary uploads
  │       └─ Returns array of CDN URLs
        │
        ▼
POST /api/contracts
  ├─ Validate session (NextAuth JWT)
  ├─ Generate unique contract number (AMT-YYYY-XXXXXX)
  ├─ Save to MongoDB via Prisma
  └─ Return contractNumber

        │
        ▼
SubmissionSuccess screen with contract number
Admin reviews → APPROUVE / REFUSE
        │
        ▼
QR code on digital card → /verify/[contractNumber]
  └─ Public page queries DB → shows live validity status
```

### Authentication Flow

```
POST /api/auth/signin (credentials)
        │
        ├─ Find user by email in MongoDB
        ├─ bcrypt.compare(password, hash)
        ├─ Legacy plain-text: auto-upgrade to bcrypt
        │
        ▼
JWT issued (24h, httpOnly cookie)
  ├─ Payload: { id, name, email, role }
  │
  ├─ role = USER  → /main/* routes accessible
  └─ role = ADMIN → /dashboard/* routes accessible

Server-side: getServerSession(authOptions) on every API route
Client-side: useSession() hook
```

---

## 4. Database Schema

### Entity Relationship Overview

```
User ──────────────────────────────────────────────────────┐
 │                                                          │
 │ 1:N                                                      │
 ▼                                                          │
Contract ──────────────────────────────────────────────┐   │
 │  contractNumber (unique, AMT-YYYY-XXXXXX)            │   │
 │  userId (ObjectId, no FK relation in Prisma)         │   │
 │  status: EN_ATTENTE | APPROUVE | REFUSE | EXPIRE     │   │
 │  assuranceType: third_party | full_coverage |        │   │
 │                 commercial                           │   │
 │  vehiclePhotoUrls[]  (Cloudinary URLs)               │   │
 │  documentUrls (JSON: chassis, plate, odometer,       │   │
 │                carteGrise, previousInsurance)        │   │
 │  selectedGuarantees (JSON snapshot)                  │   │
 │  basePrice, optionsTotal, totalCost (Int, DZD)       │   │
 │                                                      │   │
 │ 1:N                                                  │   │
 ▼                                                      │   │
AccidentDeclaration                                     │   │
 │  caseNumber (unique, UUID-based)                     │   │
 │  contractId → Contract                               │   │
 │  userId (ObjectId)                                   │   │
 │  status: EN_ATTENTE | EN_REVUE | ACCEPTEE | REFUSEE  │   │
 │  formData (JSON, full constat)                       │   │
 │  photoUrls[], sketchUrls[] (Cloudinary)              │   │
 │  internalNotes[]                                     │   │
                                                        │   │
GuaranteeGroup ─────────────────────────────────────────┘   │
 │  assuranceType: CAR | FARMER                             │
 │  inputType: CHECKBOX | SELECTGROUP                       │
 │  mandatory: Boolean                                      │
 │                                                          │
 │ 1:N                                                      │
 ▼                                                          │
GuaranteeOption                                             │
 │  key, label, price (Int, DZD)                           │
                                                            │
Partner ────────────────────────────────────────────────────┘
   type: TOWING | MECHANIC | EXPERT | BODY_SHOP |
         INSURANCE | SPARE_PARTS | OIL_DISTRIBUTOR |
         CONTROL_CENTER | TIRE_CENTER | AUTO_ELECTRICIAN | LEGAL
   wilaya, city, address, phone, rating, available
   hours, eta (towing only)
```

### Contract Number Format

```
AMT-{YEAR}-{6-digit random}
Example: AMT-2026-483921
```

---

## 5. API Reference

### Public Routes (no auth)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/verify/[id]` | Public contract verification (Server Component, DB query) |

### Authenticated User Routes

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/[...nextauth]` | Login / logout (NextAuth) |
| `GET` | `/api/contracts` | List user's contracts (with prefill data for accident form) |
| `POST` | `/api/contracts` | Create new contract |
| `GET` | `/api/accidents` | List user's accident declarations |
| `POST` | `/api/accidents` | Submit accident declaration |
| `POST` | `/api/upload` | Upload files to Cloudinary (`maxDuration = 60s`) |
| `GET` | `/api/guarantees` | Fetch guarantee groups by `assuranceType` query param |
| `GET` | `/api/partners` | Fetch partners filtered by `type` and/or `wilaya` |
| `GET/PUT` | `/api/users` | Get/update own profile |

### Admin-Only Routes (role = ADMIN)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/admin/contracts` | All contracts with user info |
| `PATCH` | `/api/admin/contracts/[id]` | Update contract status, add notes |
| `GET` | `/api/admin/accidents` | All accident declarations |
| `PATCH` | `/api/admin/accidents/[id]` | Update accident status, add notes |
| `GET` | `/api/admin/users` | All users list |
| `GET/PATCH/DELETE` | `/api/admin/users/[userId]` | Individual user management |
| `GET/POST` | `/api/admin/partners` | Partner CRUD |
| `PATCH/DELETE` | `/api/admin/partners/[id]` | Partner CRUD |
| `GET/POST` | `/api/guarantees/groups` | Guarantee group management |
| `PATCH/DELETE` | `/api/guarantees/groups/[groupId]` | Group editing |
| `GET/POST` | `/api/guarantees/options` | Guarantee option management |
| `PATCH/DELETE` | `/api/guarantees/options/[optionId]` | Option editing |

### Upload Pipeline

```
Client
  │  1. Select/capture files (camera or file picker)
  │  2. compressAll() → Canvas API resize to 1600px max, JPEG 82%
  │
  ▼
POST /api/upload (multipart/form-data, up to 60s)
  │  3. Buffer all files in memory
  │  4. Promise.all() → parallel Cloudinary uploads
  │  5. Return { urls: string[] } in same order
  │
  ▼
POST /api/contracts
  │  6. vehiclePhotoUrls = urls[0..N_vehicle]
  │  7. documentUrls = { chassis, plate, odometer, carteGrise, previousInsurance }
```

---

## 6. User Flows

### Flow A — New User Registration & First Contract

```
Landing page (/)
    │
    ├─ "Get Started" / "Sign Up"
    ▼
/signup
    │  Fill: email, password, name
    ▼
/login (auto-redirect)
    │  Authenticate
    ▼
/main (dashboard)
    │  Profile incomplete banner
    ▼
/main/profile?complete=1
    │  Fill: date of birth, gender, phone, profession,
    │        wilaya, address, license number/type/date
    ▼
/main/newassurance
    │
    ├─ Step 1: Choose Coverage
    │     Urban Pack / Flexible Pack / Professional Pack
    │     (auto-advances on selection)
    │
    ├─ Step 2: Vehicle Information
    │     17 text/numeric/select fields
    │     Vehicle photos (multi, camera or upload)
    │     Chassis photo (upload)
    │     License plate photo (upload)
    │     Odometer photo (in-app camera viewfinder)
    │     Carte grise (upload, optional PDF)
    │     Previous insurance (upload, optional)
    │     Driver behaviour questions (peak hours, night drive,
    │     prior violations, prior accidents)
    │
    ├─ Step 3: Customize Guarantees
    │     Mandatory: third-party liability (pre-selected)
    │     Optional checkboxes/radio groups per coverage tier
    │
    └─ Step 4: Payment & Confirmation
          Full name, email, phone
          Payment method: Bank Card / Bank Transfer
          Contract summary + total cost
          Accept terms → Submit
    │
    ▼
Submission Success
    │  Contract number displayed
    │  Status: EN_ATTENTE (pending admin review)
    ▼
Admin reviews → APPROUVE
    │
    ▼
/main/contract
    │  Digital contract card (QR code, status, vehicle info)
    │  Download PDF / Print
```

### Flow B — Accident Declaration

```
/main/services/automobile
    │  "Report Accident" quick action
    ▼
/main/accident
    │
    ├─ Select active contract (pre-fills vehicle A data)
    │
    ├─ Tab 1: Accident Info
    │     Date, time, location, wilaya, weather, description
    │
    ├─ Tab 2: Vehicle A (Insured)
    │     Brand, model, plate, driver info, license,
    │     insurance details, circumstances (multi-select),
    │     impact zones (visual selector)
    │
    ├─ Tab 3: Vehicle B (Third Party)
    │     Same fields, manually filled
    │
    ├─ Tab 4: Circumstances
    │     24 standard circumstances (Algerian constat format)
    │     Check boxes for vehicle A and vehicle B
    │
    ├─ Tab 5: Photos & Sketch
    │     Upload accident photos
    │     Upload hand-drawn constat sketch
    │
    └─ Tab 6: Towing Service
          Filter partners by wilaya
          One-tap call to towing service
    │
    ▼
POST /api/accidents
    │  Upload photos/sketches to Cloudinary
    │  Save full formData as JSON
    │  Generate unique caseNumber
    ▼
Confirmation screen
    │
    ▼
Admin reviews → EN_REVUE → ACCEPTEE / REFUSEE
```

### Flow C — Contract QR Verification (Third Party)

```
Third party scans QR code on physical/digital card
    │
    ▼
GET /verify/{contractNumber}   (no login required)
    │
    ├─ Query MongoDB for contractNumber
    ├─ If not found → "Contract Not Found" error screen
    │
    ├─ If found:
    │     Check status === APPROUVE AND validTo >= today
    │     isValid = true → emerald banner "Active & Authentic"
    │     isValid = false → amber banner "Not Currently Valid"
    │
    └─ Display:
          Insured name, vehicle (brand + model + plate)
          Coverage type, validity dates, agency
          Verification timestamp
```

### Flow D — Admin Contract Review

```
/dashboard
    │  Overview: total users, contracts, accidents, revenue
    ▼
/dashboard/contrats
    │  Table: all contracts sorted by date
    │  Filters: status, search by contract number
    │
    ├─ Click row → expand detail panel
    │     Vehicle info, photos grid, document thumbnails
    │     Selected guarantees, pricing breakdown
    │     User info (name, email, license)
    │
    ├─ Admin actions:
    │     APPROUVE → sets status, contract becomes active
    │     REFUSE   → sets status, contract rejected
    │     Add internal notes (rendered as Markdown)
    │
    └─ QR code links to /verify/{contractNumber}
```

---

## 7. Use Case Diagrams

### UC-01: Insurance Subscription System

```
                    ┌─────────────────────────────────────────────┐
                    │         Insurance Subscription System        │
                    │                                             │
  ┌──────────┐      │  ┌─────────────────────────────────────┐   │
  │          │      │  │                                     │   │
  │   User   │──────┼─▶│  UC1: Register / Login              │   │
  │          │      │  └─────────────────────────────────────┘   │
  └────┬─────┘      │                                             │
       │            │  ┌─────────────────────────────────────┐   │
       │            │  │                                     │   │
       ├────────────┼─▶│  UC2: Complete Profile              │   │
       │            │  │        (prerequisite to subscribe)  │   │
       │            │  └─────────────────────────────────────┘   │
       │            │                                             │
       │            │  ┌─────────────────────────────────────┐   │
       │            │  │  UC3: Subscribe to Insurance        │   │
       ├────────────┼─▶│    ├── Choose coverage type         │   │
       │            │  │    ├── Fill vehicle info            │   │
       │            │  │    ├── Upload photos / documents    │   │
       │            │  │    ├── Select guarantee packages    │   │
       │            │  │    └── Confirm & submit             │   │
       │            │  └─────────────────────────────────────┘   │
       │            │                                             │
       │            │  ┌─────────────────────────────────────┐   │
       │            │  │                                     │   │
       ├────────────┼─▶│  UC4: View Digital Contract Card    │   │
       │            │  │        (with QR code)               │   │
       │            │  └─────────────────────────────────────┘   │
       │            │                                             │
       │            │  ┌─────────────────────────────────────┐   │
       │            │  │                                     │   │
       └────────────┼─▶│  UC5: Download / Print Contract PDF │   │
                    │  └─────────────────────────────────────┘   │
                    └─────────────────────────────────────────────┘
```

### UC-02: Accident Declaration System

```
                    ┌─────────────────────────────────────────────┐
                    │          Accident Declaration System        │
                    │                                             │
  ┌──────────┐      │  ┌─────────────────────────────────────┐   │
  │          │      │  │  UC6: Declare Accident              │   │
  │   User   │──────┼─▶│    ├── Select linked contract       │   │
  │          │      │  │    ├── Fill constat form (A/B)      │   │
  └────┬─────┘      │  │    ├── Select circumstances         │   │
       │            │  │    ├── Upload photos & sketch       │   │
       │            │  │    └── Submit declaration           │   │
       │            │  └─────────────────────────────────────┘   │
       │            │                                             │
       │            │  ┌─────────────────────────────────────┐   │
       │            │  │                                     │   │
       ├────────────┼─▶│  UC7: Find Towing Service           │   │
       │            │  │        (filter by wilaya, call)     │   │
       │            │  └─────────────────────────────────────┘   │
       │            │                                             │
       │            │  ┌─────────────────────────────────────┐   │
       │            │  │                                     │   │
       └────────────┼─▶│  UC8: Track Claim Status           │   │
                    │  │        (EN_ATTENTE → ACCEPTEE)      │   │
                    │  └─────────────────────────────────────┘   │
                    └─────────────────────────────────────────────┘
```

### UC-03: Admin Back-Office

```
                    ┌─────────────────────────────────────────────┐
                    │              Admin Back-Office              │
                    │                                             │
  ┌──────────┐      │  ┌─────────────────────────────────────┐   │
  │          │      │  │                                     │   │
  │  Admin   │──────┼─▶│  UC9: Review Contract Applications  │   │
  │          │      │  │    ├── View vehicle photos & docs   │   │
  └────┬─────┘      │  │    ├── Approve / Reject             │   │
       │            │  │    └── Add internal notes           │   │
       │            │  └─────────────────────────────────────┘   │
       │            │                                             │
       │            │  ┌─────────────────────────────────────┐   │
       │            │  │                                     │   │
       ├────────────┼─▶│  UC10: Review Accident Claims       │   │
       │            │  │    ├── View accident photos/sketch  │   │
       │            │  │    ├── Set status: ACCEPTEE/REFUSEE │   │
       │            │  │    └── Add internal notes           │   │
       │            │  └─────────────────────────────────────┘   │
       │            │                                             │
       │            │  ┌─────────────────────────────────────┐   │
       │            │  │                                     │   │
       ├────────────┼─▶│  UC11: Manage Users                 │   │
       │            │  │    ├── View all accounts            │   │
       │            │  │    ├── Edit user profile            │   │
       │            │  │    └── Change role (USER/ADMIN)     │   │
       │            │  └─────────────────────────────────────┘   │
       │            │                                             │
       │            │  ┌─────────────────────────────────────┐   │
       │            │  │                                     │   │
       ├────────────┼─▶│  UC12: Manage Guarantee Catalog     │   │
       │            │  │    ├── Create/edit groups & options │   │
       │            │  │    └── Set mandatory / optional     │   │
       │            │  └─────────────────────────────────────┘   │
       │            │                                             │
       │            │  ┌─────────────────────────────────────┐   │
       │            │  │                                     │   │
       └────────────┼─▶│  UC13: Manage Service Partners      │   │
                    │  │    ├── CRUD partners                │   │
                    │  │    └── Set availability / ETA       │   │
                    │  └─────────────────────────────────────┘   │
                    └─────────────────────────────────────────────┘
```

### UC-04: Contract Verification (Public)

```
                    ┌─────────────────────────────────────────────┐
                    │          Contract Verification              │
                    │                                             │
  ┌──────────────┐  │  ┌─────────────────────────────────────┐   │
  │  Third Party │  │  │                                     │   │
  │  (police,    │──┼─▶│  UC14: Scan QR Code                 │   │
  │   other      │  │  │    ├── Resolve contract by number   │   │
  │   driver,    │  │  │    ├── Check APPROUVE + not expired │   │
  │   inspector) │  │  │    ├── Display insured name,        │   │
  └──────────────┘  │  │    │   vehicle, coverage, dates     │   │
                    │  │    └── Show validity badge           │   │
                    │  └─────────────────────────────────────┘   │
                    └─────────────────────────────────────────────┘
```

### Full System Actor Matrix

```
Actor              │ UC1 │ UC2 │ UC3 │ UC4 │ UC5 │ UC6 │ UC7 │ UC8 │ UC9 │UC10 │UC11 │UC12 │UC13 │UC14
───────────────────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼────
User               │  ✓  │  ✓  │  ✓  │  ✓  │  ✓  │  ✓  │  ✓  │  ✓  │     │     │     │     │     │
Admin              │  ✓  │     │     │     │     │     │     │     │  ✓  │  ✓  │  ✓  │  ✓  │  ✓  │
Third Party        │     │     │     │     │     │     │     │     │     │     │     │     │     │  ✓
───────────────────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴────
```

---

## 8. Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✓ | MongoDB Atlas connection string |
| `NEXTAUTH_SECRET` | ✓ | JWT signing secret (32+ char random string) |
| `NEXTAUTH_URL` | ✓ | Full app URL (e.g. `https://amana.dz`) |
| `CLOUDINARY_CLOUD_NAME` | ✓ | Cloudinary account cloud name |
| `CLOUDINARY_API_KEY` | ✓ | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | ✓ | Cloudinary API secret |
| `NEXT_PUBLIC_APP_URL` | ✓ | Public URL used to generate QR code verify links |
| `GEMINI_API_KEY` | optional | Google Gemini AI (consulting/AI features) |

---

## 9. Project Structure

```
Amana_assurance_app/
├── docs/                          ← Project documentation
├── prisma/
│   └── schema.prisma              ← Database schema + enums
├── public/                        ← Static assets
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx     ← Login page
│   │   │   └── signup/page.tsx    ← Registration page
│   │   │
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts
│   │   │   ├── contracts/route.ts
│   │   │   ├── accidents/route.ts
│   │   │   ├── guarantees/
│   │   │   │   ├── route.ts       ← List by type
│   │   │   │   ├── groups/        ← Admin CRUD
│   │   │   │   └── options/       ← Admin CRUD
│   │   │   ├── partners/route.ts  ← List + seed
│   │   │   ├── upload/route.ts    ← Cloudinary proxy
│   │   │   ├── users/route.ts     ← Profile R/W
│   │   │   └── admin/
│   │   │       ├── contracts/[id]/route.ts
│   │   │       ├── accidents/[id]/route.ts
│   │   │       ├── users/route.ts
│   │   │       └── partners/[id]/route.ts
│   │   │
│   │   ├── components/
│   │   │   ├── dashboard/         ← Admin UI components
│   │   │   ├── home/              ← Landing page sections
│   │   │   └── UI/                ← Shared (Navbar, Footer, etc.)
│   │   │
│   │   ├── dashboard/             ← Admin pages (ADMIN role only)
│   │   │   ├── layout.tsx         ← Sidebar layout
│   │   │   ├── page.tsx           ← Overview / stats
│   │   │   ├── contrats/page.tsx  ← Contract management
│   │   │   ├── demandes/page.tsx  ← Accident claims
│   │   │   ├── garanties/page.tsx ← Guarantee catalog
│   │   │   └── users/             ← User management
│   │   │
│   │   ├── main/                  ← Authenticated user pages
│   │   │   ├── layout.tsx         ← Navbar layout
│   │   │   ├── page.tsx           ← User home
│   │   │   ├── services/automobile/page.tsx  ← Dashboard hub
│   │   │   ├── newassurance/      ← 4-step subscription wizard
│   │   │   │   ├── page.tsx
│   │   │   │   ├── types.ts
│   │   │   │   ├── constants.ts
│   │   │   │   └── components/
│   │   │   │       ├── StepAssuranceType.tsx
│   │   │   │       ├── StepVehicleInfo.tsx
│   │   │   │       ├── StepGuarantees.tsx
│   │   │   │       ├── StepPayment.tsx
│   │   │   │       ├── StepIndicator.tsx
│   │   │   │       └── SubmissionSuccess.tsx
│   │   │   ├── contract/page.tsx  ← Digital card + QR + PDF
│   │   │   ├── accident/page.tsx  ← Accident declaration form
│   │   │   ├── claims/page.tsx    ← My accident claims
│   │   │   └── profile/page.tsx   ← User profile editor
│   │   │
│   │   ├── verify/[id]/page.tsx   ← Public QR verification
│   │   ├── lib/
│   │   │   ├── authOptions.ts     ← NextAuth config
│   │   │   ├── clientCache.ts     ← In-memory client cache
│   │   │   └── profileCompletion.ts
│   │   └── page.tsx               ← Public landing page
│   │
│   └── lib/
│       ├── db.ts                  ← Prisma client singleton
│       ├── cloudinary.ts          ← Upload helper
│       └── compressImage.ts       ← Client-side JPEG compressor
└── .env                           ← Environment variables
```

---

## 10. Security Model

### Authentication & Authorization

| Layer | Mechanism |
|---|---|
| Session | JWT stored in httpOnly cookie (`__Secure-next-auth.session-token` in prod) |
| Password | bcrypt hash (rounds: 10), auto-upgrades legacy plain-text on next login |
| Role check | Every admin API route calls `getServerSession()` and verifies `session.user.role === "ADMIN"` |
| Profile gate | `/main/newassurance` redirects to `/main/profile?complete=1` if profile is incomplete |
| CSRF | NextAuth CSRF token on all mutation endpoints |

### Data Validation

- Server routes validate presence of required fields before DB writes
- Contract number collision retry (3 attempts) before creation
- File upload: accepts only multipart form data; Cloudinary enforces file type on its end
- Admin notes stored as `String[]`; rendered with `react-markdown` (no raw HTML)

### Media Security

- All Cloudinary uploads are server-proxied — API keys never exposed to client
- Client compresses images before upload (reduces attack surface of large binary payloads)
- `maxDuration = 60` on upload route to prevent serverless timeout abuse

### Contract Verification

- `/verify/[id]` is intentionally public — reads only non-sensitive fields (name, vehicle, coverage, dates)
- Status check is real-time DB query — cannot be faked by QR code manipulation
- Contract number format (`AMT-YYYY-XXXXXX`) has 900,000 combinations per year — not enumerable

---

*Document generated for Amana Assurance — internal use only.*
