# CivicResolve: AI-Powered Civic Issue Reporting and Resolution Platform
### Coimbatore Smart City Municipal Corporation (CCMC) Operations

[![Next.js 14](https://img.shields.io/badge/Next.js-14.2-black?style=flat&logo=next.js)](https://nextjs.org/)
[![Google Gemini Flash](https://img.shields.io/badge/AI-Google%20Gemini%202.5%20Flash-4285F4?style=flat&logo=google)](https://ai.google.dev/)
[![Prisma ORM](https://img.shields.io/badge/Database-Prisma%20SQLite-2D3748?style=flat&logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/UI-Tailwind%20%2B%20Cinematic-06B6D4?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![Leaflet](https://img.shields.io/badge/Maps-Interactive%20Leaflet-199900?style=flat&logo=leaflet)](https://leafletjs.com/)

---

## 🏛️ Executive Summary

Everyday civic issues—from crater-sized potholes and sparking distribution transformers to overflowing garbage bins and drinking water pipeline bursts—frequently stall because:
1. **Citizens don't know which municipal department to approach** (is it CCMC Roads, State Highways, TWAD Water Board, or TANGEDCO?).
2. **Citizens lack the technical vocabulary to describe severity** or communicate urgency.
3. **Municipal authorities drown in disorganized, duplicate complaints** with no objective safety prioritization.
4. **Citizens cannot track resolution accountability**, leading to cynicism and disengagement.

**CivicResolve** bridges grassroots reporting with municipal field operations. Powered by **Google Gemini multimodal intelligence**, it automatically identifies the exact civic issue category, calculates an objective 0–100 public impact score, determines safety urgency, routes the complaint to the responsible department with reasoned confidence, verifies photographic proof of resolution, and maintains an immutable audit trail.

---

## ⚡ Core Feature Matrix (Mandatory Requirements)

| Requirement | Description | Live Verification Link |
| :--- | :--- | :--- |
| **R1. Citizen Reporting** | Multimodal submission: Title, Voice/Text description (English, Tamil, Hindi), interactive GPS map pin-drop, "Use My Location" geolocation, and photo evidence upload. | [`/report`](http://localhost:3000/report) |
| **R2. AI Classification** | Google Gemini 2.5 Flash classifies 8 civic categories with live typing preview and instant structured classification. | [`/report`](http://localhost:3000/report) |
| **R3. Priority Detection** | Urgency assignment (`Critical`, `High`, `Medium`, `Low`) + 0–100 public impact score factoring in hazard level and proximity to sensitive landmarks (schools, hospitals, transit hubs). | [`/report`](http://localhost:3000/report) |
| **R4. Dept Recommendation** | AI assigns responsible department (Roads & Highways, TWAD Water Board, TANGEDCO, Sanitation, Drainage) with confidence % and a one-line *"Why this department?"* explanation. | [`/report`](http://localhost:3000/report) |
| **R5. Issue Tracking** | Look up any ticket by ID, animated status timeline (`Reported` ➔ `In Progress` ➔ `Resolved`), before/after resolution slider, and audit logs. | [`/track/CR-2026-1002`](http://localhost:3000/track/CR-2026-1002) |
| **R6. Command Center** | Municipal control room: KPI cards, Recharts analytics, sortable table, bulk actions, detail drawer, status updater, proof uploader, and Gemini executive digest. | [`/admin`](http://localhost:3000/admin) |

---

## 🌟 Differentiating Innovations

1. **300m Spatial Duplicate Detection & Upvoting**:
   When a user files an issue within ~300 meters of an existing complaint of the same category, the system flags it: *"3 citizens already reported this. Support it instead?"* Upvoting elevates the issue's priority score without cluttering municipal queues.
2. **Voice Input & Multilingual Understanding**:
   Integrated Web Speech API supporting spoken input in **English**, **தமிழ் (Tamil)**, and **हिंदी (Hindi)**. Gemini natively understands regional complaints and returns normalized summaries in English.
3. **Interactive City Map & Hotspots**:
   Futuristic dark-themed Leaflet map of Coimbatore with color-coded markers by urgency, animated pulsating status halos, and an aggregate severity hotspot layer.
4. **Before / After Resolution Slider**:
   When field crews resolve an issue, admins upload verified "After" photography. The citizen tracking portal renders an interactive before/after comparison slider.
5. **Real-time SLA Countdown & Overdue Alerts**:
   Automated SLA calculation based on urgency (Critical: 18h, High: 36h, Medium: 48h). Visual overdue beacons alert control room supervisors.
6. **Public Transparency Scorecard**:
   City-wide resolution rate (%), department SLA leaderboards, and ward-by-ward civic health metrics available to the public.
7. **Judge's Guide & 1-Click Guided Demo**:
   Dedicated modal accessible from any page with a verification checklist and an automated 1-click end-to-end demo.

---

## 🛠️ System Architecture

```
                                  [ Citizen Mobile / Web Browser ]
                                                  │
                                ┌─────────────────┴─────────────────┐
                                │                                   │
                     [ Speech Input / Geolocation ]     [ Photo Upload / Map Pin ]
                                │                                   │
                                └─────────────────┬─────────────────┘
                                                  ▼
                                      [ Next.js 14 App Router ]
                                                  │
                     ┌────────────────────────────┼────────────────────────────┐
                     ▼                            ▼                            ▼
            /api/ai/analyze                 /api/issues                /api/analytics
                     │                            │                            │
      ┌──────────────┴──────────────┐             │                   [ Recharts Engine ]
      ▼                             ▼             ▼                            │
[ Google Gemini 2.5 Flash ]   [ Deterministic ]  [ SQLite DB / Prisma ] ◄──────┘
  - Multimodal Vision           Fallback Engine  - Issues (42+ Seeded)
  - Structured JSON Schema      (Offline Safe)   - Status Audits (Immutable)
  - Proximity Severity          Regex Heuristics - Duplicate Upvotes
```

---

## 🚀 Quickstart & Setup

### Prerequisites
- Node.js 18+ (tested on Node v20 & v26)
- npm or pnpm

### 1. Installation
```bash
cd civic-resolve
npm install
```

### 2. Environment Configuration
Create or edit `.env`:
```env
# Database
DATABASE_URL="file:./dev.db"

# Google Gemini API Key
# (Leave empty to use the built-in deterministic fallback classifier)
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash

# Admin Demo Passcode
ADMIN_PASSCODE=civicadmin2026
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Database Initialization & Seeding
```bash
# Push schema to SQLite
npx prisma db push

# Seed 42+ realistic Coimbatore municipal complaints across 14 wards
npm run db:seed
```

### 4. Run Development or Production Server
```bash
# Production server (recommended for demo)
npm run build
npm start

# Or development mode
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⏱️ 3-Minute Hackathon Demo Script

### **Minute 1: The Citizen Experience & Multimodal Gemini Triage (R1 - R4)**
1. Open the landing page [`http://localhost:3000`](http://localhost:3000)
   - Highlight the cinematic hero with glowing city pins transitioning from Red (Reported) ➔ Amber (In Progress) ➔ Green (Resolved).
2. Click **"Report an Issue"** [`/report`](http://localhost:3000/report).
3. Type headline: *"Deep crater pothole in front of school bus stop, student cycle tripped"*
   - Observe the **Live AI Preview banner** dynamically classifying the issue as *Pothole/Road Damage (Critical)* while typing!
4. Click **"Speak Issue"** to demo voice input in Tamil or English.
5. Click **"Analyze with Gemini & Review Triage"**:
   - The **AI Analysis Panel** expands:
     - Badge: `AI-analyzed by Gemini 2.5 Flash` (or Rule-based fallback).
     - Urgency: `Critical Priority` | Public Impact: `94/100`.
     - Department: `Roads & Highways Department (Highways & CCMC Wing)`.
     - *Why this department?*: Direct roadway hazard threatening student transit.
     - Human-in-the-loop: click *"Modify Triage Classification"* to show that citizens can review or override before final submission.
6. Click **"Confirm & Submit Complaint"** ➔ receives Issue ID (e.g. `CR-2026-XXXX`).

### **Minute 2: Tracking, Audit Logs & Before/After Proof (R5)**
1. Open [`/track/CR-2026-1002`](http://localhost:3000/track/CR-2026-1002) (Resolved complaint on D.B. Road, RS Puram).
2. Showcase the **Verified Resolution Proof slider**:
   - Drag the slider left and right to compare the initial complaint crater vs the hot-mix asphalt finished road!
3. Scroll to the **Live Resolution Timeline**:
   - Animated 3-step progress bar (`Reported` ➔ `Work Order Dispatched` ➔ `Inspected & Resolved`).
   - Detailed audit trail showing timestamps, responsible engineers, and inspection notes.
4. Click **"Support Issue"** to demonstrate priority upvoting.

### **Minute 3: Control Room Operations & AI Executive Digest (R6)**
1. Navigate to **Control Room** [`/admin`](http://localhost:3000/admin).
2. Review real-time KPIs: Critical Open (10), SLA Compliance (89%), Avg Resolution (20h).
3. Click **"Summarize Open Issues (AI)"**:
   - Gemini analyzes active tickets across Coimbatore and generates the *Civic Intel Digest* with top operational directives and hotspot wards.
4. Filter table by *"Critical"* or *"Pothole/Road Damage"*.
5. Click any complaint to open the **Slide-Over Detail Drawer**:
   - Transition status to `RESOLVED`, select a preset resolution photo proof, add official remarks, and click *"Commit Status Change"*.
6. Switch to **City Map View** to observe spatial density and severity hotspots across Coimbatore wards.
7. Wrap up at **Transparency Scorecard** [`/transparency`](http://localhost:3000/transparency).

---

## 🏆 Innovation Highlights for Pitch Deck

1. **Multimodal Problem Formulation**:
   Instead of forcing citizens to pick from obscure dropdown menus, Gemini consumes unconstrained voice, text in 3 languages, and photos simultaneously, producing structured JSON triage.
2. **Deterministic Graceful Degradation**:
   Zero downtime architecture: if offline or without an API key, an intelligent rule-based keyword classifier takes over without degrading user flow.
3. **Accountability via Proof-of-Resolution**:
   Addresses citizen skepticism by mandating photographic proof before closure, visualized via the interactive before/after slider.
4. **Spatial De-duplication**:
   Solves the common municipal bottleneck of redundant complaints overloading dispatchers.

---

*CivicResolve — Empowering citizens. Accelerating municipal resolution.*
