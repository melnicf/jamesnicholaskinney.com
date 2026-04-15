# JamesNicholasKinney.com — Roadmap & Milestones

> Source of truth synced from Notion workspace. Last synced: 2026-02-13.

---

## Overview

| Field              | Value                           |
| ------------------ | ------------------------------- |
| **Target**         | SXSW-ready MVP                  |
| **Duration**       | 8–13 weeks                      |
| **Approach**       | Sequential phases, light overlap |
| **Philosophy**     | Momentum and learning > rigid planning |

Each phase is successful only if it unlocks the next one.

---

## Phase 1 — Foundation & Alignment ✅

**Duration:** ~Week 1
**Status:** Foundation docs complete; technical bootstrap in Week 1

### Objective

Establish absolute clarity on product direction and create a working technical baseline.

### Deliverables (All Complete)

- [x] Project Overview
- [x] Product Vision & Definition
- [x] Site Architecture & Navigation
- [x] Content Strategy & Models
- [x] Editorial Workflow
- [x] Distribution Strategy
- [x] AI & Automation Strategy
- [x] Technical Architecture
- [x] Roadmap & Milestones
- [x] Tech Stack Decisions

### Technical Bootstrap (Week 1)

- [x] Initialize Next.js project (App Router)
- [x] Configure Tailwind CSS
- [x] Set up project structure and routing
- [x] Set up Sanity Studio
- [x] Define Sanity content schemas (articles, categories, pages)
- [x] Connect Next.js to Sanity (GROQ queries)
- [x] Deploy to Vercel (production + preview environments)

### Outcome

Zero ambiguity going into implementation. All core documents completed and agreed upon. Technical baseline (Next.js, Tailwind, Sanity, Vercel) ready for Phase 2.

---

## Phase 2 — Core Site Build 🔜

**Duration:** Weeks 2–3
**Status:** In progress

### Objective

Ship a credible, fast, press-ready headquarters.

### Key Outcomes

- Public-facing site structure live
- CMS ready for content
- Editorial workflows operational

### Deliverables

| Page / Feature       | Description                                          |
| -------------------- | ---------------------------------------------------- |
| **Home page**        | Real-time intelligence hub — latest content, featured takes, trending, video embed, promos |
| **Category pages**   | Business & Tech, Politics & Policy, Sports & Entertainment, Arts & Culture |
| **About page**       | Biography, credentials, media assets                  |
| **Books page**       | Published/upcoming books, purchase links, summaries   |
| **Appearances page** | Talks, appearances, keynote topics, booking inquiry   |
| **Contact page**     | Contact information / inquiry form                    |
| **CMS setup**        | Sanity with roles and permissions, content schemas     |

### Technical Tasks

- [x] Build global navigation (primary + secondary + utility bar)
- [x] Build responsive layout system
- [x] Create Home page with modular sections
- [x] Create Category page template
- [x] Create Content Detail page template
- [x] Build About, Books, Appearances, Contact pages
- [x] Implement editorial content states (Ingested → Needs Review → Approved → Published)
- [x] Configure role-based permissions (Admin, Editor)
- [x] Set up analytics (Plausible or Vercel Analytics)
- [x] SEO metadata setup (Open Graph, structured data)

### Success Criteria

- Editors can publish without engineering help
- Site loads fast and looks intentional
- Architecture supports daily updates

---

## Phase 3 — Aggregation Engine 🔜

**Duration:** Weeks 4–5
**Status:** In progress

### Objective

Enable daily freshness and habit formation.

### Key Outcomes

- Automated content ingestion from RSS
- Human-controlled publishing
- Consistent daily updates

### Deliverables

| Feature                  | Description                                              |
| ------------------------ | -------------------------------------------------------- |
| **RSS ingestion pipeline** | Serverless functions pulling from curated RSS feeds     |
| **De-duplication logic** | Hash-based duplicate detection using PostgreSQL           |
| **Auto-categorization**  | AI-assisted category assignment                           |
| **Editorial review queue** | Admin interface showing items in "Needs Review" state  |
| **Content states**       | Full state machine: Ingested → Needs Review → Approved → Published |

### Technical Tasks

- [x] Set up PostgreSQL database (Neon)
- [x] Build RSS ingestion serverless functions
- [x] Implement content normalization pipeline
- [x] Build deduplication system (hash-based)
- [x] Integrate OpenAI API for auto-categorization
- [x] Integrate OpenAI API for summary generation
- [x] Build editorial review queue in Sanity
- [x] Implement content state transitions
- [x] Set up scheduled ingestion (cron via Vercel)
- [x] Add ingestion logging and error handling

### Success Criteria

