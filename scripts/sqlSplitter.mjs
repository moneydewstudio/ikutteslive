// scripts/sqlSplitter.mjs
// TEAM_046: standalone SQL statement splitter (extracted for testability).
// Splits a SQL file into individual statements, respecting:
//   - single-quoted strings ('...' with '' escape)
//   - line comments (-- ...)
//   - block comments (/* ... */)
//   - dollar-quoted blocks ($tag$ ... $tag$)

export function splitSqlStatements(sql) {
  const stmts = [];
  let buf = '';
  let i = 0;
  let inSingle = false;
  let inLineComment = false;
  let inBlockComment = false;
  let dollarTag = null;

  while (i < sql.length) {
    const ch = sql[i];
    const next = sql[i + 1];

    if (inLineComment) {
      buf += ch;
      if (ch === '\n') inLineComment = false;
      i++;
      continue;
    }
    if (inBlockComment) {
      buf += ch;
      if (ch === '*' && next === '/') {
        buf += next;
        i += 2;
        inBlockComment = false;
        continue;
      }
      i++;
      continue;
    }
    if (inSingle) {
      buf += ch;
      if (ch === "'" && next === "'") {
        buf += next;
        i += 2;
        continue;
      }
      if (ch === "'") inSingle = false;
      i++;
      continue;
    }
    if (dollarTag) {
      if (ch === '$' && sql.slice(i, i + dollarTag.length + 2) === `$${dollarTag}$`) {
        buf += `$${dollarTag}$`;
        i += dollarTag.length + 2;
        dollarTag = null;
        continue;
      }
      buf += ch;
      i++;
      continue;
    }

    if (ch === '-' && next === '-') {
      buf += '--';
      i += 2;
      inLineComment = true;
      continue;
    }
    if (ch === '/' && next === '*') {
      buf += '/*';
      i += 2;
      inBlockComment = true;
      continue;
    }
    if (ch === "'") {
      buf += ch;
      inSingle = true;
      i++;
      continue;
    }
    if (ch === '$') {
      const tagMatch = sql.slice(i).match(/^\$([A-Za-z0-9_]*)\$/);
      if (tagMatch) {
        const tag = tagMatch[1];
        buf += `$${tag}$`;
        i += tag.length + 2;
        dollarTag = tag;
        continue;
      }
    }
    if (ch === ';') {
      const trimmed = buf.trim();
      if (trimmed) stmts.push(trimmed);
      buf = '';
      i++;
      continue;
    }
    buf += ch;
    i++;
  }
  const tail = buf.trim();
  if (tail) stmts.push(tail);
  return stmts;
}
