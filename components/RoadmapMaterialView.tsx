import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { apiFetch } from '../services/apiClient';
import { ArrowLeft, Play, CheckCircle2, BrainCircuit } from 'lucide-react';
import {
  buildLessonSlides,
  buildSlideKey,
  resolveTheme,
  type LessonSlide,
  type MaterialTheme,
} from '../utils/roadmapSlides';

type MaterialData = {
  subtopicId: number;
  subtopicName: string;
  content: string;
  materialJson: { themes: MaterialTheme[] } | null;
};

type Props = {
  subtopicId: number;
  initialThemeName?: string | null;
  onBack: () => void;
  onStartTest: (subtopicId: number) => void;
};

type Screen = { mode: 'list' } | { mode: 'player'; themeName: string; slideIndex: number };

const FOCUS = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2';

const P = 'text-base text-gray-700 leading-relaxed';

// `\n\n` = jeda paragraf (mt-lg), `\n` tunggal = baris baru rapat (mt-sm).
const renderMarkdown = (text: string) =>
  (text || '')
    .replace(/[<>]/g, c => (c === '<' ? '&lt;' : '&gt;'))
    .replace(/^(\d+)\. (.+)$/gm, '<span class="font-bold text-black">$1.</span> $2')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-black">$1</strong>')
    .split('\n\n')
    .map((block, bi) =>
      block.split('\n').map((line, li) => {
        const gap = bi === 0 && li === 0 ? '' : li === 0 ? ' mt-lg' : ' mt-sm';
        return `<p class="${P}${gap}">${line}</p>`;
      }).join('')
    ).join('');

