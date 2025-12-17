import React, { useState } from 'react';
import { UserSession } from '../types';
import Button from './Button';
import { ChevronDown, ChevronUp, Check, X, Share2, RefreshCw } from 'lucide-react';
import { getQuestionsByIds } from '../services/quizService';

interface ResultsViewProps {
  session: UserSession;
  onSignupClick: () => void;
  onRetryClick: () => void;
}

const ResultsView: React.FC<ResultsViewProps> = ({ session, onSignupClick, onRetryClick }) => {
  const [openQuestionId, setOpenQuestionId] = useState<string | null>(null);
  
  const questions = getQuestionsByIds(session.questionIds);
  const correctAnswers = session.score;
  const totalQuestions = questions.length;
  
  const toggleQuestion = (id: string) => {
    setOpenQuestionId(openQuestionId === id ? null : id);
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
                  <Button onClick={() => {}} variant="outline">
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
                          <p className={`font-bold text-lg ${isCorrect ? 'text-black' : 'text-red-500'}`}>
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
                    <div className="p-6 pt-0 pl-20 max-w-3xl">
                      <div className="p-6 bg-brand-cream border border-black text-sm space-y-4">
                          <div>
                              <span className="font-black uppercase text-xs block mb-1 text-gray-500">Pertanyaan</span>
                              <p className="font-bold text-lg">{q.text}</p>
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
                              <p className="leading-relaxed">{q.explanation}</p>
                          </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
      </div>
    </div>
  );
};

export default ResultsView;