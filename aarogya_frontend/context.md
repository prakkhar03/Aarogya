# Aarogya AI Frontend Session Context

## Current Work Completed (Session 2 — 2026-05-01)

### Visual Overhaul
- Rebuilt `AnimatedDNA.jsx` using GSAP — 16-rung helix with sine-wave oscillation, depth-scaling dots, and ambient glow.
- Replaced Framer Motion loader with GSAP-sequenced `Loader.jsx` — morphing logo + text reveal + fade-out synced to page readiness.
- Implemented GSAP `ScrollTrigger` on all landing page sections (hero stagger, about, features, spotlight, testimonials).

### Expanded Landing Page
- Hero section with animated DNA, floating stats badges, dual CTA buttons.
- Marquee banner ("THE SCIENCE OF HEALING, THE ART OF CARE").
- About section with one-line pitch + orbital care diagram + stats row (15+, 50+, 15k+).
- Features grid: Medical Report Analysis Agent, Symptom Interpretation Agent, Closed AI-to-Doctor Feedback Loop.
- Doctor Spotlight: Dr. Prakash card with consultation stats + clinical safety checklist.
- Testimonials: 3-card grid (Riya Sharma, Dr. Prakash, Sarah Rosen) with hover-card scale + slide-up reveal.
- Structured Footer: nav columns, social icons, "Powered by Agentic AI" badge.

### Authentication System
- Created `useAuth.jsx` context — JWT-based, aligned with backend schema (username + password + role).
- Built `AuthPage.jsx` — 40/60 split-screen with animated gradient + floating particles, tab switcher (Login/Signup), role selector (Patient/Doctor), glassmorphic inputs, Google/LinkedIn social auth buttons.
- Created `ProtectedRoute.jsx` — role-gated route guard redirecting unauthenticated users to `/auth` and mismatched roles to their correct dashboard.

### Hover Micro-interactions
- Applied "Enlarge + Scroll-Up" hover effect: cards scale to 1.05 on hover, hidden content layer slides up from bottom.

### GSAP Integration
- Installed `gsap` and `@gsap/react`.
- GSAP ScrollTrigger registered and active on all landing sections.
- Hero entrance: staggered `.hero-anim` elements with 0.12s delay.
- Loader: GSAP timeline with morphing + fadeOut + onComplete callback.

## Integration Status
| Endpoint | Frontend Component | Status |
|---|---|---|
| `POST /api/auth/register/` | `AuthPage.jsx` (signup) | ✅ Connected |
| `POST /api/auth/login/` | `AuthPage.jsx` (login) | ✅ Connected |
| `GET /api/auth/me/` | `useAuth.jsx` (hydration) | ✅ Connected |
| `POST /api/symptoms/chat/` | `SymptomTriage.jsx` | ✅ Connected (w/ fallback) |
| `POST /api/reports/upload/` | `PatientDashboard.jsx` | ✅ Connected (w/ fallback) |
| `GET /api/reports/` | `PatientDashboard.jsx` | 🔲 Pending |
| `POST /api/verify/<token>/` | `DoctorPortal.jsx` | 🔲 Frontend-only mock |
| `POST /api/share/<id>/` | — | 🔲 Not started |

## Pending Frontend Tasks
- Wire `DoctorPortal` to real `api/verify/<token>/` when tokens are available.
- Wire report list endpoint (`GET /api/reports/`) to show history.
- Admin/Prompt Config deferred to future sprint.
