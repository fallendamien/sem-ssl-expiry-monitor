# S.E.M — SSL Expiry Monitor · Roadmap

> **Status:** 🚧 In Development  
> **Current Phase:** Phase 1 — Foundation (MVP)  
> **Last Updated:** 2026-03-15

---

## Progress Overview

```
Phase 1: Foundation (MVP)    ░░░░░░░░░░  0%
Phase 2: Alerts & Persistence ░░░░░░░░░░  0%
```

---

## Phase 1: Foundation (MVP) 🏗️

**Goal:** Build the core dashboard — add domains, check SSL expiry, show status at a glance.

- [ ] Bootstrap Vue 3 + Vite + TypeScript project
- [ ] Install and configure Tailwind CSS v4
- [ ] Install and configure PrimeVue 4
- [ ] Set up Pinia store and Vue Router
- [ ] Create domain list state management
- [ ] Build clean dashboard layout (sortable/filterable list)
- [ ] Implement Add/Remove website functionality
- [ ] Fetch SSL certificate expiry date per domain
- [ ] Show days remaining with countdown
- [ ] Visual status badges: ✅ Safe / ⚠️ Expiring Soon / 🔴 Expired

---

## Phase 2: Alerts & Persistence 🔥

**Goal:** Add Firebase persistence and multi-channel alert notifications.

- [ ] Firebase integration for data persistence
- [ ] Alert at 3 months, 2 months, 1 month before expiry
- [ ] Weekly alerts within the final month
- [ ] Alert channels: Email / WhatsApp / Browser Notification

---

## Future Enhancements 💡

*Features to consider after Phase 2:*

- Bulk import domains from CSV
- SSL issuer & chain info display
- Historical expiry tracking & charts
- Team/multi-user support

---

## Notes

**Tech Stack:**
- Vue 3 (Composition API, `<script setup>`) · TypeScript · Vite
- Tailwind CSS v4 · PrimeVue 4 · Pinia · Vue Router
- Firebase *(Phase 2 — optional for MVP)*

**Key Milestones:**
- ✅ Project initialized — 2026-03-15
- 🎯 MVP (Phase 1) complete: TBD
- 🎯 Alerts live (Phase 2): TBD
