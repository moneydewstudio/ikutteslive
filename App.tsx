import React, { useState, useEffect, useCallback } from 'react';
import { ViewState, UserSession, User } from './types';
import * as QuizService from './services/quizService';
import { authService } from './services/authService';
import ProgressBar from './components/ProgressBar';
import { setPendingDailyQuizSubmit, submitDailyQuizAttempt } from './services/dailyQuizSync';
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
import { recordAnswerEvent } from './services/userEvents';
import { OnboardingTourProvider } from './src/contexts/OnboardingTourContext';
import { PaywallProvider, usePaywall } from './src/contexts/PaywallContext';
import AdminPayments from './components/AdminPayments';

// TEAM_001: switch Latihan session creation to API-backed questions (Neon via Worker)

type DrillCategory = 'TIU' | 'TWK' | 'TKP';

const AppContent: React.FC = () => {
  // TEAM_020: make Drills landing (BONUS) the default first screen
  const [view, setView] = useState<ViewState>('BONUS');
  const [session, setSession] = useState<UserSession | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const [selectedDrillCategory, setSelectedDrillCategory] = useState<DrillCategory | null>(null);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [signupReason, setSignupReason] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  // TEAM_012: prevent duplicate Google popup attempts on localhost
  const [isSignupLoading, setIsSignupLoading] = useState(false);
  const [isQuizLoading, setIsQuizLoading] = useState(false);

  const isGuest = !!user && (user.id === 'local_guest' || !user.email);

  const openSignup = useCallback((reason?: string) => {
    // TEAM_028: allow paywall gating to open signup with a dedicated reason/copy.
    setSignupReason(reason ?? null);
    setShowSignupModal(true);
  }, []);

  const refreshPremium = useCallback(async () => {
    try {
      const synced = await syncAuth();
      const nextIsPro = !!(synced as any)?.is_premium;
      setUser((prev) => {
        if (!prev) return prev;
        if (prev.isPro === nextIsPro) return prev;
        return { ...prev, isPro: nextIsPro };
      });
    } catch (e) {
      console.warn('TEAM_024 premium refresh failed', e);
    }
  }, []);

  // TEAM_016: allow deep-linking into SPA sections via URL param (e.g. /?view=DRILLS)
  useEffect(() => {
    const applyViewFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const raw = params.get('view');
      if (!raw) return;

      const next = raw.toUpperCase() as ViewState;
      // TEAM_020: allow DRILLS deep link but route to BONUS when category is unknown
      const allowed: ViewState[] = ['QUIZ', 'BONUS', 'DRILLS', 'TRYOUT', 'PROFILE', 'RESULTS', 'AD_INTERSTITIAL', 'ADMIN_PAYMENTS'];
      if (!allowed.includes(next)) return;

      // TEAM_024: admin payments panel is a hidden UI entry; deep link must also be blocked unless the email matches.
      if (next === 'ADMIN_PAYMENTS') {
        const email = user?.email ?? '';
        if (email !== 'pojok.sepak@gmail.com') return;
      }

      if (next === 'DRILLS') {
        setView('BONUS');
        return;
      }

      setView(next);
    };

    applyViewFromUrl();
    window.addEventListener('popstate', applyViewFromUrl);
    return () => window.removeEventListener('popstate', applyViewFromUrl);
  }, [user?.email]);

  // Ezoic: refresh ads on SPA navigation (view change), but not for interstitial
  useEffect(() => {
    if (import.meta.env.VITE_FEATURE_EZOIC !== 'true') return;
    if (view === 'AD_INTERSTITIAL') return;

    const ez = window.ezstandalone;
    if (!ez || !ez.cmd) return;

    ez.cmd.push(() => {
      ez.showAds();
    });
  }, [view]);

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

  const handleLatihanClick = useCallback(() => {
    // TEAM_020: clicking Latihan should resume mid-quiz, but start a new quiz after completion
    if (session && !session.completedAt) {
      setView('QUIZ');
      return;
    }
    void handleStartQuiz();
  }, [session, handleStartQuiz]);

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
      } else {
        const calculated = QuizService.calculateResults(savedSession);
        setSession(calculated);
      }
    }
    // Only auto-route to quiz/results if user explicitly navigates there
    // Default view remains BONUS unless changed by user action
  }, []);

  const handleOptionSelect = (optionId: string) => {
    if (!session) return;
    const currentQId = session.questionIds[currentQuestionIdx];
    const currentQ = QuizService.getQuestionsForSession(session).find((q) => q.id === currentQId);
    const updatedSession = {
      ...session,
      answers: { ...session.answers, [currentQId]: optionId }
    };
    setSession(updatedSession);
    QuizService.saveSession(updatedSession);

    if (currentQ) {
      // TEAM_025: fire-and-forget answer telemetry for server-side counters.
      void recordAnswerEvent({
        questionId: currentQId,
        isCorrect: optionId === currentQ.correct_option_id,
      }).catch(() => null);
    }

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

    // TEAM_029: persist daily quiz submission for profile spider chart analytics (Tryout + Daily Quiz; drills excluded)
    if (resultSession?.dayKey) {
      const payload = { dayKey: resultSession.dayKey, answers: resultSession.answers };
      void submitDailyQuizAttempt(payload).then((ok) => {
        if (!ok) setPendingDailyQuizSubmit(payload);
      });
    }

    if (user && user.isPro) {
      setView('RESULTS');
    } else {
      setView('AD_INTERSTITIAL');
    }
  };

  const handleAdComplete = () => {
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
    // TEAM_020: logo acts as "home" and routes to Drills landing
    setView('BONUS');
  };

  // --- HEADER COMPONENT ---
