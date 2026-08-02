import React, { useState } from 'react';
import { QUESTIONS_POOL } from '../constants';
import { Question } from '../types';
import { FOCUS } from './ui/Card';
import { CTA } from './ui/CTA';
import { generateQuestionWithAI } from '../services/geminiService';
import { Wand2, Plus } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>(QUESTIONS_POOL);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (subject: string) => {
    setIsGenerating(true);
    setError(null);
    try {
      const newQuestionPartial = await generateQuestionWithAI(subject);

      // Type guard and default assignment
      const newQuestion: Question = {
        id: newQuestionPartial.id || `gen_${Date.now()}`,
        subject: (newQuestionPartial.subject as any) || 'TIU',
        difficulty: newQuestionPartial.difficulty || 3,
        text: newQuestionPartial.text || '',
        options: newQuestionPartial.options || [],
        correct_option_id: newQuestionPartial.correct_option_id || '',
        explanation: newQuestionPartial.explanation || ''
      };

      setQuestions(prev => [newQuestion, ...prev]);
    } catch (err) {
      setError("Gagal membuat soal. Cek API Key.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-2xl max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-2xl">
        <h1 className="text-2xl font-bold text-black">Admin Konten</h1>
        <div className="flex gap-sm">
            <CTA variant="secondary" size="sm" onClick={() => handleGenerate('TIU')} disabled={isGenerating} className="inline-flex items-center gap-sm">
              <Wand2 className="w-4 h-4" aria-hidden="true" />
              Gen TIU
            </CTA>
             <CTA variant="secondary" size="sm" onClick={() => handleGenerate('TWK')} disabled={isGenerating} className="inline-flex items-center gap-sm">
              <Wand2 className="w-4 h-4" aria-hidden="true" />
              Gen TWK
            </CTA>
            <CTA variant="primary" size="sm" className="inline-flex items-center gap-sm">
              <Plus className="w-4 h-4" aria-hidden="true" />
              Tambah Manual
            </CTA>
        </div>
      </div>

      {error && (
        <div className="bg-feedback-red text-black p-lg rounded-xl mb-xl">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl border border-black overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-black">
            <tr>
              <th className="p-lg text-xs font-semibold text-gray-500 uppercase">Mapel</th>
              <th className="p-lg text-xs font-semibold text-gray-500 uppercase">Pertanyaan</th>
              <th className="p-lg text-xs font-semibold text-gray-500 uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {questions.map((q) => (
              <tr key={q.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-lg">
                  <span className="inline-flex items-center px-sm py-xs rounded-full text-xs font-medium bg-brand-purple text-black">
                    {q.subject}
                  </span>
                </td>
                <td className="p-lg max-w-md">
                  <p className="truncate font-medium text-black">{q.text}</p>
                  <p className="truncate text-xs text-gray-500 mt-xs">{q.explanation}</p>
                </td>
                <td className="p-lg">
                  <button type="button" className={['text-gray-600 hover:text-black font-bold', FOCUS].join(' ')}>Ubah</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;