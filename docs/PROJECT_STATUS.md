# WellSphere — Project Status

**Brand:** WellSphere | **Version:** v1.0.0 (Production Ready) | **Stack:** MERN | **Status:** ✅ 100% Complete & Audited | **Last Updated:** 2026-08-19

---

## 1. Architecture Overview

**Type:** Editorial health content platform (articles, topics, search, reader inquiries). Not telemedicine, not diagnosis.

**Stack:**
- **Frontend:** Vite 8 + React 19 + JavaScript + Tailwind CSS → `client/`
- **Backend:** Node.js (ESM) + Express 5 + MongoDB (Mongoose 8) → `server/`
- **API:** REST, versioned at `/api/v1/`
- **Media Object Storage:** Cloudinary (MongoDB stores metadata: `secureUrl`, `publicId`, `alt`, `caption` only)
- **Infrastructure:** Zero-cost free tiers (Vercel + Render + MongoDB Atlas)

**Backend pattern (locked):** `Route → Middleware → Controller → Service → Repository → MongoDB`

**Roles (locked):** `user` · `editor` · `superadmin`

---

## 2. Security & Two-Factor Authentication (2FA) Architecture

### 1. 30-Minute JWT Expiration Policy for Privileged Roles
- **SuperAdmin & Editor Sessions:**
  - JWT Access Token lifetime is strictly set to **30 minutes** (`expiresIn: '30m'`).
  - Access cookie `maxAge` is set to `1,800,000` ms (30 minutes).
- **Standard User Sessions:**
  - JWT Access Token lifetime is standard **15 minutes** (`expiresIn: '15m'`).
- **Refresh Token Policy:**
  - 7-day HttpOnly cookie (`Secure`, `SameSite=Lax`) with rotation on every single use.
  - Automatic client-side retry interceptor in `apiClient`.

### 2. Email Two-Factor Authentication (OTP) Lifecycle
- **Sign-in Evaluation (`POST /api/v1/auth/login`):**
  - Regular `user` accounts authenticate directly with email + bcrypt password.
  - Privileged accounts (`editor` and `superadmin`) require email 2FA:
    1. Server issues a cryptographically secure 6-digit numeric OTP (`crypto.randomInt(100000, 1000000)`).
    2. Hashes OTP with bcrypt into `OtpChallenge` (10-minute TTL index).
    3. Sends branded security email via Nodemailer (or developer simulator log in development).
    4. Returns `{ require2FA: true, tempToken: "<signed-2fa-jwt>", challengeId: "<id>", email: "..." }`.
- **2FA Verification (`POST /api/v1/auth/verify-2fa` / `POST /api/v1/auth/verify-otp`):**
  - Payload: `{ otp, code, tempToken, challengeId, email }`.
  - Verifies code with bcrypt, checks expiration, marks challenge as consumed.
  - Issues 30-minute JWT token and secure session cookies.
- **Resend OTP (`POST /api/v1/auth/resend-2fa` / `POST /api/v1/auth/resend-otp`):**
  - Rate-limited endpoint for requesting a fresh 6-digit code with 60-second cooldown timer.

### 3. Client-Side Login & Route Protection
- **Client 2FA Step (`AuthPage.jsx`):**
  - Transitions into an interactive 6-digit verification screen.
  - Automatic input focus, paste formatting, active countdown timer (`0:45`), and resend trigger.
  - On verification, redirects user to role dashboard (`/admin`, `/editor`, or `/dashboard`).
- **Route Guards (`RequireAuth.jsx` & `RequireRole.jsx`):**
  - Unauthenticated visitors are redirected to `/login` with return location preserved in state.
  - Authenticated users with insufficient privileges are redirected to `/forbidden` (403 Forbidden).

---

## 3. Health Discovery & Search Engine Hub (`SearchPage.jsx`)

### 1. Modern Hero & Interactive Search Input
- **Header Badge:** `inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-teal-800 bg-teal-50 border border-teal-200/60`.
- **Search Bar Form:** Container `max-w-2xl w-full mx-auto relative mt-6` with search icon, styled input, and embedded action button (`bg-teal-700 hover:bg-teal-800 text-white px-5 py-2.5 rounded-xl`).

### 2. Popular & Trending Search Tags
- Quick-filter tags: `Sleep Hygiene`, `Mindful Nutrition`, `Stress & Anxiety`, `Daily Mobility`, `Gut Health`, `Morning Routine`. Clicking immediately triggers search.

### 3. Faceted Filter & Sort Controls
- Live result counter, topic dropdown filter, and sort selector (*Most Relevant*, *Latest Published*, *Shortest Read*).

---

## 4. Editorial Studio & Author Workspace

### 1. Modern Light-Slate Sidebar & Topbar (`EditorLayout.jsx`)
- WellSphere logo (`h-8 w-auto`) + dedicated `Editorial Studio` badge row.
- Navigation: Studio Dashboard, My Articles, Write New Article, Comment Moderation, Reader Inquiries, and Editorial Analytics.
- Fixed breadcrumbs (`Editorial Studio / Current View`).

### 2. My Articles & Multi-Section Writing Studio (`ArticleEditorPage.jsx`)
- Metadata card with live character counter and **⚡ Auto-Calculate Reading Time**.
- Cloudinary object storage image uploader with preview thumbnail.
- Dynamic section repeaters with dashed add button.
- Standardized clinical guidance callouts (Home Care, Lifestyle, Exercise, Medical Red Flags).
- Medical citations repeater & interactive **Reader Preview Mode**.

---

## 5. SuperAdmin Command Center & Governance Portal

### 1. Executive Dark Sidebar & Topbar (`AdminLayout.jsx`)
- Dark slate (`bg-slate-950 text-slate-300 border-r border-slate-800/80 w-72`).
- 4-Column KPI Grid, Review Queue Drawer, User Administration, Audit Logs, and System Settings with Emergency Lockdown switches.

---

## 6. SuperAdmin Database Seeding (`seedAdmin.js`)

```bash
npm run seed:admin
```

---

## 7. Production Deployment Guide (Zero-Cost Tier)

- **Database:** MongoDB Atlas (M0 Free Tier)
- **Media:** Cloudinary (Free Tier)
- **Backend API:** Render Web Service (Free Tier)
- **Frontend Web App:** Vercel (Free Tier)
