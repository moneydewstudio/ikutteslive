import { apiFetch } from './apiClient';

export type Offer = {
  planType: '3_day' | '30_day';
  price: number;
  anchorPrice?: number;
};

export type EntitlementsResponse = {
  isPremium: boolean;
  premiumExpiresAt: string | null;
  offers: Offer[];
  paywallTrigger?: string | null;
};

export async function getEntitlements(): Promise<EntitlementsResponse> {
  const res = await apiFetch('/me/entitlements');
  if (!res.ok) throw new Error('Failed to load entitlements');
  return res.json();
}

export type CreatePaymentResponse = {
  paymentId: string;
  amountExpected: number;
  expiresAt: string;
  status: 'pending';
};

export async function createPayment(planType: '3_day' | '30_day'): Promise<CreatePaymentResponse> {
  const res = await apiFetch('/payments', {
    method: 'POST',
    body: JSON.stringify({ planType }),
  });
  if (res.status === 409) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error || 'busy_try_again');
  }
  if (!res.ok) throw new Error('Failed to create payment');
  return res.json();
}

export type PaymentStatus = 'pending' | 'confirmed' | 'expired' | 'cancelled';

export type PaymentResponse = {
  id: string;
  planType: '3_day' | '30_day' | string;
  amountExpected: number;
  status: PaymentStatus;
  createdAt: string | null;
  expiresAt: string | null;
  userClaimedAt: string | null;
};

export async function getPayment(paymentId: string): Promise<PaymentResponse> {
  const res = await apiFetch(`/payments/${encodeURIComponent(paymentId)}`);
  if (!res.ok) throw new Error('Failed to load payment');
  return res.json();
}

export async function claimPayment(paymentId: string): Promise<void> {
  console.log('[claimPayment] sending claim for', { paymentId });
  const res = await apiFetch(`/payments/${encodeURIComponent(paymentId)}/claim`, { method: 'POST' });
  console.log('[claimPayment] response', { status: res.status, ok: res.ok });
  if (!res.ok) throw new Error('Failed to claim payment');
}

export async function cancelPayment(paymentId: string): Promise<void> {
  const res = await apiFetch(`/payments/${encodeURIComponent(paymentId)}/cancel`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to cancel payment');
}
