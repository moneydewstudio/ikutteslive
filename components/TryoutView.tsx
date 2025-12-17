import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Clock, Calendar, ChevronRight, ArrowUpRight, Menu, X, CheckCircle, ChevronLeft, Award, RefreshCw, XCircle, Loader2 } from 'lucide-react';
import Button from './Button';
import QuizCard from './QuizCard';
import { Question } from '../types';

// Mock Data Generator for Tryout (Fallback Strategy)
const generateTryoutQuestions = (): Question[] => {
  return Array.from({ length: 30 }).map((_, i) => ({
    id: `to_${i + 1}`,
    subject: i < 10 ? 'TWK' : i < 20 ? 'TIU' : 'TKP',
    difficulty: 3,
    text: `[Simulasi ${i + 1}] Dalam hal terjadi kekosongan Wakil Presiden, selambat-lambatnya dalam jangka waktu beberapa hari Majelis Permusyawaratan Rakyat menyelenggarakan sidang untuk memilih Wakil Presiden?`,
    options: [
      { id: 'a', text: '60 hari' },
      { id: 'b', text: '90 hari' },
      { id: 'c', text: '30 hari' },
      { id: 'd', text: '70 hari' },
      { id: 'e', text: '20 hari' }
    ],
    correct_option_id: 'a',
    explanation: 'Sesuai UUD 1945 Pasal 8 ayat 2.'
  }));
};

interface ScoreResult {
  totalScore: number;
  details: {
    twk: number;
    tiu: number;
    tkp: number;
  };
  correctCount: number;
  totalQuestions: number;
  passed: boolean;
}

// --- EXTRACTED & MEMOIZED COMPONENTS ---

interface GridItemProps { 
  index: number; 
  isActive: boolean; 
  isAnswered: boolean; 
  onSelect: (index: number) => void;
}

const GridItem = React.memo(({ index, isActive, isAnswered, onSelect }: GridItemProps) => {
    let styleClass = "bg-gray-500";
    if (isAnswered) styleClass = "bg-green-600";
    if (isActive) styleClass = "bg-red-500";
    
    return (
      <button
        onClick={() => onSelect(index)}
        className={`w-10 h-10 rounded text-xs font-bold flex items-center justify-center text-white transition-transform active:scale-95 ${styleClass} border border-black/10`}
      >
        {index + 1}
      </button>
    );
});

const SubmitButton = React.memo(({ onClick }: { onClick: () => void }) => (
    <button 
        onClick={onClick}
        className="w-full px-6 py-3 rounded border border-black bg-brand-orange text-black font-bold text-sm hover:bg-opacity-90 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-none flex items-center justify-center gap-2"
     >
        <CheckCircle className="w-4 h-4" />
        Cek Nilaimu Sekarang!
     </button>
));

