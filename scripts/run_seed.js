// run_seed.js
import { neon } from "@neondatabase/serverless";
import fs from "fs";
import path from "path";

const sql = neon(process.env.NEON_DATABASE_URL);
const sqlFile = path.resolve("db/seed/20260620_fix_question_themes_seed.sql");
const sqlText = fs.readFileSync(sqlFile, "utf8");

async function run() {
  try {
    await sql(sqlText);
    console.log("Seed applied successfully");
  } catch (err) {
    console.error("Error applying seed:", err);
    process.exit(1);
  }
}
run();
