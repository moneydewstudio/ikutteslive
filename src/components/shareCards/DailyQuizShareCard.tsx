import React from "react";
import { UserSession } from "../../types";

interface DailyQuizShareCardProps {
  session: UserSession;
  user?: { name: string } | null;
}

export const DailyQuizShareCard: React.FC<DailyQuizShareCardProps> = ({ session, user }) => {
  const percentage = Math.round((session.score / session.questionIds.length) * 100);
  const displayName = user?.name?.includes("Tamu") ? "Tamu" : user?.name ?? "Tamu";

  return (
    <div className="w-[1080px] h-[1920px] bg-gradient-to-br from-brand-lime to-brand-purple text-black flex flex-col items-center justify-center relative overflow-hidden font-sans">
      {/* Background decoration */}
      <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] border-[80px] border-black opacity-10 rounded-full" />
      <div className="absolute -top-20 -left-20 w-[300px] h-[300px] border-[40px] border-black opacity-5 rounded-full" />

      {/* Logo + URL */}
      <div className="absolute top-12 left-0 right-0 flex flex-col items-center">
        <img src="/ikuttes.png" alt="Ikuttes" className="h-16 w-auto mb-2" />
        <div className="text-xs font-bold uppercase tracking-wider text-black/60">ikuttes.my.id</div>
      </div>

      {/* Main content */}
      <div className="flex flex-col items-center text-center px-12">
        <div className="text-6xl font-black mb-4 leading-none tracking-tighter">
          {percentage}%
        </div>
        <div className="text-2xl font-bold mb-2">
          {session.score} dari {session.questionIds.length} benar
        </div>
        <div className="text-lg font-medium mb-8 text-black/70">
          Persentil {100 - session.percentile}% teratas
        </div>

        <div className="text-3xl font-black uppercase mb-4">Hasil Latihan</div>
        <div className="text-lg font-medium mb-12">Daily Quiz</div>

        <div className="text-lg font-medium italic">
          “{displayName}”
        </div>
      </div>

      {/* Footer CTA */}
      <div className="absolute bottom-12 left-0 right-0 flex flex-col items-center">
        <div className="text-2xl font-black mb-2 text-center px-8">
          Baru saja mempersiapkan diri untuk ikut tes CPNS!
        </div>
        <div className="text-lg font-bold uppercase tracking-wider">ikuttes.my.id</div>
      </div>
    </div>
  );
};
