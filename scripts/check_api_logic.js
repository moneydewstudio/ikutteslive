import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";
dotenv.config();

const sql = neon(process.env.NEON_DATABASE_URL);
const userId = 'Ix2YpAxtlsVh9uTVZ7J1OriVMGB2'; // The user id we found earlier

async function run() {
  try {
    const tryoutRows = await sql`
        SELECT 
          q.theme_id as "themeId",
          COUNT(*) as attempts,
          SUM(CASE WHEN tai.is_correct = true THEN 1 ELSE 0 END) as "twkTiuCorrect",
          SUM(CASE WHEN tai.max_weight > 0 THEN (tai.selected_weight::float / tai.max_weight::float) ELSE 0 END) as "tkpRatioSum",
          SUM(CASE WHEN tai.is_correct IS NULL THEN 0 ELSE 1 END) as "hasBinary"
        FROM tryout_attempt_items tai
        LEFT JOIN tryout_attempts ta ON ta.id = tai.attempt_id
        LEFT JOIN questions q ON q.id = tai.question_id
        WHERE ta.user_id = ${userId} AND q.theme_id IS NOT NULL
        GROUP BY q.theme_id
    `;
    console.log("tryoutRows:", tryoutRows);

    const themeIds = tryoutRows.map(r => r.themeId).filter(Boolean);

    const themes = await sql`
        SELECT 
          qt.id,
          qt.name,
          UPPER(qtop.code) as "topicCode"
        FROM question_themes qt
        LEFT JOIN question_subtopics qs ON qt.subtopic_id = qs.id
        LEFT JOIN question_categories qc ON qs.category_id = qc.id
        LEFT JOIN question_topics qtop ON qc.topic_id = qtop.id
        WHERE qt.id = ANY(${themeIds})
    `;
    console.log("themes meta:", themes);

  } catch (err) {
    console.error(err);
  }
}
run();
