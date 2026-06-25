import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";
dotenv.config();

const sql = neon(process.env.NEON_DATABASE_URL);

async function run() {
  try {
    const res = await sql`
      SELECT 
          ta.user_id,
          q.theme_id,
          COUNT(*) as attempts
      FROM tryout_attempt_items tai
      LEFT JOIN tryout_attempts ta ON ta.id = tai.attempt_id
      LEFT JOIN questions q ON q.id = tai.question_id
      WHERE q.theme_id IS NOT NULL AND ta.user_id IS NOT NULL
      GROUP BY ta.user_id, q.theme_id
      ORDER BY attempts DESC
      LIMIT 10
    `;
    console.log("Top user/theme combinations:", res);
  } catch (err) {
    console.error(err);
  }
}
run();
