import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { apiFetch } from '../services/apiClient';
import { ArrowLeft, BookOpen, FileText, Play } from 'lucide-react';

type ExampleQuestion = {
  question: string;
  options: Array<{ key: string; text: string }>;
  correctKey: string;
  explanation: string;
};

type MaterialData = {
  subtopicId: number;
  subtopicName: string;
  content: string;
  exampleQuestions: ExampleQuestion[];
};

type Props = {
  subtopicId: number;
  onBack: () => void;
  onStartTest: (subtopicId: number) => void;
};

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
              <div
                className="prose prose-sm max-w-none prose-headings:font-black prose-headings:text-lg prose-p:text-gray-700 prose-p:leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: data.content
                    .replace(/^### (.+)$/gm, '<h3 class="text-base font-black mt-xl mb-sm">$1</h3>')
                    .replace(/^## (.+)$/gm, '<h2 class="text-lg font-black mt-2xl mb-md">$1</h2>')
                    .replace(/^# (.+)$/gm, '<h1 class="text-xl font-black mt-2xl mb-md">$1</h1>')
                    .replace(/^- (.+)$/gm, '<li class="ml-lg list-disc text-gray-700">$1</li>')
                    .replace(/^(\d+)\. (.+)$/gm, '<li class="ml-lg list-decimal text-gray-700">$2</li>')
                    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\n\n/g, '</p><p class="text-gray-700 mt-md">')
                }}
              />

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
