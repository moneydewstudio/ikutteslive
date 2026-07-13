# Spider Chart: V2 Migration + Subtopic Theme Grouping

**Date:** 2026-07-13  
**Status:** Approved design  
**Team:** TEAM_043  
**Project:** Ikuttes — CPNS exam prep platform  

---

## 1. Goal

Perbaiki spider chart (analytics radar) untuk:
1. Migrasi query dari tabel `questions` (v1) → `questions_v2` + `question_options_v2`
2. Menampilkan theme yang berdekatan per subtopic dalam satu chart
3. Visual separator (section band + garis pemisah) antar grup subtopic di SVG

---

## 2. Files Changed

| File | Changes |
|------|---------|
| `api/src/index.ts` | Response shape, SQL joins, ORDER BY |
| `components/SwipableRadarChart.tsx` | Group detection, SVG layers, chips grouping |

---

## 3. Backend: `/analytics/subtopic-readiness`

### 3a. Response — new fields

```ts
// Per item response
{
  themeId: number;
  themeName: string;
  subtopicId: number;       // NEW
  subtopicName: string;     // NEW — e.g. "VERBAL", "NUMERIK"
  topicCode: string | null;
  attempts: number;
  value: number;
}
```

### 3b. Theme query — joined hierarchy fix

Current query joins through `question_subtopics → question_categories → question_topics`, which is the legacy v1 path. The v2 schema has `question_subtopics.topic_id` directly.

**Before:**
```sql
SELECT qt.id, qt.name, upper(qt2.code) as topic_code
FROM question_themes qt
LEFT JOIN question_subtopics qs ON qt.subtopic_id = qs.id
LEFT JOIN question_categories qc ON qs.category_id = qc.id
LEFT JOIN question_topics qt2 ON qc.topic_id = qt2.id
WHERE qt2.code IS NOT NULL
ORDER BY qt2.code, qt.name
```

**After:**
```sql
SELECT qt.id, qt.name, qt.subtopic_id,
       qs.name as subtopic_name,
       upper(qt2.code) as topic_code
FROM question_themes qt
LEFT JOIN question_subtopics qs ON qt.subtopic_id = qs.id
LEFT JOIN question_topics qt2 ON qs.topic_id = qt2.id
WHERE qt2.code IS NOT NULL
ORDER BY qt2.code, qs.name, qt.name
```

Key changes:
- Added `qt.subtopic_id`, `qs.name as subtopic_name`
- Removed `question_categories` join (bypass v1)
- ORDER BY includes `qs.name` to group themes by subtopic

### 3c. Attempt queries — v2 migration

Both `tryoutRaw` and `dailyRaw` queries change JOIN from `questions` (v1) → `questions_v2`.

**Before:**
```sql
JOIN questions q ON tai.question_id = q.id
```

**After:**
```sql
JOIN questions_v2 q ON tai.question_id = q.id
```

The `question_id` FK in `tryout_attempt_items` and `daily_quiz_attempt_items` already points to `questions_v2(id)` (migrated in earlier team work). This is just catching up the analytics query.

---

## 4. Frontend: SwipableRadarChart

### 4a. Type update

```ts
type RadarPoint = {
  themeId: number;
  themeName: string;
  subtopicId: number;       // NEW
  subtopicName: string;     // NEW
  topicCode: string | null;
  value: number;
  attempts: number;
};
```

### 4b. Group detection

From `filteredRadar` (data for the current topic), derive contiguous groups where `subtopicName` is the same:

```ts
const groups = useMemo(() => {
  if (!chartData.length) return [];
  const g: { start: number; end: number; name: string }[] = [];
  let start = 0;
  for (let i = 1; i <= chartData.length; i++) {
    if (i === chartData.length || chartData[i].subtopicName !== chartData[start].subtopicName) {
      g.push({ start, end: i - 1, name: chartData[start].subtopicName });
      start = i;
    }
  }
  return g;
}, [chartData]);
```

### 4c. SVG render layers (top to bottom)

```
Layer 0: Alternating fan fills (group backgrounds)
Layer 1: Grid rings + spokes (existing)
Layer 2: Separator lines between groups
Layer 3: Group name labels (outer ring)
Layer 4: Data polygon + dots (existing)
Layer 5: Axis labels (existing)
Layer 6: Value markers (existing)
```

#### Layer 0 — Fan fills

Per group, polygon dari center ke axes dalam range `[start, end]`:

```
P = center + axis[start] + axis[start+1] + ... + axis[end] + center
```

Two alternating fills:
```ts
const FILLS = ['rgba(0,0,0,0.03)', 'rgba(0,0,0,0.06)'];
```

#### Layer 2 — Separator lines

Di setiap batas antar group, gambar garis dari center ke mid-angle:

```ts
const midAngle = (2 * Math.PI * (prevEnd + 0.5)) / n - Math.PI / 2;
const p = { x: cx + r * 0.9 * cos(midAngle), y: cy + r * 0.9 * sin(midAngle) };
line(x1=cx, y1=cy, x2=p.x, y2=p.y, stroke="#aaa", strokeWidth=1, strokeDasharray="4,2")
```

No separator when groups.length === 1 (single group, no division needed).

#### Layer 3 — Group name labels

Di luar circle, offset +12px dari label radius. Posisi di axis pertama setiap group. Font bold, uppercase, ukuran 9px, warna `#666`.

No group labels when groups.length === 1.

### 4d. Score chips grouping

Current: flat list of chips.

**After:** grouped by subtopic with header label:

```
[VERBAL]
  Analogi: 75%  Padanan: 82%
[NUMERIK]
  Deret: 60%  Hitung: 45%
```

Uses same `groups` array from 4b to chunk the chips.

### 4e. Edge cases

| Case | Behavior |
|------|----------|
| 1 group only | No separator lines, no group labels, no alternating fills |
| 1 theme only | Single axis, no separator |
| 0 themes | Existing empty state unchanged |
| Uneven groups | Each group gets its own fan fill regardless of size |
| Chart with only 1st group having data | Works — groups derived from data, not from all themes |

---

## 5. No Regressions

- Response structure is backward-compatible: old fields preserved + new fields appended
- Frontend `RadarPoint` type widened (new optional-like fields are always present)
- Swipe/accessibility behavior unchanged
- `minAttemptsSolid` threshold unchanged

---

## 6. Not In Scope

- Hover tooltips / interactive axes (deferred)
- Drill-down click to theme questions (deferred)
- Readiness trends over time (deferred)
- Theme migration for remaining 1,500+ null-theme questions (separate work)
