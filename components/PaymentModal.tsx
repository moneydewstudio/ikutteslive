import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Button from './Button';
import { cancelPayment, claimPayment, createPayment, getPayment, type PaymentResponse, type PaymentStatus } from '../services/payments';

type PaymentModalProps = {
  isOpen: boolean;
  paymentId: string;
  planType: '3_day' | '30_day';
  onClose: () => void;
  onPaymentIdChange: (nextPaymentId: string) => void;
  onConfirmed: () => Promise<void> | void;
};

const formatRupiah = (amount: number) => `Rp ${amount.toLocaleString('id-ID')}`;

const msUntil = (iso: string | null) => {
  if (!iso) return 0;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return 0;
  return d.getTime() - Date.now();
};

const formatCountdown = (ms: number) => {
  const s = Math.max(0, Math.floor(ms / 1000));
  const mm = String(Math.floor(s / 60)).padStart(2, '0');
  const ss = String(s % 60).padStart(2, '0');
  return `${mm}:${ss}`;
};

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  paymentId,
  planType,
  onClose,
  onPaymentIdChange,
  onConfirmed,
}) => {
  const [payment, setPayment] = useState<PaymentResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [claimed, setClaimed] = useState(false);
  const [nowTick, setNowTick] = useState(0);

  const refresh = useCallback(async (): Promise<PaymentResponse | null> => {
    setError(null);
    try {
      const p = await getPayment(paymentId);
      setPayment(p);
      const st = String(p.status) as PaymentStatus;
      if (st === 'confirmed') {
        await onConfirmed();
      }
      return p;
    } catch {
      setError('unavailable');
      return null;
    }
  }, [onConfirmed, paymentId]);

  useEffect(() => {
    if (!isOpen) return;
    setClaimed(false);
    setPayment(null);
    void refresh();
  }, [isOpen, refresh]);

  useEffect(() => {
    if (!isOpen) return;
    const t = window.setInterval(() => setNowTick((x) => x + 1), 1000);
    return () => window.clearInterval(t);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    if (!paymentId) return;

    // TEAM_024: poll payment status while pending (and especially after claim).
    let stopped = false;
    const t = window.setInterval(() => {
      void (async () => {
        if (stopped) return;
        const p = await refresh();
        const st = String(p?.status ?? 'pending');
        if (st !== 'pending') {
          window.clearInterval(t);
          stopped = true;
        }
      })();
    }, claimed ? 2500 : 4000);

    return () => {
      stopped = true;
      window.clearInterval(t);
    };
  }, [isOpen, paymentId, claimed, refresh]);

  const countdownMs = useMemo(() => {
    const iso = payment?.expiresAt ?? null;
    return msUntil(iso);
  }, [payment?.expiresAt, nowTick]);

  const status = String(payment?.status ?? 'pending') as PaymentStatus;
  const isExpired = status === 'expired' || countdownMs <= 0;

  const handleClaim = async () => {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      await claimPayment(paymentId);
      setClaimed(true);
      await refresh();
    } catch {
      setError('claim_failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRecreate = async () => {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      await cancelPayment(paymentId);
      const created = await createPayment(planType);
      onPaymentIdChange(created.paymentId);
    } catch {
      setError('recreate_failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      await cancelPayment(paymentId);
      onClose();
    } catch {
      setError('cancel_failed');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 p-3">
      <div className="w-full max-w-lg border border-black rounded-2xl bg-white overflow-hidden">
        <div className="p-5 border-b border-black bg-gray-50">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="font-black text-xl uppercase">Pembayaran QRIS</div>
              <div className="text-sm font-medium text-gray-700 mt-1">Bayar persis sesuai nominal agar otomatis terdeteksi.</div>
            </div>
            <button
              className="text-xs font-black uppercase border border-black rounded-lg px-2 py-1"
              onClick={onClose}
            >
              Tutup
            </button>
          </div>
        </div>

        <div className="p-5">
          {error ? (
            <div className="mb-4 border border-black rounded-xl p-3 bg-brand-cream">
              <div className="font-black">Error</div>
              <div className="text-sm font-medium text-gray-700 mt-1">
                {error === 'claim_failed'
                  ? 'Gagal mengirim status. Coba lagi.'
                  : error === 'recreate_failed'
                    ? 'Gagal membuat ulang pembayaran.'
                    : error === 'cancel_failed'
                      ? 'Gagal membatalkan pembayaran.'
                      : 'Layanan tidak tersedia.'}
              </div>
            </div>
          ) : null}

          <div className="border border-black rounded-xl p-4 bg-white">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-black uppercase text-gray-500">Nominal</div>
                <div className="font-black text-2xl">{formatRupiah(payment?.amountExpected ?? 0)}</div>
              </div>
              <div className="text-right">
                <div className="text-xs font-black uppercase text-gray-500">Sisa waktu</div>
                <div className={`font-black text-2xl ${isExpired ? 'text-red-600' : ''}`}>{formatCountdown(countdownMs)}</div>
              </div>
            </div>

            <div className="mt-4 border border-black rounded-xl bg-gray-50 p-4 flex items-center justify-center">
              <div className="text-center">
                <img src="/AdWdkD345CkD.jpeg" alt="QRIS" className="w-56 h-56 object-contain mx-auto" />
              </div>
            </div>

            <div className="mt-3 text-[11px] text-gray-600 font-medium break-all">Payment ID: {paymentId}</div>
            <div className="mt-1 text-[11px] text-gray-600 font-medium">Status: {status}</div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-2">
            <Button variant="black" fullWidth isLoading={loading} disabled={isExpired || status !== 'pending'} onClick={() => void handleClaim()}>
              Saya sudah bayar
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" fullWidth isLoading={loading} onClick={() => void handleRecreate()}>
                Buat ulang
              </Button>
              <Button variant="outline" fullWidth isLoading={loading} onClick={() => void handleCancel()}>
                Batal
              </Button>
            </div>
          </div>

          {claimed ? (
            <div className="mt-4 border border-black rounded-xl p-3 bg-brand-lime">
              <div className="font-black">Menunggu konfirmasi</div>
              <div className="text-sm font-medium text-gray-700 mt-1">Biasanya 1–5 menit. Panel admin akan mengkonfirmasi setelah nominal cocok.</div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default React.memo(PaymentModal);
