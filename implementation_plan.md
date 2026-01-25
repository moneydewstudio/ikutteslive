# Ikuttes — Endpoint-by-Endpoint Implementation Tasks

> **Purpose:** Concrete, endpoint-level execution tasks derived from the Phase-based PRD and Developer Checklist. This document is meant to be handed directly to backend/frontend engineers or AI coding agents.

---

## 1. Auth & User Context Endpoints

### 1.1 `POST /auth/sync`

**Purpose:** Synchronize Firebase User with local Postgres database.

**Logic:**

* Verify Firebase ID Token (JWT) using Firebase Public Keys.
* Check if `uid` exists in `users` table.
* If not, create user with `is_premium = false`.
* Return `{ userId, is_premium }`.

**Acceptance Criteria:**

* Database is updated upon first login.
* Token verification happens on Every request.

---

### 1.2 `GET /user/me`

**Purpose:** Fetch current user status.

**Middleware:** `withUserContext`

**Response:**

* `{ id, email, is_premium, streak }`.

---

## 2. Core Question & Drill Endpoints (FREE)

### 2.1 `GET /questions/random`

**Purpose:** Serve practice questions.

**Logic:**

* Accept params: category, limit.
* Fetch questions from Neon DB.
* **RESTRICTION:** Exclude `explanation` column from the SQL query.

---

### 2.2 `POST /attempts`

**Purpose:** Submit user answers.

**Logic:**

* Store attempt in `attempts` table (linked to `userId` if authenticated).
* Calculate basic score.

---

### 2.3 `GET /quiz/daily`

**Purpose:** Serve the daily quiz question set.

**Logic:**

* Daily quiz rotates at **00:00 UTC+07 (Jakarta time)**.
* The server is the source of truth for "today" (frontend should not compute day boundaries itself).
* Enforce subject mix:
  * TWK: 1
  * TIU: 2
  * TKP: 2
* Questions must exclude explanations.

**Response (proposed)**

```json
{
  "dayKey": "2026-01-19",
  "refreshAt": 1737222000000,
  "questions": [
    { "id": 123, "subject": "TWK", "difficulty": 2, "text": "...", "options": [{"id":"a","text":"..."}], "correct_option_id": "", "explanation": "" }
  ]
}
```

---

### 2.4 `GET /drills/daily`

**Purpose:** Serve the global daily drill set (same for all users).

**Logic:**

* Daily drills rotate at **00:00 UTC+07 (Jakarta time)**.
* The server is the source of truth for "today".
* **10 questions per day**.
* **Single-category rotation** by day (global cycle: TWK → TIU → TKP).
* Replay is allowed (same day returns the same question set).
* Questions must exclude explanations.

**Response (proposed)**

```json
{
  "dayKey": "2026-01-19",
  "refreshAt": 1737222000000,
  "category": "TWK",
  "questions": [
    { "id": 123, "subject": "TWK", "difficulty": 2, "text": "...", "options": [{"id":"a","text":"..."}], "correct_option_id": "", "explanation": "" }
  ]
}
```

---

## 3. Gated Explanation Endpoints (DORMANT PAYWALL)

### 3.1 `GET /explanations/:questionId`

**Purpose:** Return detailed explanation.

**Middleware:** `requirePremium`

**Logic:**

```ts
if (!user.is_premium) {
  return { status: "locked", message: "Fitur Premium: Tingkatkan akun untuk melihat pembahasan." }
}
const q = await db.select({ explanation: questions.explanation }).from(questions).where(eq(questions.id, id));
return q[0];
```

---

## 4. Analytics & Weakness Detection (GATED)

### 4.1 `GET /analytics/weakness`

**Purpose:** Topic-level weakness summary.

**Middleware:** `requirePremium`

---

### 4.2 `GET /analytics/history`

**Purpose:** Score history over time.

**Middleware:** `requirePremium`

---

## 5. Ranking & Percentile (GATED)

### 5.1 `GET /rank/percentile`

**Purpose:** Show user vs national performance.

**Middleware:** `requirePremium`

---

## 6. Tryout (SKD) (FREE; Paywall-Ready)

### 6.1 `POST /exam/start`

**Purpose:** Initialize SKD tryout (full-length simulation).

**Middleware (Phase I):** `withUserContext`

**Dormant paywall note**

* Tryout is **free for now**, but the API should be implemented so it can be switched to **premium-gated later** without changing the UI/flows.
* Proposed mechanism: a single server-side flag (env/config) that turns on premium enforcement for tryout endpoints.

**SKD Specs (confirmed)**

* Total questions: 110
* Distribution:
  * TWK: 30
  * TIU: 35
  * TKP: 45
* Time limit: 100 minutes

**Subtopic distribution rule**

* For each category (TWK/TIU/TKP), distribute questions as evenly as possible across `question_subcategories`.
* Target: each subcategory receives either `floor(quota / subcategoryCount)` or `ceil(quota / subcategoryCount)` questions.

**Response (proposed)**

* `200`:

```json
{
  "examId": "<opaque_token>",
  "type": "SKD",
  "startsAt": 1730000000000,
  "endsAt": 1730006000000,
  "durationSeconds": 6000,
  "questionCount": 110
}
```

**Notes**

* Do **not** return correct answers in the start response.
* `examId` should be treated as an opaque identifier by the frontend (implementation may sign it server-side).
* Use a follow-up endpoint to fetch question content.

---

### 6.2 `GET /exam/:examId/questions`

**Purpose:** Fetch the question set for an exam session.

**Middleware (Phase I):** `withUserContext`

**Logic:**

* Load the stored question IDs for `examId` in the stored order.
* Return questions with options.
* Exclude:
  * `correct_option_id`
  * explanations

---

### 6.3 `POST /exam/:examId/submit`

**Purpose:** Submit exam answers and compute score.

**Middleware (Phase I):** `withUserContext`

**Request (proposed)**

```json
{
  "answers": {
    "123": "a",
    "124": "c"
  }
}
```

**Scoring (proposed)**

* TWK/TIU:
  * correct = 5
  * wrong/blank = 0
* TKP:
  * score = selected option `question_options.weight` (expected 1–5)
  * blank = 0

**Response (proposed)**

```json
{
  "total": 450,
  "sections": { "TWK": 120, "TIU": 145, "TKP": 185 },
  "meta": { "correctCount": { "TWK": 24, "TIU": 29 } }
}
```

---

## 7. Middleware Definitions (Hono)

### 7.1 `withUserContext`

**Purpose:** Attach user info to request.

**Steps:**

* Extract Bearer token from `Authorization` header.
* Verify JWT using Firebase Auth Project ID and Public Keys.
* Attach `{ uid, email }` to context.
* Query `users` table to get `is_premium`.

---

### 7.2 `requirePremium`

**Purpose:** Enforce paywall.

**Logic:**

```ts
if (!ctx.get('user')?.is_premium) {
  return c.json({ error: 'forbidden', code: 'PREMIUM_REQUIRED' }, 403);
}
```

---

## 8. Frontend Consumption Rules

* Use Firebase JS SDK for client-side Auth.
* Attach `idToken` to every API call.
* Handle 403 responses by showing the Premium modal.

---

## 9. Phase I Definition of Done

* Server-side JWT verification active.
* Explanations are not sent to free users.
* User progress is persisted in Neon DB.
