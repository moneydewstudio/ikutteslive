import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import PaywallModal from '../../components/PaywallModal';
import PaymentModal from '../../components/PaymentModal';

// TEAM_027: Global paywall provider so any feature can open the same PaywallModal + PaymentModal flow

type PaywallContextValue = {
  openPaywall: (trigger?: string) => void;
};

const PaywallContext = createContext<PaywallContextValue | null>(null);

type PaywallProviderProps = {
  children: React.ReactNode;
  onPremiumActivated: () => Promise<void> | void;
};

export const PaywallProvider: React.FC<PaywallProviderProps> = ({ children, onPremiumActivated }) => {
  const [showPaywall, setShowPaywall] = useState(false);
  const [paymentCtx, setPaymentCtx] = useState<{ paymentId: string; planType: '3_day' | '30_day' } | null>(null);
  const [currentTrigger, setCurrentTrigger] = useState<string | null>(null);

  const openPaywall = useCallback((trigger?: string) => {
    setCurrentTrigger(trigger ?? null);
    setShowPaywall(true);
  }, []);

  const handlePaymentCreated = useCallback(({ paymentId, planType }: { paymentId: string; planType: '3_day' | '30_day' }) => {
    setShowPaywall(false);
    setPaymentCtx({ paymentId, planType });
  }, []);

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
