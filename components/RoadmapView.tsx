import React, { useEffect, useState } from 'react';
import { apiFetch } from '../services/apiClient';
import { Compass } from 'lucide-react';
import { CTA } from './ui/CTA';
import { Badge } from './ui/Badge';
import { FOCUS } from './ui/Card';
import ProgressBar from './ProgressBar';

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

const CATEGORY_LABELS: Record<DrillCategory, string> = {
  TIU: 'Tes Intelegensia Umum',
  TWK: 'Tes Wawasan Kebangsaan',
  TKP: 'Tes Karakteristik Pribadi',
};

const RoadmapView: React.FC<{ onStartMaterial?: (subtopicId: number, themeName?: string, category?: string) => void }> = ({ onStartMaterial }) => {
  const [activeCategory, setActiveCategory] = useState<DrillCategory>('TIU');
  const [deckIndex, setDeckIndex] = useState(0);
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

  const selectCategory = (cat: DrillCategory) => {
    setActiveCategory(cat);
    setDeckIndex(0);
  };

  const onDeckScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const max = Math.max((subtopics[activeCategory] ?? []).length - 1, 0);
    const idx = Math.min(Math.round(el.scrollLeft / el.clientWidth), max);
    if (idx >= 0 && idx !== deckIndex) setDeckIndex(idx);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center gap-sm">
        <span className="w-6 h-6 border border-black border-t-transparent rounded-full animate-spin" aria-hidden="true" />
        <span className="font-medium text-sm text-gray-500">Memuat roadmap...</span>
      </div>
    );
  }

  const list = subtopics[activeCategory] ?? [];

  return (
    <div className="flex flex-col w-full animate-fade-in pb-3xl md:pb-0">
      <div className="p-2xl border-b border-black bg-brand-cream">
        <div className="flex items-center gap-md mb-xl">
          <Compass className="w-8 h-8" aria-hidden="true" />
          <h1 className="text-5xl font-black uppercase tracking-tight">Roadmap Belajar</h1>
        </div>
        <p className="text-lg max-w-xl">
          Kurikulum terstruktur untuk belajar CPNS step-by-step. Selesaikan setiap subtopik dengan nilai minimal 70% untuk lanjut ke tahap berikutnya.
        </p>
      </div>

      <div className="flex border-b border-black">
        {(['TIU', 'TWK', 'TKP'] as DrillCategory[]).map((cat) => {
          const catList = subtopics[cat] ?? [];
          const completed = catList.filter((s) => progress[s.id]?.status === 'completed').length;
          const active = activeCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              aria-pressed={active}
              aria-label={CATEGORY_LABELS[cat]}
              onClick={() => selectCategory(cat)}
              className={`flex-1 py-md px-2xl flex items-center justify-center gap-md border-r border-black last:border-r-0 transition-colors ${active ? 'bg-brand-lime' : 'bg-white hover:bg-gray-50'} ${FOCUS}`}
            >
              <span className="font-black uppercase">{cat}</span>
              <span className="text-xs font-bold text-gray-500">{completed}/{catList.length}</span>
            </button>
          );
        })}
      </div>

      {list.length > 0 && (
        <div className="flex items-center justify-center gap-sm py-md" aria-hidden="true">
          {list.map((_, i) => (
            <span
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${i === deckIndex ? 'bg-black' : 'bg-gray-300'}`}
            />
          ))}
        </div>
      )}

      <div
        key={activeCategory}
        onScroll={onDeckScroll}
        className="flex overflow-x-auto snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {list.length === 0 ? (
          <div className="w-full px-2xl">
            <div className="border border-black rounded-xl p-xl text-sm text-gray-500">
              Belum ada subtopik untuk kategori ini.
            </div>
          </div>
        ) : (
          list.map((sub) => {
            const subProgress = progress[sub.id];
            const themes = sub.themes ?? [];
            const hasThemes = themes.length > 0;
            const isCompleted = subProgress?.status === 'completed';
            const completedCount = hasThemes
              ? themes.filter((t) => progress[t.id]?.status === 'completed').length
              : isCompleted ? 1 : 0;
            const totalCount = hasThemes ? themes.length : 1;
            const progressLabel = hasThemes
              ? `${completedCount}/${totalCount} tema`
              : isCompleted ? 'Selesai' : 'Belum dimulai';
            const allDone = hasThemes && themes.every((t) => progress[t.id]?.status === 'completed');
            const ctaTheme = (hasThemes ? themes.find((t) => progress[t.id]?.status !== 'completed') : undefined)?.name
              ?? (hasThemes ? themes[0].name : undefined);
            const ctaLabel = !hasThemes ? 'Mulai' : allDone ? 'Ulangi Tema' : 'Lanjut Belajar';

            return (
              <div key={sub.id} className="snap-center shrink-0 w-full px-2xl">
                <div className="border border-black rounded-xl p-xl flex flex-col gap-md min-w-0">
                  <div className="flex items-center justify-between gap-md">
                    <h2 className="uppercase font-black text-lg min-w-0 truncate">{sub.name}</h2>
                    <Badge accent={isCompleted ? 'lime' : 'white'} className="shrink-0">
                      {isCompleted ? 'SELESAI' : 'BELUM DIMULAI'}
                    </Badge>
                  </div>

                  <ProgressBar
                    current={completedCount}
                    total={totalCount}
                    ariaLabel={`${progressLabel} selesai`}
                  />
                  <span className="text-xs font-bold text-gray-500 -mt-lg">{progressLabel}</span>

                  {hasThemes && (
                    <div className="flex flex-col divide-y divide-black border-t border-black">
                      {themes.map((theme) => {
                        const t = progress[theme.id]?.status;
                        const done = t === 'completed';
                        const inProgress = t === 'in_progress';
                        const marker = done ? '✓' : inProgress ? '▸' : '○';
                        const markerCls = done
                          ? 'text-feedback-green font-bold'
                          : inProgress
                            ? 'text-gray-600 font-bold'
                            : 'text-gray-400';
                        return (
                          <button
                            key={theme.id}
                            type="button"
                            onClick={() => onStartMaterial?.(sub.id, theme.name, activeCategory)}
                            className={`w-full text-left px-xs py-md min-h-[44px] flex items-center justify-between gap-md transition-colors hover:bg-gray-50 ${FOCUS}`}
                          >
                            <span className="min-w-0 truncate font-medium">{theme.name}</span>
                            <span className={`shrink-0 ${markerCls}`} aria-hidden="true">{marker}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  <CTA
                    variant="secondary"
                    fullWidth
                    onClick={() => onStartMaterial?.(sub.id, ctaTheme, activeCategory)}
                  >
                    {ctaLabel}
                  </CTA>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default RoadmapView;
