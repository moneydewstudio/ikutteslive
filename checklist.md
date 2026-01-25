# Ikuttes — Developer Execution Checklist

> **Purpose:** This document is a **developer-facing execution checklist** derived from the PRD and stored strategic decisions. It is designed to be used directly as a **system / project prompt** for engineers or AI coding agents.

---

## 0. Global Context (Non‑Negotiable)

* Product: CPNS practice web app (Ikuttes)
* Business strategy:

  * No free trials, ever
  * Free users monetized by ads (later phase)
  * Paid users unlock value via short-duration access
  * Monetization is activated later, not redesigned
* Critical principle:

  * **Delay payments, NOT access boundaries**

---

## 1. Tech Stack (Locked)

* Frontend: React (Cloudflare Pages)
* Backend: Cloudflare Workers + Hono
* Database: Neon PostgreSQL
* ORM: Drizzle
* Auth: Firebase Auth (Identity Platform)

Server is the source of truth. Frontend must never decide access rights.

---

## 2. Phase I — Foundation & Dormant Paywall

### Phase Goal

Build a fully monetization‑ready product **without launching payments or ads**, while enforcing strict server-side feature gating.

### Explicit Non‑Goals (Do NOT build)

* Payment gateway integration
* Pricing pages
* Subscription logic
* Ads SDKs
* Refund / billing flows

---

### 2.1 Database Requirements

**Users table**

* id (text, PK - Firebase UID)
* email (text, nullable)
* is_premium (boolean, default = false)
* premium_until (timestamp, nullable)
* created_at (timestamp)

**Attempts / Sessions (simplified)**

* user_id (text, nullable for anonymous)
* category (TIU / TWK / TKP)
* score (integer)
* completed_at (timestamp)

No payment tables in Phase I.

---

## 2.2 Authentication Rules

* Allow anonymous usage for first session (Firebase Anonymous Auth)
* Firebase Auth only required when:

  * saving progress
  * viewing history
  * hitting gated features repeatedly

Auth does NOT imply premium.

---

### 2.3 Feature Gating (MANDATORY)

All premium logic must be enforced **server‑side**.

Create a reusable middleware:

* Input: request + Firebase JWT context
* Logic:

  * if user.is_premium === true → allow
  * else → return locked / truncated response

Frontend locks are cosmetic only.

---

### 2.4 Feature Access Matrix (Phase I)

**FREE (Unlocked)**

* Practice questions
* Random drills
* Basic score feedback
* Tryout (SKD) — free in Phase I, but implemented paywall-ready (server-side switch)

**GATED (Dormant Paywall)**

* Answer explanations
* Weak-topic analysis
* Percentile / rank vs Indonesia
* Full exam simulation (future) — enable gating via server-side switch when monetization is activated
* Score history
* Ad‑free experience

Gated features must:

* Be visible in UI
* Be inaccessible via API
* Return upgrade prompts (no pricing yet)

---

### 2.5 API Design Rules

For every premium endpoint:

* `/explanations`
* `/analytics/weakness`
* `/rank/percentile`
* `/exam/full`

Implement:

```
if (!user.is_premium) {
  return { status: "locked", preview: "Upgrade required" }
}
```

Never rely on frontend checks.

---

### 2.6 UI Requirements (Phase I)

* Show locked premium sections with lock icons
* Use motivational copy, not pricing copy
* Never mention prices yet
* Copy examples:

  * "Fitur ini akan tersedia untuk pengguna serius"
  * "Segera hadir"

### 2.6.1 UI Memo: Resizing font size

TEAM_009: To resize font size globally, prefer changing the base font size in `index.css` (e.g., `html { font-size: ... }`).
TEAM_009: For local adjustments, use Tailwind `text-*` utilities; only extend `tailwind.config.js` font scales if a new design-wide type scale is required.

### 2.6.2 Statistik (Premium) — Tryout history + radar analytics

TEAM_009: Riwayat Tryout + 3 radar charts (TWK/TIU/TKP) are premium-gated; endpoints `/tryout/history` and `/analytics/*` must require premium server-side.
TEAM_009: Radar scope is tryout-only (persist only from `POST /exam/:examId/submit`); schema should allow future `source_type` extension.
TEAM_009: TKP metric is non-binary: per-item contribution = `selected_weight / max_weight`; subtopic ability = average ratio, displayed as percentage (×100). Do not use “correct/incorrect” wording for TKP in UI.
TEAM_009: Riwayat Tryout rows should be clickable and open a minimal detail view (date + TWK/TIU/TKP/total).

---

### 2.7 Analytics (Internal Only)

Track (no dashboards required yet):

* Which gated endpoints are hit
* Frequency per user
* Drop-off after lock exposure

Purpose: identify future monetization pressure points.

---

## 3. Phase II — Traction & Signal Amplification

### Phase Goal

Scale usage and intensify interaction with gated features.

### Additions

* Streak system
* Readiness bar (simple heuristic)
* Badges for topic completion

All new high-value insights remain **gated**.

---

## 4. Phase III — Monetization Activation (Future‑Proofing)

> Do NOT implement now. Design must support this cleanly later.

### Pricing (Locked From Strategy)

* Rp 9.900 — 3 days
* Rp 14.900 — 7 days
* Rp 29.000 — 30 days (PROMO)
* Rp 79.000 — anchor only

### Monetization Logic

* Payment success → set `is_premium = true`
* Expiry logic handled server-side
* No trial paths exist in code

---

## 5. Security & Bypass Considerations

* All premium logic enforced in Workers
* Never ship premium data to free users
* Frontend tampering is irrelevant
* Acceptable risk: <1% bypass attempts

Focus on correctness, not paranoia.

---

## 6. Definition of Done (Phase I)

Phase I is complete when:

* All premium features are gated server-side
* No payment code exists
* Free users cannot access premium data via API
* Feature boundaries are stable
* Monetization can be activated by flipping flags, not refactors

---

## 7. Core Principle (Reminder)

> "We don’t build revenue early. We build leverage early."

This checklist must be followed strictly to avoid future rewrites and monetization failure.