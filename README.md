# 🌸 AiSpa — Smart Salon & Spa Booking System

<p align="center">
  <img src="public/images/hero.png" alt="AiSpa Banner" width="100%" style="border-radius: 16px;" />
</p>

<p align="center">
  <strong>Next-Generation Mobile-First Beauty & Wellness Booking Engine Tailored for the Bangladeshi Market</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" alt="Next.js 14" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Prisma-5.0-2D3748?style=for-the-badge&logo=prisma" alt="Prisma ORM" />
  <img src="https://img.shields.io/badge/WhatsApp_API-Cloud-25D366?style=for-the-badge&logo=whatsapp" alt="WhatsApp API" />
  <img src="https://img.shields.io/badge/Meta_Graph-Messenger-0084FF?style=for-the-badge&logo=facebook-messenger" alt="Meta Messenger" />
</p>

---

## 🌟 Overview

**AiSpa** is a state-of-the-art, dual-sided web application comprising:
1. **Consumer Web Portal (`/`)**: A mobile-first, glassmorphic booking interface localized specifically for Bangladesh with strict `+880` OTP auth, instant English ↔ বাংলা switching, and automatic USD ($) to BDT (৳) currency conversions.
2. **B2B Admin Studio (`/admin`)**: An enterprise-grade management panel for salon owners to configure service packages, override stylist shift timelines, stream omni-channel customer chats (WhatsApp, Messenger, Web), broadcast emergency notice banners, and process booking requests via a 1-click Kanban status board.

---

## ✨ Key Features

### 📱 1. Consumer Web Portal (`/`)
* **Modern Glassmorphic Design System**: Ambient backdrop blurs, dynamic color mesh glows, frosted glass cards, and high-contrast WCAG AA typography.
* **Bangladeshi Mobile Auth Engine**:
  * Native `+880` prefix badge with custom regex validation (`/^1[3-9]\d{8}$/`).
  * 6-digit numerical OTP grid with auto-focus, paste detection, and resend countdown timer.
  * Cryptographic SHA-256 OTP hashing with 3-minute timing-safe verification.
  * Sliding-window rate limiting protecting against SMS brute-force attacks.
  * Stateless session management via HTTP-Only `SameSite=Strict` JWT cookies.
  * Standardized **shadcn/ui Form primitives** (`react-hook-form` + `zod` resolvers).
* **Bilingual Localization (English ↔ বাংলা)**:
  * Full homepage translation dictionary covering titles, badges, search bar, and studio locations.
  * Converts numbers and countdown timers to native Bangla numerals (`০১২৩৪৫৬৭৮৯`).
* **Dynamic USD ($) ↔ BDT (৳) Currency Engine**:
  * English Mode: Renders USD prices (`$85`, `$65`).
  * Bangla Mode: Converts USD to BDT (`৳১০,২০০`, `৳৭,৮০০`) using 1 USD = 120 BDT with clean 50 BDT rounding.
* **AI Biometric & Weather Matcher**: Real-time ambient weather integration (e.g. *Sunny 32°C • High Humidity 78%*) recommending specialized skin protocols (e.g. *Hydro-O2 Oxygen Facial*).
* **Next Available Slot Urgency Matrix**: Live countdown timer highlighting priority open slots with up to 20% discount.
* **AI Concierge Assistant**: Interactive glassmorphic chatbot modal for instant slot reservations.

---

### 👑 2. B2B Admin Management Studio (`/admin`)
* **Admin Registration & Authentication**:
  * Form wizard for registering new Salon Owners & Managers.
  * Enforces secret passkey authorization (`AISPA-ADMIN-SECRET-2026`).
  * Role-Based Access Control (`ADMIN` vs `MANAGER`) protecting financial routes.
* **Package & Pricing Engine**:
  * Multi-service bundle builder (e.g. *Hydro Facial + Hair Gloss + Gel Nails*).
  * Tiered BDT (৳) regular and promo price controls.
  * Active/Inactive visibility toggles and duration sliders.
