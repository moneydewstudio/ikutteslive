import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FOCUS } from './ui/Card';
import { CTA } from './ui/CTA';
import { apiFetch } from '../services/apiClient';

type PaymentStatus = 'pending' | 'confirmed' | 'expired' | 'cancelled';

type PaymentRow = {
  id: string;
  user_id: string;
  plan_type: '3_day' | '30_day' | string;
  amount_expected: number;
  status: PaymentStatus | string;
  created_at: string | null;
  expires_at: string | null;
  user_claimed_at: string | null;
};

type PaymentsResponse = { payments: PaymentRow[] };

type ConfirmBody = { adminId?: string; confirmNote?: string; transactionRef?: string };

type AdminPaymentsProps = {
  adminEmail: string;
  userEmail?: string;
};

const SCROLLBAR_HIDE = '[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden';

const AdminPayments: React.FC<AdminPaymentsProps> = ({ adminEmail, userEmail }) => {
  const [status, setStatus] = useState<PaymentStatus>('pending');
  const [query, setQuery] = useState('');
  const [claimedOnly, setClaimedOnly] = useState(false);

  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [modal, setModal] = useState<
    | null
    | {
        kind: 'confirm' | 'expire' | 'cancel';
        payment: PaymentRow;
      }
  >(null);
  const [confirmChecked, setConfirmChecked] = useState(false);
  const [note, setNote] = useState('');
  const [transactionRef, setTransactionRef] = useState('');

  const isEmailAllowed = (userEmail ?? '') === adminEmail;

  const adminFetch = useCallback(
    async (path: string, init: RequestInit = {}) => {
      // No admin key required while debugging
      return apiFetch(path, { ...init });
    },
    []
  );

  const fetchPayments = useCallback(async () => {
    if (!isEmailAllowed) {
      setError('forbidden_ui');
      setPayments([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await adminFetch(`/admin/payments?status=${encodeURIComponent(status)}`);
      if (res.status === 403) {
        setError('forbidden');
        setPayments([]);
        return;
      }
      if (!res.ok) {
        setError('unavailable');
        setPayments([]);
        return;
      }
      const json = (await res.json()) as PaymentsResponse;
      console.log('[AdminPayments] fetched', { status, response: json });
      setPayments(Array.isArray(json?.payments) ? json.payments : []);
    } catch {
      setError('unavailable');
      setPayments([]);
    } finally {
      setLoading(false);
    }
  }, [adminFetch, isEmailAllowed, status]);

  useEffect(() => {
    void fetchPayments();
  }, [fetchPayments]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return payments.filter((p) => {
      if (claimedOnly && !p.user_claimed_at) return false;
      if (!q) return true;
      return (
        String(p.amount_expected ?? '').toLowerCase().includes(q) ||
        String(p.user_id ?? '').toLowerCase().includes(q) ||
        String(p.id ?? '').toLowerCase().includes(q)
      );
    });
  }, [payments, claimedOnly, query]);

  const formatTime = (iso: string | null) => {
    if (!iso) return '-';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '-';
    return d.toLocaleString();
  };

  const onCopyAmount = async (p: PaymentRow) => {
    try {
      await navigator.clipboard.writeText(String(p.amount_expected));
    } catch {
      // ignore
    }
  };

  const runAction = async () => {
    if (!modal) return;
    const { kind, payment } = modal;

    if (kind === 'confirm' && !confirmChecked) return;

    setLoading(true);
    setError(null);
    try {
      if (kind === 'confirm') {
        const body: ConfirmBody = {
          adminId: userEmail || 'admin',
          confirmNote: note || undefined,
          transactionRef: transactionRef || undefined,
        };
        const res = await adminFetch(`/admin/payments/${encodeURIComponent(payment.id)}/confirm`, {
          method: 'POST',
          body: JSON.stringify(body),
        });
        if (res.status === 403) {
          setError('forbidden');
          return;
        }
        if (!res.ok) {
          setError('action_failed');
          return;
        }
      } else if (kind === 'expire') {
        const res = await adminFetch(`/admin/payments/${encodeURIComponent(payment.id)}/expire`, {
          method: 'POST',
          body: JSON.stringify({ adminId: userEmail || 'admin', note: note || undefined }),
        });
        if (res.status === 403) {
          setError('forbidden');
          return;
        }
        if (!res.ok) {
          setError('action_failed');
          return;
        }
      } else if (kind === 'cancel') {
        const res = await adminFetch(`/admin/payments/${encodeURIComponent(payment.id)}/cancel`, {
          method: 'POST',
          body: JSON.stringify({ adminId: userEmail || 'admin', note: note || undefined }),
        });
        if (res.status === 403) {
          setError('forbidden');
          return;
        }
        if (!res.ok) {
          setError('action_failed');
          return;
        }
      }

      setModal(null);
      setConfirmChecked(false);
      setNote('');
      setTransactionRef('');
      await fetchPayments();
    } finally {
      setLoading(false);
    }
  };

  if (!isEmailAllowed) {
    return (
      <div className="p-2xl max-w-4xl mx-auto">
        <div className="border border-black bg-white rounded-xl p-xl">
          <div className="font-black text-lg">Forbidden</div>
          <div className="text-sm text-gray-600 font-medium mt-sm">Admin panel tidak tersedia untuk akun ini.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2xl max-w-6xl mx-auto pb-xl md:pb-0">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-md mb-xl">
        <div>
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight">Admin Payments</h1>
          <div className="text-sm text-gray-600 font-medium">Konfirmasi pembayaran QRIS berdasarkan nominal persis.</div>
        </div>
      </div>

      {error ? (
        <div className="mb-lg border border-black rounded-xl p-lg bg-brand-cream">
          <div className="font-black">Error</div>
          <div className="text-sm font-medium text-gray-600 mt-xs">
            {error === 'forbidden'
              ? 'Admin key salah / belum di-set.'
              : error === 'action_failed'
                ? 'Aksi gagal. Coba refresh.'
                : error === 'unavailable'
                  ? 'Layanan tidak tersedia.'
                  : 'Terjadi kesalahan.'}
          </div>
        </div>
      ) : null}

      <div className="flex flex-col gap-md mb-lg">
        <div className={`flex gap-sm overflow-x-auto pb-xs -mx-xl px-xl md:mx-0 md:px-0 ${SCROLLBAR_HIDE}`}>
          {(['pending', 'confirmed', 'expired', 'cancelled'] as const).map((s) => (
            <button
              key={s}
              type="button"
              className={[
                'px-md py-sm text-xs font-black uppercase border border-black rounded-xl whitespace-nowrap transition-colors',
                status === s ? 'bg-brand-lime' : 'bg-white hover:bg-gray-50',
                FOCUS,
              ].join(' ')}
              onClick={() => setStatus(s)}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-sm">
          <input
            className={['border border-black rounded-xl px-md py-sm text-sm w-full sm:w-72', FOCUS].join(' ')}
            placeholder="Cari amount / userId / paymentId"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <label className="flex items-center gap-sm text-sm font-bold whitespace-nowrap">
            <input type="checkbox" checked={claimedOnly} onChange={(e) => setClaimedOnly(e.target.checked)} />
            Claimed only
          </label>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block border border-black rounded-xl overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full text-left">
            <thead className="bg-gray-50 border-b border-black">
              <tr>
                <th className="p-md text-xs font-black uppercase">Amount</th>
                <th className="p-md text-xs font-black uppercase">Plan</th>
                <th className="p-md text-xs font-black uppercase">User</th>
                <th className="p-md text-xs font-black uppercase">Created</th>
                <th className="p-md text-xs font-black uppercase">Expires</th>
                <th className="p-md text-xs font-black uppercase">Claimed</th>
                <th className="p-md text-xs font-black uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((p) => {
                const canAct = String(p.status) === 'pending';
                return (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="p-md">
                      <div className="flex items-center gap-sm">
                        <div className="font-black">Rp {Number(p.amount_expected).toLocaleString('id-ID')}</div>
                        <button
                          type="button"
                          className={['text-xs font-bold underline', FOCUS].join(' ')}
                          onClick={() => void onCopyAmount(p)}
                          title="Copy amount"
                        >
                          Copy
                        </button>
                      </div>
                      <div className="text-xs text-gray-600 font-medium break-all">{p.id}</div>
                    </td>
                    <td className="p-md text-sm font-bold">{p.plan_type}</td>
                    <td className="p-md">
                      <div className="text-sm font-bold break-all">{p.user_id}</div>
                    </td>
                    <td className="p-md text-xs font-medium text-gray-600">{formatTime(p.created_at)}</td>
                    <td className="p-md text-xs font-medium text-gray-600">{formatTime(p.expires_at)}</td>
                    <td className="p-md text-xs font-medium text-gray-600">{formatTime(p.user_claimed_at)}</td>
                    <td className="p-md">
                      <div className="flex gap-sm">
                        <CTA
                          size="sm"
                          variant="accent"
                          disabled={!canAct}
                          onClick={() => {
                            setModal({ kind: 'confirm', payment: p });
                            setConfirmChecked(false);
                            setNote('');
                            setTransactionRef('');
                          }}
                        >
                          Confirm
                        </CTA>
                        <CTA
                          size="sm"
                          variant="secondary"
                          disabled={!canAct}
                          onClick={() => {
                            setModal({ kind: 'expire', payment: p });
                            setConfirmChecked(false);
                            setNote('');
                            setTransactionRef('');
                          }}
                        >
                          Expire
                        </CTA>
                        <CTA
                          size="sm"
                          variant="secondary"
                          disabled={!canAct}
                          onClick={() => {
                            setModal({ kind: 'cancel', payment: p });
                            setConfirmChecked(false);
                            setNote('');
                            setTransactionRef('');
                          }}
                        >
                          Cancel
                        </CTA>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {!filtered.length ? (
                <tr>
                  <td className="p-xl text-sm font-medium text-gray-600" colSpan={7}>
                    {loading ? 'Memuat...' : 'Tidak ada data.'}
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-md">
        {filtered.map((p) => {
          const canAct = String(p.status) === 'pending';
          return (
            <div key={p.id} className="border border-black rounded-xl bg-white p-lg space-y-md">
              <div className="flex items-start justify-between gap-sm">
                <div>
                  <div className="flex items-center gap-sm">
                    <div className="font-black text-lg">Rp {Number(p.amount_expected).toLocaleString('id-ID')}</div>
                    <button
                      type="button"
                      className={['text-xs font-bold underline text-gray-600', FOCUS].join(' ')}
                      onClick={() => void onCopyAmount(p)}
                      title="Copy amount"
                    >
                      Copy
                    </button>
                  </div>
                  <div className="text-xs text-gray-500 font-medium break-all mt-xs">{p.id}</div>
                </div>
                <span className={`text-xs font-black uppercase px-sm py-xs rounded border ${
                  p.status === 'pending' ? 'bg-brand-lime border-black text-black' :
                  p.status === 'confirmed' ? 'bg-feedback-green border-black text-black' :
                  p.status === 'expired' ? 'bg-gray-100 border-black text-black' :
                  'bg-feedback-red border-black text-black'
                }`}>
                  {p.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-sm text-sm">
                <div>
                  <div className="text-xs text-gray-500 font-medium">Plan</div>
                  <div className="font-bold">{p.plan_type}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-medium">Claimed</div>
                  <div className="font-medium">{formatTime(p.user_claimed_at)}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-xs text-gray-500 font-medium">User ID</div>
                  <div className="text-xs font-medium break-all">{p.user_id}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-medium">Created</div>
                  <div className="text-xs font-medium">{formatTime(p.created_at)}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-medium">Expires</div>
                  <div className="text-xs font-medium">{formatTime(p.expires_at)}</div>
                </div>
              </div>

              <div className="flex flex-col gap-sm pt-sm border-t border-gray-100">
                <CTA
                  size="sm"
                  variant="accent"
                  disabled={!canAct}
                  className="w-full"
                  onClick={() => {
                    setModal({ kind: 'confirm', payment: p });
                    setConfirmChecked(false);
                    setNote('');
                    setTransactionRef('');
                  }}
                >
                  Confirm Payment
                </CTA>
                <div className="flex gap-sm">
                  <CTA
                    size="sm"
                    variant="secondary"
                    disabled={!canAct}
                    className="flex-1"
                    onClick={() => {
                      setModal({ kind: 'expire', payment: p });
                      setConfirmChecked(false);
                      setNote('');
                      setTransactionRef('');
                    }}
                  >
                    Expire
                  </CTA>
                  <CTA
                    size="sm"
                    variant="secondary"
                    disabled={!canAct}
                    className="flex-1"
                    onClick={() => {
                      setModal({ kind: 'cancel', payment: p });
                      setConfirmChecked(false);
                      setNote('');
                      setTransactionRef('');
                    }}
                  >
                    Cancel
                  </CTA>
                </div>
              </div>
            </div>
          );
        })}
        {!filtered.length ? (
          <div className="p-xl text-sm font-medium text-gray-600 text-center border border-black rounded-xl bg-white">
            {loading ? 'Memuat...' : 'Tidak ada data.'}
          </div>
        ) : null}
      </div>

      {modal ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-lg overflow-y-auto">
          <div className="w-full max-w-lg border border-black rounded-xl bg-white p-lg my-auto">
            <div className="flex items-start justify-between gap-md">
              <div className="min-w-0 flex-1">
                <div className="font-black text-base md:text-lg uppercase">
                  {modal.kind === 'confirm' ? 'Confirm Payment' : modal.kind === 'expire' ? 'Expire Payment' : 'Cancel Payment'}
                </div>
                <div className="text-sm text-gray-600 font-medium mt-xs">
                  Nominal: <span className="font-black">Rp {Number(modal.payment.amount_expected).toLocaleString('id-ID')}</span>
                </div>
                <div className="text-xs text-gray-600 font-medium mt-xs break-all">Payment ID: {modal.payment.id}</div>
                <div className="text-xs text-gray-600 font-medium mt-xs break-all">User ID: {modal.payment.user_id}</div>
                <div className="text-xs text-gray-600 font-medium mt-xs">Plan: {modal.payment.plan_type}</div>
                <div className="text-xs text-gray-600 font-medium mt-xs">Created: {formatTime(modal.payment.created_at)}</div>
                <div className="text-xs text-gray-600 font-medium mt-xs">Expires: {formatTime(modal.payment.expires_at)}</div>
                <div className="text-xs text-gray-600 font-medium mt-xs">Claimed: {formatTime(modal.payment.user_claimed_at)}</div>
              </div>

              <button
                type="button"
                className={['text-xs font-black uppercase border border-black rounded-xl px-sm py-xs shrink-0 hover:bg-gray-100 transition-colors', FOCUS].join(' ')}
                onClick={() => {
                  setModal(null);
                  setConfirmChecked(false);
                  setNote('');
                  setTransactionRef('');
                }}
              >
                Close
              </button>
            </div>

            {modal.kind === 'confirm' ? (
              <div className="mt-lg">
                <label className="flex items-start gap-sm text-sm font-bold">
                  <input
                    type="checkbox"
                    checked={confirmChecked}
                    onChange={(e) => setConfirmChecked(e.target.checked)}
                  />
                  <span className="leading-tight">Saya sudah cek transaksi masuk dengan nominal yang sama persis</span>
                </label>
                <div className="mt-md grid grid-cols-1 gap-sm">
                  <input
                    className={['border border-black rounded-xl px-md py-sm text-sm', FOCUS].join(' ')}
                    placeholder="Transaction ref (optional)"
                    value={transactionRef}
                    onChange={(e) => setTransactionRef(e.target.value)}
                  />
                  <textarea
                    className={['border border-black rounded-xl px-md py-sm text-sm', FOCUS].join(' ')}
                    placeholder="Catatan (optional)"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={2}
                  />
                </div>
              </div>
            ) : (
              <div className="mt-lg">
                <textarea
                  className={['border border-black rounded-xl px-md py-sm text-sm w-full', FOCUS].join(' ')}
                  placeholder="Catatan (optional)"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={2}
                />
              </div>
            )}

            <div className="mt-xl flex flex-col sm:flex-row gap-sm sm:justify-end">
              <CTA
                variant={modal.kind === 'confirm' ? 'accent' : 'secondary'}
                onClick={() => void runAction()}
                disabled={modal.kind === 'confirm' ? !confirmChecked || loading : loading}
                className="w-full sm:w-auto"
              >
                {loading ? 'Memproses...' : modal.kind === 'confirm' ? 'Confirm' : modal.kind === 'expire' ? 'Expire' : 'Cancel'}
              </CTA>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default React.memo(AdminPayments);