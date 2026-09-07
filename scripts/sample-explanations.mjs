import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";
dotenv.config();
const sql = neon(process.env.NEON_DATABASE_URL);

const samples = await sql`
  SELECT q.id::int AS qid,
    (SELECT array_agg(option_key || ':' || COALESCE(weight::text,'null') ORDER BY option_key)
       FROM question_options_v2 WHERE question_id = q.id) AS opts,
    e.explanation_text
  FROM questions_v2 q
  JOIN question_explanations_v2 e ON e.question_id = q.id
  WHERE q.id IN (
    SELECT q.id FROM questions_v2 q JOIN question_topics qt ON q.topic_id = qt.id
    WHERE qt.code = 'TKP' ORDER BY q.id LIMIT 5
  )
`;
for (const r of samples) {
  console.log(`\n=== qid=${r.qid} ===`);
  console.log("opts:", r.opts);
  console.log("explanation:", r.explanation_text.slice(0, 250));
}