* **Availability & Emergency Announcement Manager**:
  * Master Stylist Shift Roster with 1-click slot blocking/unblocking.
  * Global Emergency Announcement Banner Publisher (broadcasts holiday closures directly to consumer site).
* **Omni-Channel Inbox & Chat Hub**:
  * Unified split-pane chat interface aggregating real-time messages from `[Website Live Chat]`, `[WhatsApp]`, and `[Facebook Messenger]`.
* **Booking Request Status Kanban Manager**:
  * Kanban board displaying requests split into `Pending Approval`, `Confirmed`, `Rescheduled`, and `Completed`.
  * 1-Click **"Approve & Confirm"** action triggering automated WhatsApp Business Cloud API template messages.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | Vanilla CSS Glassmorphism + Tailwind CSS |
| **Form System** | React Hook Form + Zod + `@hookform/resolvers` (shadcn pattern) |
| **Database ORM** | Prisma ORM (PostgreSQL) |
| **Security & Auth** | JWT (`jsonwebtoken`), Node.js `crypto` (SHA-256), `cookie` |
| **Omni-Channel** | Meta Graph API (Messenger) + WhatsApp Business Cloud API |
| **Icons** | `lucide-react` |

---

## 📁 Project File Structure

```text
aispa/
├── prisma/
│   └── schema.prisma                 # Prisma schema for User, Package, Shift, Notice, Booking, OmniMessage
├── src/
│   ├── app/
│   │   ├── (public)/
│   │   │   └── page.tsx              # Main Consumer Homepage
│   │   ├── admin/
│   │   │   └── page.tsx              # Admin Management Studio Dashboard
│   │   ├── api/
│   │   │   ├── admin/
│   │   │   │   ├── bookings/route.ts # Admin Bookings API & WhatsApp Trigger
│   │   │   │   └── packages/route.ts # Admin Packages API
│   │   │   ├── auth/
│   │   │   │   ├── admin-register/   # Admin Registration Endpoint
│   │   │   │   ├── send-otp/route.ts # OTP Dispatch Route
│   │   │   │   └── verify-otp/route.ts# OTP Verification & Session Issuer
│   │   │   └── webhooks/
│   │   │       ├── messenger/route.ts# Facebook Messenger Webhook Receiver
│   │   │       └── whatsapp/route.ts # WhatsApp Business API Webhook Receiver
│   │   ├── globals.css               # Glassmorphism utility suite & ambient animations
│   │   └── layout.tsx                # Root App Layout
│   ├── components/
│   │   ├── admin/
│   │   │   ├── AdminAuthModal.tsx    # Admin Registration & Sign In Modal
│   │   │   ├── AdminSidebar.tsx      # Admin Drawer Navigation
│   │   │   ├── AvailabilityNoticeManager.tsx # Shift Roster & Emergency Banners
│   │   │   ├── BookingKanbanBoard.tsx# Kanban Board & 1-Click WhatsApp Trigger
│   │   │   ├── OmniInboxHub.tsx      # Split-pane Omni-Channel Chat Hub
│   │   │   └── PackageEngine.tsx     # Bundle Builder & Tiered BDT Pricing
│   │   ├── aispa/
│   │   │   ├── AIConciergeModal.tsx  # Chatbot Modal
│   │   │   ├── AIRecommendationWidget.tsx # Weather & Biometric Matcher
│   │   │   ├── AuthModal.tsx         # Localized BD Auth Modal (shadcn forms)
│   │   │   ├── ClientTestimonials.tsx# Verified Customer Reviews
│   │   │   ├── Footer.tsx            # Glassmorphic Footer
│   │   │   ├── HeroSection.tsx       # Smart Search & Hero Banner
│   │   │   ├── LanguageSwitcher.tsx  # English ↔ বাংলা Pill Switcher
│   │   │   ├── Navbar.tsx            # Dual Responsive Navigation
│   │   │   ├── NextAvailableSlotFinder.tsx # Urgent Slot Matrix
│   │   │   └── ServiceCategories.tsx # Service Catalog
│   │   └── ui/
│   │       └── form.tsx              # Shadcn Form Primitives
│   └── lib/
│       ├── auth/
│       │   ├── jwt.ts                # JWT Generation & Cookie Utilities
│       │   ├── otp.ts                # SHA-256 Hashing & OTP Engine
│       │   ├── rate-limiter.ts       # Sliding Window Rate Limiter
│       │   └── rbac.ts               # Role-Based Access Control Middleware
│       ├── i18n/
│       │   └── dict.ts               # English & Bangla Dictionary + BDT Price Converter
│       ,   omni/
│       │   └── webhook-router.ts     # Meta/WhatsApp Webhook Router & Template Dispatcher
│       └── validations/
│           ├── admin-auth.ts         # Admin Registration Zod Schemas
│           └── auth.ts               # Phone & OTP Zod Schemas
└── README.md                         # Project Documentation
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **Package Manager**: `npm` or `pnpm`
- **PostgreSQL Database** (optional for local testing; mock fallbacks included)

### 2. Environment Variables Setup
Create a `.env.local` file in the root directory:

```env
# Application Secrets
JWT_SECRET="aispa_super_secret_jwt_key_2026"
OTP_SECRET_SALT="aispa_crypto_salt_998877"
ADMIN_SECRET_KEY="AISPA-ADMIN-SECRET-2026"

