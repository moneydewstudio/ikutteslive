import React, { useState, useEffect } from 'react';
import { X, Download, Share, MessageCircle, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import Button from './Button';
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

  const isActionsDisabled = imageState !== 'ready';

  return (
    <div className="fixed inset-0 z-[130] bg-black/60 backdrop-blur-sm flex items-center justify-center p-lg animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border-2 border-black animate-scale-in">
        <div className="p-4 border-b border-black flex justify-between items-center bg-gray-50">
          <h3 className="font-black text-lg">Bagikan Hasil</h3>
          <button onClick={onClose} className="p-1 hover:bg-black hover:text-white rounded border border-transparent hover:border-black transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 bg-brand-cream">
          {/* Preview area */}
          <div className="mb-6 bg-white rounded-lg overflow-hidden border border-black">
            {imageState === 'loading' && (
              <div className="w-full h-48 flex flex-col items-center justify-center text-gray-500">
                <Loader2 className="w-8 h-8 animate-spin mb-2" />
                <span className="text-sm">Menyiapkan gambar...</span>
              </div>
            )}
            {imageState === 'error' && (
              <div className="w-full h-48 flex flex-col items-center justify-center text-red-500">
                <AlertCircle className="w-8 h-8 mb-2" />
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
              <Button onClick={onRetryGenerate} variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" /> Coba lagi
              </Button>
            </div>
          )}

          {imageState === 'ready' && (
            <div className="flex w-full gap-3 mb-4">
              {canNativeShareFile ? (
                <Button onClick={handleNativeShare} variant="black" size="sm" className="flex-1">
                  <Share className="w-4 h-4 mr-2" /> Bagikan
                </Button>
              ) : (
                <Button onClick={handleWhatsApp} variant="black" size="sm" className="flex-1">
                  <MessageCircle className="w-4 h-4 mr-2" /> WhatsApp
                </Button>
              )}
              <Button onClick={handleDownload} variant="outline" size="sm" className="flex-1">
                <Download className="w-4 h-4 mr-2" /> Download
              </Button>
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
