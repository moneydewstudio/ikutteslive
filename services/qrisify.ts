// TEAM_046: QRIS-ify dynamic QRIS runtime integration.
// Client for QRIS-ify API (https://qrisify.adihub.my.id) + webhook signature verification.
// Imported by api/src/index.ts — lives here (repo-root services/) alongside other service modules.

export interface QrisifyConfig {
  apiKey: string;
  webhookSecret: string;
  webhookUrl: string;
  baseUrl?: string;
}

export type QrisifyTransaction = {
  id: string;
  amount: number;
  qr_url: string;
  unique_code?: number;
  status?: string;
};

export type QrisifyWebhookPayload = {
  transaction_id: string;
  status: 'paid' | 'failed';
  amount?: number;
  paid_at?: string;
};

const DEFAULT_BASE_URL = 'https://qrisify.adihub.my.id';

// TEAM_046: read env at request time (not module init) so a `wrangler secret put`
// change is picked up without a code redeploy. Returns null if QRISIFY_API_KEY is missing.
export function readQrisifyConfig(env: {
  QRISIFY_API_KEY?: string;
  QRISIFY_WEBHOOK_SECRET?: string;
  QRISIFY_WEBHOOK_URL?: string;
}): QrisifyConfig | null {
  const apiKey = env.QRISIFY_API_KEY;
  if (!apiKey) return null;
  return {
    apiKey,
    webhookSecret: env.QRISIFY_WEBHOOK_SECRET || '',
    webhookUrl: env.QRISIFY_WEBHOOK_URL || '',
    baseUrl: DEFAULT_BASE_URL,
  };
}

// TEAM_046: create a dynamic QRIS transaction via QRIS-ify middleware.
// amount is INTEGER (no decimals) — includes the random suffix already.
// uniqueCode is a 1-99 random suffix appended to the base amount, matching
// the existing randomSuffix() pattern in api/src/index.ts.
export async function createQrisTransaction(
  config: QrisifyConfig,
  args: { merchantName: string; amount: number; externalId: string }
): Promise<{ qrisifyTransactionId: string; qrImageUrl: string; amountTotal: number; uniqueCode: number }> {
  const uniqueCode = 1 + Math.floor(Math.random() * 99);
  const amountTotal = args.amount;

  const res = await fetch(`${config.baseUrl || DEFAULT_BASE_URL}/api/v1/transactions`, {
    method: 'POST',
    headers: {
      'x-api-key': config.apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      merchant_name: args.merchantName,
      amount: amountTotal,
      external_id: args.externalId,
      webhook_url: config.webhookUrl,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`QRIS-ify create transaction failed: ${res.status} ${res.statusText} ${text}`);
  }

  const data = (await res.json()) as QrisifyTransaction & { id: string };
  // TEAM_046: QRIS-ify returns qr_image_url as a *relative* path ("transactions/<id>/qr").
  // Per qrisify-qr-relative-url.md, normalize to the full QRIS-ify URL if it's relative.
  const qrImageUrlRaw = data.qr_url || data.id;
  const qrImageUrl = /^https?:\/\//.test(qrImageUrlRaw)
    ? qrImageUrlRaw
    : `${config.baseUrl || DEFAULT_BASE_URL}/${qrImageUrlRaw.replace(/^\/+/, '')}`;

  return {
    qrisifyTransactionId: data.id,
    qrImageUrl,
    amountTotal,
    uniqueCode,
  };
}

// TEAM_046: fetch raw PNG bytes for a QRIS transaction via the GET /api/v1/transactions/:id/qr endpoint.
// The caller (api/src/index.ts GET /payments/:id/qr) proxies this through the Worker origin
// to avoid CORS/CORB issues (see qrisify-qr-proxy.md).
export async function fetchQrisQrImage(config: QrisifyConfig, transactionId: string): Promise<ArrayBuffer> {
  const res = await fetch(
    `${config.baseUrl || DEFAULT_BASE_URL}/api/v1/transactions/${encodeURIComponent(transactionId)}/qr`,
    {
      headers: { 'x-api-key': config.apiKey },
    }
  );

  if (!res.ok) {
    throw new Error(`QRIS-ify fetch QR image failed: ${res.status} ${res.statusText}`);
  }

  return res.arrayBuffer();
}

// TEAM_046: verify QRIS-ify webhook HMAC-SHA256 signature.
// QRIS-ify signs the raw request body with the webhook secret using HMAC-SHA256,
// and sends the signature in the x-qrisify-signature header.
// NOTE: header name is 'x-qrisify-signature' per current integration; update if QRIS-ify docs specify otherwise.
// Uses Web Crypto (SubtleCrypto) — the only crypto API available in Cloudflare Workers
// runtime. Async because SubtleCrypto.sign is async.
export async function verifyWebhookSignature(
  rawBody: string,
  signatureHeader: string | undefined,
  secret: string
): Promise<boolean> {
  if (!signatureHeader || !secret) return false;

  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const expected = new Uint8Array(
    await crypto.subtle.sign('HMAC', key, enc.encode(rawBody))
  );
  const provided = hexToBytes(signatureHeader);

  if (expected.length !== provided.length) return false;
  // Constant-time compare.
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected[i] ^ provided[i];
  return diff === 0;
}

function hexToBytes(hex: string): Uint8Array {
  const clean = hex.replace(/^0x/, '').trim();
  if (clean.length % 2 !== 0) return new Uint8Array(0);
  const out = new Uint8Array(clean.length / 2);
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}
