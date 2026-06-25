import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";
dotenv.config();

const sql = neon(process.env.NEON_DATABASE_URL);

async function run() {
  try {
    const res = await sql`SELECT count(*) as total, count(theme_id) as tagged FROM questions`;
    console.log("Questions:", res);
    const themes = await sql`SELECT count(*) as total FROM question_themes`;
    console.log("Themes:", themes);
    const tryouts = await sql`SELECT count(*) as total FROM tryout_attempts`;
    console.log("Tryouts:", tryouts);
    const items = await sql`
        SELECT COUNT(*) as total, count(q.theme_id) as tagged 
        FROM tryout_attempt_items tai
        LEFT JOIN tryout_attempts ta ON ta.id = tai.attempt_id
        LEFT JOIN questions q ON q.id = tai.question_id
    `;
    console.log("Items:", items);
  } catch (err) {
    console.error(err);
  }
}
run();
