// TEAM_036: Test the analytics queries
import { neon } from '@neondatabase/serverless';
const DATABASE_URL = process.env.NEON_DATABASE_URL;
const sql = neon(DATABASE_URL);

async function check() {
  console.log('Testing tryout query...');
  try {
    const r1 = await sql`
      select "questions"."theme_id", count(*),
      sum(case when "tryout_attempt_items"."is_correct" = true then 1 else 0 end),
      sum(case when "tryout_attempt_items"."max_weight" > 0 then ("tryout_attempt_items"."selected_weight"::float / "tryout_attempt_items"."max_weight"::float) else 0 end),
      sum(case when "tryout_attempt_items"."is_correct" is null then 0 else 1 end)
      from "tryout_attempt_items"
      left join "tryout_attempts" on "tryout_attempt_items"."attempt_id" = "tryout_attempts"."id"
      left join "questions" on "tryout_attempt_items"."question_id" = "questions"."id"
      where ("tryout_attempts"."user_id" = 'test_user' and "questions"."theme_id" is not null)
      group by "questions"."theme_id"
    `;
    console.log('tryout query OK', r1.length);
  } catch(e) { console.error('tryout query FAIL', e.message); }

  console.log('Testing daily query...');
  try {
    const r2 = await sql`
      select "questions"."theme_id", count(*),
      sum(case when "daily_quiz_attempt_items"."is_correct" = true then 1 else 0 end),
      sum(case when "daily_quiz_attempt_items"."max_weight" > 0 then ("daily_quiz_attempt_items"."selected_weight"::float / "daily_quiz_attempt_items"."max_weight"::float) else 0 end),
      sum(case when "daily_quiz_attempt_items"."is_correct" is null then 0 else 1 end)
      from "daily_quiz_attempt_items"
      left join "daily_quiz_attempts" on "daily_quiz_attempt_items"."attempt_id" = "daily_quiz_attempts"."id"
      left join "questions" on "daily_quiz_attempt_items"."question_id" = "questions"."id"
      where ("daily_quiz_attempts"."user_id" = 'test_user' and "questions"."theme_id" is not null)
      group by "questions"."theme_id"
    `;
    console.log('daily query OK', r2.length);
  } catch(e) { console.error('daily query FAIL', e.message); }

  console.log('Testing themes query...');
  try {
    const r3 = await sql`
      select "question_themes"."id", "question_themes"."name", upper("question_topics"."code")
      from "question_themes"
      left join "question_subtopics" on "question_themes"."subtopic_id" = "question_subtopics"."id"
      left join "question_categories" on "question_subtopics"."category_id" = "question_categories"."id"
      left join "question_topics" on "question_categories"."topic_id" = "question_topics"."id"
      where "question_themes"."id" in (1, 2, 3)
    `;
    console.log('themes query OK', r3.length);
  } catch(e) { console.error('themes query FAIL', e.message); }
}

check().catch(console.error);
