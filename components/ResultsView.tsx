import React, { useState, useRef, useCallback } from 'react';
import { UserSession } from '../types';
import Button from './Button';
import { ChevronDown, ChevronUp, Check, X, Share2, RefreshCw } from 'lucide-react';
import { getQuestionsForSession } from '../services/quizService';
import { getExplanation } from '../services/backend';
import ShareResultModal from './ShareResultModal';
import DailyQuizShareCard from '../src/components/share/DailyQuizShareCard';
import { toPng } from 'html-to-image';
import { SHARE_CAPTION, SHARE_LINK_QUIZ } from '../src/constants/share';
import type { DailyQuizShareData } from '../src/types/share';
import { waitForCardAssets } from '../src/utils/share';

// TEAM_001: render results from session-embedded API questions instead of placeholder pool

interface ResultsViewProps {
  session: UserSession;
  onSignupClick: () => void;
  onRetryClick: () => void;
}

const ResultsView: React.FC<ResultsViewProps> = ({ session, onSignupClick, onRetryClick }) => {
  const [openQuestionId, setOpenQuestionId] = useState<string | null>(null);
  const [expState, setExpState] = useState<Record<string, { status: 'idle' | 'loading' | 'ready' | 'locked' | 'error'; text?: string }>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [shareImageUrl, setShareImageUrl] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const questions = getQuestionsForSession(session);
  const correctAnswers = session.score;
  const totalQuestions = questions.length;

  const fetchExplanationIfNeeded = async (id: string) => {
    const state = expState[id]?.status || 'idle';
    if (state === 'ready' || state === 'locked' || state === 'loading') return;
    setExpState((s) => ({ ...s, [id]: { status: 'loading' } }));
    try {
      const res = await getExplanation(id);
      if ('explanation' in res) {
        setExpState((s) => ({ ...s, [id]: { status: 'ready', text: res.explanation } }));
      } else if ('status' in res) {
        setExpState((s) => ({ ...s, [id]: { status: 'locked' } }));
      } else {
        setExpState((s) => ({ ...s, [id]: { status: 'error' } }));
      }
    } catch {
      setExpState((s) => ({ ...s, [id]: { status: 'error' } }));
    }
  };

  const toggleQuestion = (id: string) => {
    const next = openQuestionId === id ? null : id;
    setOpenQuestionId(next);
    if (next) fetchExplanationIfNeeded(next);
  };

  const generateImage = useCallback(async (): Promise<string | null> => {
    const node = cardRef.current;
    if (!node) return null;

    const t0 = performance.now();
    const rect = node.getBoundingClientRect();
    const style = getComputedStyle(node);
    console.info('[share_capture] preflight', {
      kind: 'daily_quiz',
      timestamp: Date.now(),
      nodeExists: !!node,
      offsetWidth: node.offsetWidth,
      offsetHeight: node.offsetHeight,
      boundingRect: { w: rect.width, h: rect.height, top: rect.top, left: rect.left },
      computedFontFamily: style.fontFamily,
      computedBgColor: style.backgroundColor,
      images: [...node.querySelectorAll('img')].map((img) => ({
        src: img.src,
        currentSrc: img.currentSrc,
        complete: img.complete,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
      })),
    });

    const sheets = [...document.styleSheets].map((sheet) => {
      let readable = false;
      try {
        void sheet.cssRules;
        readable = true;
      } catch {
        /* blocked */
      }
      return { href: sheet.href ?? '(inline)', readable };
    });
    console.info('[share_capture] stylesheets', {
      total: sheets.length,
      blocked: sheets.filter((s) => !s.readable).map((s) => s.href),
    });

    try {
      const t1 = performance.now();
      // TEAM_016: wait for fonts + images to load/decode to avoid blank captures
      await waitForCardAssets(node);
      const t2 = performance.now();
      const dataUrl = await toPng(node, {
        cacheBust: true,
        pixelRatio: 2,
        skipFonts: true,
        style: {
          position: 'static',
          left: 'auto',
          top: 'auto',
        },
        backgroundColor: '#f5f5dc',
      });
      const t3 = performance.now();

      console.info('[share_capture] timing_ms', {
        raf: Math.round(t1 - t0),
        assets: Math.round(t2 - t1),
        capture: Math.round(t3 - t2),
        total: Math.round(t3 - t0),
      });

      console.info('[share_capture] result', {
        dataUrlLength: dataUrl.length,
        startsWithPng: dataUrl.startsWith('data:image/png'),
        likelyBlank: dataUrl.length < 2_000,
      });

      return dataUrl;
    } catch (err: unknown) {
      console.error('[share_capture] error', {
        name: err instanceof Error ? err.name : typeof err,
        message: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : undefined,
      });
      return null;
    }
  }, []);

  const handleShareClick = useCallback(() => {
    void (async () => {
      setIsGenerating(true);
      try {
        // TEAM_016: allow offscreen card to render before capture
        await new Promise<void>((resolve) => {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => resolve());
          });
        });
        const dataUrl = await generateImage();
        if (dataUrl) {
          setShareImageUrl(dataUrl);
          setShowShareModal(true);
        }
      } finally {
        setIsGenerating(false);
      }
    })();
  }, [generateImage]);

  const percentage = Math.round((correctAnswers / totalQuestions) * 100);
  const readiness = session.readiness >= 80 ? 'Sangat Siap' : session.readiness >= 60 ? 'Siap' : session.readiness >= 40 ? 'Cukup Siap' : 'Perlu Latihan';
  const shareData: DailyQuizShareData = {
    kind: 'daily_quiz',
    userName: 'User', // TODO: Get from user context
    percentage,
    correct: correctAnswers,
    total: totalQuestions,
    percentile: session.percentile,
    readiness,
    generatedAt: new Date().toISOString(),
    link: SHARE_LINK_QUIZ,
  };

  return (
    <div className="flex flex-col w-full animate-fade-in pb-20 md:pb-0">

      {/* HERO SCORE SECTION */}
      <div className="flex flex-col md:flex-row border-b border-black">

        {/* Left: Score */}
        <div className="md:w-1/2 p-12 bg-brand-lime border-b md:border-b-0 md:border-r border-black flex flex-col justify-center items-center text-center">
          <span className="font-bold text-xs uppercase tracking-[0.2em] mb-4">Hasil Sesi</span>
          <h1 className="text-9xl font-black mb-2 leading-none tracking-tighter">
            {Math.round((correctAnswers / totalQuestions) * 100)}%
          </h1>
          <p className="font-bold text-xl mb-6">Anda menjawab {correctAnswers} dari {totalQuestions} dengan benar.</p>
          <div className="inline-block px-4 py-2 border border-black bg-white rounded-full text-xs font-black uppercase">
            Persentil {100 - session.percentile}% Teratas
          </div>
        </div>

        {/* Right: Actions */}
        <div className="md:w-1/2 bg-white p-8 flex flex-col justify-center items-start space-y-4">
          <h2 className="text-3xl font-black uppercase mb-2">Langkah Selanjutnya</h2>
          <p className="text-gray-600 mb-6 max-w-sm">Usaha yang bagus. Tinjau kesalahan Anda di bawah atau simpan sesi ini ke profil Anda.</p>

          <Button onClick={onSignupClick} variant="black" fullWidth size="lg">
            Simpan Progres
          </Button>
          <div className="flex w-full gap-3">
            <Button onClick={onRetryClick} variant="outline" fullWidth>
              <RefreshCw className="w-4 h-4 mr-2" /> Coba Lagi
            </Button>
            <Button onClick={handleShareClick} variant="outline">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* REVIEW LIST */}
      <div className="bg-bg">
        <div className="p-4 border-b border-black flex items-center gap-2 bg-gray-50">
          <div className="w-2 h-2 bg-black rounded-full"></div>
          <h3 className="font-black text-sm uppercase tracking-wider">Tinjauan Detail</h3>
        </div>

        <div>
          {questions.map((q, idx) => {
            const isCorrect = session.answers[q.id] === q.correct_option_id;
            const isOpen = openQuestionId === q.id;

            return (
              <div key={q.id} className="border-b border-black bg-white group">
                <button
                  onClick={() => toggleQuestion(q.id)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors focus:outline-none"
                >
                  <div className="flex items-center gap-6">
                    <span className={`
                      flex-shrink-0 w-8 h-8 flex items-center justify-center border border-black font-black text-sm
                      ${isCorrect ? 'bg-brand-lime' : 'bg-brand-pink'}
                    `}>
                      {idx + 1}
                    </span>
                    <div>
                      <p className={`font-bold text-base md:text-lg ${isCorrect ? 'text-black' : 'text-red-500'}`}>
                        {isCorrect ? 'Benar' : 'Salah'}
                      </p>
                      <p className="text-sm text-gray-500 font-medium truncate max-w-[200px] md:max-w-md">
                        {q.text}
                      </p>
                    </div>
                  </div>
                  {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>

                {isOpen && (
                  <div className="p-6 pt-0 pl-6 md:pl-20 max-w-3xl">
                    <div className="p-6 bg-brand-cream border border-black text-sm space-y-4">
                      <div>
                        <span className="font-black uppercase text-xs block mb-1 text-gray-500">Pertanyaan</span>
                        <p className="font-bold text-sm md:text-lg">{q.text}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`p-3 border border-black ${isCorrect ? 'bg-brand-lime' : 'bg-brand-pink/20'}`}>
                          <span className="text-[10px] font-black uppercase mb-1 block">Jawaban Anda</span>
                          <span className="font-bold">{q.options.find(o => o.id === session.answers[q.id])?.text || 'Dilewati'}</span>
                        </div>
                        <div className="p-3 border border-black bg-white">
                          <span className="text-[10px] font-black uppercase mb-1 block">Jawaban Benar</span>
                          <span className="font-bold">{q.options.find(o => o.id === q.correct_option_id)?.text}</span>
                        </div>
                      </div>

                      <div>
                        <span className="font-black uppercase text-xs block mb-1 text-gray-500">Penjelasan</span>
                        {(() => {
                          const st = expState[q.id]?.status || 'idle';
                          if (st === 'ready') {
                            return <p className="leading-relaxed">{expState[q.id]?.text}</p>;
                          }
                          if (st === 'locked') {
                            return (
                              <div className="flex items-center justify-between gap-3 p-3 border border-black bg-white">
                                <p className="text-sm font-medium">Fitur Premium. Tingkatkan akun untuk melihat pembahasan.</p>
                                <Button variant="black" size="sm" onClick={onSignupClick}>Naikkan Akun</Button>
                              </div>
                            );
                          }
                          if (st === 'loading') {
                            return <p className="text-sm text-gray-500">Memuat pembahasan...</p>;
                          }
                          return <p className="text-sm text-gray-500">Pembahasan tersedia untuk pengguna serius.</p>;
                        })()}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Offscreen share card */}
      <div
        ref={cardRef}
        style={{
          position: 'fixed',
          left: '-9999px',
          top: 0,
          width: '1080px',
          height: '1920px',
        }}
      >
        <DailyQuizShareCard data={shareData} />
      </div>

      {/* Share modal */}
      <ShareResultModal
        imageUrl={shareImageUrl}
        caption={SHARE_CAPTION}
        link={SHARE_LINK_QUIZ}
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
      />
    </div>
  );
};

export default ResultsView;