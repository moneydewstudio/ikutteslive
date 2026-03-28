
import React, { useState, useEffect } from 'react';
import Button from './Button';
import { X, ShieldCheck, Zap } from 'lucide-react';
import { AD_CONFIG } from '../src/utils/adConfig';
import AdSenseAd from '../src/components/AdSenseAd';

interface InterstitialAdProps {
  onClose: () => void;
  onGoPro: () => void;
}

const InterstitialAd: React.FC<InterstitialAdProps> = ({ onClose, onGoPro }) => {
  const [timeLeft, setTimeLeft] = useState(5);
  const [canSkip, setCanSkip] = useState(false);
  const [adFailed, setAdFailed] = useState(false);
  const useRealAds = import.meta.env.VITE_FEATURE_ADSENSE === 'true' && AD_CONFIG.slots.interstitial;

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else {
      setCanSkip(true);
    }
  }, [timeLeft]);

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-6 animate-fade-in">
       
       {/* Top Bar: Counter / Skip */}
       <div className="absolute top-0 left-0 right-0 p-6 flex justify-end">
          {!canSkip ? (
             <div className="bg-gray-800/80 text-white px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 border border-white/20">
                <div className="w-4 h-4 rounded-full border-2 border-t-transparent border-white animate-spin"></div>
                Video akan berakhir dalam {timeLeft}
             </div>
          ) : (
             <button 
               onClick={onClose}
               className="bg-white text-black px-6 py-3 rounded-full font-black text-sm flex items-center gap-2 hover:bg-gray-200 transition-all transform hover:scale-105 shadow-neo"
             >
                LEWATI IKLAN <X className="w-4 h-4" />
             </button>
          )}
       </div>

       {/* Ad Container */}
       {useRealAds && !adFailed ? (
         <AdSenseAd
           className="w-full max-w-sm bg-white rounded-none border-4 border-black shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)] overflow-hidden"
           slot={AD_CONFIG.slots.interstitial}
           format="rectangle"
           onAdLoaded={() => console.log('[Ad] Loaded')}
           onAdFailed={() => setAdFailed(true)}
         />
       ) : (
         <div className="w-full max-w-sm bg-white rounded-none border-4 border-black shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)] overflow-hidden flex flex-col relative">
           
           {/* Ad Badge */}
           <div className="bg-gray-100 px-3 py-1 text-[10px] font-black uppercase text-gray-400 flex justify-between border-b border-gray-200">
              <span>Advertisement</span>
              <span>Google Ads</span>
           </div>

           {/* Main Ad Visual (Premium CTA) */}
           <div className="h-80 bg-brand-lime flex flex-col items-center justify-center p-8 text-center relative overflow-hidden group">
               {/* Animated Background Pattern */}
               <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '10px 10px'}}></div>
               
               <div className="relative z-10 transform transition-transform group-hover:scale-105 duration-500">
                   <div className="bg-black text-brand-lime w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-lg">
                        <ShieldCheck className="w-10 h-10" />
                   </div>
                   <h3 className="text-3xl font-black uppercase leading-none mb-3 tracking-tighter text-black">
                       Benci Iklan?
                   </h3>
                   <p className="font-bold text-gray-800 mb-8 leading-tight">
                       Upgrade ke Premium untuk pengalaman belajar tanpa gangguan.
                   </p>
                   <Button onClick={onGoPro} variant="black" size="md" fullWidth withArrow className="shadow-lg">
                      Hilangkan Iklan
                   </Button>
               </div>
           </div>
           
           {/* Ad Footer (Native Ad Style) */}
           <div className="p-4 bg-white border-t border-black flex items-center gap-3">
               <div className="w-12 h-12 bg-brand-purple border border-black rounded flex items-center justify-center text-black font-black text-xl">
                  <Zap className="w-6 h-6" />
               </div>
               <div className="flex-1">
                   <h4 className="font-black text-sm uppercase">Ikuttes Premium</h4>
                   <div className="flex text-[10px] text-gray-500 font-bold gap-1">
                      <span className="bg-yellow-100 text-yellow-700 px-1 rounded">4.9 ★</span>
                      <span>• Pendidikan</span>
                   </div>
               </div>
               <Button variant="outline" size="sm" onClick={onGoPro}>
                   Install
               </Button>
           </div>
       </div>
       )}

       {/* Always-visible small premium CTA when real ads are shown */}
       {useRealAds && !adFailed && (
         <div className="mt-4 flex justify-center">
           <Button onClick={onGoPro} variant="outline" size="sm">
             Upgrade ke Premium
           </Button>
         </div>
       )}
       

    </div>
  );
};

export default InterstitialAd;
