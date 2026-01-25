import React, { useState, useEffect, useCallback } from 'react';
import { ViewState, UserSession, User } from './types';
import * as QuizService from './services/quizService';
import { authService } from './services/authService';
import ProgressBar from './components/ProgressBar';
import QuizCard from './components/QuizCard';
import ResultsView from './components/ResultsView';
import SignupModal from './components/SignupModal';
import Dashboard from './components/Dashboard'; 
import BottomNav from './components/BottomNav';
import BonusView from './components/BonusView';
import TryoutView from './components/TryoutView';
import DrillsView from './components/DrillsView';
import InterstitialAd from './components/InterstitialAd';
import Button from './components/Button';

// TEAM_001: switch Latihan session creation to API-backed questions (Neon via Worker)

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('QUIZ');
  const [session, setSession] = useState<UserSession | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isQuizLoading, setIsQuizLoading] = useState(false);

  // AUTH LISTENER
  useEffect(() => {
    let isMounting = true;
    const unsubscribe = authService.subscribeToAuthChanges(async (authUser) => {
      if (!isMounting) return;

      if (authUser) {
        // Map Firebase Auth User to internal User type
        setUser({
          id: authUser.uid,
          name: authUser.displayName || (authUser.isAnonymous ? 'Tamu' : 'Pelajar'),
          email: authUser.email || undefined,
          isPro: false,
          streak: 0 // Will be fetched from backend in later steps
        });
        setIsAuthLoading(false);
      } else {
        // No user found. Attempt Anonymous Sign-in.
        setUser(null);
        
        try {
          await authService.signInAnonymously();
          // If successful, onAuthStateChanged will fire again with the user.
        } catch (err: any) {
          // Fallback for unauthorized domain or restricted auth
          if (isMounting) {
            console.warn("Guest fallback active due to:", err.code);
            setUser({
               id: 'local_guest',
               name: 'Tamu',
               isPro: false,
               streak: 0
            });
            setIsAuthLoading(false);
          }
        }
      }
    });

    return () => {
      isMounting = false;
      unsubscribe();
    };
  }, []);

  // TEAM_004: use server-defined daily quiz (rotates at 00:00 UTC+07) as the default Latihan session
  const handleStartQuiz = useCallback(async () => {
    setIsQuizLoading(true);
    try {
      const newSession = await QuizService.createDailySessionFromApi();
      setSession(newSession);
      setCurrentQuestionIdx(0);
      setView('QUIZ');
    } finally {
      setIsQuizLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!session?.refreshAt) return;
    const ms = session.refreshAt - Date.now();
    if (!Number.isFinite(ms)) return;

    if (ms <= 0) {
      QuizService.clearSession();
      void handleStartQuiz();
      return;
    }

    const timer = window.setTimeout(() => {
      QuizService.clearSession();
      void handleStartQuiz();
    }, ms);

    return () => window.clearTimeout(timer);
  }, [session?.refreshAt, handleStartQuiz]);

  useEffect(() => {
    const savedSession = QuizService.loadSession();
    if (savedSession) {
      setSession(savedSession);
      const answeredCount = Object.keys(savedSession.answers).length;
      if (answeredCount < savedSession.questionIds.length) {
        setCurrentQuestionIdx(answeredCount);
        setView('QUIZ');
      } else {
        const calculated = QuizService.calculateResults(savedSession);
        setSession(calculated);
        setView('RESULTS');
      }
    } else {
      handleStartQuiz();
    }
  }, []);

  const handleOptionSelect = (optionId: string) => {
    if (!session) return;
    const currentQId = session.questionIds[currentQuestionIdx];
    const updatedSession = {
      ...session,
      answers: { ...session.answers, [currentQId]: optionId }
    };
    setSession(updatedSession);
    QuizService.saveSession(updatedSession);

    setTimeout(() => {
      if (currentQuestionIdx < session.questionIds.length - 1) {
        setCurrentQuestionIdx(prev => prev + 1);
      } else {
        finishQuiz(updatedSession);
      }
    }, 250);
  };

  const finishQuiz = (finalSession: UserSession) => {
    const resultSession = QuizService.calculateResults(finalSession);
    setSession(resultSession);
    QuizService.clearSession();

    if (user && user.isPro) {
      setView('RESULTS');
    } else {
      setView('AD_INTERSTITIAL');
    }
  };

  const handleAdComplete = () => {
    setView('RESULTS');
  };

  const handleGoPro = () => {
    alert("Fitur Premium akan tersedia untuk pengguna serius. Segera hadir!");
    setView('RESULTS');
  };

  const handleSignupConfirm = async () => {
    try {
      await authService.signInWithGoogle();
      setShowSignupModal(false);
    } catch (err: any) {
      console.error("Sign-in failed", err);
      // Handle domain unauthorized specifically
      if (err?.code === 'auth/unauthorized-domain' || err?.message?.includes('unauthorized-domain')) {
        alert("Domain ini belum terdaftar di Firebase.\n\nAnda tetap dapat menggunakan aplikasi sebagai Tamu.");
        setShowSignupModal(false);
        
        // Ensure guest mode is active if we don't have a user yet
        if (!user || user.id !== 'local_guest') {
            setUser({
              id: 'local_guest',
              name: 'Tamu',
              isPro: false,
              streak: 0
            });
        }
      } else {
        alert("Gagal masuk: " + (err.message || "Terjadi kesalahan"));
      }
    }
  };

  const handleLogout = async () => {
    await authService.signOut();
  };

  const handleLogoClick = () => {
    if (session && session.completedAt) {
      setView('RESULTS');
    } else if (session) {
      setView('QUIZ');
    } else {
      handleStartQuiz();
    }
  };

  // --- HEADER COMPONENT ---
  const Header = () => (
    <header className="sticky top-0 z-50 bg-bg border-b border-black h-20 flex items-center justify-between px-6 lg:px-12 w-full">
      <div className="flex items-center gap-2 cursor-pointer" onClick={handleLogoClick}>
        <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-brand-lime rounded-full"></div>
        </div>
        <span className="font-black text-xl tracking-tight">Ikuttes</span>
      </div>

      {/* TEAM_008: fix desktop menu spacing by adding consistent gap + clickable padding on nav items */}
      <nav className="hidden md:flex items-center gap-2 lg:gap-6 font-bold text-sm uppercase tracking-wide">
        <button onClick={handleLogoClick} className={`px-2 py-1 hover:text-gray-600 transition-colors ${view === 'QUIZ' || view === 'RESULTS' ? 'text-black' : 'text-gray-400'}`}>Latihan</button>
        {/* TEAM_005: add daily drills entrypoint */}
        <button onClick={() => setView('DRILLS')} className={`px-2 py-1 hover:text-gray-600 transition-colors ${view === 'DRILLS' ? 'text-black' : 'text-gray-400'}`}>Drill</button>
        <button onClick={() => setView('BONUS')} className={`px-2 py-1 hover:text-gray-600 transition-colors ${view === 'BONUS' ? 'text-black' : 'text-gray-400'}`}>Bonus</button>
        <button onClick={() => setView('TRYOUT')} className={`px-2 py-1 hover:text-gray-600 transition-colors ${view === 'TRYOUT' ? 'text-black' : 'text-gray-400'}`}>Tryout</button>
        <button onClick={() => setView('PROFILE')} className={`px-2 py-1 hover:text-gray-600 transition-colors ${view === 'PROFILE' ? 'text-black' : 'text-gray-400'}`}>Statistik</button>
      </nav>

      <div>
        {user && !user.name?.includes('Tamu') ? (
           <Button variant="black" size="sm" onClick={() => setView('PROFILE')}>
              Profil Saya
           </Button>
        ) : (
           <Button variant="black" size="sm" onClick={() => setShowSignupModal(true)} isLoading={isAuthLoading}>
              Masuk
           </Button>
        )}
      </div>
    </header>
  );

  const renderContent = () => {
    switch (view) {
      case 'BONUS':
        return <BonusView />;
      case 'DRILLS':
        return <DrillsView onSignupClick={() => setShowSignupModal(true)} />;
      case 'TRYOUT':
        return <TryoutView />;
      case 'PROFILE':
        return <Dashboard user={user || { id: '', isPro: false, streak: 0 }} history={QuizService.getHistory()} onStartQuiz={handleStartQuiz} />;
      case 'QUIZ':
        if (!session) return null;
        const questions = QuizService.getQuestionsForSession(session);
        if (questions.length === 0) {
          if (isQuizLoading) {
            return (
              <div className="flex-1 flex items-center justify-center">
                <span className="font-medium text-sm text-gray-500">Memuat soal...</span>
              </div>
            );
          }
          return null;
        }
        const currentQ = questions[currentQuestionIdx];
        return (
          <div className="flex flex-col h-[calc(100vh-80px)] w-full">
             <div className="w-full h-1 bg-gray-200">
                <div 
                  className="h-full bg-brand-lime transition-all duration-300 ease-out"
                  style={{ width: `${((currentQuestionIdx + 1) / questions.length) * 100}%` }}
                />
             </div>
             <QuizCard 
               question={currentQ}
               selectedOptionId={session.answers[currentQ.id]}
               onSelectOption={handleOptionSelect}
               questionIndex={currentQuestionIdx}
               totalQuestions={questions.length}
             />
          </div>
        );
      case 'AD_INTERSTITIAL':
        return <InterstitialAd onClose={handleAdComplete} onGoPro={handleGoPro} />;
      case 'RESULTS':
        if (!session) return null;
        return (
          <ResultsView session={session} onSignupClick={() => setShowSignupModal(true)} onRetryClick={handleStartQuiz} />
        );
      default:
        if (session) return renderContent(); 
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-bg text-black font-sans selection:bg-brand-lime selection:text-black flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col w-full">
        {renderContent()}
      </main>
      {view !== 'AD_INTERSTITIAL' && (
        <div className="md:hidden">
           <BottomNav currentView={view} onChange={setView} />
        </div>
      )}
      {showSignupModal && (
        <SignupModal onClose={() => setShowSignupModal(false)} onConfirm={handleSignupConfirm} />
      )}
    </div>
  );
};

export default App;