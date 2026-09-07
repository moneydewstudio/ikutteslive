// Shuffle option_key (a/b/c/d/e) for every TKP question in questions_v2.
// Weight, option_text stay attached to the same row — only the label rotates.
// Idempotent: running twice on the same seed produces identical results per question.
//
// Prereq: NEON_DATABASE_URL in env (.env).
//   node scripts/shuffle-tkp-option-keys.mjs            # apply
//   node scripts/shuffle-tkp-option-keys.mjs --dry-run  # preview only
import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";
dotenv.config();

const sql = neon(process.env.NEON_DATABASE_URL);
const dryRun = process.argv.includes("--dry-run");

const limitArg = (() => {
  const hit = process.argv.find((a) => a.startsWith("--limit="));
  return hit ? Number(hit.slice("--limit=".length)) : undefined;
})();

const KEYS = ["a", "b", "c", "d", "e"];

// Deterministic shuffle: same question_id always rotates the same way.
// Seed = question_id so reruns are safe; pre-shuffled questions still match.
const shuffle = (qid, order) => {
  let seed = qid >>> 0;
  for (let i = order.length - 1; i > 0; i--) {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    const j = seed % (i + 1);
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
};

async function main() {
  const tkpTopicIds = await sql`
    SELECT id FROM question_topics WHERE code = 'TKP'
  `;
  const ids = tkpTopicIds.map((r) => r.id);
  if (!ids.length) {
    console.error("No TKP topics found.");
    process.exit(1);
  }

  const questions = await sql`
    SELECT q.id::int AS id
    FROM questions_v2 q
    WHERE q.topic_id = ANY(${ids})
      AND q.is_active = true
    ORDER BY q.id
    ${limitArg ? sql`LIMIT ${limitArg}` : sql``}
  `;
  console.log(`TKP questions to process: ${questions.length}${limitArg ? ` (limit=${limitArg})` : ""}`);

  const options = await sql`
    SELECT question_id::int AS qid, option_key, weight, option_text
    FROM question_options_v2
    WHERE question_id = ANY(${questions.map((q) => q.id)})
    ORDER BY question_id, option_key
  `;

  // group by question, preserving current option_key order
  const byQ = new Map();
  for (const o of options) {
    if (!byQ.has(o.qid)) byQ.set(o.qid, []);
    byQ.get(o.qid).push(o);
  }

  let updates = 0;
  for (const [qid, rows] of byQ) {
    if (rows.length !== 5) {
      console.warn(`  qid=${qid} has ${rows.length} options, skipping`);
      continue;
    }
    const currentOrder = rows.map((r) => r.option_key);
    const targetOrder = shuffle(qid, [...currentOrder]);
    // skip if already shuffled (no rotation needed)
    if (currentOrder.every((k, i) => k === targetOrder[i])) continue;

    if (dryRun) {
      console.log(`qid=${qid}: ${currentOrder.join("")} → ${targetOrder.join("")}`);
      continue;
    }

    // Rotate via temp labels to avoid unique constraint collisions during UPDATE.
    // Two-phase: move current keys → temp placeholders (z,y,x,w,v), then to new keys.
    const tempKeys = ["z", "y", "x", "w", "v"];
    for (let i = 0; i < 5; i++) {
      await sql`
        UPDATE question_options_v2
        SET option_key = ${tempKeys[i]}
        WHERE question_id = ${qid} AND option_key = ${currentOrder[i]}
      `;
    }
    for (let i = 0; i < 5; i++) {
      await sql`
        UPDATE question_options_v2
        SET option_key = ${targetOrder[i]}
        WHERE question_id = ${qid} AND option_key = ${tempKeys[i]}
      `;
    }
    updates++;
  }

  console.log(`${dryRun ? "Would update" : "Updated"}: ${updates} questions`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});