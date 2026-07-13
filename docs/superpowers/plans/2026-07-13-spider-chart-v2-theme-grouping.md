# Spider Chart: V2 Migration + Subtopic Theme Grouping

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate spider chart from v1 tables to v2, add subtopic grouping with SVG section separators

**Architecture:** Backend (Hono/Neon) changes the analytics query to use `questions_v2` and return `subtopicId`/`subtopicName`; Frontend (React/SVG) adds group detection and renders alternating fan fills + separator lines between subtopic groups.

**Tech Stack:** Hono.js, Neon/Postgres (raw `neon()` SQL), React 18, Tailwind CSS, inline SVG

## Global Constraints

- All neon SQL uses raw tagged template literals, NOT Drizzle ORM (edge runtime quirk)
- Response fields must be backward-compatible (old fields untouched)
- SVG render order: fan fills → grid → separators → group labels → polygon → axis labels → markers
- No new npm dependencies
- Follow existing TEAM_XXX comment conventions

---

### Task 1: Backend — Add subtopic fields to theme query

**Files:**
- Modify: `api/src/index.ts:1366-1374`

**Interfaces:**
- Consumes: Existing `neon()` helper, `nsql` tagged template
- Produces: Theme query returns `subtopic_id`, `subtopic_name` in response

Changes the theme-fetching SQL to bypass the legacy `question_categories` join, fetch `subtopic_id` and `subtopic_name` directly via the v2 path, and order by subtopic then theme name.

- [ ] **Step 1: Open and read target code**

Read `api/src/index.ts` lines 1362-1375 to see current theme query.

- [ ] **Step 2: Replace theme query SQL**

Change the neon SQL block (line ~1366) from the current 4-table join to the v2 direct path:

Old:
```sql
const themes = await nsql`
  SELECT qt.id, qt.name, upper(qt2.code) as topic_code
  FROM question_themes qt
  LEFT JOIN question_subtopics qs ON qt.subtopic_id = qs.id
  LEFT JOIN question_categories qc ON qs.category_id = qc.id
  LEFT JOIN question_topics qt2 ON qc.topic_id = qt2.id
  WHERE qt2.code IS NOT NULL
  ORDER BY qt2.code, qt.name
`;
```

New:
```sql
const themes = await nsql`
  SELECT qt.id, qt.name, qt.subtopic_id,
         qs.name as subtopic_name,
         upper(qt2.code) as topic_code
  FROM question_themes qt
  LEFT JOIN question_subtopics qs ON qt.subtopic_id = qs.id
  LEFT JOIN question_topics qt2 ON qs.topic_id = qt2.id
  WHERE qt2.code IS NOT NULL
  ORDER BY qt2.code, qs.name, qt.name
`;
```

- [ ] **Step 3: Update the response builder**

At line ~1377, the `.map()` that builds response items. Add `subtopicId` and `subtopicName`:

Old:
```ts
return {
  themeId: Number(t.id),
  themeName: t.name,
  topicCode: t.topic_code,
  attempts,
  value: Math.max(0, Math.min(100, ratio * 100)),
};
```

New:
```ts
return {
  themeId: Number(t.id),
  themeName: t.name,
  subtopicId: Number(t.subtopic_id ?? 0),
  subtopicName: String(t.subtopic_name ?? ''),
  topicCode: t.topic_code,
  attempts,
  value: Math.max(0, Math.min(100, ratio * 100)),
};
```

- [ ] **Step 4: Commit**

```bash
git add api/src/index.ts
git commit -m "feat: add subtopicId/subtopicName to readiness API, fix join chain"
```

---

### Task 2: Backend — Migrate attempt queries from questions to questions_v2

**Files:**
- Modify: `api/src/index.ts:1325-1346`

**Interfaces:**
- Consumes: Project ID from env, user ID from request
- Produces: Attempt data grouped by `questions_v2.theme_id`

Both `tryoutRaw` and `dailyRaw` queries currently JOIN `questions` (v1). Change to `questions_v2`.

- [ ] **Step 1: Change tryout query table reference**

Line ~1332, replace:
```sql
JOIN questions q ON tai.question_id = q.id
```
→
```sql
JOIN questions_v2 q ON tai.question_id = q.id
```

- [ ] **Step 2: Change daily query table reference**

