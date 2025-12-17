import React from 'react';
import Button from './Button';
import { X } from 'lucide-react';

interface SignupModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

const SignupModal: React.FC<SignupModalProps> = ({ onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white rounded-2xl w-full max-w-sm relative overflow-hidden shadow-2xl animate-fade-in-up">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
        
        <div className="p-6 pt-8 text-center">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Simpan hasil Anda</h2>
          <p className="text-gray-500 mb-6">Buat akun gratis untuk melacak kemajuan dan membuka latihan harian.</p>
          
          <div className="space-y-3">
            <button 
              onClick={onConfirm}
              className="w-full flex items-center justify-center space-x-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-xl transition-colors"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
              <span>Lanjut dengan Google</span>
            </button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-400">Atau dengan email</span>
              </div>
            </div>

            <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); onConfirm(); }}>
              <input 
                type="email" 
                placeholder="Masukkan email Anda" 
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
              />
              <Button type="submit" fullWidth>
                Buat Akun
              </Button>
            </form>
          </div>
          
          <p className="text-xs text-gray-400 mt-6">
            Dengan melanjutkan, Anda menyetujui Ketentuan Layanan dan Kebijakan Privasi kami.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupModal;