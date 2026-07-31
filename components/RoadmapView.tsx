import React, { useEffect, useState } from 'react';
import { apiFetch } from '../services/apiClient';
import { Compass, CheckCircle, ArrowRight } from 'lucide-react';

type DrillCategory = 'TIU' | 'TWK' | 'TKP';

type Theme = {
  id: number;
  name: string;
};

type SubtopicRow = {
  id: number;
  name: string;
  code: string;
  topicId: number | null;
  themes: Theme[];
};

type ProgressRow = {
  subtopicId: number;
  status: string;
  bestScore: number | null;
  attempts: number;
};

const CATEGORY_META: Record<DrillCategory, { label: string; color: string; bgLight: string }> = {
  TIU: { label: 'Tes Intelegensia Umum', color: 'bg-brand-pink', bgLight: 'bg-pink-50' },
  TWK: { label: 'Tes Wawasan Kebangsaan', color: 'bg-brand-cream', bgLight: 'bg-amber-50' },
  TKP: { label: 'Tes Karakteristik Pribadi', color: 'bg-brand-lime', bgLight: 'bg-lime-50' },
};

const RoadmapView: React.FC<{ onStartMaterial?: (subtopicId: number, themeName?: string) => void }> = ({ onStartMaterial }) => {
  const [activeCategory, setActiveCategory] = useState<DrillCategory | null>(null);
  const [expandedSubtopic, setExpandedSubtopic] = useState<number | null>(null);
  const [subtopics, setSubtopics] = useState<Record<DrillCategory, SubtopicRow[]>>({ TIU: [], TWK: [], TKP: [] });
  const [progress, setProgress] = useState<Record<number, ProgressRow>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      const cats: DrillCategory[] = ['TIU', 'TWK', 'TKP'];
      const next: Record<DrillCategory, SubtopicRow[]> = { TIU: [], TWK: [], TKP: [] };
      await Promise.all(
        cats.map(async (cat) => {
          try {
            const res = await apiFetch('/roadmap/subtopics?category=' + cat);
            if (!res.ok) return;
            const data = await res.json() as any;
            if (!cancelled) next[cat] = (data?.subtopics ?? []) as SubtopicRow[];
          } catch {}
        })
      );
      if (!cancelled) setSubtopics(next);

      // Load user progress
      try {
        const res = await apiFetch('/roadmap/progress');
        if (res.ok) {
          const data = await res.json() as any;
          const map: Record<number, ProgressRow> = {};
          for (const p of (data?.progress ?? []) as ProgressRow[]) {
            map[p.subtopicId] = p;
          }
          if (!cancelled) setProgress(map);
        }
      } catch {}
      if (!cancelled) setLoading(false);
    };
    void run();
    return () => { cancelled = true; };
  }, []);

  const toggleCategory = (cat: DrillCategory) => {
    setActiveCategory(activeCategory === cat ? null : cat);
  };

  const getStatusIcon = (subtopicId: number) => {
    const p = progress[subtopicId];
    if (!p || p.status === 'not_started') return null;
    if (p.status === 'completed') return <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />;
    return <div className="w-5 h-5 rounded-full border-2 border-amber-500 shrink-0" />;
  };

  const getStatusText = (subtopicId: number) => {
    const p = progress[subtopicId];
    if (!p) return 'Belum dimulai';
    if (p.status === 'completed') return `✅ ${p.bestScore ?? 0}%`;
    if (p.status === 'in_progress') return `🔄 ${p.attempts}x percobaan`;
    return 'Belum dimulai';
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <span className="font-medium text-sm text-gray-500">Memuat roadmap...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full animate-fade-in pb-20 md:pb-0">
      <div className="p-2xl border-b border-black bg-brand-cream">
        <div className="flex items-center gap-3 mb-xl">
          <Compass className="w-8 h-8" />
          <h1 className="text-5xl font-black uppercase tracking-tight">Roadmap Belajar</h1>
        </div>
        <p className="text-lg max-w-xl">
          Kurikulum terstruktur untuk belajar CPNS step-by-step. Selesaikan setiap subtopik dengan nilai minimal 70% untuk lanjut ke tahap berikutnya.
        </p>
      </div>

      <div className="flex flex-col divide-y divide-black">
        {(['TIU', 'TWK', 'TKP'] as DrillCategory[]).map((cat) => {
          const meta = CATEGORY_META[cat];
          const list = subtopics[cat] ?? [];
          const completed = list.filter((s) => progress[s.id]?.status === 'completed').length;
          return (
            <div key={cat}>
              {/* Category header button */}
              <button
                onClick={() => toggleCategory(cat)}
                className={`w-full text-left px-2xl py-lg flex items-center justify-between hover:bg-gray-50 transition-colors ${meta.bgLight}`}
              >
                <div className="flex items-center gap-lg">
                  <div className={`w-10 h-10 rounded-full ${meta.color} border border-black flex items-center justify-center font-black text-sm`}>
                    {cat}
                  </div>
                  <div>
                    <div className="font-black text-lg">{cat}</div>
                    <div className="text-sm text-gray-600">{meta.label}</div>
                  </div>
                </div>
                <div className="flex items-center gap-lg">
                  <span className="text-sm font-bold text-gray-500">{completed}/{list.length} selesai</span>
                  <ArrowRight className={`w-5 h-5 transition-transform ${activeCategory === cat ? 'rotate-90' : ''}`} />
                </div>
              </button>

              {/* Subtopic list (expandable) */}
              {activeCategory === cat && (
                <div className="divide-y divide-gray-200 bg-white">
                  {list.length === 0 ? (
                    <div className="px-2xl py-lg text-sm text-gray-400">Belum ada subtopik untuk kategori ini.</div>
                  ) : (
                    list.map((sub, idx) => {
                      const isCompleted = progress[sub.id]?.status === 'completed';
                      const isExpanded = expandedSubtopic === sub.id;
                      const hasThemes = (sub.themes ?? []).length > 0;
                      const completedThemes = (sub.themes ?? []).filter((t) => progress[t.id]?.status === 'completed').length;
                      return (
                        <div key={sub.id}>
                          <div
                            className={`px-2xl py-md flex items-center justify-between transition-colors ${isCompleted ? 'opacity-70' : 'cursor-pointer hover:bg-gray-50'}`}
                            onClick={() => {
                              if (!isCompleted) {
                                if (hasThemes) {
                                  setExpandedSubtopic(isExpanded ? null : sub.id)
                                } else {
                                  onStartMaterial?.(sub.id)
                                }
                              }
                            }}
                          >
                            <div className="flex items-center gap-lg min-w-0">
                              <span className="text-xs font-bold text-gray-400 w-6 shrink-0">{`${idx + 1}.`}</span>
                              <div className="min-w-0">
                                <span className="font-bold text-sm truncate block">{sub.name}</span>
                                <span className="text-xs text-gray-500">
                                  {hasThemes
                                    ? `${completedThemes}/${sub.themes.length} tema`
                                    : getStatusText(sub.id)}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-md shrink-0">
                              {getStatusIcon(sub.id)}
                              {!isCompleted && hasThemes && (
                                <ArrowRight className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                              )}
                              {!isCompleted && !hasThemes && (
                                <span className="text-xs font-bold text-gray-400 uppercase border border-gray-300 px-2 py-0.5 rounded">
                                  Mulai
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Nested themes */}
                          {isExpanded && hasThemes && (
                            <div className="bg-gray-50 border-t border-b border-gray-200">
                              {sub.themes.map((theme) => {
                                return (
                                  <div
                                    key={theme.id}
                                    onClick={() => onStartMaterial?.(sub.id, theme.name)}
                                    className="px-2xl py-sm pl-3xl flex items-center justify-between text-sm cursor-pointer hover:bg-gray-100 transition-colors"
                                  >
                                    <div className="flex items-center gap-lg min-w-0">
                                      <span className="text-xs text-gray-300 w-4 shrink-0">•</span>
                                      <span className="text-gray-700 truncate">{theme.name}</span>
                                    </div>
                                    <div className="flex items-center gap-md shrink-0">
                                      <span className="text-[10px] font-bold text-gray-400 uppercase border border-gray-300 px-1.5 py-0.5 rounded">
                                        Tes
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RoadmapView;
