// TEAM_037: Simple search helper to locate code blocks in api/src/index.ts
import fs from 'node:fs';

const file = 'api/src/index.ts';
const content = fs.readFileSync(file, 'utf8');
const lines = content.split('\n');

const query = process.argv[2] || '';
console.log(`Searching for "${query}" in ${file}...`);

lines.forEach((line, index) => {
  if (line.toLowerCase().includes(query.toLowerCase())) {
    console.log(`L${index + 1}: ${line.trim()}`);
  }
});
