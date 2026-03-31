import React, { createContext, useContext, useState, useRef, ReactNode } from 'react';

type OnboardingTourContextValue = {
  replayTour: () => void;
  isTourActive: boolean;
  setIsTourActive: (active: boolean) => void;
};

const OnboardingTourContext = createContext<OnboardingTourContextValue | undefined>(undefined);

export const useOnboardingTour = () => {
  const ctx = useContext(OnboardingTourContext);
  if (!ctx) throw new Error('useOnboardingTour must be used within OnboardingTourProvider');
  return ctx;
};

export const OnboardingTourProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isTourActive, setIsTourActive] = useState(false);
  const shouldReplayRef = useRef(false);

  const replayTour = () => {
    // Clear localStorage flag so tour runs on next mount
    localStorage.removeItem('onboarding_tour_v1_completed');
    localStorage.removeItem('onboarding_tour_v1_completed_at');
    shouldReplayRef.current = true;
    
    // Navigate to BONUS view (Drills landing)
    // This will be handled by the component that uses the context
    window.location.hash = '#bonus';
    window.location.reload(); // Simple way to ensure we're on the right view
  };

  const contextValue: OnboardingTourContextValue = {
    replayTour,
    isTourActive,
    setIsTourActive,
  };

  return (
    <OnboardingTourContext.Provider value={contextValue}>
      {children}
    </OnboardingTourContext.Provider>
  );
};
