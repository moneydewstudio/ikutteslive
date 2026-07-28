# Roadmap Phase 2: Materi & Tes per Subtopik — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add interactive learning flow to Roadmap: user reads materi, sees contoh soal, then takes a dedicated 10-question test per subtopic with ≥70% passing threshold.

**Architecture:** 3-layer — (1) new DB table `roadmap_materials` stores markdown content + inline example questions per subtopic; (2) two new API endpoints serve materials and subtopic-filtered tests; (3) two new dedicated frontend components (`RoadmapMaterialView`, `RoadmapQuizView`) render the learn→test flow with slide transitions via Motion (already installed). Existing `PUT /roadmap/progress` reused for score persistence.

**Tech Stack:** Hono + Drizzle ORM + Neon (API), React + Tailwind + Motion v12.40.0 (frontend)

## Global Constraints

- Motion v12.40.0 already installed — do NOT add new animation dependency
- All new questions come from `questions_v2` table (not v1)
- V2 question helper functions already exist: `activeWhereV2`, `categoryWhereV2`, `subjectSelectV2` in `api/src/index.ts`
- V2 option query pattern: join `question_options_v2` by `question_id`
- V2 explanation query pattern: join `question_explanations_v2` by `question_id`
- Follow existing code style: no semicolons, 2-space indent in API, functional components
- Placeholder content: `"Materi [subtopic_name] sedang disusun. Akan segera hadir."` in Indonesian
- All text copy in Indonesian for user-facing strings
- Auth required for progress endpoints; material & test endpoints open (guest can view/attempt but progress not saved)
- `ViewState` union lives in `types.ts`
- New components go in `components/` directory
- API response follows same question shape as `/drills/daily` for consistency
- `motion/react` import: `import { motion, AnimatePresence } from 'motion/react'`

---

## File Structure

### New Files
- `components/RoadmapMaterialView.tsx` — dual-tab view: Materi (scroll) + Contoh Soal (inline) + CTA "Mulai Tes"
- `components/RoadmapQuizView.tsx` — dedicated 10-question test with per-question feedback, prev/next nav, pembahasan expand

### Modified Files
| File | Changes |
|------|---------|
| `api/src/schema.ts` | +`roadmap_materials` table definition |
| `api/src/index.ts` | +`GET /roadmap/materials` + `GET /roadmap/test` endpoints |
| `types.ts` | +`ROADMAP_MATERIAL | ROADMAP_QUIZ` to ViewState |
| `App.tsx` | +imports, render cases, pass props |
| `components/RoadmapView.tsx` | +onClick subtopic navigates to material view |

---

### Task 1: DB — `roadmap_materials` table

**Files:**
- Modify: `api/src/schema.ts` (append after `roadmap_progress` definition, ~L216)

**Interfaces:**
- Produces: `roadmap_materials` Drizzle table definition
- Consumes: existing `questionSubtopics` table for FK

- [ ] **Step 1: Add Drizzle table definition**

```ts
// api/src/schema.ts — after roadmapProgress

export const roadmapMaterials = pgTable('roadmap_materials', {
  id: serial('id').primaryKey(),
  subtopicId: integer('subtopic_id').notNull().references(() => questionSubtopics.id),
  content: text('content').notNull().default(''),
  exampleQuestions: jsonb('example_questions').default('[]'),
  order: integer('order').default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});
```

- [ ] **Step 2: Run migrations**

```bash
# Generate migration file
npx drizzle-kit generate --name "add_roadmap_materials"

# Apply to Neon
npx drizzle-kit migrate
```

Or if using raw SQL approach:

```bash
# Connect to Neon and run
psql "$NEON_DATABASE_URL" -c "
CREATE TABLE IF NOT EXISTS roadmap_materials (
  id SERIAL PRIMARY KEY,
  subtopic_id INTEGER NOT NULL REFERENCES question_subtopics(id),
  content TEXT NOT NULL DEFAULT '',
  example_questions JSONB DEFAULT '[]',
  ord INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
"
```

- [ ] **Step 3: Seed placeholder data for all subtopics**

```bash
# Insert placeholder row for every subtopic that doesn't have one yet
psql "$NEON_DATABASE_URL" -c "
INSERT INTO roadmap_materials (subtopic_id, content, ord)
SELECT id, '## 📖 Materi ' || name || E'\n\nMateri ' || name || E' sedang disusun. Akan segera hadir.\n\n---\n\n*Tim Ikuttes sedang menyiapkan materi belajar terstruktur untuk subtopik ini. Pantau terus pembaruannya!*', id
FROM question_subtopics qs
WHERE NOT EXISTS (SELECT 1 FROM roadmap_materials rm WHERE rm.subtopic_id = qs.id);
"
```

- [ ] **Step 4: Seed example questions for a few subtopics (optional/test data)**