Line ~1343, replace:
```sql
JOIN questions q ON dai.question_id = q.id
```
→
```sql
JOIN questions_v2 q ON dai.question_id = q.id
```

- [ ] **Step 3: Commit**

```bash
git add api/src/index.ts
git commit -m "feat: migrate readiness attempt JOIN from questions v1 to questions_v2"
```

---

### Task 3: Frontend — Update RadarPoint type + group detection

**Files:**
- Modify: `components/SwipableRadarChart.tsx`

**Interfaces:**
- Consumes: Type `RadarPoint` with new `subtopicId`/`subtopicName` fields
- Produces: `groups` array for SVG rendering, `chartData` with `subtopicName`

- [ ] **Step 1: Add new fields to RadarPoint type**

At the top of the file (line ~6), add `subtopicId` and `subtopicName`:

```tsx
type RadarPoint = {
  themeId: number;
  themeName: string;
  subtopicId: number;
  subtopicName: string;
  topicCode: string | null;
  value: number;
  attempts: number;
};
```

- [ ] **Step 2: Add subtopicName to chartData mapping**

At line ~157, add `subtopicName` to the derived `chartData`:

```tsx
const chartData = filteredRadar.map((r) => ({
  name: r.themeName,
  value: r.value,
  attempts: r.attempts,
  subtopicName: r.subtopicName,
}));
```

- [ ] **Step 3: Add group detection via useMemo**

After the `chartData` line, add group derivation:

```tsx
const groups = useMemo(() => {
  if (!chartData.length) return [];
  const result: { start: number; end: number; name: string }[] = [];
  let start = 0;
  for (let i = 1; i <= chartData.length; i++) {
    if (i === chartData.length || chartData[i].subtopicName !== chartData[start].subtopicName) {
      result.push({ start, end: i - 1, name: chartData[start].subtopicName });
      start = i;
    }
  }
  return result;
}, [chartData]);
```

Import `useMemo` if not already imported (add to line 3):
```tsx
import React, { useState, useRef, useCallback, useMemo } from 'react';
```

- [ ] **Step 4: Commit**

```bash
git add components/SwipableRadarChart.tsx
git commit -m "feat: add subtopic fields, chartData mapping, and group detection"
```

---

### Task 4: Frontend — SVG section separator rendering

**Files:**
- Modify: `components/SwipableRadarChart.tsx`

**Interfaces:**
- Consumes: `groups` array from Task 3, `chartData` array, `polar()` helper
- Produces: Alternating fan fills + separator lines between subtitle groups

Modify the `RadarSvg` component to render group backgrounds and separator lines.

- [ ] **Step 1: Update RadarSvg props interface**

In `SwipableRadarChart.tsx`, change the `RadarSvg` function signature to accept `groups` and update the call site:

```tsx
const RadarSvg: React.FC<{
  data: { name: string; value: number; attempts: number; subtopicName: string }[];
  color: string;
  minAttemptsSolid: number;
  groups: { start: number; end: number; name: string }[];
}> = ({ data, color, minAttemptsSolid, groups }) => {
```

And in the render return (inside `SwipableRadarChart`), pass the prop:
```tsx
<RadarSvg
  data={chartData}
  color={color}
  minAttemptsSolid={minAttemptsSolid}
  groups={groups}
/>
```

```tsx
const RadarSvg: React.FC<{
  data: { name: string; value: number; attempts: number; subtopicName: string }[];
  color: string;
  minAttemptsSolid: number;
  groups: { start: number; end: number; name: string }[];
}> = ({ data, color, minAttemptsSolid, groups }) => {
```

- [ ] **Step 2: Add group fan fills after grid rings loop**

After the existing grid rings `<polygon>` loop (line ~68), add alternating fan fills:

```tsx
{/* Group alternating fills */}
{groups.length > 1 && groups.map((g, gi) => {
  const fill = gi % 2 === 0 ? 'rgba(0,0,0,0.03)' : 'rgba(0,0,0,0.06)';
  let pts = `${cx},${cy}`;
  for (let i = g.start; i <= g.end; i++) {
    const p = polar(i, r);
    pts += ` ${p.x},${p.y}`;
  }
  pts += ` ${cx},${cy}`;
  return <polygon key={gi} points={pts} fill={fill} />;
})}
```

- [ ] **Step 3: Add separator lines after grid lines**

