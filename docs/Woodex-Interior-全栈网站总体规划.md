# Woodex Interior — Fullstack Website Master Plan

**Project:** Woodex Interior (Lahore) — fullstack website
**Design language:** Ultra-luxury dark + gold system (from the attached UI Design System PRD)
**Content source:** Verified Woodex SEO Content Master (no invented claims, awards, or project counts)

---

## 1. Vision & Positioning

> **Woodex Interior is a Lahore-based interior design and custom furniture company creating functional residential, office, retail and commercial spaces.**

Competitive niche: *interior design + workspace planning + customized furniture under one coordinated service* — not another generic "best interior designer in Lahore".

**Content rule (from audit):** no fabricated figures ("500+ projects", "since 2015", "award-winning") until the owner confirms them. All stats on the site are derived from the actual service offering (12 service lines, 6-step process).

---

## 2. Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│  FRONTEND  (Stage 1 — COMPLETE)                             │
│  React 18 + TypeScript + Vite + Tailwind + shadcn/ui        │
│  react-router · lazy-loaded routes · IntersectionObserver   │
├─────────────────────────────────────────────────────────────┤
│  BACKEND  (Stage 2 — next)                                  │
│  Hono + tRPC + Drizzle ORM (per backend-building skill)     │
├─────────────────────────────────────────────────────────────┤
│  DATABASE  (Stage 2 — next)                                 │
│  MySQL (default per backend skill) via Drizzle migrations   │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Stage 1 — Frontend (DELIVERED)

**Pages (13 routes):**

| Route | Page | Status |
|---|---|---|
| `/` | Home — hero, value pillars, services grid, featured projects, custom-furniture strip, 6-step process, why-Woodex, FAQ, insights preview, CTA | ✅ |
| `/about` | Brand story, approach, scope of work, location | ✅ |
| `/services` | All 12 services index | ✅ |
| `/services/:slug` | 12 SEO service pages (interior design, residential, office, commercial, retail, 3D & space planning, custom furniture, office furniture, carpenter, turnkey, renovation, exterior) | ✅ |
| `/projects` | Portfolio with category filters | ✅ |
| `/projects/:slug` | 6 case studies (brief → challenge → solution → materials → services) | ✅ |
| `/insights` | Blog/guides index | ✅ |
| `/insights/:slug` | 6 published guides (cost guides, office planning, retail, turnkey) | ✅ |
| `/contact` | Full lead form (11 fields + services multi-select + file upload + honeypot), map embed, WhatsApp | ✅ |
| `/privacy-policy`, `/terms` | Legal pages | ✅ |
| `*` | Luxury 404 | ✅ |

**Design system implemented:** gold-on-black tokens, Cormorant Garamond + Montserrat, clipped-corner gold buttons with shimmer, ornament corner frames, gold dividers, watermark typography, scroll-reveal animations, marquee, process timeline, FAQ accordions, WhatsApp FAB with pulse, back-to-top.

**Business data (verified only):** Zainab Tower, Model Town Link Road, Lahore · 0322 4000768 · 042 35942471.

**SEO:** unique titles/meta, LocalBusiness JSON-LD, semantic H1/H2 hierarchy, lazy-loaded images, route-level code splitting (main bundle ~98 KB gzipped).

**API-ready:** `src/lib/api.ts` already implements `submitInquiry()` with UTM capture — it posts to `VITE_API_BASE/inquiries` as soon as the backend exists (currently simulates success locally).

---

## 4. Stage 2 — Backend + Database (NEXT)

**Stack:** Hono server + tRPC routers + Drizzle ORM + MySQL, grafted onto this project.

### Database schema (planned tables)

| Table | Purpose |
|---|---|
| `inquiries` | Contact-form leads: name, phone, email, project_type, location, area, services[], start_date, budget, message, source_page, utm_*, status (new/reviewing/quoted/won/lost) |
| `services` | Service pages content (slug, title, h1, intro, sections JSON, meta) — CMS-editable |
| `projects` | Portfolio case studies (slug, category, location, area, year, brief, challenge, solution, materials[], services[], images[]) |
| `articles` | Insights posts (slug, category, body JSON, faqs JSON, related_service) |
| `bookings` | Consultation bookings (name, contact, preferred date/time, type) |
| `settings` | Site settings: phone, address, hours, social links, SEO defaults |
| `admin_users` | JWT auth for the admin panel |

### API endpoints (planned)

```
POST   /inquiries              → submit lead (rate-limited, honeypot-checked)
GET    /services · /services/:slug
GET    /projects · /projects/:slug
GET    /articles · /articles/:slug
POST   /bookings               → consultation booking
POST   /auth/login             → admin JWT
Admin: CRUD on all content tables + inquiry status pipeline
```

### Admin panel (Stage 2b)

Lightweight `/admin` route: login, inquiries pipeline board, content editors for services/projects/articles.

---

## 5. Stage 3 — Go-Live

- Owner confirms: establishment year, project counts, team profiles, working hours, email, exact unit number → replace placeholder copy
- Replace representative portfolio images with real project photography
- robots.txt + sitemap.xml generation, Search Console verification
- Remaining 6 insights articles (12 total planned)
- Performance audit (target: LCP < 2.5 s), image CDN
- WhatsApp Business integration, GA4 + conversion events (form, call, WhatsApp clicks)

---

## 6. Content Roadmap (12 SEO articles — 6 live, 6 planned)

✅ Interior Design Cost in Lahore · ✅ Office Interior Cost · ✅ How to Plan an Office Interior · ✅ Small Office Ideas · ✅ Shop Interior Ideas · ✅ Turnkey Explained
⬜ Custom vs Ready-Made Office Furniture · ⬜ How 3D Visualization Helps · ⬜ Home Interior Planning Checklist · ⬜ How to Choose an Interior Designer · ⬜ Office Renovation Checklist · ⬜ How to Compare Interior Quotations