# Database Configuration
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/aispa_db?schema=public"

# WhatsApp Business Cloud API
WHATSAPP_API_URL="https://graph.facebook.com/v18.0/YOUR_PHONE_NUMBER_ID/messages"
WHATSAPP_ACCESS_TOKEN="YOUR_WHATSAPP_PERMANENT_ACCESS_TOKEN"
WHATSAPP_VERIFY_TOKEN="aispa_wa_verify_token_2026"

# Meta Graph API (Facebook Messenger)
MESSENGER_VERIFY_TOKEN="aispa_fb_verify_token_2026"
PAGE_ACCESS_TOKEN="YOUR_FACEBOOK_PAGE_ACCESS_TOKEN"
```

### 3. Installation & Local Execution

```bash
# Clone repository
git clone https://github.com/your-org/aispa.git
cd aispa

# Install dependencies
npm install

# Initialize Database Schema
npx prisma db push

# Run TypeScript Typecheck Verification
npx tsc --noEmit

# Start Development Server
npm run dev
```

The web application will be accessible at:
- **Consumer Portal**: [http://localhost:3000](http://localhost:3000)
- **Admin Studio Dashboard**: [http://localhost:3000/admin](http://localhost:3000/admin)

---

## 🔐 Admin Instructions

### Registering a New Salon Owner / Manager Profile
1. Navigate to the Admin Dashboard at [`http://localhost:3000/admin`](http://localhost:3000/admin).
2. Click the **"Admin Registration"** button in the top right header.
3. Fill out the registration form:
   - **Full Name**: e.g., `Salma Ahmed`
   - **Business Email**: e.g., `salma@aispa-downtown.com`
   - **Bangladeshi Mobile Phone**: e.g., `01712345678`
   - **Admin Secret Passkey**: Enter `AISPA-ADMIN-SECRET-2026`
   - **System Role**: Select `ADMIN` (Full Access) or `MANAGER` (Operations & Shifts)
   - **Password**: Enter password (min. 6 characters).
4. Click **"Register Salon Admin Profile"**. You will be issued an HTTP-only admin session token.

---

## 🌐 Webhook Integration Setup

### WhatsApp Business Cloud API
- **Webhook Endpoint URL**: `https://your-domain.com/api/webhooks/whatsapp`
- **Verify Token**: `aispa_wa_verify_token_2026`
- **Subscribed Fields**: `messages`

### Meta Facebook Messenger Graph API
- **Webhook Endpoint URL**: `https://your-domain.com/api/webhooks/messenger`
- **Verify Token**: `aispa_fb_verify_token_2026`
- **Subscribed Fields**: `messages`, `messaging_postbacks`

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

---
<p align="center">
  Crafted with ❤️ for Bangladesh's Beauty & Wellness Industry.
</p>
# aispa
