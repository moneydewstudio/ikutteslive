import React from 'react';
import { X } from 'lucide-react';
import { FOCUS } from './ui/Card';
import { CTA } from './ui/CTA';

// TEAM_012: prevent duplicate popup attempts by exposing loading state
interface SignupModalProps {
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  reason?: string;
}

const SignupModal: React.FC<SignupModalProps> = ({ onClose, onConfirm, isLoading = false, reason }) => {
  // TEAM_028: premium gating requires account creation; show dedicated copy when opened from paywall.
  const isPremiumGate = reason === 'premium_requires_account';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-lg">
      <button
        type="button"
        aria-label="Tutup"
        onClick={onClose}
        className={['absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer', FOCUS].join(' ')}
      />
      <div className="bg-white rounded-xl w-full max-w-sm relative overflow-hidden border border-black animate-fade-in-up">
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup"
          className={['absolute top-lg right-lg text-gray-600 hover:text-black p-sm rounded-full transition-colors', FOCUS].join(' ')}
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>

        <div className="p-xl pt-2xl text-center">
          <div className="w-3xl h-3xl bg-feedback-green text-black rounded-full flex items-center justify-center mx-auto mb-lg">
            <svg className="w-xl h-xl" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-black mb-sm">{isPremiumGate ? 'Buat akun dulu' : 'Simpan hasil Anda'}</h2>
          <p className="text-gray-600 mb-xl">
            {isPremiumGate
              ? 'Kamu belum buat akun. Buat akun dulu, baru upgrade ke premium, ya!'
              : 'Buat akun gratis untuk melacak kemajuan dan membuka latihan harian.'}
          </p>

          <div className="space-y-md">
            <button
              type="button"
              onClick={onConfirm}
              className={[
                'w-full flex items-center justify-center gap-sm bg-white border border-black hover:bg-gray-50 text-black font-medium py-md px-lg rounded-xl transition-colors disabled:cursor-not-allowed disabled:opacity-60',
                FOCUS,
              ].join(' ')}
              disabled={isLoading}
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
              <span>{isLoading ? 'Memproses...' : 'Lanjut dengan Google'}</span>
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-black" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-sm text-gray-600">Atau dengan email</span>
              </div>
            </div>

            <form className="space-y-md" onSubmit={(e) => { e.preventDefault(); onConfirm(); }}>
              <input
                type="email"
                placeholder="Masukkan email Anda"
                className={['w-full px-lg py-md rounded-xl border border-black bg-white', FOCUS].join(' ')}
              />
              <CTA type="submit" fullWidth disabled={isLoading}>
                {isLoading ? 'Memproses...' : 'Buat Akun'}
              </CTA>
            </form>
          </div>

          <p className="text-xs text-gray-600 mt-xl">
            Dengan melanjutkan, Anda menyetujui Ketentuan Layanan dan Kebijakan Privasi kami.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupModal;
