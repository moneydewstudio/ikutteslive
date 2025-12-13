import React, { useState, useEffect } from 'react';
import { ViewState, UserSession, User } from './types';
import * as QuizService from './services/quizService';
import { MOCK_USER } from './constants';
import ProgressBar from './components/ProgressBar';
import QuizCard from './components/QuizCard';
import ResultsView from './components/ResultsView';
import SignupModal from './components/SignupModal';
import Dashboard from './components/Dashboard'; 
import BottomNav from './components/BottomNav';
import BonusView from './components/BonusView';
import TryoutView from './components/TryoutView';
import Button from './components/Button';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('QUIZ');
  const [session, setSession] = useState<UserSession | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [user, setUser] = useState<User | null>({...MOCK_USER, streak: 3});
  const [showSignupModal, setShowSignupModal] = useState(false);

  const handleStartQuiz = () => {
    const newSession = QuizService.createSession();
    setSession(newSession);
    setCurrentQuestionIdx(0);
    setView('QUIZ');
  };

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
      // Auto-start quiz if no session exists
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
    setView('RESULTS');
  };

  const handleSignupConfirm = () => {
    setShowSignupModal(false);
    setUser(prev => prev ? ({ ...prev, name: 'New User', email: 'user@test.com' }) : null);
    alert("Account created! Progress saved.");
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

      <nav className="hidden md:flex items-center gap-8 font-bold text-sm uppercase tracking-wide">
        <button onClick={handleLogoClick} className={`hover:text-gray-600 transition-colors ${view === 'QUIZ' || view === 'RESULTS' ? 'text-black' : 'text-gray-400'}`}>Practice</button>
        <button onClick={() => setView('BONUS')} className={`hover:text-gray-600 transition-colors ${view === 'BONUS' ? 'text-black' : 'text-gray-400'}`}>Marketplace</button>
        <button onClick={() => setView('TRYOUT')} className={`hover:text-gray-600 transition-colors ${view === 'TRYOUT' ? 'text-black' : 'text-gray-400'}`}>Tryout</button>
        <button onClick={() => setView('PROFILE')} className={`hover:text-gray-600 transition-colors ${view === 'PROFILE' ? 'text-black' : 'text-gray-400'}`}>Stats</button>
      </nav>

      <div>
        <Button variant="black" size="sm" onClick={() => view === 'PROFILE' ? setShowSignupModal(true) : setView('PROFILE')}>
           {user?.name ? 'My Profile' : 'Connect Wallet'}
        </Button>
      </div>
    </header>
  );

  const renderContent = () => {
    switch (view) {
      case 'BONUS':
        return <BonusView />;
      case 'TRYOUT':
        return <TryoutView />;
      case 'PROFILE':
        return <Dashboard user={user || MOCK_USER} history={QuizService.getHistory()} onStartQuiz={handleStartQuiz} />;
      case 'QUIZ':
        if (!session) return null;
        const questions = QuizService.getQuestionsByIds(session.questionIds);
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
      case 'RESULTS':
        if (!session) return null;
        return (
          <ResultsView session={session} onSignupClick={() => setShowSignupModal(true)} onRetryClick={handleStartQuiz} />
        );
      default:
        // Fallback for any unexpected state, though QUIZ is default
        if (session) return renderContent(); 
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-bg text-black font-sans selection:bg-brand-lime selection:text-black flex flex-col">
      {/* Show Header on all views */}
      <Header />

      <main className="flex-1 flex flex-col w-full">
        {renderContent()}
      </main>

      {/* Mobile Bottom Nav - Show on all views except SIGNUP */}
      {view !== 'SIGNUP' && (
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