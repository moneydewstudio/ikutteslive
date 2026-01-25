# TEAM_009 — Open question: how to apply Neon schema changes (tryout history + radar analytics)

## Context
To implement premium-gated `Riwayat Tryout` and radar analytics, the API Worker needs to persist tryout submissions (attempt header + per-question items) and read them back for:
- `GET /tryout/history` (premium)
- `GET /analytics/subtopic-accuracy` (premium)

This requires **new Neon tables**. The repo explicitly removed runtime schema bootstrapping/DDL from the Worker request path (TEAM_001) and there is **no migrations toolchain checked in**.

## Decision needed
How should we apply the new tables in Neon?

### Option A (recommended now): Versioned SQL migration file + manual apply
- Add a `db/migrations/` folder and commit an explicit `YYYYMMDDHHMM_team_009_tryout_history.sql`.
- Apply it via Neon SQL editor or `psql` (out-of-band).
- Worker stays clean: no runtime DDL.

### Option B: Introduce `drizzle-kit` migrations workflow
- Add `drizzle-kit` config + migration scripts.
- Generate/apply migrations via CI or local workflow.
- More setup, but long-term structured.

## Recommendation
Choose **Option A** for Phase I speed + safety (explicit, auditable, no runtime DDL), unless you already have an established Drizzle migrations workflow you want to standardize on.
