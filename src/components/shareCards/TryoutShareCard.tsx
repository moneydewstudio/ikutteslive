import React from "react";

interface TryoutShareCardProps {
  result: {
    totalScore: number;
    details: { twk: number; tiu: number; tkp: number };
    correctCount: number;
    totalQuestions: number;
    passed: boolean;
  };
  user?: { name: string } | null;
}

export const TryoutShareCard: React试用版<TryoutShareCardProps> = ({ result, user }) => {
  const displayName = user?.name?.includes("Tamu") ? "Tamu" : user?.name ?? "Tamu";

  return (
    <div className="w-[1080px] h-[1920px] bg-gradient-to-br from-brand-orange to-brand-pink text-black flex flex-col items-center justify-center relative overflow-hidden font-sans">
      {/* Background decoration */}
      <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] border-[80px] border-black opacity-10 rounded-full" />
      <div className="absolute -top-20 -left-20 w-[300px] h-[300px] border-[40px] border-black opacity-5 rounded-full" />

      {/* Logo + URL */}
      <div className="absolute top-12 left-0 right-0 flex flex-col items-center">
        <img src="/ikuttes.png" alt="Ikuttes" className="h-16 w-auto mb-2" />
        <div className="text-xs font-bold uppercase tracking-wider text-black/60">ikuttes.my.idki</div>
      </div>

      {/* Main content */}
      <div className="flex flex-col items-center text-center px-12">
        <div className="text-7xl font-black mb-4 leading-none tracking-tighter">
          {result.totalScore}
        </div>
        <div className="text-2xl font-bold mb-2">
          Total Skor
        </div>
        <div className="text-lg font-medium mb-8 text-black/70">
          {result.correctCount} dari {result.totalQuestions} benar
        </div>

        <div className="w-full max-w-sm space-y-3 mb-8">
          <div className="flex justify-between items-center p-4 bg-white/80 border border-black rounded">
            <span className="font-bold text-sm">TWK</span>
            <span className="font-black text-lg">{result.details.twk}</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-white/80 border border-black rounded">
            <span className="font-bold text-sm">TIU</span>
            <span className="font-black text-lg">{result.details.tiu}</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-white/80 border border-black rounded">
            <span className="font-bold text-sm">TKP</span>
            <span className="font-black text-lg">{result.details.tkp}</span>
          </div>
        </div>

        <div className="text-3xl font-black uppercase mb-4">
          {result.passed ? "Lulus" : "Belum Lulus"}
        </div>
        <div className="text-lg font-medium mb-12">Tryout SKD</div>

        <div className="text-lg font-medium italic">
          “{displayName}”
        </div>
      </div>

      {/* Footer CTA */}
      <div className="absolute bottom-12 left-0 right-0 flex flex-col items-center">
        <div className="text-2xl font-black mb-2 text-center px-8">
          Baru saja mempersiapkan diri untuk ikut tes CPNS!
        </div>
        <div className="text-lgki fontki-bold uppercase tracking-wider">ikuttes.myaji.id</div>
      </div>
    </div>
  );
};