```bash
# Example: insert a sample question for subtopic_id = 1
psql "$NEON_DATABASE_URL" -c "
UPDATE roadmap_materials
SET example_questions = '[{\"question\":\"Sinonim dari kata BAKU adalah?\",\"options\":[{\"key\":\"a\",\"text\":\"Standar\"},{\"key\":\"b\",\"text\":\"Asli\"},{\"key\":\"c\",\"text\":\"Palsu\"},{\"key\":\"d\",\"text\":\"Sementara\"}],\"correctKey\":\"a\",\"explanation\":\"Baku berarti standar atau patokan. Contoh: bahasa baku = bahasa standar.\"}]'::jsonb
WHERE subtopic_id = 1;
"
```

- [ ] **Step 5: Verify**

```bash
psql "$NEON_DATABASE_URL" -c "SELECT id, subtopic_id, length(content) as content_len, jsonb_array_length(example_questions) as example_count FROM roadmap_materials ORDER BY id LIMIT 10;"
```
Expected: rows returned with content_len > 50, example_count >= 0

- [ ] **Step 6: Commit**

```bash
git add api/src/schema.ts
git commit -m "feat: add roadmap_materials table with placeholder data"
```

---

### Task 2: API — `GET /roadmap/materials` endpoint

**Files:**
- Modify: `api/src/index.ts` (add after `PUT /roadmap/progress` block, ~L2167)

**Interfaces:**
- Consumes: `roadmapMaterials` from schema (Task 1), `questionSubtopics`
- Produces: `GET /roadmap/materials?subtopicId=N` → `{ subtopicId, subtopicName, content, exampleQuestions }`
- Authentication: optional (guest can read materials)

- [ ] **Step 1: Add import for roadmapMaterials**

In the imports section (~L38), add `roadmapMaterials` to the drizzle schema imports:

```ts
import {
  // ... existing imports ...
  roadmapMaterials,
} from './schema';
```

- [ ] **Step 2: Add the endpoint**

```ts
// After PUT /roadmap/progress, before export default app

// TEAM_045: serve learning materials for a roadmap subtopic
app.get('/roadmap/materials', async (c) => {
  c.header('Cache-Control', 'no-store');
  const subtopicIdRaw = Number(c.req.query('subtopicId'));
  const subtopicId = Number.isInteger(subtopicIdRaw) && subtopicIdRaw > 0 ? subtopicIdRaw : null;
  if (!subtopicId) return c.json({ error: 'invalid_subtopic' }, 400);

  try {
    const db = await getDb(c.env);

    const rows = await db
      .select({
        subtopicId: roadmapMaterials.subtopicId,
        subtopicName: questionSubtopics.name,
        content: roadmapMaterials.content,
        exampleQuestions: roadmapMaterials.exampleQuestions,
      })
      .from(roadmapMaterials)
      .innerJoin(questionSubtopics, eq(roadmapMaterials.subtopicId, questionSubtopics.id))
      .where(eq(roadmapMaterials.subtopicId, subtopicId))
      .limit(1);

    if (!rows.length) {
      // Fallback placeholder if no material row exists yet
      return c.json({
        subtopicId,
        subtopicName: '',
        content: `## 📖 Materi\n\nMateri ini sedang disusun. Akan segera hadir.\n\n---\n\n*Tim Ikuttes sedang menyiapkan materi belajar terstruktur untuk subtopik ini. Pantau terus pembaruannya!*`,
        exampleQuestions: [],
      });
    }

    return c.json({
      subtopicId: rows[0].subtopicId,
      subtopicName: rows[0].subtopicName,
      content: rows[0].content,
      exampleQuestions: rows[0].exampleQuestions ?? [],
    });
  } catch (e) {
    console.error('TEAM_045 /roadmap/materials failed', e);
    return c.json({ error: 'unavailable' }, 503);
  }
});
```

- [ ] **Step 3: Verify with test request**

```bash
# Using curl or fetch from the app
curl -s "https://your-worker.workers.dev/roadmap/materials?subtopicId=1" | head -c 500
```
Expected: JSON with `{ subtopicId, subtopicName, content, exampleQuestions }` fields, content containing placeholder text

- [ ] **Step 4: Commit**

```bash
git add api/src/index.ts
git commit -m "feat: add GET /roadmap/materials endpoint"
```

---

### Task 3: API — `GET /roadmap/test` endpoint (10 soal per subtopic)

**Files:**
- Modify: `api/src/index.ts` (add after `/roadmap/materials` endpoint)

**Interfaces:**
- Produces: `GET /roadmap/test?subtopicId=N` → same question shape as `/drills/daily` (id, subject, difficulty, text, options, correct_option_id, explanation)
- Consumes: `questionsV2`, `questionOptionsV2`, `questionExplanationsV2`, `questionTopics` tables
- Filter: `questions_v2.subtopic_id = N`, active, deterministic shuffle via `md5(id || dayKey)`
- Limit: 10 questions
- Auth: optional (guest can attempt test but progress not saved)

- [ ] **Step 1: Add the endpoint**

```ts
// After GET /roadmap/materials, before export default app

