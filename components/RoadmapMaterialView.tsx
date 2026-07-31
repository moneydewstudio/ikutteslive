import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { apiFetch } from '../services/apiClient';
import { ArrowLeft, BookOpen, FileText, Play, CheckCircle2, Lightbulb, Target, BrainCircuit } from 'lucide-react';

type ExampleQuestion = {
  question: string;
  options: Array<{ key: string; text: string }>;
  correctKey: string;
  explanation: string;
};

type StructuredSection = {
  type: 'hook' | 'learning_objectives' | 'content' | 'checkpoint' | 'summary';
  title: string;
  body?: string;
  scenario?: string;
  objectives?: string[];
  question?: string;
  options?: Array<{ key: string; text: string; correct?: boolean }>;
  feedback?: string;
};

type MaterialJson = {
  themes: Array<{
    name: string;
    code: string;
    structuredContent: {
      estimatedMinutes: number;
      sections: StructuredSection[];
    } | null;
    exampleQuestions: ExampleQuestion[];
  }>;
};

type MaterialData = {
  subtopicId: number;
  subtopicName: string;
  content: string;
  exampleQuestions: ExampleQuestion[];
  materialJson: MaterialJson | null;
};

type Props = {
  subtopicId: number;
  initialThemeName?: string | null;
  onBack: () => void;
  onStartTest: (subtopicId: number) => void;
};

// ── Section renderers ──────────────────────────────────────────

const P = 'text-base text-gray-700 leading-relaxed';

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

const HookSection: React.FC<{ section: StructuredSection }> = ({ section }) => (
  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-xl mb-xl">
    <div className="flex items-start gap-md">
      <BrainCircuit className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" />
      <div>
        <h3 className="font-black text-base mb-sm">{section.title}</h3>
        <p className="text-gray-700 text-sm italic leading-relaxed">{section.scenario || section.body}</p>
      </div>
    </div>
  </div>
);

const ObjectivesSection: React.FC<{ section: StructuredSection }> = ({ section }) => (
  <div className="border border-gray-200 rounded-2xl p-xl mb-xl">
    <div className="flex items-center gap-2 mb-md">
      <Target className="w-5 h-5 text-gray-700" />
      <h3 className="font-black text-sm">{section.title}</h3>
    </div>
    <ul className="space-y-sm">
      {(section.objectives || []).map((obj, i) => (
        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
          <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
          <span>{obj}</span>
        </li>
      ))}
    </ul>
  </div>
);

const ContentSection: React.FC<{ section: StructuredSection }> = ({ section }) => (
  <div className="mb-xl">
    <h3 className="text-base font-black mb-md">{section.title}</h3>
    <div dangerouslySetInnerHTML={{ __html: renderMarkdown(section.body || '') }} />
  </div>
);

const CheckpointSection: React.FC<{ section: StructuredSection }> = ({ section }) => {
  const [selected, setSelected] = useState<string | null>(null);
  const correctOpt = section.options?.find(o => o.correct)?.key || null;

  const handleSelect = (key: string) => {
    if (selected) return;
    setSelected(key);
  };

  return (
    <div className="border-2 border-amber-300 rounded-2xl overflow-hidden mb-xl">
      <div className="bg-amber-50 px-xl py-md flex items-center gap-2">
        <Lightbulb className="w-5 h-5 text-amber-600" />
        <h3 className="font-black text-sm text-amber-800">{section.title}</h3>
      </div>
      <div className="p-xl">
        <p className="font-bold text-sm mb-md">{section.question}</p>
        <div className="space-y-sm">
          {section.options?.map(opt => {
            const isSelected = selected === opt.key;
            const isCorrect = opt.key === correctOpt;
            let cls = 'border rounded-xl px-md py-sm text-sm transition-colors cursor-pointer ';
            if (!selected) {
              cls += 'border-gray-200 hover:border-gray-400';
            } else if (isCorrect) {
              cls += 'border-green-500 bg-green-50 text-green-800 font-bold';
            } else if (isSelected) {
              cls += 'border-red-500 bg-red-50 text-red-800';
            } else {
              cls += 'border-gray-200 text-gray-400';
            }
            return (
              <div key={opt.key} onClick={() => handleSelect(opt.key)} className={cls}>
                <span className="font-bold mr-sm uppercase">{opt.key}.</span>
                {opt.text}
                {selected && isCorrect && ' ✅'}
                {isSelected && !isCorrect && ' ❌'}
              </div>
            );
          })}
        </div>
        {selected && section.feedback && (
          <div className="mt-md p-md bg-amber-50 rounded-xl border border-amber-200">
            <p className="text-sm text-amber-800">{section.feedback}</p>
          </div>
        )}
      </div>
    </div>
  );
};

