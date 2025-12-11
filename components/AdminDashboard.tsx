import React, { useState } from 'react';
import { QUESTIONS_POOL } from '../constants';
import { Question } from '../types';
import Button from './Button';
import { generateQuestionWithAI } from '../services/geminiService';
import { Wand2, Plus, Save } from 'lucide-react';

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
      setError("Failed to generate question. Check API Key.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Content Admin</h1>
        <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleGenerate('TIU')} isLoading={isGenerating}>
              <Wand2 className="w-4 h-4 mr-2" />
              Gen TIU
            </Button>
             <Button variant="outline" onClick={() => handleGenerate('TWK')} isLoading={isGenerating}>
              <Wand2 className="w-4 h-4 mr-2" />
              Gen TWK
            </Button>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Manual Add
            </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Subject</th>
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Question</th>
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Diff</th>
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {questions.map((q) => (
              <tr key={q.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {q.subject}
                  </span>
                </td>
                <td className="p-4 max-w-md">
                  <p className="truncate font-medium text-gray-900">{q.text}</p>
                  <p className="truncate text-xs text-gray-500 mt-1">{q.explanation}</p>
                </td>
                <td className="p-4 text-sm text-gray-600">
                   {Array.from({ length: q.difficulty }).map((_, i) => '★').join('')}
                </td>
                <td className="p-4">
                  <button className="text-gray-400 hover:text-blue-600">Edit</button>
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