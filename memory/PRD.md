# FounderPlane - Product Requirements Document

## Original Problem Statement
User transferred their FounderPlane project from another Emergent session via GitHub (https://github.com/hemsarts5-cmyk/Founderplanev3.git). The project is a startup consultancy platform with multiple service pages, lead capture, AI assessment, and admin dashboard. User wants the platform running as-is and fully functional.

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
5. Scroll analytics tracking
6. Animated splash screen and page transitions

## Pages
| Page | Route | Status |
|------|-------|--------|
| Index (Homepage) | / | Working |
| BoltRunway | /services/boltrunway | Working (Crimson Red accent) |
| ScaleRunway | /services/scalerunway | Working (Gold accent) |
| B2BBolt | /services/b2bbolt | Working |
| D2CBolt | /services/d2cbolt | Working |
| Boltguider | /services/boltguider | Working |
| BrandToFly | /services/brandtofly | Working |
| Admin | /admin | Working |
| 404 | /* | Working |

## What's Been Implemented (Jan 2026)

### Migration to Current Environment
- Cloned from GitHub and migrated CRA to Vite + TypeScript setup
- Configured environment variables (VITE_BACKEND_URL, EMERGENT_LLM_KEY, ADMIN_PASSWORD)
- Installed all dependencies and verified services running
- **Testing**: 100% backend, 95% frontend (404 page confirmed working), 100% integration

### Backend (FastAPI)
- Lead CRUD endpoints (create, list, update status, stats)
- Admin authentication (password-based)
- AI Stage Assessment via GPT-5.2
- Scroll analytics tracking (individual + batch events)

### Frontend (React + Vite)
- 6 service pages with unique branding/accents
- Homepage with hero, problem section, services overview
- Splash screen with animated logo
- Page transitions via Framer Motion
- Lead capture forms + modals
- Stage Clarity Check quiz
- Admin dashboard with login and lead management
- Intercom live chat integration

## Prioritized Backlog

### P1
- BoltGuider premium page rebuild (if needed)
- BrandToFly premium page rebuild (if needed)
- Razorpay integration for paid services
- Email notifications for new leads

### P2
- Lead notes/comments, team assignment
- Calendar integration, Slack webhooks
- SEO meta tags, Open Graph tags
- Performance optimizations

## Next Tasks
- Awaiting user review of current deployment
- User to identify specific improvements, features, or bug fixes needed