- New content appears daily
- Review → publish takes minutes
- No direct auto-publishing to users

---

## Phase 4 — Editorial & Engagement ✅

**Duration:** Weeks 6–7
**Status:** Complete

### Objective

Surface value immediately, improve shareability, and highlight upcoming content.

### Deliverables

- [x] **Bio** — Biography with credentials (Global Chief AI Officer, author, certifications, AI For Better President)
- [x] **Books** — SustAIning Leadership, AI + Mental Health with purchase links (`a.co/d/0d5qkYJe`, `a.co/d/0iKhwsov`)
- [x] **Contact** — Contact info (hello@jamesnicholaskinney.com)
- [x] **This week articles summary** — Curated digest of the week’s best articles
- [x] **Share icons on articles** — Easy sharing to social channels from article pages
- [x] **Punchy header** — First thing you see; explains immediately the website’s value
- [x] **What’s coming next** — Upcoming events section on top of the page next to main section
- [x] **Featured article** — AI-related featured article prominently displayed
- [x] **YouTube video** — Wire/embed YouTube video on site

### Success Criteria

- Bio, Books, and Contact pages are complete and accurate
- Visitors immediately understand the site’s value proposition
- Articles are easy to share
- Upcoming events and featured content drive engagement

---

## Phase 5 — Distribution Studio

**Duration:** Weeks 8–9

### Objective

Make distribution effortless and consistent.

### Key Outcomes

- Site content flows naturally into social channels
- Distribution becomes part of publishing workflow

### Deliverables

| Feature                       | Description                                        |
| ----------------------------- | -------------------------------------------------- |
| **LinkedIn post draft generation** | AI-generated drafts from published content     |
| **Manual approval workflow**  | Editor reviews and edits before posting             |
| **YouTube video embedding**   | Weekly recaps embedded on site                      |
| **AI-assisted metadata**      | Titles and descriptions for YouTube                 |

### Technical Tasks

- [ ] Build LinkedIn post draft generator (OpenAI API)
- [ ] Create distribution draft review interface
- [ ] Implement YouTube embed components
- [ ] Build AI title/description generator for YouTube
- [ ] Add distribution status tracking to content items
- [ ] Create "ready for distribution" content views

### Success Criteria

- LinkedIn posts generated regularly from site content
- Weekly YouTube recap embedded on site
- No manual copy-paste chaos

---

## Phase 6 — QA & Soft Launch

**Duration:** Weeks 10–11

### Objective

Stabilize and prepare for public visibility.

### Key Outcomes

- Confidence in system behavior
- Polished but not over-engineered experience

### Deliverables

- [ ] Cross-device testing (mobile, tablet, desktop)
- [ ] Performance tuning (Core Web Vitals)
- [ ] Editorial permission testing
- [ ] Analytics verification
- [ ] Bug fixes and UX refinements
- [ ] Load testing for ingestion pipeline
- [ ] Security review (no unpublished content exposed)

### Success Criteria

- No critical bugs
- Editorial flow feels smooth
- Site feels alive and current

---

## Phase 7 — Public Launch & Iteration

**Duration:** Weeks 12–13

### Objective

Launch publicly and learn from real usage.

### Key Outcomes

- Real audience feedback
- Distribution loops validated
- Clear next priorities emerge

### Deliverables

- [ ] Public launch
- [ ] Consistent publishing cadence established
- [ ] Weekly YouTube rhythm running
- [ ] Ongoing LinkedIn distribution active

### Success Criteria

- Users return
- Content is shared
- Operational load remains low

---

## Explicitly Deferred (Post-MVP)

The following are **intentionally deferred** until daily habit, distribution, and editorial voice are proven:

- Email newsletters and digests
- Email capture and funnels
- User accounts or memberships
- Personalized feeds
- "Think like James" AI plugins
- Automated social posting (no-human-in-the-loop)
- Video clipping pipelines
- Advanced analytics dashboards
- Push notifications
- Mobile applications
- AI chat in James' voice
- Personalized intelligence views
- AI-assisted research tools

---

## MVP Completion Definition

The MVP is complete when:

- [x] Phase 1: Foundation & alignment docs locked
- [ ] Phase 2: Site publishes content, CMS operational
- [ ] Phase 3: Aggregation pipeline delivers daily content
- [x] Phase 4: Editorial & engagement features live (summary, share, punchy header, upcoming events, AI featured)
- [ ] Phase 5: Distribution drafts generated consistently
- [ ] Phase 6: QA passed, system stable
- [ ] Phase 7: Public launch, audience engaged

**The site publishes content daily, aggregation and review workflows are reliable, LinkedIn distribution is consistent, weekly YouTube recaps are live, and ongoing operation requires minimal effort.**
