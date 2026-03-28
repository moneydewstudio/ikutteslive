import React from 'react';
import { X, Download, Copy, Share } from 'lucide-react';
import Button from './Button';
import { canShareFiles, shareWithFile, downloadImage, copyToClipboard, dataUrlToFile } from '../src/utils/share';

interface ShareResultModalProps {
  imageUrl: string | null;
  caption: string;
  link: string;
  isOpen: boolean;
  onClose: () => void;
}

const ShareResultModal: React.FC<ShareResultModalProps> = ({ imageUrl, caption, link, isOpen, onClose }) => {
  if (!isOpen || !imageUrl) return null;

  const handleShare = async () => {
    const file = await dataUrlToFile(imageUrl, 'ikuttes-result.png');
    const success = await shareWithFile(file, `${caption}\n\n${link}`);
    if (!success) {
      // Fallback: copy caption + link
      await copyToClipboard(`${caption}\n\n${link}`);
    }
    onClose();
  };

  const handleDownload = () => {
    downloadImage(imageUrl, 'ikuttes-result.png');
  };

  const handleCopyCaption = async () => {
    await copyToClipboard(caption);
  };

  const handleCopyLink = async () => {
    await copyToClipboard(link);
  };

  return (
    <div className="fixed inset-0 z-[130] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border-2 border-black animate-scale-in">
        <div className="p-4 border-b border-black flex justify-between items-center bg-gray-50">
          <h3 className="font-black text-lg">Bagikan Hasil</h3>
          <button onClick={onClose} className="p-1 hover:bg-black hover:text-white rounded border border-transparent hover:border-black transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 bg-brand-cream">
          <div className="mb-6 bg-white rounded-lg overflow-hidden border border-black">
            <img src={imageUrl} alt="Share preview" className="w-full h-48 object-cover" />
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {canShareFiles() && (
              <Button onClick={handleShare} variant="black" size="sm">
                <Share className="w-4 h-4 mr-2" /> Share
              </Button>
            )}
            <Button onClick={handleDownload} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" /> Download
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button onClick={handleCopyCaption} variant="outline" size="sm">
              <Copy className="w-4 h-4 mr-2" /> Copy caption
            </Button>
            <Button onClick={handleCopyLink} variant="outline" size="sm">
              <Copy className="w-4 h-4 mr-2" /> Copy link
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareResultModal;