const Header = () => (
  <header className="sticky top-0 z-50 bg-bg border-b border-black h-20 flex items-center justify-between px-6 lg:px-12 w-full">
    <div className="flex items-center gap-2 cursor-pointer" onClick={handleLogoClick} data-tour="header-logo">
      <img src="/ikuttes.png" alt="Ikuttes" className="h-8 w-auto" />
    </div>

    {/* TEAM_008: fix desktop menu spacing by adding consistent gap + clickable padding on nav items */}
    <nav className="hidden md:flex items-center gap-2 lg:gap-6 font-bold text-sm uppercase tracking-wide" data-tour="nav-bar">
      {/* TEAM_018: repurpose BONUS tab into Drills entry; DRILLS view is internal runner */}
      <button onClick={() => setView('BONUS')} className={`px-2 py-1 hover:text-gray-600 transition-colors ${view === 'BONUS' || view === 'DRILLS' ? 'text-black' : 'text-gray-400'}`}>Drills</button>
      <button onClick={handleLatihanClick} className={`px-2 py-1 hover:text-gray-600 transition-colors ${view === 'QUIZ' || view === 'RESULTS' ? 'text-black' : 'text-gray-400'}`}>Latihan</button>
      <button onClick={() => setView('TRYOUT')} className={`px-2 py-1 hover:text-gray-600 transition-colors ${view === 'TRYOUT' ? 'text-black' : 'text-gray-400'}`}>Tryout</button>
      <a href="/blog/" className="px-2 py-1 hover:text-gray-600 transition-colors text-gray-400">Blog</a>
      <button onClick={() => setView('PROFILE')} className={`px-2 py-1 hover:text-gray-600 transition-colors ${view === 'PROFILE' ? 'text-black' : 'text-gray-400'}`}>Profil</button>
      {/* TEAM_015: link to Astro blog served under /blog */}
    </nav>

    <div>
      {user && !user.name?.includes('Tamu') ? (
        <div className="flex items-center gap-2">
          {user?.email === 'pojok.sepak@gmail.com' ? (
            <Button variant="outline" size="sm" onClick={() => setView('ADMIN_PAYMENTS')}>
              Admin
            </Button>
          ) : null}
          <Button variant="black" size="sm" onClick={() => setView('PROFILE')}>
            Profil Saya
          </Button>
        </div>
      ) : (
        <Button variant="black" size="sm" onClick={() => openSignup('manual')} isLoading={isAuthLoading}>
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
        return (
          <DrillsView
            onSignupClick={() => openSignup('manual')}
            category={selectedDrillCategory ?? undefined}
            onPremiumActivated={refreshPremium}
          />
        );
      case 'TRYOUT':
        return <TryoutView />;
      case 'PROFILE':
        return <Dashboard user={user || { id: '', isPro: false, streak: 0 }} history={QuizService.getHistory()} onStartQuiz={handleStartQuiz} />;
      case 'ADMIN_PAYMENTS':
        return <AdminPayments adminEmail="pojok.sepak@gmail.com" userEmail={user?.email} />;
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
        return null;
      case 'RESULTS':
        if (!session) return null;
        return (
          <ResultsView
            session={session}
            onSignupClick={() => openSignup('manual')}
            onRetryClick={handleStartQuiz}
            onPremiumActivated={refreshPremium}
          />
        );
      default:
        return null;
    }
  };

  return (
    <PaywallProvider
      onPremiumActivated={refreshPremium}
      getIsGuest={() => isGuest}
      onOpenSignup={(reason) => openSignup(reason)}
    >
      <OnboardingTourProvider>
        <AppWithPaywall
          view={view}
          setView={setView}
          user={user}
          session={session}
          currentQuestionIdx={currentQuestionIdx}
          isAuthLoading={isAuthLoading}
          isQuizLoading={isQuizLoading}
          selectedDrillCategory={selectedDrillCategory}
          isSignupLoading={isSignupLoading}
          showSignupModal={showSignupModal}
          signupReason={signupReason}
          setShowSignupModal={setShowSignupModal}
          setSignupReason={setSignupReason}
          handleLatihanClick={handleLatihanClick}
          handleStartQuiz={handleStartQuiz}
          handleAdComplete={handleAdComplete}
          handleSignupConfirm={handleSignupConfirm}
          handleLogoClick={handleLogoClick}
          renderContent={renderContent}
          openSignup={openSignup}
        />
      </OnboardingTourProvider>
    </PaywallProvider>
  );
};

