import React, { useEffect, useState } from 'react';
import { Adsense } from '@ctrl/react-adsense';
import { AD_CONFIG } from '../utils/adConfig';

interface AdSenseAdProps {
  className?: string;
  slot: string;
  format?: string;
  responsive?: boolean;
  onAdLoaded?: () => void;
  onAdFailed?: () => void;
}

const AdSenseAd: React.FC<AdSenseAdProps> = ({
  className,
  slot,
  format = 'auto',
  responsive = true,
  onAdLoaded,
  onAdFailed,
}) => {
  const [state, setState] = useState<'loading' | 'loaded' | 'error'>('loading');

  useEffect(() => {
    // Timeout-based fill detection
    const timer = setTimeout(() => {
      if (state === 'loading') {
        setState('error');
        onAdFailed?.();
      }
    }, AD_CONFIG.maxLoadWaitMs);
    return () => clearTimeout(timer);
  }, [state, onAdFailed]);

  // Observe the ins element for a filled class / non-zero height
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const ins = document.querySelector('ins.adsbygoogle[data-ad-slot="' + slot + '"]');
      if (ins && (ins as HTMLElement).offsetHeight > 0) {
        setState('loaded');
        onAdLoaded?.();
        observer.disconnect();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });
    return () => observer.disconnect();
  }, [slot, onAdLoaded]);

  return (
    <div className={className} data-ad-state={state}>
      {state === 'loading' && (
        <div className="flex items-center justify-center h-[250px] animate-pulse bg-gray-100 rounded">
          <span className="text-gray-400 text-sm">Memuat iklan…</span>
        </div>
      )}
      <div style={{ display: state === 'error' ? 'none' : 'block' }}>
        <Adsense
          client={AD_CONFIG.clientId}
          slot={slot}
          style={{ display: 'block', width: '100%' }}
          format={format}
          responsive={responsive.toString()}
          data-adtest={AD_CONFIG.testMode ? 'on' : undefined}
        />
      </div>
      {state === 'error' && null /* parent handles fallback */}
    </div>
  );
};

export default AdSenseAd;