// TEAM_045: serve 10 questions per subtopic for roadmap test
app.get('/roadmap/test', async (c) => {
  c.header('Cache-Control', 'no-store');
  const subtopicIdRaw = Number(c.req.query('subtopicId'));
  const subtopicId = Number.isInteger(subtopicIdRaw) && subtopicIdRaw > 0 ? subtopicIdRaw : null;
  if (!subtopicId) return c.json({ error: 'invalid_subtopic' }, 400);

  const nowMs = Date.now();
  const dayKey = getJakartaDayKey(nowMs);

  try {
    const db = await getDb(c.env);

    const picked = await db
      .select({
        id: questionsV2.id,
        subject: subjectSelectV2,
        difficulty: questionsV2.difficulty,
        text: questionsV2.questionText,
      })
      .from(questionsV2)
      .leftJoin(questionTopics, eq(questionsV2.topicId, questionTopics.id))
      .where(and(activeWhereV2, eq(questionsV2.subtopicId, subtopicId)))
      .orderBy(sql`md5((${questionsV2.id})::text || ${dayKey} || 'roadmap')`)
      .limit(10);

    if (!picked.length) {
      return c.json({ error: 'insufficient_question_pool' }, 503);
    }

    const ids = picked.map((r) => r.id);
    const opts = ids.length
      ? await db
        .select({
          questionId: questionOptionsV2.questionId,
          optionKey: questionOptionsV2.optionKey,
          optionText: questionOptionsV2.optionText,
          isCorrect: questionOptionsV2.isCorrect,
          weight: questionOptionsV2.weight,
        })
        .from(questionOptionsV2)
        .where(inArray(questionOptionsV2.questionId, ids))
      : [];

    const explRows = ids.length
      ? await db
        .select({ questionId: questionExplanationsV2.questionId, explanationText: questionExplanationsV2.explanationText })
        .from(questionExplanationsV2)
        .where(inArray(questionExplanationsV2.questionId, ids))
      : [];
    const explMap: Record<string, string> = {};
    for (const e of explRows) explMap[String(e.questionId)] = e.explanationText;

    const grouped: Record<string, { id: string; text: string }[]> = {};
    const correctByQuestion: Record<string, string | null> = {};
    const maxWeightByQuestion: Record<string, { id: string; weight: number }> = {};
    for (const o of opts as any[]) {
      const questionKey = String(o.questionId);
      const optionId = String(o.optionKey).toLowerCase();
      if (!grouped[questionKey]) grouped[questionKey] = [];
      grouped[questionKey].push({ id: optionId, text: o.optionText });
      if (o.isCorrect && !correctByQuestion[questionKey]) {
        correctByQuestion[questionKey] = optionId;
      }
      const w = Number(o.weight);
      if (Number.isFinite(w)) {
        const cur = maxWeightByQuestion[questionKey];
        if (!cur || w > cur.weight) maxWeightByQuestion[questionKey] = { id: optionId, weight: w };
      }
    }

    const questionsPayload = picked.map((r) => {
      const questionKey = String(r.id);
      const options = grouped[questionKey] ?? [];
      const correctId =
        correctByQuestion[questionKey] ??
        maxWeightByQuestion[questionKey]?.id ??
        (options[0]?.id ?? null);
      return {
        id: r.id,
        subject: (r.subject as any) ?? null,
        difficulty: r.difficulty,
        text: r.text,
        image_url: null,
        options,
        correct_option_id: correctId,
        explanation: explMap[questionKey] ?? '',
      };
    });

    return c.json({ subtopicId, questionCount: questionsPayload.length, questions: questionsPayload });
  } catch (e) {
    console.error('TEAM_045 /roadmap/test failed', e);
    return c.json({ error: 'unavailable' }, 503);
  }
});
```

- [ ] **Step 2: Verify with test request**

```bash
curl -s "https://your-worker.workers.dev/roadmap/test?subtopicId=1" | node -e "
const d=require('fs').readFileSync('/dev/stdin','utf8');
const j=JSON.parse(d);
console.log('count:', j.questions?.length, 'first_id:', j.questions?.[0]?.id, 'subject:', j.questions?.[0]?.subject);
"
```
Expected: count: 10, first_id: <number>, subject: "TIU" or "TWK" or "TKP"

- [ ] **Step 3: Commit**

```bash
git add api/src/index.ts
git commit -m "feat: add GET /roadmap/test endpoint (10 soal per subtopic)"
```

---

### Task 4: Types — add new ViewStates

**Files:**
- Modify: `types.ts`

**Interfaces:**
- Consumes: existing `ViewState` union type
- Produces: updated union with `ROADMAP_MATERIAL | ROADMAP_QUIZ`

- [ ] **Step 1: Update ViewState union**

```ts
export type ViewState = 'QUIZ' | 'RESULTS' | 'BONUS' | 'TRYOUT' | 'PROFILE' | 'DRILLS' | 'SIGNUP' | 'AD_INTERSTITIAL' | 'ADMIN_PAYMENTS' | 'ROADMAP' | 'ROADMAP_MATERIAL' | 'ROADMAP_QUIZ';
```

- [ ] **Step 2: Commit**

```bash
git add types.ts
git commit -m "feat: add ROADMAP_MATERIAL and ROADMAP_QUIZ to ViewState"
```

---

### Task 5: RoadmapView — onClick subtopic navigates to material view

**Files:**
- Modify: `components/RoadmapView.tsx`

**Interfaces:**
- Consumes: existing RoadmapView props + add `onStartMaterial: (subtopicId: number) => void` prop
- Produces: click handler on non-completed subtopic rows → triggers onStartMaterial

- [ ] **Step 1: Add navigation prop**

```ts
type RoadmapViewProps = {
  onStartMaterial?: (subtopicId: number) => void;
};
```

Update component declaration:

```ts
const RoadmapView: React.FC<RoadmapViewProps> = ({ onStartMaterial }) => {
```

- [ ] **Step 2: Add onClick handler on subtopic row**

Wrap the subtopic div (line ~144) with a click handler:

```tsx
<div
  key={sub.id}
  onClick={() => onStartMaterial?.(sub.id)}
  className={`px-2xl py-md flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer ${isCompleted ? 'opacity-70' : ''}`}
>
```

Only non-completed subtopics should be clickable (completed ones just show status):

```tsx
// If completed, show without click handler
if (isCompleted) {
  return (
    <div key={sub.id} className={`px-2xl py-md flex items-center justify-between ${isCompleted ? 'opacity-70' : ''}`}>
      {/* existing layout, no onClick */}
    </div>
  );
}
// If not completed, show as clickable
return (
  <div
    key={sub.id}
    onClick={() => onStartMaterial?.(sub.id)}
    className="px-2xl py-md flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer"
  >
    {/* existing layout */}
  </div>
);
```

- [ ] **Step 3: Commit**

```bash
git add components/RoadmapView.tsx
git commit -m "feat: add navigation from subtopic list to material view"
```

---

### Task 6: RoadmapMaterialView — dual-tab component

**Files:**
- Create: `components/RoadmapMaterialView.tsx`

**Interfaces:**
- Consumes: `onBack: () => void`, `onStartTest: (subtopicId: number) => void`, `subtopicId: number`
- Internal: fetches `GET /roadmap/materials?subtopicId=X`, renders tabs
- State: `activeTab: 'materi' | 'contoh'`

- [ ] **Step 1: Create component file**

```tsx
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { apiFetch } from '../services/apiClient';
import { ArrowLeft, BookOpen, FileText, Play } from 'lucide-react';

type ExampleQuestion = {
  question: string;
  options: Array<{ key: string; text: string }>;
  correctKey: string;
  explanation: string;
};

type MaterialData = {
  subtopicId: number;
  subtopicName: string;
  content: string;
  exampleQuestions: ExampleQuestion[];
};

type Props = {
  subtopicId: number;
  onBack: () => void;
  onStartTest: (subtopicId: number) => void;
};

const EXAMPLE_KEYS = ['a', 'b', 'c', 'd', 'e'] as const;

const exampleStatusIcon = (isCorrect: boolean) =>
  isCorrect
    ? <span className="text-feedback-green font-bold">✅</span>
    : <span className="text-feedback-red font-bold">❌</span>;

const RoadmapMaterialView: React.FC<Props> = ({ subtopicId, onBack, onStartTest }) => {
  const [data, setData] = useState<MaterialData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'materi' | 'contoh'>('materi');
  const [expandedExample, setExpandedExample] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      try {
        const res = await apiFetch(`/roadmap/materials?subtopicId=${subtopicId}`);
        if (res.ok) {
          const json = await res.json();
          if (!cancelled) setData(json as MaterialData);
        }
      } catch {}
      if (!cancelled) setLoading(false);
    };
    void run();
    return () => { cancelled = true; };
  }, [subtopicId]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <span className="font-medium text-sm text-gray-500">Memuat materi...</span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-xl p-2xl">
        <p className="text-gray-500">Materi tidak ditemukan.</p>
        <button onClick={onBack} className="text-sm font-bold text-black underline">Kembali</button>
      </div>
    );
  }

  const TABS = [
    { key: 'materi' as const, label: 'Materi', icon: BookOpen },
    { key: 'contoh' as const, label: 'Contoh Soal', icon: FileText },
  ];

  return (
    <div className="flex flex-col w-full min-h-0 animate-fade-in pb-20 md:pb-0">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200">
        <div className="flex items-center gap-sm px-2xl h-14">
          <button onClick={onBack} className="flex items-center gap-1 text-sm font-bold text-gray-600 hover:text-black">
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </button>
          <span className="text-sm text-gray-400 mx-1">/</span>
          <span className="text-sm font-bold truncate">{data.subtopicName}</span>
        </div>

        {/* Tab bar */}
        <div className="flex px-2xl gap-lg">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 pb-3 text-sm font-bold border-b-2 transition-colors ${
                  isActive
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'materi' ? (
            <motion.div
              key="materi"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.2 }}
              className="px-2xl py-xl"
            >
              {/* Markdown content rendered as simple HTML */}
              <div
                className="prose prose-sm max-w-none prose-headings:font-black prose-headings:text-lg prose-p:text-gray-700 prose-p:leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: data.content
                    .replace(/^### (.+)$/gm, '<h3 class="text-base font-black mt-xl mb-sm">$1</h3>')
                    .replace(/^## (.+)$/gm, '<h2 class="text-lg font-black mt-2xl mb-md">$1</h2>')
                    .replace(/^# (.+)$/gm, '<h1 class="text-xl font-black mt-2xl mb-md">$1</h1>')
                    .replace(/^- (.+)$/gm, '<li class="ml-lg list-disc text-gray-700">$1</li>')
                    .replace(/^(\d+)\. (.+)$/gm, '<li class="ml-lg list-decimal text-gray-700">$2</li>')
                    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\n\n/g, '</p><p class="text-gray-700 mt-md">')
                    .replace(/^(.+)$/gm, (match) => {
                      if (match.startsWith('<')) return match;
                      return match;
                    })
                }}
              />

              {/* CTA */}
              <div className="mt-2xl mb-xl">
                <button
                  onClick={() => onStartTest(subtopicId)}
                  className="w-full flex items-center justify-center gap-2 bg-black text-white font-black text-lg py-4 px-xl rounded-xl hover:bg-gray-800 transition-colors"
                >
                  <Play className="w-5 h-5" />
                  Mulai Tes (10 Soal)
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="contoh"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.2 }}
              className="px-2xl py-xl"
            >
              {(!data.exampleQuestions || data.exampleQuestions.length === 0) ? (
                <div className="text-center py-3xl">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-lg" />
                  <p className="text-gray-500 text-sm">Belum ada contoh soal untuk subtopik ini.</p>
                </div>
              ) : (
                <div className="space-y-xl">
                  {data.exampleQuestions.map((eq, idx) => {
                    const isExpanded = expandedExample === idx;
                    const userAnswer = userAnswers[idx];
                    const isAnswered = userAnswer !== undefined;

                    return (
                      <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden">
                        {/* Question header */}
                        <div className="p-lg bg-gray-50 border-b border-gray-200">
                          <span className="text-xs font-bold text-gray-400">CONTOH {idx + 1}</span>
                          <p className="font-bold text-sm mt-1">{eq.question}</p>
                        </div>

                        {/* Options */}
                        <div className="p-lg space-y-sm">
                          {eq.options.map((opt) => {
                            const isSelected = userAnswer === opt.key;
                            const isCorrectOpt = opt.key === eq.correctKey;
                            let optClasses = 'border border-gray-200 rounded-lg px-md py-sm text-sm transition-colors';

                            if (isAnswered) {
                              if (isCorrectOpt) {
                                optClasses += ' bg-green-50 border-feedback-green text-green-800 font-bold';
                              } else if (isSelected && !isCorrectOpt) {
                                optClasses += ' bg-red-50 border-feedback-red text-red-800';
                              } else {
                                optClasses += ' text-gray-400';
                              }
                            } else {
                              optClasses += ' hover:border-gray-400 cursor-pointer';
                            }

                            return (
                              <div
                                key={opt.key}
                                onClick={() => {
                                  if (!isAnswered) {
                                    setUserAnswers((prev) => ({ ...prev, [idx]: opt.key }));
                                    setExpandedExample(idx);
                                  }
                                }}
                                className={optClasses}
                              >
                                <span className="font-bold mr-sm uppercase">{opt.key}.</span>
                                {opt.text}
                                {isAnswered && isCorrectOpt && ' ✅'}
                                {isAnswered && isSelected && !isCorrectOpt && ' ❌'}
                              </div>
                            );
                          })}
                        </div>

                        {/* Expandable explanation */}
                        {isAnswered && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            className="border-t border-gray-200"
                          >
                            <div className="p-lg bg-amber-50">
                              <button
                                onClick={() => setExpandedExample(isExpanded ? null : idx)}
                                className="flex items-center gap-1 text-xs font-bold text-amber-700 mb-sm"
                              >
                                {isExpanded ? 'Sembunyikan' : 'Lihat'} Pembahasan
                              </button>
                              {isExpanded && (
                                <p className="text-sm text-gray-700">{eq.explanation}</p>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* CTA after examples */}
              <div className="mt-2xl mb-xl">
                <button
                  onClick={() => onStartTest(subtopicId)}
                  className="w-full flex items-center justify-center gap-2 bg-black text-white font-black text-lg py-4 px-xl rounded-xl hover:bg-gray-800 transition-colors"
                >
                  <Play className="w-5 h-5" />
                  Mulai Tes (10 Soal)
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RoadmapMaterialView;
```

- [ ] **Step 2: Commit**

```bash
git add components/RoadmapMaterialView.tsx
git commit -m "feat: add RoadmapMaterialView with materi/contoh tabs"
```

---

### Task 7: RoadmapQuizView — dedicated test component

**Files:**
- Create: `components/RoadmapQuizView.tsx`

**Interfaces:**
- Consumes: `subtopicId: number`, `onBack: () => void`, `onComplete: (score: number, subtopicId: number) => void`
- Internal: fetches `GET /roadmap/test?subtopicId=X`, manages 10-question flow
- Features: per-question instant feedback, explanation expand, prev/next navigation, progress ring, results summary

- [ ] **Step 1: Create component file**

```tsx
import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { apiFetch } from '../services/apiClient';
import { ArrowLeft, ArrowRight, RotateCcw, CheckCircle2, XCircle, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

type Option = { id: string; text: string };
type Question = {
  id: number;
  subject: string;
  difficulty: number;
  text: string;
  options: Option[];
  correct_option_id: string;
  explanation: string;
};

type Props = {
  subtopicId: number;
  subtopicName?: string;
  onBack: () => void;
  onComplete: (score: number, subtopicId: number) => void;
};

const RoadmapQuizView: React.FC<Props> = ({ subtopicId, subtopicName, onBack, onComplete }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [confirmed, setConfirmed] = useState<Record<string, boolean>>({});
  const [showExplanation, setShowExplanation] = useState<Record<string, boolean>>({});
  const [finished, setFinished] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      try {
        const res = await apiFetch(`/roadmap/test?subtopicId=${subtopicId}`);
        if (!res.ok) {
          const errText = await res.text().catch(() => '');
          if (!cancelled) setError(errText || 'Gagal memuat soal');
          return;
        }
        const json = await res.json();
        const qs = (json?.questions ?? []) as Question[];
        if (!cancelled) {
          if (!qs.length) {
            setError('Belum ada soal untuk subtopik ini.');
          } else {
            setQuestions(qs);
          }
        }
      } catch {
        if (!cancelled) setError('Gagal memuat soal. Periksa koneksi Anda.');
      }
      if (!cancelled) setLoading(false);
    };
    void run();
    return () => { cancelled = true; };
  }, [subtopicId]);

  const currentQuestion = questions[currentIdx];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(confirmed).length;
  const progressPct = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;

  const handleSelectOption = (optionId: string) => {
    if (confirmed[String(currentQuestion.id)]) return; // Already confirmed
    setAnswers((prev) => ({ ...prev, [String(currentQuestion.id)]: optionId }));
  };

  const handleConfirm = () => {
    const qid = String(currentQuestion.id);
    if (!answers[qid]) return;
    setConfirmed((prev) => ({ ...prev, [qid]: true }));
    setShowExplanation((prev) => ({ ...prev, [qid]: true }));
  };

  const toggleExplanation = () => {
    const qid = String(currentQuestion.id);
    setShowExplanation((prev) => ({ ...prev, [qid]: !prev[qid] }));
  };

  const goNext = () => {
    if (currentIdx < totalQuestions - 1) {
      setCurrentIdx((prev) => prev + 1);
    }
  };

  const goPrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
    }
  };

  const finish = () => {
    setFinished(true);
  };

  // Calculate score
  const score = useMemo(() => {
    if (!finished) return 0;
    let correct = 0;
    for (const q of questions) {
      const ans = confirmed[String(q.id)] ? answers[String(q.id)] : undefined;
      if (ans && ans === q.correct_option_id) correct++;
    }
    return Math.round((correct / totalQuestions) * 100);
  }, [finished, questions, answers, confirmed, totalQuestions]);

  // Submit progress to backend
  useEffect(() => {
    if (!finished || !score) return;
    // Only submit if score >= 70 (completed) or first attempt (in_progress)
    const status = score >= 70 ? 'completed' : 'in_progress';
    void apiFetch('/roadmap/progress', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subtopicId,
        status,
        bestScore: score,
        incrementAttempts: true,
      }),
    }).catch(() => {});
  }, [finished, score, subtopicId]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-10 h-10 border-3 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-lg" />
          <span className="font-medium text-sm text-gray-500">Memuat soal...</span>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-xl p-2xl">
        <XCircle className="w-12 h-12 text-gray-300" />
        <p className="text-gray-500 text-sm text-center">{error}</p>
        <button onClick={onBack} className="text-sm font-bold text-black underline">Kembali</button>
      </div>
    );
  }

  if (finished) {
    const passed = score >= 70;
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-2xl">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-sm"
        >
          {passed ? (
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-xl">
              <CheckCircle2 className="w-10 h-10 text-feedback-green" />
            </div>
          ) : (
            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-xl">
              <XCircle className="w-10 h-10 text-feedback-red" />
            </div>
          )}

          <h2 className="text-2xl font-black mb-sm">
            {passed ? 'Selamat! 🎉' : 'Belum Lulus'}
          </h2>
          <p className="text-sm text-gray-500 mb-lg">
            {passed
              ? 'Kamu berhasil menyelesaikan subtopik ini!'
              : `Skor kamu ${score}%. Minimal 70% untuk lulus.`}
          </p>

          {/* Score circle */}
          <div className="w-32 h-32 rounded-full border-4 border-gray-200 flex items-center justify-center mx-auto mb-xl">
            <span className={`text-3xl font-black ${passed ? 'text-feedback-green' : 'text-feedback-red'}`}>
              {score}%
            </span>
          </div>

          <div className="flex flex-col gap-md">
            {passed ? (
              <button
                onClick={() => onComplete(score, subtopicId)}
                className="w-full bg-black text-white font-bold py-3 px-xl rounded-xl hover:bg-gray-800 transition-colors"
              >
                Kembali ke Roadmap
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    setFinished(false);
                    setCurrentIdx(0);
                  }}
                  className="w-full bg-black text-white font-bold py-3 px-xl rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Coba Lagi
                </button>
                <button
                  onClick={() => onComplete(score, subtopicId)}
                  className="w-full text-gray-600 font-bold py-3 px-xl rounded-xl border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  Kembali ke Roadmap
                </button>
              </>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  const isConfirmed = confirmed[String(currentQuestion.id)];
  const selectedOption = answers[String(currentQuestion.id)];
  const isCorrect = isConfirmed && selectedOption === currentQuestion.correct_option_id;

  return (
    <div className="flex flex-col w-full h-full min-h-0 animate-fade-in">
      {/* Top bar */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-2xl h-14">
          <button onClick={onBack} className="flex items-center gap-1 text-sm font-bold text-gray-600 hover:text-black">
            <ArrowLeft className="w-4 h-4" />
            Keluar
          </button>
          <span className="text-sm font-bold text-gray-400">
            {currentIdx + 1}/{totalQuestions}
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-gray-100">
          <motion.div
            className="h-full bg-black transition-all"
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Progress dots */}
        <div className="flex gap-1.5 px-2xl py-sm overflow-x-auto">
          {questions.map((q, i) => {
            const qid = String(q.id);
            const isAnswered = !!confirmed[qid];
            const isCurrent = i === currentIdx;
            const qCorrect = isAnswered && answers[qid] === q.correct_option_id;
            const qWrong = isAnswered && answers[qid] !== q.correct_option_id;
            return (
              <button
                key={q.id}
                onClick={() => setCurrentIdx(i)}
                className={`w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 transition-colors ${
                  isCurrent
                    ? 'ring-2 ring-black ring-offset-1'
                    : ''
                } ${
                  qCorrect
                    ? 'bg-feedback-green text-white'
                    : qWrong
                    ? 'bg-feedback-red text-white'
                    : isAnswered
                    ? 'bg-gray-300 text-white'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {qCorrect ? '✓' : qWrong ? '✗' : i + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Question area */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="p-2xl"
          >
            {/* Subject badge + difficulty */}
            <div className="flex items-center gap-sm mb-lg">
              <span className="text-[10px] font-bold uppercase bg-gray-100 text-gray-500 px-2 py-0.5 rounded">
                {currentQuestion.subject}
              </span>
              <span className="text-[10px] text-gray-400">
                {'★'.repeat(currentQuestion.difficulty)}{'☆'.repeat(5 - currentQuestion.difficulty)}
              </span>
            </div>

            {/* Question text */}
            <h3 className="text-base font-bold leading-relaxed mb-xl">
              {currentQuestion.text}
            </h3>

            {/* Options */}
            <div className="space-y-sm">
              {currentQuestion.options.map((opt) => {
                const isSelected = selectedOption === opt.id;
                const isCorrectOpt = opt.id === currentQuestion.correct_option_id;
                let classes = 'w-full text-left border-2 rounded-xl px-lg py-md text-sm transition-all';

                if (isConfirmed) {
                  if (isCorrectOpt) {
                    classes += ' border-feedback-green bg-green-50 text-green-900 font-bold';
                  } else if (isSelected && !isCorrectOpt) {
                    classes += ' border-feedback-red bg-red-50 text-red-900';
                  } else {
                    classes += ' border-gray-100 text-gray-400';
                  }
                } else if (isSelected) {
                  classes += ' border-black bg-gray-50';
                } else {
                  classes += ' border-gray-200 hover:border-gray-400';
                }

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    disabled={isConfirmed}
                    className={classes}
                  >
                    <span className="font-bold mr-sm uppercase">{opt.id}.</span>
                    {opt.text}
                    {isConfirmed && isCorrectOpt && ' ✅'}
                    {isConfirmed && isSelected && !isCorrectOpt && ' ❌'}
                  </button>
                );
              })}
            </div>

            {/* Confirm button or feedback */}
            {!isConfirmed && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-xl"
              >
                <button
                  onClick={handleConfirm}
                  disabled={!selectedOption}
                  className={`w-full font-bold text-base py-3 px-xl rounded-xl transition-colors ${
                    selectedOption
                      ? 'bg-black text-white hover:bg-gray-800'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Konfirmasi Jawaban
                </button>
              </motion.div>
            )}

            {/* Feedback + explanation */}
            {isConfirmed && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-xl space-y-md"
              >
                <div className={`flex items-center gap-2 font-bold text-sm ${isCorrect ? 'text-feedback-green' : 'text-feedback-red'}`}>
                  {isCorrect ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                  {isCorrect ? 'Benar!' : 'Kurang tepat'}
                </div>

                <button
                  onClick={toggleExplanation}
                  className="flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-black"
                >
                  <HelpCircle className="w-4 h-4" />
                  {showExplanation[String(currentQuestion.id)] ? 'Sembunyikan' : 'Lihat'} Pembahasan
                  {showExplanation[String(currentQuestion.id)] ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>

                <AnimatePresence>
                  {showExplanation[String(currentQuestion.id)] && currentQuestion.explanation && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-lg bg-amber-50 rounded-xl border border-amber-200">
                        <p className="text-sm text-gray-700 leading-relaxed">{currentQuestion.explanation}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom navigation */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 px-2xl py-md">
        <div className="flex items-center gap-md">
          <button
            onClick={goPrev}
            disabled={currentIdx === 0}
            className="flex items-center gap-1 text-sm font-bold text-gray-500 disabled:text-gray-200 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Sebelumnya
          </button>

          <div className="flex-1" />

          {currentIdx < totalQuestions - 1 ? (
            <button
              onClick={goNext}
              className="flex items-center gap-1 text-sm font-bold text-black hover:text-gray-600 transition-colors"
            >
              Selanjutnya
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={finish}
              className="bg-black text-white font-bold text-sm py-2 px-lg rounded-xl hover:bg-gray-800 transition-colors"
            >
              Selesai
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoadmapQuizView;
```

- [ ] **Step 2: Commit**

```bash
git add components/RoadmapQuizView.tsx
git commit -m "feat: add RoadmapQuizView dedicated test component with instant feedback"
```

---

### Task 8: App.tsx — wire up RoadmapMaterialView & RoadmapQuizView

**Files:**
- Modify: `App.tsx`

**Interfaces:**
- Consumes: `RoadmapMaterialView`, `RoadmapQuizView`
- Produces: render cases for `ROADMAP_MATERIAL` and `ROADMAP_QUIZ` + state for current subtopicId

- [ ] **Step 1: Add state and imports**

In `AppContent`:

```tsx
import RoadmapView from './components/RoadmapView';
import RoadmapMaterialView from './components/RoadmapMaterialView';
import RoadmapQuizView from './components/RoadmapQuizView';
```

Add state:

```tsx
const [roadmapSubtopicId, setRoadmapSubtopicId] = useState<number | null>(null);
const [roadmapSubtopicName, setRoadmapSubtopicName] = useState<string>('');
```

- [ ] **Step 2: Pass onStartMaterial to RoadmapView**

In `renderContent`, case `'ROADMAP'`:

```tsx
case 'ROADMAP':
  return (
    <RoadmapView
      onStartMaterial={(subtopicId) => {
        setRoadmapSubtopicId(subtopicId);
        setRoadmapSubtopicName('');
        setView('ROADMAP_MATERIAL');
      }}
    />
  );
```

- [ ] **Step 3: Add render cases**

```tsx
case 'ROADMAP_MATERIAL':
  return roadmapSubtopicId ? (
    <RoadmapMaterialView
      subtopicId={roadmapSubtopicId}
      onBack={() => setView('ROADMAP')}
      onStartTest={(id) => {
        setRoadmapSubtopicId(id);
        setView('ROADMAP_QUIZ');
      }}
    />
  ) : null;

case 'ROADMAP_QUIZ':
  return roadmapSubtopicId ? (
    <RoadmapQuizView
      subtopicId={roadmapSubtopicId}
      subtopicName={roadmapSubtopicName}
      onBack={() => setView('ROADMAP_MATERIAL')}
      onComplete={(score, id) => {
        // Navigate back to roadmap after test
        setView('ROADMAP');
      }}
    />
  ) : null;
```

- [ ] **Step 4: Update deep-link allowlist**

In the `allowed` array (~L89), add `'ROADMAP_MATERIAL'` and `'ROADMAP_QUIZ'`.

- [ ] **Step 5: BottomNav — hide bottom nav on exam screens**

Add `ROADMAP_MATERIAL` and `ROADMAP_QUIZ` to the condition that hides BottomNav (check how TRYOUT/QUIZ already do it — the `view !== 'AD_INTERSTITIAL'` check ~L703). These views should also hide bottom nav since they're full-screen:

```tsx
{view !== 'AD_INTERSTITIAL' && view !== 'ROADMAP_MATERIAL' && view !== 'ROADMAP_QUIZ' && (
  <div className="md:hidden">
    <BottomNav ... />
  </div>
)}
```

- [ ] **Step 6: Commit**

```bash
git add App.tsx
git commit -m "feat: wire RoadmapMaterialView and RoadmapQuizView into App"
```

---

### Task 9: Verify end-to-end flow

**Files:**
- Check: All files above

- [ ] **Step 1: Build to check for type errors**

```bash
cd "C:/Users/Digitalisasi/Documents/ikuttesarena/06202026/ikutteslive"
npx tsc --noEmit 2>&1 | head -30
```
Expected: no type errors (or only pre-existing ones)

- [ ] **Step 2: Verify API locally**

```bash
# Start dev API
npm run dev:api
# In another terminal
curl -s "http://localhost:8787/roadmap/materials?subtopicId=1" | head -c 300
curl -s "http://localhost:8787/roadmap/test?subtopicId=1" | node -e "
const d=require('fs').readFileSync('/dev/stdin','utf8');
const j=JSON.parse(d);
console.log('questions:', j.questions?.length, 'first:', j.questions?.[0]?.text?.substring(0,50));
"
```

- [ ] **Step 3: Vite build check**

```bash
npm run build 2>&1 | tail -20
```
Expected: build succeeds

- [ ] **Step 4: Commit any fixes**

```bash
git add -A
git commit -m "fix: type and build fixes for roadmap phase 2"
```

---
