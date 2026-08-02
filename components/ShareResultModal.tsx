import React, { useState, useEffect } from 'react';
import { X, Download, Share, MessageCircle, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { FOCUS } from './ui/Card';
import { CTA } from './ui/CTA';
import { canShareFiles, shareWithFile, downloadImage, dataUrlToFile, openWhatsAppShare } from '../src/utils/share';

interface ShareResultModalProps {
  imageUrl: string | null;
  imageState: 'loading' | 'ready' | 'error';
  caption: string;
  link: string;
  isOpen: boolean;
  onClose: () => void;
  onRetryGenerate: () => void;
}

const ShareResultModal: React.FC<ShareResultModalProps> = ({
  imageUrl,
  imageState,
  caption,
  link,
  isOpen,
  onClose,
  onRetryGenerate,
}) => {
  const [canNativeShareFile, setCanNativeShareFile] = useState(false);

  useEffect(() => {
    setCanNativeShareFile(canShareFiles());
  }, []);

  if (!isOpen) return null;

  const handleNativeShare = async () => {
    if (!imageUrl) return;
    const file = await dataUrlToFile(imageUrl, 'ikuttes-result.png');
    await shareWithFile(file, `${caption}\n\n${link}`);
    onClose();
  };

  const handleDownload = () => {
    if (!imageUrl) return;
    downloadImage(imageUrl, 'ikuttes-result.png');
  };

  const handleWhatsApp = () => {
    openWhatsAppShare(`${caption}\n\n${link}`);
  };

  return (
    <div className="fixed inset-0 z-[130] bg-black/60 backdrop-blur-sm flex items-center justify-center p-lg animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-xl overflow-hidden border border-black animate-scale-in">
        <div className="p-lg border-b border-black flex justify-between items-center bg-gray-50">
          <h3 className="font-black text-lg">Bagikan Hasil</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className={[
              'p-xs hover:bg-black hover:text-white rounded-full border border-transparent hover:border-black transition-colors',
              FOCUS,
            ].join(' ')}
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
        <div className="p-xl bg-brand-cream">
          {/* Preview area */}
          <div className="mb-xl bg-white rounded-xl overflow-hidden border border-black">
            {imageState === 'loading' && (
              <div className="w-full h-48 flex flex-col items-center justify-center text-gray-500">
                <Loader2 className="w-5 h-5 animate-spin mb-sm" aria-hidden="true" />
                <span className="text-sm">Menyiapkan gambar...</span>
              </div>
            )}
            {imageState === 'error' && (
              <div className="w-full h-48 flex flex-col items-center justify-center text-feedback-red">
                <AlertCircle className="w-5 h-5 mb-sm" aria-hidden="true" />
                <span className="text-sm">Gagal membuat gambar</span>
              </div>
            )}
            {imageState === 'ready' && imageUrl && (
              <img src={imageUrl} alt="Share preview" className="w-full h-48 object-cover" />
            )}
          </div>

          {/* Action buttons */}
          {imageState === 'error' && (
            <div className="flex justify-center">
              <CTA onClick={onRetryGenerate} variant="secondary" size="sm" className="inline-flex items-center gap-sm">
                <RefreshCw className="w-4 h-4" aria-hidden="true" /> Coba lagi
              </CTA>
            </div>
          )}

          {imageState === 'ready' && (
            <div className="flex w-full gap-md mb-lg">
              {canNativeShareFile ? (
                <CTA onClick={handleNativeShare} variant="primary" size="sm" className="flex-1 inline-flex items-center justify-center gap-sm">
                  <Share className="w-4 h-4" aria-hidden="true" /> Bagikan
                </CTA>
              ) : (
                <CTA onClick={handleWhatsApp} variant="primary" size="sm" className="flex-1 inline-flex items-center justify-center gap-sm">
                  <MessageCircle className="w-4 h-4" aria-hidden="true" /> WhatsApp
                </CTA>
              )}
              <CTA onClick={handleDownload} variant="secondary" size="sm" className="flex-1 inline-flex items-center justify-center gap-sm">
                <Download className="w-4 h-4" aria-hidden="true" /> Download
              </CTA>
            </div>
          )}

          {/* Guidance text when native share is unavailable */}
          {imageState === 'ready' && !canNativeShareFile && (
            <p className="text-xs text-gray-500 text-center">
              Gambar tidak bisa dikirim otomatis ke WhatsApp. Tekan Download, lalu lampirkan di chat.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareResultModal;
