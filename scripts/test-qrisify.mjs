const NEON_URL = 'postgresql://neondb_owner:npg_IiMFKka4o6pw@ep-polished-rain-a1fl6wek-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
const QRISIFY_KEY = 'qris_test_OSHOyF_gGhCPdxZM76oh5-tqZLLgbepc';

// 1. Query DB via fetch wrapper (Neon serverless driver)
const neonRes = await fetch('https://ep-polished-rain-a1fl6wek-pooler.ap-southeast-1.aws.neon.tech/sql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Neon-Connection-String': NEON_URL,
  },
  body: JSON.stringify({
    query: "SELECT qrisify_transaction_id FROM payments WHERE status='pending' ORDER BY created_at DESC LIMIT 1",
    params: [],
  }),
});
const { rows } = await neonRes.json();
const txn = rows?.[0]?.qrisify_transaction_id;
if (!txn) { console.error('No pending payment found'); process.exit(1); }
console.log('Found transaction:', txn);

// 2. Trigger test-pay
const testPayRes = await fetch(`https://qrisify.adihub.my.id/api/v1/transactions/${txn}/test-pay`, {
  method: 'POST',
  headers: { 'x-api-key': QRISIFY_KEY },
});
console.log('test-pay status:', testPayRes.status);
console.log('test-pay body:', await testPayRes.text());