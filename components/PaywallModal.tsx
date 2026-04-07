import React, { useEffect, useMemo, useState } from 'react';
import Button from './Button';
import { createPayment, getEntitlements, type Offer } from '../services/payments';

type PaywallModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onPaymentCreated: (args: { paymentId: string; planType: '3_day' | '30_day' }) => void;
  trigger?: string;
};

const formatRupiah = (amount: number) => `Rp ${amount.toLocaleString('id-ID')}`;

const PaywallModal: React.FC<PaywallModalProps> = ({ isOpen, onClose, onPaymentCreated, trigger }) => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(false);
  const [creatingPlan, setCreatingPlan] = useState<'3_day' | '30_day' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [serverTrigger, setServerTrigger] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    // TEAM_024: paywall offer reveal is backend-driven; fetch offers on open.
    let cancelled = false;
    setLoading(true);
    setError(null);
    void (async () => {
      try {
        const ent = await getEntitlements();
        const nextOffers = Array.isArray(ent?.offers) ? ent.offers : [];
        if (!cancelled) {
          setOffers(nextOffers);
          setServerTrigger(typeof ent?.paywallTrigger === 'string' ? ent.paywallTrigger : null);
        }
      } catch (e) {
        if (!cancelled) {
          setOffers([{ planType: '3_day', price: 9900, anchorPrice: 59000 }]);
          const msg = e instanceof Error ? e.message : '';
          setError(msg === 'unauthenticated' ? 'unauthenticated' : 'unavailable');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  const offerMap = useMemo(() => {
    const map = new Map<string, Offer>();
    for (const o of offers) map.set(o.planType, o);
    return map;
  }, [offers]);

  const show30Day = offerMap.has('30_day');
  const anchorPrice = offerMap.get('3_day')?.anchorPrice ?? 59000;
  const effectiveTrigger = serverTrigger ?? trigger ?? null;
  const isUnauthenticated = error === 'unauthenticated';

  const handleUnlock = async (planType: '3_day' | '30_day') => {
    if (creatingPlan) return;
    setCreatingPlan(planType);
    setError(null);
    try {
      const p = await createPayment(planType);
      onPaymentCreated({ paymentId: p.paymentId, planType });
    } catch (e) {
      const msg = e instanceof Error ? e.message : '';
      setError(msg === 'unauthenticated' ? 'unauthenticated' : 'create_failed');
    } finally {
      setCreatingPlan(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 p-3">
      <div className="w-full max-w-lg border border-black rounded-2xl bg-white overflow-hidden">
        <div className="p-5 border-b border-black bg-gray-50">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="font-black text-xl uppercase">{isUnauthenticated ? 'Buat Akun Dulu' : 'Buka Pembahasan'}</div>
              <div className="text-sm font-medium text-gray-700 mt-1">
                {isUnauthenticated
                  ? 'Kamu belum buat akun. Buat akun dulu, ya!'
                  : 'Pembahasan hanya untuk Premium. Bayar 3 hari dulu biar cepat paham dan tidak mengulang kesalahan.'}
              </div>
              {effectiveTrigger ? (
                <div className="text-[11px] font-bold text-gray-500 mt-2">Trigger: {effectiveTrigger}</div>
              ) : null}
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
          <div className="flex items-center gap-2 mb-4">
            <div className="text-sm font-bold text-gray-600 line-through">{formatRupiah(anchorPrice)}</div>
            <div className="text-xs font-black uppercase px-2 py-1 border border-black rounded-full bg-brand-lime">Diskon</div>
          </div>

          {error ? (
            <div className="mb-4 border border-black rounded-xl p-3 bg-brand-cream">
              <div className="font-black">{error === 'unauthenticated' ? 'Akun diperlukan' : 'Error'}</div>
              <div className="text-sm font-medium text-gray-700 mt-1">
                {error === 'unauthenticated'
                  ? 'Kamu belum buat akun. Buat akun dulu, ya!'
                  : error === 'create_failed'
                    ? 'Gagal membuat pembayaran. Coba lagi.'
                    : 'Layanan tidak tersedia.'}
              </div>
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-3">
            <div className="border border-black rounded-xl p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-black text-lg">3-Day Sprint Pass</div>
                  <div className="text-sm font-medium text-gray-700 mt-1">Pembahasan + review kesalahan selama 3 hari.</div>
                </div>
                <div className="font-black text-lg">{formatRupiah(offerMap.get('3_day')?.price ?? 9900)}</div>
              </div>
              <div className="mt-3">
                <Button
                  variant="black"
                  fullWidth
                  isLoading={creatingPlan === '3_day'}
                  onClick={() => void handleUnlock('3_day')}
                >
                  Unlock 3-Day
                </Button>
              </div>
            </div>

            {show30Day ? (
              <div className="border border-black rounded-xl p-4 bg-gray-50">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-black text-lg">30-Day Full Access</div>
                    <div className="text-sm font-medium text-gray-700 mt-1">Mode serius: pembahasan penuh 30 hari.</div>
                  </div>
                  <div className="font-black text-lg">{formatRupiah(offerMap.get('30_day')?.price ?? 19000)}</div>
                </div>
                <div className="mt-3">
                  <Button
                    variant="outline"
                    fullWidth
                    isLoading={creatingPlan === '30_day'}
                    onClick={() => void handleUnlock('30_day')}
                  >
                    Unlock 30-Day
                  </Button>
                </div>
              </div>
            ) : null}
          </div>

          {loading ? (
            <div className="mt-4 text-xs font-bold text-gray-500">Memuat penawaran...</div>
          ) : null}

          <div className="mt-4 text-xs text-gray-600 font-medium">
            Bayar persis sesuai nominal agar otomatis terdeteksi.
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PaywallModal);
