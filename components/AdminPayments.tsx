import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Button from './Button';
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
      <div className="p-8 max-w-4xl mx-auto">
        <div className="border border-black bg-white rounded-xl p-6">
          <div className="font-black text-lg">Forbidden</div>
          <div className="text-sm text-gray-600 font-medium mt-2">Admin panel tidak tersedia untuk akun ini.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2xl max-w-6xl mx-auto pb-24 md:pb-0">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight">Admin Payments</h1>
          <div className="text-sm text-gray-600 font-medium">Konfirmasi pembayaran QRIS berdasarkan nominal persis.</div>
        </div>
      </div>

      {error ? (
        <div className="mb-4 border border-black rounded-xl p-4 bg-brand-cream">
          <div className="font-black">Error</div>
          <div className="text-sm font-medium text-gray-700 mt-1">
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

      <div className="flex flex-col gap-3 mb-4">
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-6 px-6 md:mx-0 md:px-0 scrollbar-hide">
          {(['pending', 'confirmed', 'expired', 'cancelled'] as const).map((s) => (
            <button
              key={s}
              className={`px-3 py-2 text-xs font-black uppercase border border-black rounded-lg whitespace-nowrap ${
                status === s ? 'bg-brand-lime' : 'bg-white'
              }`}
              onClick={() => setStatus(s)}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            className="border border-black rounded-lg px-3 py-2 text-sm w-full sm:w-72"
            placeholder="Cari amount / userId / paymentId"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <label className="flex items-center gap-2 text-sm font-bold whitespace-nowrap">
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
                <th className="p-3 text-xs font-black uppercase">Amount</th>
                <th className="p-3 text-xs font-black uppercase">Plan</th>
                <th className="p-3 text-xs font-black uppercase">User</th>
                <th className="p-3 text-xs font-black uppercase">Created</th>
                <th className="p-3 text-xs font-black uppercase">Expires</th>
                <th className="p-3 text-xs font-black uppercase">Claimed</th>
                <th className="p-3 text-xs font-black uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((p) => {
                const canAct = String(p.status) === 'pending';
                return (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="font-black">Rp {Number(p.amount_expected).toLocaleString('id-ID')}</div>
                        <button
                          className="text-xs font-bold underline"
                          onClick={() => void onCopyAmount(p)}
                          title="Copy amount"
                        >
                          Copy
                        </button>
                      </div>
                      <div className="text-[11px] text-gray-600 font-medium break-all">{p.id}</div>
                    </td>
                    <td className="p-3 text-sm font-bold">{p.plan_type}</td>
                    <td className="p-3">
                      <div className="text-sm font-bold break-all">{p.user_id}</div>
                    </td>
                    <td className="p-3 text-xs font-medium text-gray-700">{formatTime(p.created_at)}</td>
                    <td className="p-3 text-xs font-medium text-gray-700">{formatTime(p.expires_at)}</td>
                    <td className="p-3 text-xs font-medium text-gray-700">{formatTime(p.user_claimed_at)}</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="lime"
                          disabled={!canAct}
                          onClick={() => {
                            setModal({ kind: 'confirm', payment: p });
                            setConfirmChecked(false);
                            setNote('');
                            setTransactionRef('');
                          }}
                        >
                          Confirm
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={!canAct}
                          onClick={() => {
                            setModal({ kind: 'expire', payment: p });
                            setConfirmChecked(false);
                            setNote('');
                            setTransactionRef('');
                          }}
                        >
                          Expire
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={!canAct}
                          onClick={() => {
                            setModal({ kind: 'cancel', payment: p });
                            setConfirmChecked(false);
                            setNote('');
                            setTransactionRef('');
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {!filtered.length ? (
                <tr>
                  <td className="p-6 text-sm font-medium text-gray-600" colSpan={7}>
                    {loading ? 'Memuat...' : 'Tidak ada data.'}
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {filtered.map((p) => {
          const canAct = String(p.status) === 'pending';
          return (
            <div key={p.id} className="border border-black rounded-xl bg-white p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="font-black text-lg">Rp {Number(p.amount_expected).toLocaleString('id-ID')}</div>
                    <button
                      className="text-xs font-bold underline text-gray-600"
                      onClick={() => void onCopyAmount(p)}
                      title="Copy amount"
                    >
                      Copy
                    </button>
                  </div>
                  <div className="text-[11px] text-gray-500 font-medium break-all mt-1">{p.id}</div>
                </div>
                <span className={`text-xs font-black uppercase px-2 py-1 rounded border ${
                  p.status === 'pending' ? 'bg-yellow-100 border-yellow-400 text-yellow-800' :
                  p.status === 'confirmed' ? 'bg-green-100 border-green-400 text-green-800' :
                  p.status === 'expired' ? 'bg-gray-100 border-gray-400 text-gray-600' :
                  'bg-red-100 border-red-400 text-red-800'
                }`}>
                  {p.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
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

              <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
                <Button
                  size="sm"
                  variant="lime"
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
                </Button>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
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
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
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
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
        {!filtered.length ? (
          <div className="p-6 text-sm font-medium text-gray-600 text-center border border-black rounded-xl bg-white">
            {loading ? 'Memuat...' : 'Tidak ada data.'}
          </div>
        ) : null}
      </div>

      {modal ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 overflow-y-auto">
          <div className="w-full max-w-lg border border-black rounded-xl bg-white p-5 my-auto">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="font-black text-base md:text-lg uppercase">
                  {modal.kind === 'confirm' ? 'Confirm Payment' : modal.kind === 'expire' ? 'Expire Payment' : 'Cancel Payment'}
                </div>
                <div className="text-sm text-gray-700 font-medium mt-1">
                  Nominal: <span className="font-black">Rp {Number(modal.payment.amount_expected).toLocaleString('id-ID')}</span>
                </div>
                <div className="text-xs text-gray-600 font-medium mt-1 break-all">Payment ID: {modal.payment.id}</div>
                <div className="text-xs text-gray-600 font-medium mt-1 break-all">User ID: {modal.payment.user_id}</div>
                <div className="text-xs text-gray-600 font-medium mt-1">Plan: {modal.payment.plan_type}</div>
                <div className="text-xs text-gray-600 font-medium mt-1">Created: {formatTime(modal.payment.created_at)}</div>
                <div className="text-xs text-gray-600 font-medium mt-1">Expires: {formatTime(modal.payment.expires_at)}</div>
                <div className="text-xs text-gray-600 font-medium mt-1">Claimed: {formatTime(modal.payment.user_claimed_at)}</div>
              </div>

              <button
                className="text-xs font-black uppercase border border-black rounded-lg px-2 py-1 shrink-0"
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
              <div className="mt-4">
                <label className="flex items-start gap-2 text-sm font-bold">
                  <input
                    type="checkbox"
                    checked={confirmChecked}
                    onChange={(e) => setConfirmChecked(e.target.checked)}
                  />
                  <span className="leading-tight">Saya sudah cek transaksi masuk dengan nominal yang sama persis</span>
                </label>
                <div className="mt-3 grid grid-cols-1 gap-2">
                  <input
                    className="border border-black rounded-lg px-3 py-2 text-sm"
                    placeholder="Transaction ref (optional)"
                    value={transactionRef}
                    onChange={(e) => setTransactionRef(e.target.value)}
                  />
                  <textarea
                    className="border border-black rounded-lg px-3 py-2 text-sm"
                    placeholder="Catatan (optional)"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={2}
                  />
                </div>
              </div>
            ) : (
              <div className="mt-4">
                <textarea
                  className="border border-black rounded-lg px-3 py-2 text-sm w-full"
                  placeholder="Catatan (optional)"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={2}
                />
              </div>
            )}

            <div className="mt-5 flex flex-col sm:flex-row gap-2 sm:justify-end">
              <Button
                variant={modal.kind === 'confirm' ? 'lime' : 'outline'}
                onClick={() => void runAction()}
                disabled={modal.kind === 'confirm' ? !confirmChecked : false}
                isLoading={loading}
                className="w-full sm:w-auto"
              >
                {modal.kind === 'confirm' ? 'Confirm' : modal.kind === 'expire' ? 'Expire' : 'Cancel'}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default React.memo(AdminPayments);