const TryoutView: React.FC = () => {
  const [isStarted, setIsStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  
  // Simulation State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds
  const [isMobileGridOpen, setIsMobileGridOpen] = useState(false);
  
  // Result State
  const [result, setResult] = useState<ScoreResult | null>(null);

  // FETCHING STRATEGY: Firestore First -> Fallback to Generator
  useEffect(() => {
    if (isStarted && !result && questions.length === 0) {
      const fetchQuestions = async () => {
        setIsLoading(true);
        try {
          // 1. Production Check
          const isProduction = process.env.NODE_ENV === 'production';

          if (isProduction) {
            // Placeholder for Firestore Logic
            // await db.collection('tryouts').doc('active').get();
            
            // Simulating network request failure for demo purposes to trigger fallback
            // In real app: remove the throw and implement actual fetch
            await new Promise(resolve => setTimeout(resolve, 1000));
            throw new Error("Firestore unavailable in demo environment");
          } else {
            // 2. Demo Environment: Simulate delay for realism
            await new Promise(resolve => setTimeout(resolve, 800));
            setQuestions(generateTryoutQuestions());
          }
        } catch (error) {
          console.warn("Fetching failed or in demo mode, using fallback generator.", error);
          // 3. Fallback Strategy
          setQuestions(generateTryoutQuestions());
        } finally {
          setIsLoading(false);
        }
      };

      fetchQuestions();
    }
  }, [isStarted, result, questions.length]);

  // TIMER LOGIC
  useEffect(() => {
    if (isStarted && !result && !isLoading && questions.length > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 0) {
            clearInterval(timer);
            // Auto-submit logic could be triggered here
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isStarted, result, isLoading, questions.length]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleAnswer = useCallback((optionId: string) => {
    if (!questions[currentIndex]) return;
    const qId = questions[currentIndex].id;
    setAnswers(prev => ({ ...prev, [qId]: optionId }));
    // No auto-advance in Tryout mode to allow review
  }, [questions, currentIndex]);

  const handleNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex, questions.length]);
  
  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  const handleJumpToQuestion = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const handleMobileJump = useCallback((index: number) => {
      setCurrentIndex(index);
      setIsMobileGridOpen(false);
  }, []);

  const stats = useMemo(() => {
    const answered = Object.keys(answers).length;
    const total = questions.length;
    return { answered, unread: total - answered, unanswered: 0 }; 
  }, [answers, questions.length]);

  const calculateScore = useCallback(() => {
    let twk = 0;
    let tiu = 0;
    let tkp = 0;
    let correct = 0;

    questions.forEach(q => {
      const userAnswer = answers[q.id];
      if (userAnswer === q.correct_option_id) {
        correct++;
        // CPNS Logic: 5 points per correct answer
        if (q.subject === 'TWK') twk += 5;
        if (q.subject === 'TIU') tiu += 5;
        if (q.subject === 'TKP') tkp += 5; 
      }
    });

    // Mock Passing Grade Logic
    const passed = twk >= 30 && tiu >= 30 && tkp >= 30; // Simplified thresholds

    setResult({
      totalScore: twk + tiu + tkp,
      details: { twk, tiu, tkp },
      correctCount: correct,
      totalQuestions: questions.length,
      passed
    });
    setIsMobileGridOpen(false);
  }, [questions, answers]);

  const handleRetry = useCallback(() => {
    setResult(null);
    setIsStarted(false);
    setQuestions([]); // Clear questions to force re-fetch
    setAnswers({});
    setCurrentIndex(0);
    setTimeLeft(30 * 60);
  }, []);

  // --- RENDER ---

  if (!isStarted) {
    return (
      <div className="flex flex-col w-full animate-fade-in pb-20 md:pb-0">
         <div className="grid grid-cols-1 md:grid-cols-2 min-h-[calc(100vh-80px)]">
             {/* Left: Main Action */}
             <div className="p-8 md:p-12 border-b md:border-b-0 md:border-r border-black bg-brand-purple flex flex-col justify-center relative overflow-hidden">
                 <div className="relative z-10">
                     <div className="inline-flex items-center gap-2 border border-black bg-black text-white px-3 py-1 rounded-full text-xs font-bold uppercase mb-6">
                         <Clock className="w-3 h-3" />
                         Waktu Terbatas
                     </div>
                     <h1 className="text-5xl md:text-7xl font-black leading-none mb-6">
                         Tryout<br/>Akbar
                     </h1>
                     <p className="font-bold text-lg mb-8 max-w-md">
                         Simulasi skala penuh. 30 soal. 30 menit. 
                         Uji diri Anda dengan antarmuka CAT standar BKN.
                     </p>
                     <Button size="lg" variant="black" withArrow onClick={() => setIsStarted(true)}>
                         Mulai Simulasi
                     </Button>
                 </div>
                 <div className="absolute -bottom-20 -right-20 w-64 h-64 border-[40px] border-black opacity-10 rounded-full"></div>
             </div>
             {/* Right: Info */}
             <div className="flex flex-col bg-white">
                 <div className="flex-1 border-b border-black p-8 flex flex-col justify-center">
                     <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                         <Calendar className="w-5 h-5" /> Jadwal
                     </h3>
                     <div className="space-y-4">
                         {[1, 2, 3].map(i => (
                             <div key={i} className="flex items-center justify-between p-4 border border-black hover:bg-gray-50 cursor-pointer transition-colors group">
                                 <div>
                                     <div className="font-black text-lg">Gelombang {i}</div>
                                     <div className="text-xs text-gray-500 font-bold">10 Okt 2024 • 09:00 WIB</div>
                                 </div>
                                 <ChevronRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                             </div>
                         ))}
                     </div>
                 </div>
                 <div className="h-1/3 bg-brand-lime p-8 flex items-center justify-between">
                     <div>
                         <div className="text-xs font-black uppercase tracking-widest mb-1">Peserta</div>
                         <div className="text-4xl font-black">1,240</div>
                     </div>
                     <div className="h-12 w-12 bg-black text-brand-lime flex items-center justify-center rounded-full">
                         <ArrowUpRight className="w-6 h-6" />
                     </div>
                 </div>
             </div>
         </div>
      </div>
    );
  }

  // LOADING STATE
  if (isLoading) {
    return (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center space-y-4 font-sans">
            <Loader2 className="w-12 h-12 animate-spin text-brand-black" />
            <p className="font-bold text-lg animate-pulse">Menyiapkan Paket Soal...</p>
        </div>
    );
  }

  // SIMULATION VIEW (Overlay Mode)
  const currentQ = questions[currentIndex];
  // Safety check if loading failed or array empty
  if (!currentQ && !isLoading) return <div className="p-8">Gagal memuat soal. Silakan refresh.</div>;

  return (
    <div className="fixed inset-0 z-[100] bg-gray-100 flex flex-col font-sans overflow-hidden">
      
      {/* RESULT MODAL */}
      {result && (
        <div className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
           <div className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border-2 border-black animate-scale-in">
              <div className={`p-6 text-center border-b border-black ${result.passed ? 'bg-brand-lime' : 'bg-brand-pink'}`}>
                  {result.passed ? <Award className="w-12 h-12 mx-auto mb-2" /> : <XCircle className="w-12 h-12 mx-auto mb-2" />}
                  <h2 className="text-2xl font-black uppercase tracking-tight">{result.passed ? 'Lulus Passing Grade' : 'Belum Lulus'}</h2>
                  <p className="font-medium opacity-80">{result.passed ? 'Pertahankan performa ini!' : 'Jangan menyerah, coba lagi!'}</p>
              </div>
              <div className="p-6 bg-brand-cream">
                  <div className="flex justify-between items-center mb-6">
                      <span className="font-bold text-gray-500 uppercase text-xs">Total Skor</span>
                      <span className="font-black text-4xl">{result.totalScore}</span>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                      <div className="flex justify-between p-3 bg-white border border-black rounded">
                          <span className="font-bold text-sm">TWK (Kebangsaan)</span>
                          <span className="font-black">{result.details.twk}</span>
                      </div>
                      <div className="flex justify-between p-3 bg-white border border-black rounded">
                          <span className="font-bold text-sm">TIU (Intelegensia)</span>
                          <span className="font-black">{result.details.tiu}</span>
                      </div>
                       <div className="flex justify-between p-3 bg-white border border-black rounded">
                          <span className="font-bold text-sm">TKP (Pribadi)</span>
                          <span className="font-black">{result.details.tkp}</span>
                      </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                     <Button variant="outline" onClick={handleRetry}>
                        <RefreshCw className="w-4 h-4 mr-2" /> Ulangi
                     </Button>
                     <Button variant="black" onClick={() => setIsStarted(false)}>
                        Tutup
                     </Button>
                  </div>
              </div>
           </div>
        </div>
      )}

      {/* 1. Header */}
      <div className="bg-white border-b border-black shadow-sm h-16 flex items-center justify-between px-4 md:px-8 flex-shrink-0 z-20">
         <h2 className="font-bold text-lg md:text-xl truncate mr-4">
            Try Out TWK (Tes Wawasan Kebangsaan) 26 
            <span className="ml-2 text-sm font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded">No. {currentIndex + 1}</span>
         </h2>
         <div className="text-xl md:text-2xl font-bold text-red-600 font-mono tracking-widest bg-red-50 px-3 py-1 rounded border border-red-100">
            {formatTime(timeLeft)}
         </div>
      </div>

      {/* 2. Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative">
          
          {/* Left Column: Question Area */}
          <div className="flex-1 flex flex-col min-w-0 bg-gray-50">
              
              {/* Reusing QuizCard for Content */}
              <div className="flex-1 relative border-b border-black md:border-b-0 min-h-0">
                  <QuizCard 
                      question={currentQ}
                      selectedOptionId={answers[currentQ.id]}
                      onSelectOption={handleAnswer}
                      questionIndex={currentIndex}
                      totalQuestions={questions.length}
                      hideSubjectLabel={true}
                  />
              </div>

              {/* Bottom Navigation Bar */}
              <div className="h-auto border-t border-black bg-white p-4 flex items-center justify-between shrink-0 z-10">
                  <div className="flex gap-2 w-full md:w-auto">
                    <button 
                        onClick={handlePrev}
                        disabled={currentIndex === 0}
                        className="flex-1 md:flex-none justify-center px-4 py-2 rounded border border-black bg-gray-100 text-black font-bold text-sm hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                        <ChevronLeft className="w-4 h-4 mr-1" /> Sebelumnya
                    </button>
                    <button 
                        onClick={handleNext}
                        disabled={currentIndex === questions.length - 1}
                        className="flex-1 md:flex-none justify-center px-4 py-2 rounded border border-black bg-brand-lime text-black font-bold text-sm hover:bg-opacity-80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                        Selanjutnya <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                    <button 
                        onClick={() => setIsMobileGridOpen(true)}
                        className="md:hidden px-3 py-2 rounded border border-black bg-black text-white hover:bg-gray-800 transition-colors flex items-center justify-center"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                  </div>
              </div>
          </div>

          {/* Right Column: Navigation Grid (Desktop) */}
          <div className="hidden md:flex w-80 bg-white border-l border-black flex-col flex-shrink-0">
             <div className="p-4 border-b border-black bg-brand-cream">
                <h3 className="font-black text-sm uppercase tracking-wider">Navigasi Soal</h3>
             </div>
             
             <div className="p-4 flex-1 overflow-y-auto bg-gray-50">
                 <div className="grid grid-cols-5 gap-2">
                    {questions.map((q, idx) => (
                        <GridItem 
                            key={q.id} 
                            index={idx} 
                            isActive={idx === currentIndex}
                            isAnswered={!!answers[q.id]}
                            onSelect={handleJumpToQuestion}
                        />
                    ))}
                 </div>
             </div>

             {/* Legend */}
             <div className="p-4 bg-white border-t border-black space-y-2 text-xs font-bold text-gray-600">
                 <div className="flex items-center justify-between">
                     <span className="flex items-center gap-2"><div className="w-3 h-3 bg-green-600 rounded border border-black"></div> Terjawab</span>
                     <span>{stats.answered}</span>
                 </div>
                 <div className="flex items-center justify-between">
                     <span className="flex items-center gap-2"><div className="w-3 h-3 bg-red-500 rounded border border-black"></div> Posisi Sekarang</span>
                     <span>-</span>
                 </div>
                 <div className="flex items-center justify-between">
                     <span className="flex items-center gap-2"><div className="w-3 h-3 bg-gray-500 rounded border border-black"></div> Belum Dijawab</span>
                     <span>{stats.unread}</span>
                 </div>
             </div>
             
             {/* Submit Button (Desktop) */}
             <div className="p-4 border-t border-black bg-white">
                <SubmitButton onClick={calculateScore} />
             </div>
          </div>

      </div>

      {/* Mobile Grid Toggle & Drawer */}
      <div className="md:hidden">
          {/* Drawer Overlay */}
          {isMobileGridOpen && (
              <div className="fixed inset-0 z-[110] bg-black/50 backdrop-blur-sm flex justify-end">
                  <div className="w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col animate-slide-in-right border-l border-black">
                      <div className="p-4 border-b border-black flex justify-between items-center bg-brand-cream">
                          <h3 className="font-black text-lg">Daftar Soal</h3>
                          <button onClick={() => setIsMobileGridOpen(false)} className="p-1 hover:bg-black hover:text-white rounded border border-transparent hover:border-black transition-colors">
                              <X className="w-6 h-6" />
                          </button>
                      </div>
                      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                          <div className="grid grid-cols-5 gap-3">
                                {questions.map((q, idx) => (
                                    <GridItem 
                                        key={q.id} 
                                        index={idx} 
                                        isActive={idx === currentIndex}
                                        isAnswered={!!answers[q.id]}
                                        onSelect={handleMobileJump}
                                    />
                                ))}
                          </div>
                      </div>

                      {/* Submit Button (Mobile) */}
                      <div className="p-4 border-t border-black bg-white">
                         <SubmitButton onClick={calculateScore} />
                      </div>
                  </div>
              </div>
          )}
      </div>

    </div>
  );
};

export default TryoutView;