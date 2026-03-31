import React, { useEffect, useMemo, useState } from 'react';
import { User, UserSession } from '../types';
import Button from '../components/Button';
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  Tooltip,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import { TrendingUp, Lock, ChevronRight, BookOpen } from 'lucide-react';
import { apiFetch } from '../services/apiClient';
import { useOnboardingTour } from '../src/contexts/OnboardingTourContext';

interface DashboardProps {
  user: User;
  history: UserSession[];
  onStartQuiz: () => void;
}

type TryoutHistoryRow = {
  id: string;
  total: number;
  twk: number;
  tiu: number;
  tkp: number;
  passed: boolean | null;
  createdAt: string;
};

type RadarPoint = {
  subtopicId: number;
  subtopicName: string;
  value: number;
  attempts: number;
};

const Dashboard: React.FC<DashboardProps> = ({ user, history, onStartQuiz }) => {
  const { replayTour } = useOnboardingTour();
  const chartData = useMemo(
    () =>
      history
        .slice(0, 10)
        .reverse()
        .map((h, i) => ({
          name: `S${i + 1}`,
          score: h.readiness,
        })),
    [history]
  );

  const [tryoutHistory, setTryoutHistory] = useState<TryoutHistoryRow[]>([]);
  const [tryoutHistoryLoading, setTryoutHistoryLoading] = useState(false);
  const [tryoutHistoryError, setTryoutHistoryError] = useState<string | null>(null);
  const [selectedTryout, setSelectedTryout] = useState<TryoutHistoryRow | null>(null);

  const [radar, setRadar] = useState<{ TWK: RadarPoint[]; TIU: RadarPoint[]; TKP: RadarPoint[] }>({
    TWK: [],
    TIU: [],
    TKP: [],
  });
  const [radarLoading, setRadarLoading] = useState(false);
  const [radarError, setRadarError] = useState<string | null>(null);

  const isPremium = !!(user as any)?.isPro;

  useEffect(() => {
    if (!isPremium) return;

    let cancelled = false;
    const run = async () => {
      setTryoutHistoryLoading(true);
      setTryoutHistoryError(null);
      try {
        const res = await apiFetch('/tryout/history');
        if (res.status === 403) {
          if (!cancelled) setTryoutHistoryError('locked');
          return;
        }
        if (!res.ok) throw new Error('Failed to load tryout history');
        const json = (await res.json()) as any;
        const rows = Array.isArray(json?.history) ? (json.history as TryoutHistoryRow[]) : [];
        if (!cancelled) setTryoutHistory(rows);
      } catch {
        if (!cancelled) setTryoutHistoryError('unavailable');
      } finally {
        if (!cancelled) setTryoutHistoryLoading(false);
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [isPremium]);

  useEffect(() => {
    if (!isPremium) return;

    let cancelled = false;
    const run = async () => {
      setRadarLoading(true);
      setRadarError(null);
      try {
        const res = await apiFetch('/analytics/subtopic-accuracy');
        if (res.status === 403) {
          if (!cancelled) setRadarError('locked');
          return;
        }
        if (!res.ok) throw new Error('Failed to load radar analytics');
        const json = (await res.json()) as any;
        const categories = json?.categories ?? {};
        const next = {
          TWK: Array.isArray(categories?.TWK) ? (categories.TWK as RadarPoint[]) : [],
          TIU: Array.isArray(categories?.TIU) ? (categories.TIU as RadarPoint[]) : [],
          TKP: Array.isArray(categories?.TKP) ? (categories.TKP as RadarPoint[]) : [],
        };
        if (!cancelled) setRadar(next);
      } catch {
        if (!cancelled) setRadarError('unavailable');
      } finally {
        if (!cancelled) setRadarLoading(false);
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [isPremium]);

  return (
    <div className="flex flex-col w-full animate-fade-in pb-24 md:pb-0">
      
      {/* HEADER SECTION */}
      <div className="p-8 border-b border-black bg-white">
         <div className="flex justify-between items-end">
             <div>
                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight mb-2">Statistik Saya</h1>
                <p className="text-gray-500 font-medium">Pantau kemajuan dan kesiapan Anda.</p>
             </div>
             <Button onClick={onStartQuiz} withArrow>
               Latihan Cepat
             </Button>
         </div>
      </div>

      <div className="flex flex-col md:flex-row flex-1">
        
        {/* LEFT COLUMN: Profile & Key Metrics */}
        <div className="md:w-1/3 flex flex-col border-b md:border-b-0 md:border-r border-black bg-bg">
            
            {/* User Profile Cell */}
            <div className="p-6 border-b border-black flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full border border-black bg-brand-cream overflow-hidden">
                      <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" />
                  </div>
                  <div>
                      <h2 className="font-black text-xl">{user.name || 'Tamu'}</h2>
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-500">{isPremium ? 'Akun Premium' : 'Akun Gratis'}</span>
                  </div>
               </div>
               <Button variant="outline" size="sm" onClick={replayTour}>
                 <BookOpen className="w-4 h-4 mr-2" />
                 Panduan
               </Button>
            </div>

            {/* Radar Charts (Premium) */}
            <div className="p-6 flex-1 flex flex-col bg-brand-lime">
              <div className="flex items-center justify-between mb-4">
                <span className="font-bold text-sm uppercase tracking-widest border border-black px-2 py-1 rounded-full bg-white">Kemampuan per Subtopik</span>
                {!isPremium ? <Lock className="w-4 h-4" /> : null}
              </div>

              {!isPremium ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <p className="font-black text-lg mb-2">Fitur Premium</p>
                  <p className="font-medium text-sm max-w-[220px]">Fitur ini akan tersedia untuk pengguna serius. Segera hadir!</p>
                </div>
              ) : radarLoading ? (
                <div className="flex-1 flex items-center justify-center text-sm font-bold">Memuat...</div>
              ) : radarError ? (
                <div className="flex-1 flex items-center justify-center text-sm font-bold">Gagal memuat.</div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {(['TWK', 'TIU', 'TKP'] as const).map((code) => (
                    <div key={code} className="border border-black bg-white rounded-xl p-3">
                      <div className="font-black text-sm mb-2">{code}</div>
                      <div className="h-44">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart data={(radar as any)[code] || []}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="subtopicName" tick={{ fontSize: 10 }} />
                            <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                            <Radar dataKey="value" stroke="#000000" fill="#D4F938" fillOpacity={0.6} />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
        </div>

        {/* RIGHT COLUMN: Charts & History */}
        <div className="md:w-2/3 flex flex-col bg-white">
            
            {/* Chart Section */}
            <div className="h-64 md:h-80 border-b border-black p-6 relative">
                 <div className="absolute top-6 left-6 z-10">
                    <h3 className="font-black text-xl flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" /> Tren Performa
                    </h3>
                 </div>
                 <ResponsiveContainer width="100%" height="100%">
                   <LineChart data={chartData}>
                     <Tooltip 
                        contentStyle={{backgroundColor: 'black', color: 'white', border: 'none', borderRadius: '8px'}}
                        itemStyle={{color: '#D4F938'}}
                        cursor={{stroke: 'black', strokeWidth: 1}}
                     />
                     <Line 
                        type="monotone" 
                        dataKey="score" 
                        stroke="#000000" 
                        strokeWidth={2} 
                        dot={{r: 4, fill: '#D4F938', stroke: 'black', strokeWidth: 1}} 
                        activeDot={{r: 6}}
                     />
                   </LineChart>
                 </ResponsiveContainer>
            </div>

            {/* Riwayat Tryout (Premium) */}
            <div className="flex flex-col flex-1">
              <div className="p-4 border-b border-black bg-gray-50 flex justify-between items-center">
                <h3 className="font-black text-lg flex items-center gap-2">
                  Riwayat Tryout {!isPremium ? <Lock className="w-4 h-4" /> : null}
                </h3>
              </div>

              {!isPremium ? (
                <div className="p-8 text-center">
                  <p className="font-black mb-2">Fitur Premium</p>
                  <p className="text-gray-600 font-medium">Fitur ini akan tersedia untuk pengguna serius. Segera hadir!</p>
                </div>
              ) : tryoutHistoryLoading ? (
                <div className="p-8 text-center text-gray-600 font-medium">Memuat...</div>
              ) : tryoutHistoryError ? (
                <div className="p-8 text-center text-gray-600 font-medium">Gagal memuat.</div>
              ) : tryoutHistory.length === 0 ? (
                <div className="p-8 text-center text-gray-400 font-medium">Belum ada tryout.</div>
              ) : (
                <div className="flex-1 overflow-y-auto">
                  {tryoutHistory.slice(0, 20).map((row) => (
                    <button
                      key={row.id}
                      className="w-full text-left p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors flex items-center justify-between"
                      onClick={() => setSelectedTryout(row)}
                    >
                      <div>
                        <div className="font-black text-sm">{new Date(row.createdAt).toLocaleDateString()}</div>
                        <div className="text-xs text-gray-600 font-medium">TWK {row.twk} | TIU {row.tiu} | TKP {row.tkp}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-xs font-black px-2 py-1 border border-black rounded-md bg-white">{row.total}</div>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {selectedTryout ? (
                <div className="p-4 border-t border-black bg-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-black text-sm">Detail</div>
                      <div className="text-xs text-gray-600 font-medium">{new Date(selectedTryout.createdAt).toLocaleString()}</div>
                    </div>
                    <button className="text-xs font-bold uppercase" onClick={() => setSelectedTryout(null)}>
                      Tutup
                    </button>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                    <div className="border border-black rounded-md p-2 bg-gray-50"><span className="font-black">TWK</span> {selectedTryout.twk}</div>
                    <div className="border border-black rounded-md p-2 bg-gray-50"><span className="font-black">TIU</span> {selectedTryout.tiu}</div>
                    <div className="border border-black rounded-md p-2 bg-gray-50"><span className="font-black">TKP</span> {selectedTryout.tkp}</div>
                    <div className="border border-black rounded-md p-2 bg-gray-50"><span className="font-black">Total</span> {selectedTryout.total}</div>
                  </div>
                </div>
              ) : null}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;