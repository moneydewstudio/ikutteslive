import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Zap } from 'lucide-react';
import { FOCUS } from './ui/Card';
import { CTA } from './ui/CTA';
import EzoicPlaceholder from '../src/components/EzoicPlaceholder';

interface InterstitialAdProps {
  onClose: () => void;
  onGoPro: () => void;
}

const InterstitialAd: React.FC<InterstitialAdProps> = ({ onClose, onGoPro }) => {
  const [timeLeft, setTimeLeft] = useState(5);
  const [canSkip, setCanSkip] = useState(false);
  const [adFailed, setAdFailed] = useState(false);
  const useRealAds =
    import.meta.env.VITE_FEATURE_EZOIC === 'true' &&
    !!import.meta.env.VITE_EZOIC_INTERSTITIAL_PLACEMENT_ID;
  const placementId = Number(import.meta.env.VITE_EZOIC_INTERSTITIAL_PLACEMENT_ID) || 101;

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else {
      setCanSkip(true);
    }
  }, [timeLeft]);

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-2xl animate-fade-in">

       {/* Top Bar: Counter / Skip */}
       <div className="absolute top-0 left-0 right-0 p-xl flex justify-end">
          {!canSkip ? (
             <div className="bg-gray-800/80 text-white px-lg py-sm rounded-full font-bold text-sm flex items-center gap-sm border border-white/20">
                <div className="w-4 h-4 rounded-full border-2 border-t-transparent border-white animate-spin" />
                Video akan berakhir dalam {timeLeft}
             </div>
          ) : (
             <button
               type="button"
               onClick={onClose}
               className={[
                 'bg-white text-black px-xl py-md rounded-full font-black text-sm flex items-center gap-sm hover:bg-gray-200 transition-all',
                 FOCUS,
               ].join(' ')}
             >
                LEWATI IKLAN <X className="w-4 h-4" aria-hidden="true" />
             </button>
          )}
       </div>

       {/* Ad Container */}
       {useRealAds && !adFailed ? (
         <EzoicPlaceholder
           placementId={placementId}
           onFallback={() => setAdFailed(true)}
           className="w-full max-w-sm bg-white rounded-none border border-black overflow-hidden"
         />
       ) : (
         <div className="w-full max-w-sm bg-white rounded-none border border-black overflow-hidden flex flex-col relative">

           {/* Ad Badge */}
           <div className="bg-gray-100 px-md py-xs text-[10px] font-black uppercase text-gray-500 flex justify-between border-b border-black">
              <span>Advertisement</span>
              <span>Ezoic Ads</span>
           </div>

           {/* Main Ad Visual (Premium CTA) */}
           <div className="h-80 bg-brand-lime flex flex-col items-center justify-center p-xl text-center relative overflow-hidden group">
               {/* Animated Background Pattern */}
               <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '10px 10px'}}></div>

               <div className="relative z-10 transform transition-transform group-hover:scale-105 duration-500">
                   <div className="bg-black text-brand-lime w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-xl border border-white">
                        <ShieldCheck className="w-10 h-10" aria-hidden="true" />
                   </div>
                   <h3 className="text-3xl font-black uppercase leading-none mb-md tracking-tighter text-black">
                       Benci Iklan?
                   </h3>
                   <p className="font-bold text-gray-800 mb-xl leading-tight">
                       Upgrade ke Premium untuk pengalaman belajar tanpa gangguan.
                   </p>
                   <CTA onClick={onGoPro} variant="primary" size="md" fullWidth>
                      Hilangkan Iklan
                   </CTA>
               </div>
           </div>

           {/* Ad Footer (Native Ad Style) */}
           <div className="p-lg bg-white border-t border-black flex items-center gap-md">
               <div className="w-lg h-lg bg-brand-purple border border-black rounded flex items-center justify-center text-black font-black text-xl">
                  <Zap className="w-5 h-5" aria-hidden="true" />
               </div>
               <div className="flex-1">
                   <h4 className="font-black text-sm uppercase">Ikuttes Premium</h4>
                   <div className="flex text-[10px] text-gray-500 font-bold gap-xs">
                      <span className="bg-yellow-100 text-yellow-700 px-xs rounded">4.9 ★</span>
                      <span>• Pendidikan</span>
                   </div>
               </div>
               <CTA variant="secondary" size="sm" onClick={onGoPro}>
                   Install
               </CTA>
           </div>
       </div>
       )}

       {/* Always-visible small premium CTA when real ads are shown */}
       {useRealAds && !adFailed && (
         <div className="mt-lg flex justify-center">
           <CTA onClick={onGoPro} variant="secondary" size="sm">
             Upgrade ke Premium
           </CTA>
         </div>
       )}


    </div>
  );
};

export default InterstitialAd;