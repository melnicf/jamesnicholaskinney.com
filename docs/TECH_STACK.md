# JamesNicholasKinney.com — Tech Stack

> Source of truth synced from Notion workspace. Last synced: 2026-02-13.
> These decisions are locked for the MVP phase.

---

## Stack Overview

| Layer                  | Technology                    | Purpose                                      |
| ---------------------- | ----------------------------- | -------------------------------------------- |
| **Frontend**           | Next.js (App Router)          | Public-facing website, SSR, routing, layouts  |
| **Styling**            | Tailwind CSS                  | Utility-first styling, fast iteration         |
| **CMS**               | Sanity                        | System of record for all content              |
| **Backend**            | Node.js (Serverless via Vercel) | RSS ingestion, normalization, AI services   |
| **Database**           | PostgreSQL (Managed)          | Dedup hashes, ingestion logs, metadata        |
| **AI Services**        | OpenAI API                    | Summaries, categorization, draft generation   |
| **Hosting**            | Vercel                        | Frontend + serverless backend hosting         |
| **DNS**                | Existing registrar             | Domain DNS (point to Vercel)                  |
| **Analytics**          | Plausible / Vercel Analytics  | Page views, referrers, publish frequency      |
| **CI/CD**              | Vercel Native                 | Automatic deploys on push to main             |
| **Video**              | YouTube                       | Weekly recap hosting, embedded on site         |

---

## Frontend — Next.js (App Router)

Used to build the public-facing website.

**Why Next.js:**
- Server-rendered pages for SEO and performance
- Fast iteration and strong ecosystem
- Native support for metadata, routing, and layouts
- Seamless integration with Vercel

**Responsibilities:**
- Home feed
- Category pages (Business & Tech, Politics & Policy, Sports & Entertainment, Arts & Culture)
- Content detail pages
- Static pages (About, Books, Speaking)
- Video embeds
- SEO metadata

---

## Styling — Tailwind CSS

**Why Tailwind:**
- Utility-first approach for fast development
- Clean, modern aesthetic
- No heavy design system required for MVP
- Easy iteration as brand evolves

---

## Content Management — Sanity

Sanity acts as the **system of record** for all content.

**Used for:**
- Aggregated content storage
- Original articles
- Editorial workflows
- Content states (Ingested → Needs Review → Approved → Published)
- Role-based permissions (Admin, Editor, Contributor)

**Why Sanity:**
- Excellent editorial experience
- Flexible schemas
- Real-time updates
- API-first and frontend-agnostic

---

## Backend & Aggregation — Node.js Serverless

Deployed via Vercel serverless infrastructure.

**Responsibilities:**
- RSS feed ingestion
- Content normalization
- De-duplication
- Auto-categorization (AI-assisted)
- Ingestion logging

**Characteristics:**
- No long-running servers
- Scales automatically
- Minimal ops overhead
- Easy to extend post-MVP

---

## Database — PostgreSQL (Managed)

Used as a **supporting datastore**, not the primary CMS.

**Use cases:**
- Deduplication hashes
- Ingestion logs
- Processing metadata
- Future analytics support

**Provider options:**
- Neon
- Supabase
- Equivalent managed Postgres

---

## AI Services — OpenAI API

Abstracted behind a service layer for replaceability.

**Used for:**
- Content summaries
- Category suggestions
- Editorial framing drafts ("Why this matters")
- LinkedIn post drafts
- YouTube title and description drafts

**Hard constraints:**
- AI output is always reviewed before use
- No autonomous publishing
- All AI services are replaceable and modular

---

## Distribution & Media

### LinkedIn
- Manual posting (no automated publishing)
- AI-assisted draft generation
- Links always point back to site

### YouTube
- Primary video hosting
- Weekly recap videos
- Embedded into site
- AI-assisted metadata drafting

---

## Analytics — Plausible / Vercel Analytics

**Tracked during MVP:**
- Page views
- Referrers (LinkedIn, YouTube)
- Publish frequency
- Content freshness

No complex dashboards or user tracking during MVP.

---

## Hosting & Infrastructure

### Vercel
- Frontend hosting
- Serverless backend
- Automatic preview deployments
- Built-in CI/CD

### DNS
- Domain managed at existing registrar
- A / CNAME records pointed at Vercel for production and preview

---

## Environments & Deployment

| Environment   | Trigger                        |
| ------------- | ------------------------------ |
| **Production** | Push to `main` branch          |
| **Preview**    | Pull request (staging URLs)    |

- Automatic deployment on push
- Preview URLs for pull requests
- Rollback supported
- No manual deployments required

---

## Security Baseline

- HTTPS everywhere
- Secure admin access (Sanity Studio)
- Role-based permissions
- No exposure of unpublished content

---

## Explicitly Out of Scope (MVP)

- User authentication
- Memberships or paywalls
- Personalized feeds
- Mobile applications
- Realtime systems (WebSockets, etc.)
- Complex microservices
- Automated social publishing
- Push notifications
- Email newsletters / capture

---

## Design Principles

- This stack favors **editorial speed and reliability** over complexity
- All components are replaceable post-MVP
- No decision here blocks future expansion
- Operational overhead is intentionally minimal

> **Does this technical decision increase speed, clarity, and trust?** If not, simplify it.
