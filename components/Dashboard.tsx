import React, { useEffect, useMemo, useRef, useState } from 'react';
import { User, UserSession } from '../types';
import Button from '../components/Button';
import DeltaBanner from '../components/DeltaBanner';
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
import { TrendingUp, ChevronRight, BookOpen, AlertCircle, TrendingUp as TrendingUpIcon, CheckCircle2 } from 'lucide-react';
import { apiFetch } from '../services/apiClient';
import { useOnboardingTour } from '../src/contexts/OnboardingTourContext';
import { getPendingDailyQuizSubmit, syncPendingDailyQuizSubmit } from '../services/dailyQuizSync';

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
  subcategoryId: number;
  subcategoryName: string;
  topicCode: string | null;
  value: number;
  attempts: number;
};

type SpiderAxis = { topicCode: 'TIU' | 'TWK' | 'TKP'; subcategoryName: string };

const SPIDER_AXES: SpiderAxis[] = [
  { topicCode: 'TIU', subcategoryName: 'Verbal' },
  { topicCode: 'TIU', subcategoryName: 'Numerik' },
  { topicCode: 'TWK', subcategoryName: 'Pancasila' },
  { topicCode: 'TWK', subcategoryName: 'UUD 1945' },
  { topicCode: 'TWK', subcategoryName: 'NKRI' },
  { topicCode: 'TWK', subcategoryName: 'Bhinneka Tunggal Ika' },
  { topicCode: 'TWK', subcategoryName: 'Nasionalisme' },
  { topicCode: 'TKP', subcategoryName: 'Pelayanan Publik' },
  { topicCode: 'TKP', subcategoryName: 'Jejaring Kerja' },
  { topicCode: 'TKP', subcategoryName: 'Sosial Budaya' },
  { topicCode: 'TKP', subcategoryName: 'Profesionalisme' },
  { topicCode: 'TKP', subcategoryName: 'Anti Radikalisme' },
];

const MIN_ATTEMPTS_SOLID = 5;

