import { useState } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import Modal from './Modal';

interface AIGenerationModalProps {
  onClose: () => void;
  onGenerate: (prompt: string) => void;
  isGenerating: boolean;
}

export default function AIGenerationModal({
  onClose,
  onGenerate,
  isGenerating,
}: AIGenerationModalProps) {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = () => {
    if (prompt.trim()) {
      onGenerate(prompt);
    }
  };

  return (
    <Modal title='Generate Content with AI' onClose={onClose}>
      <div className='space-y-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            What should the post be about?
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 h-32 resize-none'
            placeholder='E.g., A welcome message for the new semester covering the basics of C#...'
          />
        </div>

        <div className='flex justify-end gap-3'>
          <button
            onClick={onClose}
            className='px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50'
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!prompt.trim() || isGenerating}
            className='flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-400'
          >
            {isGenerating ? (
              <>
                <Loader2 className='w-4 h-4 animate-spin' />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className='w-4 h-4' />
                Generate
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
