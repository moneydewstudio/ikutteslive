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
import { syncAuth } from './services/backend';

// TEAM_001: switch Latihan session creation to API-backed questions (Neon via Worker)

type DrillCategory = 'TIU' | 'TWK' | 'TKP';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('QUIZ');
  const [session, setSession] = useState<UserSession | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const [selectedDrillCategory, setSelectedDrillCategory] = useState<DrillCategory | null>(null);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  // TEAM_012: prevent duplicate Google popup attempts on localhost
  const [isSignupLoading, setIsSignupLoading] = useState(false);
  const [isQuizLoading, setIsQuizLoading] = useState(false);

  // TEAM_016: allow deep-linking into SPA sections via URL param (e.g. /?view=DRILLS)
  useEffect(() => {
    const applyViewFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const raw = params.get('view');
      if (!raw) return;

      const next = raw.toUpperCase() as ViewState;
      const allowed: ViewState[] = ['QUIZ', 'BONUS', 'TRYOUT', 'PROFILE', 'RESULTS', 'AD_INTERSTITIAL'];
      if (!allowed.includes(next)) return;

      setView(next);
    };

    applyViewFromUrl();
    window.addEventListener('popstate', applyViewFromUrl);
    return () => window.removeEventListener('popstate', applyViewFromUrl);
  }, []);

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

        // TEAM_012: sync auth state to backend (Neon) and hydrate premium flag
        if (!authUser.isAnonymous) {
          try {
            const synced = await syncAuth();
            const nextIsPro = !!synced?.is_premium;
            setUser((prev) => {
              if (!prev) return prev;
              if (prev.id !== authUser.uid) return prev;
              if (prev.isPro === nextIsPro) return prev;
              return { ...prev, isPro: nextIsPro };
            });
          } catch (e) {
            console.warn('TEAM_012 /auth/sync failed; premium status will default to free', e);
          }
        }

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
    if (isSignupLoading) return;
    setIsSignupLoading(true);
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
    setIsSignupLoading(false);
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
        <img src="/ikuttes.png" alt="Ikuttes" className="h-8 w-auto" />
      </div>

      {/* TEAM_008: fix desktop menu spacing by adding consistent gap + clickable padding on nav items */}
      <nav className="hidden md:flex items-center gap-2 lg:gap-6 font-bold text-sm uppercase tracking-wide">
        <button onClick={handleLogoClick} className={`px-2 py-1 hover:text-gray-600 transition-colors ${view === 'QUIZ' || view === 'RESULTS' ? 'text-black' : 'text-gray-400'}`}>Latihan</button>
        {/* TEAM_018: repurpose BONUS tab into Drills entry; DRILLS view is internal runner */}
        <button onClick={() => setView('BONUS')} className={`px-2 py-1 hover:text-gray-600 transition-colors ${view === 'BONUS' ? 'text-black' : 'text-gray-400'}`}>Drills</button>
        <button onClick={() => setView('TRYOUT')} className={`px-2 py-1 hover:text-gray-600 transition-colors ${view === 'TRYOUT' ? 'text-black' : 'text-gray-400'}`}>Tryout</button>
        <button onClick={() => setView('PROFILE')} className={`px-2 py-1 hover:text-gray-600 transition-colors ${view === 'PROFILE' ? 'text-black' : 'text-gray-400'}`}>Statistik</button>
        {/* TEAM_015: link to Astro blog served under /blog */}
        <a href="/blog/" className="px-2 py-1 hover:text-gray-600 transition-colors text-gray-400">Blog</a>
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
        return (
          <BonusView
            user={user}
            onStartDrill={(category) => {
              // TEAM_018: store selected category and navigate into the drill runner
              setSelectedDrillCategory(category);
              setView('DRILLS');
            }}
          />
        );
      case 'DRILLS':
        return <DrillsView onSignupClick={() => setShowSignupModal(true)} category={selectedDrillCategory ?? undefined} />;
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
      {/* TEAM_011: keep question UI within the viewport so the header never overlaps content */}
      <main className="flex-1 flex flex-col w-full min-h-0">
        {renderContent()}
      </main>
      {view !== 'AD_INTERSTITIAL' && (
        <div className="md:hidden">
           <BottomNav currentView={view} onChange={setView} />
        </div>
      )}
      {showSignupModal && (
        <SignupModal
          onClose={() => setShowSignupModal(false)}
          onConfirm={handleSignupConfirm}
          isLoading={isSignupLoading}
        />
      )}
    </div>
  );
};

export default App;