const Dashboard: React.FC<DashboardProps> = ({ user, history, onStartQuiz }) => {
  const { replayTour } = useOnboardingTour();
  // TEAM_029: prevent duplicate fetches from double-mount (StrictMode or production)
  const didLoadHistoryRef = useRef(false);
  const didLoadSyncRef = useRef(false);
  const didLoadRadarRef = useRef(false);
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

  const [radar, setRadar] = useState<RadarPoint[]>([]);
  const [radarLoading, setRadarLoading] = useState(false);
  const [radarError, setRadarError] = useState<string | null>(null);
  const [radarSyncWarning, setRadarSyncWarning] = useState(false);

  useEffect(() => {
    // TEAM_029: dedupe: only run fetch once per mount lifecycle
    if (didLoadHistoryRef.current) return;
    didLoadHistoryRef.current = true;
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
      didLoadHistoryRef.current = false;
    };
  }, []);

  useEffect(() => {
    // TEAM_029: dedupe: only run sync once per mount lifecycle
    if (didLoadSyncRef.current) return;
    didLoadSyncRef.current = true;
    let cancelled = false;

    const run = async () => {
      const pending = getPendingDailyQuizSubmit();
      if (!pending) {
        if (!cancelled) setRadarSyncWarning(false);
        return;
      }

      const ok = await syncPendingDailyQuizSubmit().catch(() => false);
      if (!cancelled) setRadarSyncWarning(!ok);
    };

    void run();
    return () => {
      cancelled = true;
      didLoadSyncRef.current = false;
    };
  }, []);

  useEffect(() => {
    // TEAM_029: dedupe: only run fetch once per mount lifecycle
    if (didLoadRadarRef.current) return;
    didLoadRadarRef.current = true;
    let cancelled = false;
    const run = async () => {
      setRadarLoading(true);
      setRadarError(null);
      try {
        const res = await apiFetch('/analytics/subtopic-readiness');
        if (res.status === 403) {
          if (!cancelled) setRadarError('locked');
          return;
        }
        if (!res.ok) throw new Error('Failed to load radar analytics');
        const json = (await res.json()) as any;
        const rows = Array.isArray(json?.data) ? (json.data as RadarPoint[]) : [];
        if (!cancelled) setRadar(rows);
      } catch {
        if (!cancelled) setRadarError('unavailable');
      } finally {
        if (!cancelled) setRadarLoading(false);
      }
    };

    void run();
    return () => {
      cancelled = true;
      didLoadRadarRef.current = false;
    };
  }, []);

  return (
    <div className="flex flex-col w-full animate-fade-in pb-24 md:pb-0">

      <div className="flex flex-col md:flex-row flex-1">
        
        {/* LEFT COLUMN: Profile & Key Metrics */}
        <div className="md:w-1/3 flex flex-col border-b md:border-b-0 md:border-r border-black bg-bg">
            
            {/* User Profile Cell - TEAM_034: Tidied layout */}
            <div className="p-4 border-b border-black">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full border border-black bg-brand-cream overflow-hidden flex-shrink-0">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" className="w-full h-full" />
                  </div>
                  <h2 className="font-black text-lg leading-tight truncate">{user.name || 'Tamu'}</h2>
                </div>
                <button 
                  onClick={replayTour}
                  className="flex-shrink-0 p-2 border border-black hover:bg-gray-100 transition-colors"
                  title="Panduan"
                >
                  <BookOpen className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* TEAM_034: Compact DeltaBar - Progress indicator only */}
            <div className="border-b border-black bg-brand-cream">
              <DeltaBanner
                onContinueClick={onStartQuiz}
                continueLabel="Latihan"
                tryoutHistory={tryoutHistory}
                compact={true}
              />
            </div>

            {/* Radar Charts */}
            <div className="p-6 flex-1 flex flex-col bg-brand-lime">
              <div className="flex items-center justify-between mb-4">
                <span className="font-bold text-sm uppercase tracking-widest border border-black px-2 py-1 rounded-full bg-white">Kemampuan per Subtopik</span>
              </div>

              {radarLoading ? (
                <div className="flex-1 flex items-center justify-center text-sm font-bold">Memuat...</div>
              ) : radarError ? (
                <div className="flex-1 flex items-center justify-center text-sm font-bold">Gagal memuat.</div>
              ) : (
                <div className="border border-black bg-white rounded-xl p-3">
                  <div className="font-black text-sm mb-2">SKD</div>
                  {radarSyncWarning ? (
                    <div className="mb-2 text-xs font-bold text-black/80">
                      Data belum tersinkron—coba lagi.
                    </div>
                  ) : null}

                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart
                        data={SPIDER_AXES.map((axis) => {
                          const found = radar.find(
                            (r) => String(r.topicCode || '').toUpperCase() === axis.topicCode && String(r.subcategoryName || '').toLowerCase() === axis.subcategoryName.toLowerCase()
                          );
                          const attempts = Number(found?.attempts ?? 0);
                          const value = Number(found?.value ?? 0);
                          const preview = attempts > 0 ? value : 0;
                          const solid = attempts >= MIN_ATTEMPTS_SOLID ? value : 0;
                          return {
                            name: `${axis.topicCode} ${axis.subcategoryName}`,
                            preview,
                            value: solid,
                            attempts,
                          };
                        })}
                      >
                        <PolarGrid />
                        <PolarAngleAxis dataKey="name" tick={{ fontSize: 10 }} />
                        <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10 }} />

                        <Radar dataKey="preview" stroke="#000000" fill="#E5E7EB" fillOpacity={0.5} />
                        <Radar dataKey="value" stroke="#000000" fill="#D4F938" fillOpacity={0.6} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="mt-2 text-[11px] font-bold text-black/80">
                    Nilai penuh muncul setelah minimal {MIN_ATTEMPTS_SOLID} percobaan per subtopik.
                  </div>
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

            {/* Riwayat Tryout */}
            <div className="flex flex-col flex-1">
              <div className="p-4 border-b border-black bg-gray-50 flex justify-between items-center">
                <h3 className="font-black text-lg flex items-center gap-2">
                  Riwayat Tryout
                </h3>
              </div>

              {tryoutHistoryLoading ? (
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