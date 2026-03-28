import { useEffect, useRef, useState } from 'react';
import { AD_CONFIG } from '../utils/adConfig';

interface UseAdSenseReturn {
  isScriptLoaded: boolean;
  isAdBlocked: boolean;
  adRef: React.RefObject<HTMLModElement | null>;
  pushAd: () => void;
}

export function useAdSense(): UseAdSenseReturn {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isAdBlocked, setIsAdBlocked] = useState(false);
  const adRef = useRef<HTMLModElement | null>(null);
  const pushed = useRef(false);

  useEffect(() => {
    // Check if adsbygoogle script loaded
    const checkScript = () => {
      if (typeof window.adsbygoogle !== 'undefined') {
        setIsScriptLoaded(true);
        return;
      }
      // If script tag exists but adsbygoogle is undefined → blocked
      const scriptTag = document.querySelector(
        'script[src*="pagead2.googlesyndication.com"]'
      );
      if (scriptTag) {
        // Give it a moment, then declare blocked
        const timeout = setTimeout(() => {
          if (typeof window.adsbygoogle === 'undefined') {
            setIsAdBlocked(true);
          } else {
            setIsScriptLoaded(true);
          }
        }, 3_000);
        return () => clearTimeout(timeout);
      }
    };
    checkScript();
  }, []);

  const pushAd = () => {
    if (pushed.current) return; // prevent double-push in StrictMode
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      setIsAdBlocked(true);
    }
  };

  return { isScriptLoaded, isAdBlocked, adRef, pushAd };
}
