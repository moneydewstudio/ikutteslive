import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";
dotenv.config();
const sql = neon(process.env.NEON_DATABASE_URL);

const dup = await sql`
  SELECT question_id::int, COUNT(*) as n
  FROM question_options_v2
  WHERE question_id IN (
    SELECT q.id FROM questions_v2 q JOIN question_topics qt ON q.topic_id = qt.id WHERE qt.code = 'TKP'
  )
  GROUP BY question_id
  HAVING COUNT(*) != 5
`;
console.log("Questions with != 5 options:", dup.length);

const distrib = await sql`
  SELECT option_key, COUNT(*) as n
  FROM question_options_v2
  WHERE question_id IN (
    SELECT q.id FROM questions_v2 q JOIN question_topics qt ON q.topic_id = qt.id WHERE qt.code = 'TKP'
  )
  GROUP BY option_key
  ORDER BY option_key
`;
console.log("Distribution after shuffle:", distrib);

const stillABCDE = await sql`
  SELECT COUNT(*)::int as n FROM (
    SELECT question_id,
      array_agg(option_key ORDER BY option_key) as keys
    FROM question_options_v2
    WHERE question_id IN (
      SELECT q.id FROM questions_v2 q JOIN question_topics qt ON q.topic_id = qt.id WHERE qt.code = 'TKP'
    )
    GROUP BY question_id
  ) s WHERE s.keys = ARRAY['a','b','c','d','e']::text[]
`;
console.log("Questions still in ABCDE order:", stillABCDE[0].n);