After the existing grid lines `<line>` loop (line ~72), add separator lines between groups:

```tsx
{/* Separator lines between groups */}
{groups.length > 1 && groups.slice(0, -1).map((g, gi) => {
  const midIdx = g.end + 0.5;
  const angle = (2 * Math.PI * midIdx) / data.length - Math.PI / 2;
  const p = {
    x: cx + r * 0.9 * Math.cos(angle),
    y: cy + r * 0.9 * Math.sin(angle),
  };
  return (
    <line
      key={gi}
      x1={cx} y1={cy} x2={p.x} y2={p.y}
      stroke="#aaa" strokeWidth={1} strokeDasharray="4,2"
    />
  );
})}
```

- [ ] **Step 4: Add group name labels**

After separator lines, add group name labels at the first axis of each group:

```tsx
{/* Group name labels */}
{groups.length > 1 && groups.map((g, gi) => {
  const labelR = r + 30;
  const p = polar(g.start, labelR);
  const deg = (360 * g.start) / data.length;
  const isLeft = deg > 90 && deg < 270;
  return (
    <text
      key={gi}
      x={p.x} y={p.y}
      textAnchor={isLeft ? 'end' : 'start'}
      fontSize={10} fontWeight={800}
      fill="#666"
      transform={isLeft ? 'translate(-4, 3)' : 'translate(4, 3)'}
    >
      {g.name}
    </text>
  );
})}
```

- [ ] **Step 5: Commit**

```bash
git add components/SwipableRadarChart.tsx
git commit -m "feat: add SVG section separator rendering for subtopic groups"
```

---

### Task 5: Frontend — Grouped score chips

**Files:**
- Modify: `components/SwipableRadarChart.tsx`

**Interfaces:**
- Consumes: `groups` array, `chartData`, `color` from parent
- Produces: Chips rendered in subtopic groups with group header

Replace the flat chips section (line ~204) with grouped chips.

- [ ] **Step 1: Replace chips rendering**

Old:
```tsx
{chartData.length > 0 && (
  <div className="mt-2 flex flex-wrap gap-1">
    {chartData.filter(d => d.attempts > 0).map(d => (
      <span key={d.name} className="text-[10px] font-bold px-1.5 py-0.5 rounded border border-black" style={{ backgroundColor: color + '40' }}>
        {d.name.substring(0, 8)}: {Math.round(d.value)}%
      </span>
    ))}
  </div>
)}
```

New:
```tsx
{chartData.length > 0 && (
  <div className="mt-2 flex flex-col gap-2">
    {groups.map((g, gi) => (
      <div key={gi}>
        {groups.length > 1 && (
          <span className="text-[9px] font-black uppercase tracking-wider text-black/50 block mb-0.5">{g.name}</span>
        )}
        <div className="flex flex-wrap gap-1">
          {chartData.slice(g.start, g.end + 1).filter(d => d.attempts > 0).map(d => (
            <span key={d.name} className="text-[10px] font-bold px-1.5 py-0.5 rounded border border-black" style={{ backgroundColor: color + '40' }}>
              {d.name.substring(0, 8)}: {Math.round(d.value)}%
            </span>
          ))}
        </div>
      </div>
    ))}
  </div>
)}
```

- [ ] **Step 2: Commit**

```bash
git add components/SwipableRadarChart.tsx
git commit -m "feat: group score chips by subtopic with section header"
```

---

### Task 6: Verify and deploy

**Files:**
- Test: `api/src/index.test.ts` (if exists & relevant)
- Verify: Interactive — hit the API + check frontend

- [ ] **Step 1: Check TypeScript compilation**

```bash
cd api && npx tsc --noEmit
cd .. && npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 2: Run existing tests**

```bash
cd api && npm test 2>&1 | tail -20
```

Ensure no regression from the SQL changes.

- [ ] **Step 3: Deploy API worker**

```bash
cd api && npx wrangler deploy
```

- [ ] **Step 4: Deploy frontend worker**

```bash
npx wrangler deploy --config wrangler.jsonc
```

- [ ] **Step 5: Commit remaining changes + tag**

```bash
git add -A
git commit -m "feat: spider chart v2 migration + subtopic theme grouping"
git tag -a "v0.37" -m "spider chart v2 migration + subtopic theme grouping"
```