type AppWithPaywallProps = {
  view: ViewState;
  setView: React.Dispatch<React.SetStateAction<ViewState>>;
  user: User | null;
  session: UserSession | null;
  currentQuestionIdx: number;
  isAuthLoading: boolean;
  isQuizLoading: boolean;
  selectedDrillCategory: DrillCategory | null;
  isSignupLoading: boolean;
  showSignupModal: boolean;
  signupReason: string | null;
  setShowSignupModal: React.Dispatch<React.SetStateAction<boolean>>;
  setSignupReason: React.Dispatch<React.SetStateAction<string | null>>;
  handleLatihanClick: () => void;
  handleStartQuiz: () => Promise<void>;
  handleAdComplete: () => void;
  handleSignupConfirm: () => Promise<void>;
  handleLogoClick: () => void;
  renderContent: () => React.ReactNode;
  openSignup: (reason?: string) => void;
};

const AppWithPaywall: React.FC<AppWithPaywallProps> = ({
  view,
  setView,
  user,
  isAuthLoading,
  handleLatihanClick,
  handleAdComplete,
  handleLogoClick,
  renderContent,
  openSignup,
  showSignupModal,
  setShowSignupModal,
  handleSignupConfirm,
  isSignupLoading,
  signupReason,
}) => {
  const { openPaywall } = usePaywall();

  const handleGoPro = useCallback(() => {
    openPaywall('interstitial_premium_cta');
  }, [openPaywall]);

  // --- HEADER COMPONENT ---
  const Header = () => (
    <header className="sticky top-0 z-50 bg-bg border-b border-black h-20 flex items-center justify-between px-6 lg:px-12 w-full">
      <div className="flex items-center gap-2 cursor-pointer" onClick={handleLogoClick} data-tour="header-logo">
        <img src="/ikuttes.png" alt="Ikuttes" className="h-8 w-auto" />
      </div>

      {/* TEAM_008: fix desktop menu spacing by adding consistent gap + clickable padding on nav items */}
      <nav className="hidden md:flex items-center gap-2 lg:gap-6 font-bold text-sm uppercase tracking-wide" data-tour="nav-bar">
        {/* TEAM_018: repurpose BONUS tab into Drills entry; DRILLS view is internal runner */}
        <button
          onClick={() => setView('BONUS')}
          className={`px-2 py-1 hover:text-gray-600 transition-colors ${view === 'BONUS' || view === 'DRILLS' ? 'text-black' : 'text-gray-400'}`}
        >
          Drills
        </button>
        <button
          onClick={handleLatihanClick}
          className={`px-2 py-1 hover:text-gray-600 transition-colors ${view === 'QUIZ' || view === 'RESULTS' ? 'text-black' : 'text-gray-400'}`}
        >
          Latihan
        </button>
        <button
          onClick={() => setView('TRYOUT')}
          className={`px-2 py-1 hover:text-gray-600 transition-colors ${view === 'TRYOUT' ? 'text-black' : 'text-gray-400'}`}
        >
          Tryout
        </button>
        <a href="/blog/" className="px-2 py-1 hover:text-gray-600 transition-colors text-gray-400">
          Blog
        </a>
        <button
          onClick={() => setView('PROFILE')}
          className={`px-2 py-1 hover:text-gray-600 transition-colors ${view === 'PROFILE' ? 'text-black' : 'text-gray-400'}`}
        >
          Profil
        </button>
        {/* TEAM_015: link to Astro blog served under /blog */}
      </nav>

      <div>
        {user && !user.name?.includes('Tamu') ? (
          <div className="flex items-center gap-2">
            {user?.email === 'pojok.sepak@gmail.com' ? (
              <Button variant="outline" size="sm" onClick={() => setView('ADMIN_PAYMENTS')}>
                Admin
              </Button>
            ) : null}
            <Button variant="black" size="sm" onClick={() => setView('PROFILE')}>
              Profil Saya
            </Button>
          </div>
        ) : (
          <Button variant="black" size="sm" onClick={() => openSignup('manual')} isLoading={isAuthLoading}>
            Masuk
          </Button>
        )}
      </div>
    </header>
  );

  return (
    <div className="min-h-screen bg-bg text-black font-sans selection:bg-brand-lime selection:text-black flex flex-col">
      <Header />
      {/* TEAM_011: keep question UI within the viewport so the header never overlaps content */}
      <main className="flex-1 flex flex-col w-full min-h-0">
        {view === 'AD_INTERSTITIAL' ? <InterstitialAd onClose={handleAdComplete} onGoPro={handleGoPro} /> : renderContent()}
      </main>
      {view !== 'AD_INTERSTITIAL' && (
        <div className="md:hidden">
          <BottomNav
            currentView={view}
            onChange={(next) => {
              // TEAM_020: centralize Latihan click behavior for bottom nav as well
              if (next === 'QUIZ') {
                handleLatihanClick();
                return;
              }
              setView(next);
            }}
          />
        </div>
      )}
      {showSignupModal && (
        <SignupModal
          onClose={() => {
            setShowSignupModal(false);
          }}
          onConfirm={handleSignupConfirm}
          isLoading={isSignupLoading}
          reason={signupReason ?? undefined}
        />
      )}
    </div>
  );
};

const App: React.FC = () => <AppContent />;

export default App;