const SummarySection: React.FC<{ section: StructuredSection }> = ({ section }) => (
  <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-300 rounded-2xl p-xl mb-xl">
    <div className="flex items-start gap-md">
      <BookOpen className="w-5 h-5 text-gray-600 shrink-0 mt-0.5" />
      <div>
        <h3 className="font-black text-sm mb-sm">{section.title}</h3>
        <div dangerouslySetInnerHTML={{ __html: renderMarkdown(section.body || '') }} />
      </div>
    </div>
  </div>
);

const RoadmapMaterialView: React.FC<Props> = ({ subtopicId, onBack, onStartTest }) => {
  const [data, setData] = useState<MaterialData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'materi' | 'contoh'>('materi');
  const [expandedExample, setExpandedExample] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      try {
        const res = await apiFetch(`/roadmap/materials?subtopicId=${subtopicId}`);
        if (res.ok) {
          const json = await res.json();
          if (!cancelled) setData(json as MaterialData);
        }
      } catch {}
      if (!cancelled) setLoading(false);
    };
    void run();
    return () => { cancelled = true; };
  }, [subtopicId]);

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
        <button onClick={onBack} className="text-sm font-bold text-black underline">Kembali</button>
      </div>
    );
  }

  const allSections: Array<{ themeName: string; sections: StructuredSection[] }> =
    data.materialJson?.themes
      ?.filter(t => t.structuredContent?.sections?.length)
      ?.map(t => ({ themeName: t.name, sections: t.structuredContent!.sections })) ?? [];

  const hasStructured = allSections.length > 0;

  const TABS = [
    { key: 'materi' as const, label: 'Materi', icon: BookOpen },
    { key: 'contoh' as const, label: 'Contoh Soal', icon: FileText },
  ];

  return (
    <div className="flex flex-col w-full min-h-0 animate-fade-in pb-20 md:pb-0">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200">
        <div className="flex items-center gap-sm px-2xl h-14">
          <button onClick={onBack} className="flex items-center gap-1 text-sm font-bold text-gray-600 hover:text-black">
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </button>
          <span className="text-sm text-gray-400 mx-1">/</span>
          <span className="text-sm font-bold truncate">{data.subtopicName}</span>
        </div>

        {/* Tab bar */}
        <div className="flex px-2xl gap-lg">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 pb-3 text-sm font-bold border-b-2 transition-colors ${
                  isActive
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'materi' ? (
            <motion.div
              key="materi"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.2 }}
              className="px-2xl py-xl"
            >
              {hasStructured ? (
                allSections.map((theme, ti) => (
                  <div key={ti} className="mb-2xl">
                    {allSections.length > 1 && (
                      <h2 className="text-lg font-black mb-lg border-b border-gray-200 pb-sm">{theme.themeName}</h2>
                    )}
                    {theme.sections.map((sec, si) => {
                      switch (sec.type) {
                        case 'hook': return <HookSection key={si} section={sec} />;
                        case 'learning_objectives': return <ObjectivesSection key={si} section={sec} />;
                        case 'content': return <ContentSection key={si} section={sec} />;
                        case 'checkpoint': return <CheckpointSection key={si} section={sec} />;
                        case 'summary': return <SummarySection key={si} section={sec} />;
                        default: return null;
                      }
                    })}
                  </div>
                ))
              ) : (
                <div dangerouslySetInnerHTML={{ __html: renderMarkdown(data.content) }} />
              )}

              {/* CTA */}
              <div className="mt-2xl mb-xl">
                <button
                  onClick={() => onStartTest(subtopicId)}
                  className="w-full flex items-center justify-center gap-2 bg-black text-white font-black text-lg py-4 px-xl rounded-xl hover:bg-gray-800 transition-colors"
                >
                  <Play className="w-5 h-5" />
                  Mulai Tes (10 Soal)
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="contoh"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.2 }}
              className="px-2xl py-xl"
            >
              {(!data.exampleQuestions || data.exampleQuestions.length === 0) ? (
                <div className="text-center py-3xl">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-lg" />
                  <p className="text-gray-500 text-sm">Belum ada contoh soal untuk subtopik ini.</p>
                </div>
              ) : (
                <div className="space-y-xl">
                  {data.exampleQuestions.map((eq, idx) => {
                    const isExpanded = expandedExample === idx;
                    const userAnswer = userAnswers[idx];
                    const isAnswered = userAnswer !== undefined;

                    return (
                      <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden">
                        {/* Question header */}
                        <div className="p-lg bg-gray-50 border-b border-gray-200">
                          <span className="text-xs font-bold text-gray-400">CONTOH {idx + 1}</span>
                          <p className="font-bold text-sm mt-1">{eq.question}</p>
                        </div>

                        {/* Options */}
                        <div className="p-lg space-y-sm">
                          {eq.options.map((opt) => {
                            const isSelected = userAnswer === opt.key;
                            const isCorrectOpt = opt.key === eq.correctKey;
                            let optClasses = 'border border-gray-200 rounded-lg px-md py-sm text-sm transition-colors';

                            if (isAnswered) {
                              if (isCorrectOpt) {
                                optClasses += ' bg-green-50 border-green-500 text-green-800 font-bold';
                              } else if (isSelected && !isCorrectOpt) {
                                optClasses += ' bg-red-50 border-red-500 text-red-800';
                              } else {
                                optClasses += ' text-gray-400';
                              }
                            } else {
                              optClasses += ' hover:border-gray-400 cursor-pointer';
                            }

                            return (
                              <div
                                key={opt.key}
                                onClick={() => {
                                  if (!isAnswered) {
                                    setUserAnswers((prev) => ({ ...prev, [idx]: opt.key }));
                                    setExpandedExample(idx);
                                  }
                                }}
                                className={optClasses}
                              >
                                <span className="font-bold mr-sm uppercase">{opt.key}.</span>
                                {opt.text}
                                {isAnswered && isCorrectOpt && ' ✅'}
                                {isAnswered && isSelected && !isCorrectOpt && ' ❌'}
                              </div>
                            );
                          })}
                        </div>

                        {/* Expandable explanation */}
                        {isAnswered && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            className="border-t border-gray-200"
                          >
                            <div className="p-lg bg-amber-50">
                              <button
                                onClick={() => setExpandedExample(isExpanded ? null : idx)}
                                className="flex items-center gap-1 text-xs font-bold text-amber-700 mb-sm"
                              >
                                {isExpanded ? 'Sembunyikan' : 'Lihat'} Pembahasan
                              </button>
                              {isExpanded && (
                                <p className="text-sm text-gray-700">{eq.explanation}</p>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* CTA after examples */}
              <div className="mt-2xl mb-xl">
                <button
                  onClick={() => onStartTest(subtopicId)}
                  className="w-full flex items-center justify-center gap-2 bg-black text-white font-black text-lg py-4 px-xl rounded-xl hover:bg-gray-800 transition-colors"
                >
                  <Play className="w-5 h-5" />
                  Mulai Tes (10 Soal)
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RoadmapMaterialView;
