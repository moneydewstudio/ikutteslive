import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import PaywallModal from '../../components/PaywallModal';
import PaymentModal from '../../components/PaymentModal';
import { track } from '../../services/analytics';

// TEAM_027: Global paywall provider so any feature can open the same PaywallModal + PaymentModal flow
// TEAM_048: Removed guest early-return so checkout (PaywallModal) shows for Firebase-anonymous
// users too. PaywallModal already handles `unauthenticated` errors with a friendly
// "Akun diperlukan" card (PaywallModal.tsx:113-124). Also added funnel tracking
// (paywall_payment_created, paywall_blocked_unauth) and a 3-per-24h frequency cap
// to bound churn exposure per the RevenueCat 2026 finding.

type PaywallContextValue = {
  openPaywall: (trigger?: string) => void;
};

const PaywallContext = createContext<PaywallContextValue | null>(null);

type PaywallProviderProps = {
  children: React.ReactNode;
  onPremiumActivated: () => Promise<void> | void;
};

const DAY_MS = 24 * 60 * 60 * 1000;
const MAX_OPENS_PER_DAY = 3;
// Module-scoped — resets on reload. Acceptable; per research, day-level cap
// is the only meaningful cap; per-session cap is implicit (no double-show).
const recentOpens: number[] = [];

export const PaywallProvider: React.FC<PaywallProviderProps> = ({ children, onPremiumActivated }) => {
  const [showPaywall, setShowPaywall] = useState(false);
  const [paymentCtx, setPaymentCtx] = useState<{ paymentId: string; planType: '3_day' | '30_day' } | null>(null);
  const [currentTrigger, setCurrentTrigger] = useState<string | null>(null);

  const openPaywall = useCallback((trigger?: string) => {
    // TEAM_048: day-level frequency cap — bound paywall exposure to 3/24h.
    const now = Date.now();
    while (recentOpens.length > 0 && now - recentOpens[0] > DAY_MS) recentOpens.shift();
    if (recentOpens.length >= MAX_OPENS_PER_DAY) {
      track('paywall_capped', { trigger: trigger ?? 'unknown' });
      return;
    }
    recentOpens.push(now);
    track('paywall_open', { trigger: trigger ?? 'unknown' });
    setCurrentTrigger(trigger ?? null);
    setShowPaywall(true);
  }, []);

  const handlePaymentCreated = useCallback(({ paymentId, planType }: { paymentId: string; planType: '3_day' | '30_day' }) => {
    // TEAM_048: funnel tracking — payment attempted.
    track('paywall_payment_created', { trigger: currentTrigger ?? 'unknown' });
    setShowPaywall(false);
    setPaymentCtx({ paymentId, planType });
  }, [currentTrigger]);

  const handlePaymentConfirmed = useCallback(async () => {
    try {
      await onPremiumActivated();
    } finally {
      setPaymentCtx(null);
      setShowPaywall(false);
    }
  }, [onPremiumActivated]);

  const value = useMemo(() => ({ openPaywall }), [openPaywall]);

  return (
    <PaywallContext.Provider value={value}>
      {children}
      <PaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        onPaymentCreated={handlePaymentCreated}
        trigger={currentTrigger ?? undefined}
      />
      {paymentCtx ? (
        <PaymentModal
          isOpen={!!paymentCtx}
          paymentId={paymentCtx.paymentId}
          planType={paymentCtx.planType}
          onClose={() => setPaymentCtx(null)}
          onPaymentIdChange={(nextPaymentId) =>
            setPaymentCtx((prev) => (prev ? { ...prev, paymentId: nextPaymentId } : prev))
          }
          onConfirmed={handlePaymentConfirmed}
        />
      ) : null}
    </PaywallContext.Provider>
  );
};

export const usePaywall = (): PaywallContextValue => {
  const ctx = useContext(PaywallContext);
  if (!ctx) throw new Error('usePaywall must be used within PaywallProvider');
  return ctx;
};