// Regenerate explanation_text in question_explanations_v2 for every TKP question.
// The new explanation explains the highest-weight option WITHOUT naming any option label
// (a/b/c/d/e) — because labels will rotate independently of weight.
//
// Prereq: NEON_DATABASE_URL and ANTHROPIC_API_KEY in env (.env).
//   node scripts/regen-tkp-explanations.mjs                 # apply
//   node scripts/regen-tkp-explanations.mjs --dry-run       # preview, no writes
//   node scripts/regen-tkp-explanations.mjs --limit=20      # cap batch (debugging)
//   node scripts/regen-tkp-explanations.mjs --concurrency=4 # parallel requests (default 2)
import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";
dotenv.config();

const sql = neon(process.env.NEON_DATABASE_URL);
const dryRun = process.argv.includes("--dry-run");

const arg = (name) => {
  const flag = `--${name}=`;
  const hit = process.argv.find((a) => a.startsWith(flag));
  return hit ? Number(hit.slice(flag.length)) : undefined;
};
const limit = arg("limit");
const concurrency = arg("concurrency") ?? 2;

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-haiku-4-5";

const callClaude = async (system, user) => {
  const res = await fetch(ANTHROPIC_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 600,
      system,
      messages: [{ role: "user", content: user }],
    }),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Anthropic ${res.status}: ${txt}`);
  }
  const data = await res.json();
  return data.content?.[0]?.text?.trim() ?? "";
};

const SYSTEM = [
  "Anda menulis penjelasan soal SKD kategori TKP (Tes Karakteristik Pribadi) untuk aplikasi latihan.",
  "Tugas Anda: jelaskan MENGANapa opsi dengan skor tertinggi (best practice) adalah jawaban ideal.",
  "",
  "ATURAN KETAT:",
  "1. JANGAN pernah menyebut label opsi (A/B/C/D/E, 'Opsi A', 'pilihan pertama', dll).",
  "2. JANGAN menyebut skor numerik ('skor 5', 'bobot 5', dll).",
  "3. Langsung jelaskan prinsip/nilai yang mendasari jawaban ideal (mis. integritas, inisiatif, kolaborasi, profesionalisme).",
  "4. Maksimal 3 kalimat. Bahasa Indonesia, nada netral-pedagogis.",
  "5. Jika soal bukan tentang nilai profesional, jelaskan rasional substantifnya.",
].join("\n");

const buildPrompt = (q, options) => {
  const best = options.find((o) => o.weight === Math.max(...options.map((x) => x.weight)));
  const others = options.filter((o) => o.option_key !== best.option_key);
  return [
    `SOAL: ${q.text}`,
    "",
    "OPSI (acak label):",
    ...options.map((o, i) => `${i + 1}. ${o.option_text}`),
    "",
    `JAWABAN IDEAL (skor tertinggi): ${best.option_text}`,
    "",
    "Tulis penjelasan 1-3 kalimat untuk opsi jawaban ideal di atas, tanpa menyebut label opsi atau skor.",
  ].join("\n");
};

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("ANTHROPIC_API_KEY is missing from env.");
    process.exit(1);
  }

  const tkpTopicIds = await sql`SELECT id FROM question_topics WHERE code = 'TKP'`;
  const topicIds = tkpTopicIds.map((r) => r.id);
  if (!topicIds.length) {
    console.error("No TKP topics found.");
    process.exit(1);
  }

  const questions = await sql`
    SELECT q.id::int AS id, q.question_text AS text
    FROM questions_v2 q
    WHERE q.topic_id = ANY(${topicIds}) AND q.is_active = true
    ORDER BY q.id
    ${limit ? sql`LIMIT ${limit}` : sql``}
  `;
  console.log(`TKP questions to regenerate: ${questions.length}`);

  const optionsRaw = await sql`
    SELECT question_id::int AS qid, option_key, option_text, weight
    FROM question_options_v2
    WHERE question_id = ANY(${questions.map((q) => q.id)})
    ORDER BY question_id, option_key
  `;
  const optsByQ = new Map();
  for (const o of optionsRaw) {
    if (!optsByQ.has(o.qid)) optsByQ.set(o.qid, []);
    optsByQ.get(o.qid).push(o);
  }

  let done = 0;
  let failed = 0;
  const queue = [...questions];
  const workers = Array.from({ length: concurrency }, async () => {
    while (queue.length) {
      const q = queue.shift();
      const opts = optsByQ.get(q.id);
      if (!opts || opts.length < 2) {
        console.warn(`qid=${q.id}: insufficient options, skipping`);
        continue;
      }
      try {
        const prompt = buildPrompt(q, opts);
        const newExplanation = await callClaude(SYSTEM, prompt);
        if (!newExplanation) {
          failed++;
          continue;
        }
        if (dryRun) {
          if (done < 3) console.log(`\n[qid=${q.id}]\n${newExplanation}`);
        } else {
          await sql`
            UPDATE question_explanations_v2
            SET explanation_text = ${newExplanation}
            WHERE question_id = ${q.id}
          `;
        }
        done++;
        if (done % 10 === 0) console.log(`  progress: ${done}/${questions.length}`);
      } catch (e) {
        console.warn(`qid=${q.id} failed: ${e.message}`);
        failed++;
      }
    }
  });

  await Promise.all(workers);
  console.log(`Done: ${done}, Failed: ${failed}, Mode: ${dryRun ? "dry-run" : "applied"}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});