const RoadmapMaterialView: React.FC<Props> = ({ subtopicId, initialThemeName, onBack, onStartTest }) => {
  const [data, setData] = useState<MaterialData | null>(null);
  const [loading, setLoading] = useState(true);
  const [screen, setScreen] = useState<Screen>({ mode: 'list' });
  const [completedThemes, setCompletedThemes] = useState<Set<string>>(new Set());
  const [answers, setAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      try {
        const res = await apiFetch(`/roadmap/materials?subtopicId=${subtopicId}`);
        if (res.ok) {
          const json = await res.json();
          if (cancelled) return;
          setData(json as MaterialData);
          // Auto-open player hanya kalau initialThemeName ter-resolve. Tidak pakai
          // useEffect terpisah — effect yang bergantung pada initialThemeName re-fire
          // saat kembali dari player dan melempar user balik. `key=` di App menangani reset.
          const t = resolveTheme(json?.materialJson?.themes ?? [], initialThemeName);
          if (t) setScreen({ mode: 'player', themeName: t.name, slideIndex: 0 });
        }
      } catch {}
      if (!cancelled) setLoading(false);
    };
    void run();
    return () => { cancelled = true; };
  }, [subtopicId]);

  const themes: MaterialTheme[] = data?.materialJson?.themes ?? [];
  const theme = screen.mode === 'player' ? resolveTheme(themes, screen.themeName) : null;
  const slides = theme ? buildLessonSlides(theme) : [];
  const slide: LessonSlide | undefined = slides[screen.mode === 'player' ? screen.slideIndex : 0];
  const playerSlideKind = screen.mode === 'player' && theme ? slide?.kind : undefined;

  // Tandai selesai saat slide completion tampil (idempotent via Set baru).
  useEffect(() => {
    if (playerSlideKind === 'completion' && theme) {
      setCompletedThemes(prev => prev.has(theme.name) ? prev : new Set(prev).add(theme.name));
    }
  }, [playerSlideKind, theme]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <span className="font-medium text-sm text-gray-500">Memuat materi...</span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-xl p-2xl">
        <p className="text-gray-500">Materi tidak ditemukan.</p>
        <button type="button" onClick={onBack} className={`text-sm font-bold text-black underline ${FOCUS}`}>Kembali</button>
      </div>
    );
  }

  const firstIncomplete = themes.find(t => !completedThemes.has(t.name));
  const sortedThemes = [...themes].sort((a, b) =>
    Number(completedThemes.has(b.name)) - Number(completedThemes.has(a.name))
  );

  const renderList = () => (
    <div className="flex flex-col w-full min-h-0 animate-fade-in pb-20 md:pb-0">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200">
        <div className="flex items-center gap-sm px-2xl h-14">
          <button type="button" onClick={onBack} className={`flex items-center gap-1 text-sm font-bold text-gray-600 hover:text-black ${FOCUS}`}>
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </button>
          <span className="text-sm text-gray-400 mx-1">/</span>
          <span className="text-sm font-bold truncate">{data.subtopicName}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2xl py-xl">
        {themes.length === 0 ? (
          <>
            <div dangerouslySetInnerHTML={{ __html: renderMarkdown(data.content) }} />
            <div className="mt-2xl mb-xl">
              <button
                type="button"
                onClick={() => onStartTest(subtopicId)}
                className={`w-full flex items-center justify-center gap-2 bg-black text-white font-black text-lg py-lg px-xl rounded-xl hover:bg-gray-800 transition-colors ${FOCUS}`}
              >
                <Play className="w-5 h-5" />
                Mulai Tes (10 Soal)
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col gap-md">
              {sortedThemes.map(t => {
                const count = buildLessonSlides(t).length;
                const done = completedThemes.has(t.name);
                const isNext = !done && t.name === firstIncomplete?.name;
                return (
                  <button
                    key={t.name}
                    type="button"
                    onClick={() => setScreen({ mode: 'player', themeName: t.name, slideIndex: 0 })}
                    className={`w-full text-left border border-gray-200 rounded-xl px-lg py-md hover:border-gray-400 transition-colors ${FOCUS}`}
                  >
                    <div className="flex items-center justify-between gap-md">
                      <span className="font-bold text-sm truncate">{t.name}</span>
                      <div className="flex items-center gap-sm shrink-0">
                        <span className="text-xs text-gray-400">{count} slide</span>
                        {done ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500" aria-hidden="true" />
                        ) : isNext ? (
                          <Play className="w-5 h-5 text-amber-500" aria-hidden="true" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-gray-300" aria-hidden="true" />
                        )}
                      </div>
                    </div>
                    <div className={`text-xs ${done ? 'text-green-600' : 'text-gray-400'}`}>
                      {done ? 'Selesai' : isNext ? 'Lanjut' : 'Belum'}
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="mt-2xl mb-xl">
              <button
                type="button"
                onClick={() => onStartTest(subtopicId)}
                className={`w-full flex items-center justify-center gap-2 bg-black text-white font-black text-lg py-lg px-xl rounded-xl hover:bg-gray-800 transition-colors ${FOCUS}`}
              >
                <Play className="w-5 h-5" />
                Mulai Tes (10 Soal)
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );

  if (screen.mode === 'list' || !theme) return renderList();

  const slideIndex = screen.slideIndex;
  const slideKey = buildSlideKey(theme.name, slideIndex);
  const pct = ((slideIndex + 1) / slides.length) * 100;
  const answered = slide?.kind === 'quiz' ? answers[slideKey] : undefined;
  const canAdvance = slide?.kind !== 'quiz' || !!answered;

  const quizzes = slides.filter(s => s.kind === 'quiz');
  const right = quizzes.filter(q => {
    const i = slides.indexOf(q);
    return answers[buildSlideKey(theme.name, i)] === (q as { correctKey: string }).correctKey;
  }).length;

  const nextTheme = themes.find(t => t.name !== theme.name && !completedThemes.has(t.name)) ?? null;

  const ctaClasses = `w-full py-lg px-xl rounded-xl font-black text-base transition-colors ${FOCUS} ${
    canAdvance ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
  }`;

  const renderContent = (s: Extract<LessonSlide, { kind: 'content' }>) => (
    <>
      <h3 className="text-xl font-black mb-lg">{s.title}</h3>
      {s.lede && <p className="text-base italic text-gray-500 mb-lg">{s.lede}</p>}
      <div dangerouslySetInnerHTML={{ __html: renderMarkdown(s.body) }} />
    </>
  );

  const renderQuiz = (s: Extract<LessonSlide, { kind: 'quiz' }>) => {
    const isRight = answered === s.correctKey;
    const maxWeight = Math.max(0, ...s.options.map(o => o.weight ?? 0));
    const userWeight = s.options.find(o => o.key === answered)?.weight;
    return (
      <>
        <div className="flex items-center gap-sm mb-lg">
          <BrainCircuit className="w-4 h-4 text-gray-500" aria-hidden="true" />
          <span className="text-[10px] font-bold uppercase bg-gray-100 text-gray-500 px-2 py-0.5 rounded">{s.title}</span>
        </div>
        <h3 className="text-lg font-bold mb-lg">{s.question}</h3>
        <div className="space-y-sm">
          {s.options.map(opt => {
            const isSelected = answered === opt.key;
            const isCorrectOpt = opt.key === s.correctKey;
            let cls = 'w-full text-left border-2 rounded-xl px-lg py-md text-sm transition-all ' + FOCUS;
            if (!answered) {
              cls += 'border-gray-200 hover:border-gray-400';
            } else if (isCorrectOpt) {
              cls += 'border-green-500 bg-green-50 text-green-900 font-bold';
            } else if (isSelected) {
              cls += 'border-red-500 bg-red-50 text-red-900';
            } else {
              cls += 'border-gray-100 text-gray-400';
            }
            return (
              <button
                key={opt.key}
                type="button"
                disabled={!!answered}
                aria-pressed={isSelected}
                onClick={() => setAnswers(p => ({ ...p, [slideKey]: opt.key }))}
                className={cls}
              >
                <span className="font-bold mr-sm uppercase">{opt.key}.</span>
                {opt.text}
                <span aria-hidden="true">
                  {answered && isCorrectOpt && ' ✅'}
                  {answered && isSelected && !isCorrectOpt && ' ❌'}
                </span>
              </button>
            );
          })}
        </div>

        {answered && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-xl space-y-md">
            {s.weighted ? (
              <div className="bg-amber-50 border border-amber-500 rounded-xl px-lg py-md" role="alert" aria-live="polite">
                <p className="font-bold text-sm text-amber-800">
                  {userWeight !== undefined && userWeight === maxWeight
                    ? `+${userWeight} poin — jawaban terbaik!`
                    : `+${userWeight ?? 0} poin (terbaik +${maxWeight} poin)`}
                </p>
              </div>
            ) : isRight ? (
              <div className="bg-green-50 border border-green-500 rounded-xl px-lg py-md" role="alert" aria-live="polite">
                <p className="flex items-center gap-2 font-bold text-sm text-green-700">
                  <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
                  Benar!
                </p>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-500 rounded-xl px-lg py-md" role="alert" aria-live="polite">
                <p className="font-bold text-sm text-red-700">Kurang tepat — jawaban benar: {s.correctKey}</p>
              </div>
            )}
            {s.explanation && (
              <div className="p-lg bg-amber-50 rounded-xl border border-amber-200">
                <p className="text-sm text-gray-700 leading-relaxed">{s.explanation}</p>
              </div>
            )}
          </motion.div>
        )}
      </>
    );
  };

  const renderCompletion = (s: Extract<LessonSlide, { kind: 'completion' }>) => (
    <div className="text-center">
      <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-lg" aria-hidden="true" />
      <h2 className="text-2xl font-black mb-sm">Tema selesai! 🎉</h2>
      {quizzes.length > 0 && (
        <p className="text-sm text-gray-500 mb-lg">{right}/{quizzes.length} benar</p>
      )}
      {s.summary && (
        <div className="bg-gray-50 rounded-xl px-lg py-md text-left mb-xl">
          <p className="font-black text-sm mb-sm">📌 Intisari</p>
          <div dangerouslySetInnerHTML={{ __html: renderMarkdown(s.summary) }} />
        </div>
      )}
      <div className="flex flex-col gap-md">
        {nextTheme && (
          <button
            type="button"
            onClick={() => setScreen({ mode: 'player', themeName: nextTheme.name, slideIndex: 0 })}
            className={`w-full bg-black text-white font-black text-base py-lg px-xl rounded-xl hover:bg-gray-800 transition-colors ${FOCUS}`}
          >
            Tema Berikutnya
          </button>
        )}
        <button
          type="button"
          onClick={() => setScreen({ mode: 'list' })}
          className={`w-full text-gray-600 font-bold py-md px-xl rounded-xl border border-gray-300 hover:bg-gray-50 transition-colors ${FOCUS}`}
        >
          Kembali ke Daftar
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col w-full h-full min-h-0 animate-fade-in">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-2xl h-14">
          <button type="button" onClick={() => setScreen({ mode: 'list' })} className={`flex items-center gap-1 text-sm font-bold text-gray-600 hover:text-black ${FOCUS}`}>
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </button>
          <span className="text-sm font-bold truncate">{theme.name}</span>
        </div>
        {/* Progress bar */}
        <div className="h-1 bg-gray-100" role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}>
          <motion.div className="h-full bg-black" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.3 }} />
        </div>
      </div>

      {/* Slide area */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={slideKey}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col justify-center px-2xl py-2xl max-w-xl mx-auto w-full"
            aria-live="polite"
          >
            {slide?.kind === 'content' && renderContent(slide)}
            {slide?.kind === 'quiz' && renderQuiz(slide)}
            {slide?.kind === 'completion' && renderCompletion(slide)}

            {/* CTA */}
            {slide?.kind !== 'completion' && (
              <div className="mt-xl">
                <button
                  type="button"
                  disabled={!canAdvance}
                  onClick={() => setScreen(s => s.mode === 'player' ? { ...s, slideIndex: s.slideIndex + 1 } : s)}
                  className={ctaClasses}
                >
                  {slide?.kind === 'quiz' && !answered ? 'Pilih jawaban' : 'Lanjut'}
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RoadmapMaterialView;
