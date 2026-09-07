// scripts/setup-qrisify.mjs
// TEAM_046: one-shot setup for QRIS-ify dynamic QRIS payments.
// 1) Applies DB migration (adds qrisify_* columns + UNIQUE index on qrisify_transaction_id)
// 2) Sets Cloudflare Worker secrets via `wrangler secret put` (interactive)
//
// Run from repo root:  node scripts/setup-qrisify.mjs
//   or for the api worker specifically:  node scripts/setup-qrisify.mjs --api
//
// Flags:
//   --live                  Switch to production: delete price overrides, prompt for live key,
//                           require non-DISABLED webhook secret.
//   --reset-prices          Delete QRISIFY_PLAN_3_DAY_AMOUNT and QRISIFY_PLAN_30_DAY_AMOUNT
//                           (use after sandbox testing to restore 9900/19000 defaults).
//   --skip-migration        Skip the DB migration step.
//   --skip-secrets          Skip the secret-setting step.
//   --migration-file <path> Use a custom migration file (default: db/migrations/20260906_team_046_qrisify_dynamic.sql).
//
// Requirements: Node 18+ (uses fetch), wrangler logged in (`npx wrangler login`).
// No psql needed — uses the Neon serverless HTTP API directly.

import { spawnSync } from 'node:child_process';
import { createInterface } from 'node:readline/promises';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { splitSqlStatements } from './sqlSplitter.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');
const apiDir = resolve(repoRoot, 'api');

const isApi = process.argv.includes('--api');
const skipMigration = process.argv.includes('--skip-migration');
const skipSecrets = process.argv.includes('--skip-secrets');
const isLive = process.argv.includes('--live');
const resetPrices = process.argv.includes('--reset-prices') || isLive;

const migrationFileArg = process.argv.indexOf('--migration-file');
const migrationFileOverride = migrationFileArg > -1 ? process.argv[migrationFileArg + 1] : null;

function wranglerSecretDelete(name, cwd) {
  const res = spawnSync('npx', ['wrangler', 'secret', 'delete', name], {
    cwd,
    stdio: 'inherit',
    shell: true,
  });
  // wrangler returns non-zero if the secret didn't exist — not fatal.
  return res.status === 0;
}

// Apply SQL statements via Neon's HTTP SQL API.
// Handles both pooled (-pooler suffix) and direct connection strings.
async function applySqlViaNeonHttp(dbUrl, sql) {
  const u = new URL(dbUrl);
  let host = u.hostname; // e.g. ep-polished-rain-a1fl6wek-pooler.ap-southeast-1.aws.neon.tech

  // Strip -pooler suffix — the HTTP SQL endpoint is on the direct (non-pooled) host.
  host = host.replace(/-pooler\./, '.');

  // host is now e.g. ep-polished-rain-a1fl6wek.ap-southeast-1.aws.neon.tech
  // For the HTTP endpoint, Neon expects: <endpoint>.<region>.neon.tech/sql
  // The first segment of the hostname is the endpoint ID, rest is region.
  const segments = host.split('.');
  const endpoint = segments[0];
  const regionSegments = segments.slice(1).join('.'); // e.g. "ap-southeast-1.aws.neon.tech"
  const url = `https://${endpoint}.${regionSegments}/sql`;

  const dbName = u.pathname.replace(/^\//, '') || 'neondb';
  const statements = splitSqlStatements(sql);
  let applied = 0;

  for (const stmt of statements) {
    const body = {
      query: stmt,
      params: [],
      databaseName: dbName,
    };
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Neon-Connection-String': dbUrl,
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`HTTP ${res.status}: ${text}\nEndpoint: ${url}\nFailed statement:\n${stmt}`);
    }
    applied++;
  }
  return { applied, total: statements.length, endpoint: url };
}

const rl = createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => rl.question(q);

function logStep(n, msg) {
  console.log(`\n\x1b[36m[${n}]\x1b[0m ${msg}`);
}

