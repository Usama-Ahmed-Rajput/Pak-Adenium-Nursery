# 🌿 PAK ADENIUM — PREMIUM DIGITAL NURSERY PLATFORM

A production-ready botanical e-commerce and nursery management system designed specifically for **Pak Adenium**, cultivating and curating sculptural Desert Roses (*Adenium obesum*, *Adenium arabicum*, rare collector hybrids, and specimen bonsai) across Pakistan.

---

## 🌟 Highlights & Distinctive Architecture

- **True Botanical Editorial Identity**: Handcrafted with a warm ivory canvas (`#FBF9F4`), deep botanical greens (`#15271E`, `#233D2E`), terracotta clay (`#B87555`), and sage (`#A4B29D`). No generic AI website templates or artificial neon glow effects.
- **Interactive 3D Botanical Visualizer**: Built with Three.js rendering procedural caudex formations, radial branching, and multi-petal Desert Rose blooms with mouse-tracking and reduced-motion fallback.
- **Pakistani E-Commerce & Checkout Engine**:
  - Currency in PKR (`Rs. 9,500`).
  - Cash on Delivery (COD) supported across designated Pakistan courier hubs.
  - Direct Bank Transfer (IBFT via Meezan Bank) & EasyPaisa / JazzCash verification.
  - Server-side inventory locks and price calculation (client price manipulation impossible).
  - WhatsApp Order Integration: Generates pre-formatted bilingual WhatsApp inquiry and confirmation messages linking customer directly to the nursery concierge.
- **Complete Nursery Admin Portal (`/admin`)**:
  - Secure credentials login with cryptographic HMAC signed HTTP-only cookies.
  - Live KPI Analytics (Gross revenue, pending orders, low-stock warnings).
  - Specimen Catalog CRUD with physical attributes (caudex girth, plant age, grafting status, flower color, petal layer style, care specs).
  - Real-time Inventory Tracker with inline quantity adjusters and low-stock alerts.
  - Orders Management with lifecycle transitions (Pending → Confirmed → Shipped → Delivered), printable invoices, and direct WhatsApp customer messaging.
  - Category and taxonomy manager.
  - Growing Journal article manager.
  - Nursery settings & announcement banner editor.
- **The Growing Journal (Care Knowledge Center)**:
  - Deep-dive guides for Pakistan microclimates: Caudex fattening, Monsoon root rot prevention, and Winter dormancy care.
- **Interactive Plant Finder**:
  - Guided 4-question wizard matching growers with varieties suited to their experience, sunlight, and space.
- **Full SEO & Structured Data Infrastructure**:
  - `sitemap.xml` and `robots.txt` dynamically mapped.
  - Rich JSON-LD schemas (`Organization`, `Product`, `Offer`, `Article`).

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 15+ (App Router) & React 19 |
| **Language** | TypeScript (Strict mode) |
| **Styling** | Tailwind CSS with custom botanical design tokens |
| **3D Rendering** | Three.js |
| **Icons** | Lucide React |
| **Validation** | Zod schemas |
| **Database** | Dual-mode: Local file-backed database (`data/database.json`) + Supabase PostgreSQL schema with full RLS (`supabase/migrations/`) |

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js v20+ or v22+
- npm v10+

### 2. Installation
```bash
git clone <repo-url>
cd "Pak Adenium Nursury"
npm install
```

### 3. Environment Setup
Copy the example environment configuration:
```bash
cp .env.example .env.local
```

Default local credentials for the Admin Portal:
- **URL**: `http://localhost:3000/admin`
- **Email**: `admin@pakadenium.com`
- **Password**: `admin_pak_adenium_2026`

### 4. Running Locally
```bash
# Development mode with hot-reloading:
npm run dev

# Production build and run:
npm run build
npm start
```
The storefront will be live at `http://localhost:3000`.

---

## 🗄️ Database & Cloud Deployment (Supabase)

The application includes complete PostgreSQL migrations and seed scripts in `supabase/`:
- `supabase/migrations/20261119_initial_schema.sql` — Creates all 11 relational tables (`categories`, `products`, `product_images`, `inventory_logs`, `orders`, `order_items`, `articles`, `site_settings`, `reviews`, `inquiries`) with strict Row Level Security (RLS) policies and performance indexes.
- `supabase/seed.sql` — Populates authentic specimen varieties (*Dorset Horn*, *Triple Black King*, *Super Baobab Arabicum*, *White Diamond*, *Star of Pakistan*).

To connect to Supabase:
1. Create a new project in your Supabase dashboard.
2. In the Supabase SQL Editor, run `supabase/migrations/20261119_initial_schema.sql` followed by `supabase/seed.sql`.
3. Add your Supabase credentials to `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
   SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
   ```

---

## 🔐 Admin Portal Credentials & Security Notes

- **Route**: `/admin`
- The admin dashboard is guarded by a two-tier security perimeter:
  1. Next.js edge middleware inspecting session presence.
  2. Server-side session verification using SHA-256 HMAC cryptographic signatures on an `httpOnly`, `sameSite: lax` cookie.
- Client-side code **never** receives administrative secrets or database service-role keys.
- Client checkout requests calculate all totals on the server and decrement stock atomically.

---

## 📦 Production Deployment (Vercel / Node Server)

### Deploying to Vercel:
1. Push this repository to GitHub or GitLab.
2. Import project into Vercel.
3. Add your production environment variables (`NEXT_PUBLIC_SITE_URL`, `ADMIN_SECRET_KEY`, `ADMIN_DEFAULT_PASSWORD`, `NEXT_PUBLIC_WHATSAPP_NUMBER`).
4. Click **Deploy**. Vercel will automatically build the Next.js production bundle.

---

## 🌿 Handcrafted for Pak Adenium Nursery
*“Living Sculptures. Grown With Care.”*

