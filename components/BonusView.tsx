import React from 'react';
import BonusCard, { Pack } from './BonusCard';

const BonusView: React.FC = () => {
  const packs: Pack[] = [
      { id: 1, title: 'Penguasaan Logika', subject: 'TIU', questions: 20, difficulty: 'Sulit', price: 'Gratis', color: 'bg-brand-pink' },
      { id: 2, title: 'Wawasan Kebangsaan V1', subject: 'TWK', questions: 15, difficulty: 'Sedang', price: 'Terkunci', color: 'bg-white' },
      { id: 3, title: 'Kepribadian Plus', subject: 'TKP', questions: 25, difficulty: 'Mudah', price: 'Terkunci', color: 'bg-white' },
      { id: 4, title: 'Simulasi Ujian', subject: 'ALL', questions: 100, difficulty: 'Campuran', price: 'Terkunci', color: 'bg-white' },
      { id: 5, title: 'Kecepatan Matematika', subject: 'TIU', questions: 10, difficulty: 'Sulit', price: 'Terkunci', color: 'bg-white' },
      { id: 6, title: 'Ahli Sejarah', subject: 'TWK', questions: 20, difficulty: 'Sedang', price: 'Terkunci', color: 'bg-white' },
  ];

  return (
    <div className="flex flex-col w-full animate-fade-in pb-20 md:pb-0">
      
      {/* Header */}
      <div className="p-8 border-b border-black bg-brand-cream">
         <h1 className="text-5xl font-black uppercase tracking-tight mb-4">Toko Bonus</h1>
         <p className="text-lg max-w-xl">Buka paket soal khusus untuk target kelemahan Anda. Kumpulkan semuanya untuk memaksimalkan kesiapan Anda.</p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {packs.map((pack) => (
              <BonusCard key={pack.id} pack={pack} />
          ))}
      </div>
    </div>
  );
};

export default BonusView;