function run(cmd, args, opts = {}) {
  const res = spawnSync(cmd, args, { stdio: 'inherit', shell: true, ...opts });
  if (res.status !== 0 && !opts.ignoreExit) {
    console.error(`\x1b[31m✗ ${cmd} ${args.join(' ')}\x1b[0m (exit ${res.status})`);
    process.exit(res.status ?? 1);
  }
}

function wranglerSecretPut(name, value, cwd) {
  // Pipe value into `wrangler secret put <name>` non-interactively.
  const res = spawnSync('npx', ['wrangler', 'secret', 'put', name], {
    cwd,
    input: value,
    stdio: ['pipe', 'inherit', 'inherit'],
    shell: true,
  });
  if (res.status !== 0) {
    console.error(`\x1b[31m✗ wrangler secret put ${name} failed\x1b[0m`);
    return false;
  }
  return true;
}

async function main() {
  // ----- Pre-flight -----
  logStep('0', 'Pre-flight checks');
  if (!existsSync(resolve(apiDir, 'wrangler.jsonc'))) {
    console.error('api/wrangler.jsonc not found. Run from repo root.');
    process.exit(1);
  }
  if (!skipMigration) {
    // Node 18+ ships with global fetch — no psql needed.
    const nodeMajor = Number(process.versions.node.split('.')[0]);
    if (nodeMajor < 18) {
      console.error(`Node ${process.versions.node} detected. Need Node 18+ for fetch. Upgrade or pass --skip-migration.`);
      process.exit(1);
    }
  }

  // ----- Step 1: migration -----
  if (!skipMigration) {
    const migrationPath = migrationFileOverride
      ? resolve(repoRoot, migrationFileOverride)
      : resolve(repoRoot, 'db/migrations/20260906_team_046_qrisify_dynamic.sql');
    logStep('1', `Apply DB migration: ${path.relative(repoRoot, migrationPath)}`);

    let dbUrl = process.env.NEON_DATABASE_URL || '';
    const envFile = resolve(repoRoot, '.env');
    if (!dbUrl && existsSync(envFile)) {
      const envText = readFileSync(envFile, 'utf8');
      const match = envText.match(/^NEON_DATABASE_URL=(.+)$/m);
      if (match) dbUrl = match[1].trim();
    }
    if (!dbUrl) {
      dbUrl = await ask('NEON_DATABASE_URL not found. Paste it: ');
    }
    if (!dbUrl) {
      console.error('No NEON_DATABASE_URL. Aborting migration step.');
      process.exit(1);
    }

    const sql = readFileSync(migrationPath, 'utf8');
    console.log(`Connecting to ${new URL(dbUrl).hostname}...`);
    try {
      const { applied, total } = await applySqlViaNeonHttp(dbUrl, sql);
      console.log(`\x1b[32m✓ Applied ${applied}/${total} statements\x1b[0m`);
    } catch (e) {
      console.error(`\x1b[31m✗ Migration failed:\x1b[0m\n${e.message}`);
      process.exit(1);
    }
  } else {
    logStep('1', 'Skipping migration (--skip-migration)');
  }

  // ----- Step 2: secrets -----
  if (!skipSecrets) {
    logStep('2', 'Set QRIS-ify secrets on Cloudflare Worker');
    console.log('Worker name: ikuttes (from api/wrangler.jsonc)');
    console.log('Paste each value. Wrangler writes to the worker you select (use --env-name for staging).');

    if (isLive) {
      console.log('\x1b[33m[--live mode]\x1b[0m Switching to production. Will:\n  - Refuse test keys (qris_test_*)\n  - Refuse "DISABLED" webhook secret\n  - Delete price overrides (if any)\n');
    }

    // TEAM_046: --live requires a live key, --default accepts either.
    let apiKeyPrompt = 'QRISIFY_API_KEY (qris_live_... or qris_test_...): ';
    let apiKey = '';
    while (!apiKey) {
      apiKey = await ask(apiKeyPrompt);
      if (isLive && apiKey.startsWith('qris_test_')) {
        console.log('\x1b[31m✗ --live mode requires a qris_live_... key.\x1b[0m');
        apiKey = '';
      } else if (!apiKey) {
        console.error('API key required.');
        process.exit(1);
      }
    }
    wranglerSecretPut('QRISIFY_API_KEY', apiKey, apiDir);

    const webhookSecret = await ask('QRISIFY_WEBHOOK_SECRET (any random string, e.g. 32+ hex chars): ');
    if (!webhookSecret) { console.error('Webhook secret required.'); process.exit(1); }
    if (isLive && webhookSecret === 'DISABLED') {
      console.error('\x1b[31m✗ --live mode refuses "DISABLED" webhook secret (HMAC verify must be on for production).\x1b[0m');
      process.exit(1);
    }
    wranglerSecretPut('QRISIFY_WEBHOOK_SECRET', webhookSecret, apiDir);

    const defaultWebhookUrl = 'https://ikuttes.robimaulanaspsi.workers.dev/webhook/qris';
    const webhookUrl = await ask(`QRISIFY_WEBHOOK_URL [${defaultWebhookUrl}]: `);
    wranglerSecretPut('QRISIFY_WEBHOOK_URL', webhookUrl || defaultWebhookUrl, apiDir);

    console.log('\x1b[32m✓ All 3 secrets set\x1b[0m');

    // Optional: sandbox/testing price override.
    // Set QRISIFY_PLAN_3_DAY_AMOUNT=1 to trigger the webhook with a 1 IDR payment
    // (uses QRIS-ify /test-pay to simulate without moving real money).
    // TEAM_046: in --live mode, delete any existing override instead of asking for one.
    if (isLive) {
      console.log('\n[--live] Deleting price overrides (back to defaults 9900/19000)...');
      wranglerSecretDelete('QRISIFY_PLAN_3_DAY_AMOUNT', apiDir);
      wranglerSecretDelete('QRISIFY_PLAN_30_DAY_AMOUNT', apiDir);
    } else {
      const overridePrice = await ask('\nOverride 3-day price for sandbox testing? [leave blank to keep 9900]: ');
      if (overridePrice && /^\d+$/.test(overridePrice) && Number(overridePrice) > 0) {
        wranglerSecretPut('QRISIFY_PLAN_3_DAY_AMOUNT', overridePrice, apiDir);
        console.log(`\x1b[33m⚠ QRISIFY_PLAN_3_DAY_AMOUNT=${overridePrice} — run with --live or --reset-prices to restore defaults.\x1b[0m`);
      }
    }
  } else if (resetPrices && !skipSecrets) {
    // Edge case: --reset-prices without --skip-secrets but skipping the rest is handled above.
    // This branch runs when --skip-secrets is also set.
  }

  // ----- Step 3: deploy + verify -----
  if (resetPrices && skipSecrets) {
    // Standalone --reset-prices mode: just delete overrides, skip everything else.
    logStep('2', 'Deleting price overrides (back to defaults 9900/19000)');
    wranglerSecretDelete('QRISIFY_PLAN_3_DAY_AMOUNT', apiDir);
    wranglerSecretDelete('QRISIFY_PLAN_30_DAY_AMOUNT', apiDir);
    console.log('\x1b[32m✓ Price overrides removed\x1b[0m');
  }

  logStep('3', 'Next steps (manual)');
  console.log('  cd api && npx wrangler deploy');
  console.log('  cd ..  && npm run build && npx wrangler deploy');
  if (isLive) {
    console.log('  Update QRIS-ify dashboard:');
    console.log('    - API Key: same qris_live_xxxxx you just set');
    console.log('    - Webhook URL: https://ikuttes.robimaulanaspsi.workers.dev/webhook/qris (singular)');
    console.log('    - Webhook Secret: same as QRISIFY_WEBHOOK_SECRET');
  }
  console.log('  Then test: open the app, hit "Beli Premium", scan QR with your e-wallet, watch /webhook/qris in wrangler tail.');
  console.log('  Sandbox test: trigger /api/v1/transactions/<id>/test-pay on QRIS-ify with your qris_test_ key.');

  rl.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
