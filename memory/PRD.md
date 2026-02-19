# FounderPlane - Product Requirements Document

## Original Problem Statement
User transferred their FounderPlane project from another Emergent session via GitHub (https://github.com/hemsarts5-cmyk/Founderplanev3.git). Startup consultancy platform with multiple service pages, lead capture, AI assessment, and admin dashboard.

## Architecture
- **Frontend**: React 18 + TypeScript + Vite 5 + Tailwind CSS + Framer Motion + shadcn/ui
- **Backend**: FastAPI + MongoDB (Motor async driver)
- **AI Integration**: GPT-5.2 via Emergent LLM Key (emergentintegrations library)
- **Intercom**: Live chat widget via react-use-intercom

## User Personas
- **Founders** (primary): Startup founders at Launch/Growth/Scale stages seeking consultancy
- **Admin**: FounderPlane team managing leads via /admin dashboard

## Core Requirements (Static)
1. Multi-page service platform showcasing 6 consulting services
2. Lead capture forms on each service page
3. AI-powered Stage Clarity Check quiz
4. Admin dashboard for lead management
5. Scroll analytics tracking with per-section funnel visualization
6. Animated splash screen and page transitions

## Pages
| Page | Route | Status |
|------|-------|--------|
| Index (Homepage) | / | Working |
| BoltRunway | /services/boltrunway | Working |
| ScaleRunway | /services/scalerunway | Working |
| B2BBolt | /services/b2bbolt | Working |
| D2CBolt | /services/d2cbolt | Working |
| Boltguider | /services/boltguider | Working |
| BrandToFly | /services/brandtofly | Working |
| Admin | /admin | Working |
| 404 | /* | Working |

## What's Been Implemented

### Session 1: Initial Migration (Jan 2026)
- Cloned from GitHub and migrated CRA to Vite + TypeScript setup
- Configured environment variables (VITE_BACKEND_URL, EMERGENT_LLM_KEY, ADMIN_PASSWORD)
- **Testing**: 100% backend, 95% frontend, 100% integration

### Session 2: Scroll Analytics + Nav Fix (Jan 2026)
- Removed "About Us" from navigation menu
- Added `data-testid` attributes to ALL sections across ALL 7 pages
- Added ScrollTracker component to Index, BoltRunway, ScaleRunway, B2BBolt, D2CBolt, Boltguider, BrandToFly
- Built Scroll Depth tab in Admin Dashboard with:
  - Summary cards (Unique Sessions, Total Events, Pages Tracked)
  - Per-page funnel cards with section progress bars
  - Drop-off indicators between sections
  - Page filter pills with visitor counts
  - Time range selector (7d, 14d, 30d, 90d)
- **Testing**: 100% frontend, 93.8% backend (AI endpoint not related to new feature), 100% integration

## Prioritized Backlog

### P0
- Fix AI stage assessment endpoint (520 error - LLM key config)

### P1
- Razorpay integration for paid services
- Email notifications for new leads
- SEO meta tags, Open Graph tags

### P2
- Lead notes/comments, team assignment
- Calendar integration, Slack webhooks
- Export scroll analytics data to CSV
- Performance optimizations

## Next Tasks
- Awaiting user review of scroll analytics dashboard
- User to identify specific improvements, features, or bug fixes needed
