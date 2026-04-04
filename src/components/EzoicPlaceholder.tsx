import React, { useEffect, useRef, useState } from 'react';

interface EzoicPlaceholderProps {
  placementId: number;
  onFallback?: () => void;
  className?: string;
}

/**
 * EzoicPlaceholder renders a single Ezoic ad placement and handles:
 * - Mount: showAds(placementId)
 * - Unmount: destroyPlaceholders(placementId) (recommended for modals)
 * - 3s failure detection: notifies parent to show fallback UI
 */
export const EzoicPlaceholder: React.FC<EzoicPlaceholderProps> = ({
  placementId,
  onFallback,
  className,
}) => {
  const [timedOut, setTimedOut] = useState(false);
  const placeholderRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Guard: only run if Ezoic is loaded
    if (!window.ezstandalone || !window.ezstandalone.cmd) {
      if (onFallback) onFallback();
      return;
    }

    // Show the ad
    window.ezstandalone.cmd.push(() => {
      window.ezstandalone.showAds(placementId);
    });

    // Failure detection: 3 seconds
    timeoutRef.current = setTimeout(() => {
      // Simple failure criteria: placeholder still empty or missing
      const el = placeholderRef.current;
      if (!el || el.offsetHeight === 0 || el.children.length === 0) {
        setTimedOut(true);
        if (onFallback) onFallback();
      }
    }, 3000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      // Clean up the placeholder when unmounting (modal close)
      if (window.ezstandalone && window.ezstandalone.cmd) {
        window.ezstandalone.cmd.push(() => {
          window.ezstandalone.destroyPlaceholders(placementId);
        });
      }
    };
  }, [placementId, onFallback]);

  if (timedOut) return null; // parent will render fallback

  return (
    <div
      ref={placeholderRef}
      className={className}
      id={`ezoic-pub-ad-placeholder-${placementId}`}
      data-ezoic-placement-id={placementId}
    />
  );
};

// Extend global window for Ezoic
declare global {
  interface Window {
    ezstandalone?: {
      cmd: unknown[];
      showAds: (...ids: number[]) => void;
      destroyPlaceholders: (...ids: number[]) => void;
    };
  }
}

export default EzoicPlaceholder;
