import React, { useState, useEffect, useCallback } from 'react';
import { Keyword, ContentIdeas } from '../types';
import { generateContentIdeas } from '../services/geminiService';
import { CloseIcon, CopyIcon, GemIcon } from './icons';

interface ContentIdeasModalProps {
  keyword: Keyword;
  onClose: () => void;
}

const ModalSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
    const [copied, setCopied] = useState(false);
    const textToCopy = React.Children.toArray(children).join('');

    const handleCopy = () => {
        navigator.clipboard.writeText(textToCopy).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };
    
    return (
        <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
                 <h4 className="text-lg font-semibold text-teal-700">{title}</h4>
                 <button onClick={handleCopy} className="text-gray-500 hover:text-black transition-colors flex items-center space-x-1 text-sm">
                    <CopyIcon className="w-4 h-4"/>
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                 </button>
            </div>
            <div className="bg-[#EAF1EC] p-4 rounded-md text-[#036666] whitespace-pre-wrap text-sm leading-relaxed">
                {children}
            </div>
        </div>
    );
};

export const ContentIdeasModal: React.FC<ContentIdeasModalProps> = ({ keyword, onClose }) => {
  const [ideas, setIdeas] = useState<ContentIdeas | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContentIdeas = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await generateContentIdeas(keyword.keyword);
      setIdeas(result);
    } catch (err) {
      setError('Failed to generate content ideas. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [keyword.keyword]);

  useEffect(() => {
    fetchContentIdeas();
  }, [fetchContentIdeas]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-[#F3F6F1] border border-[#C1D7CF] rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <header className="flex justify-between items-center p-4 border-b border-[#C1D7CF]">
          <div>
            <h3 className="text-xl font-bold text-[#036666]">AI Content Ideas</h3>
            <p className="text-sm text-[#679483]">For keyword: "{keyword.keyword}"</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-black transition-colors">
            <CloseIcon className="w-6 h-6" />
          </button>
        </header>
        
        <div className="p-6 overflow-y-auto">
          {isLoading && (
            <div className="flex flex-col items-center justify-center text-center p-12">
                <GemIcon className="w-12 h-12 text-green-500 animate-spin mb-4" />
                <p className="text-lg font-semibold">Generating content plan...</p>
                <p className="text-[#679483]">This might take a moment.</p>
            </div>
          )}
          {error && <p className="text-center text-red-700 bg-red-100 p-4 rounded-lg">{error}</p>}
          
          {ideas && (
            <div>
                <ModalSection title="Video Title">{ideas.title}</ModalSection>
                <ModalSection title="Video Description">{ideas.description}</ModalSection>
                <div className="mb-4">
                    <h4 className="text-lg font-semibold text-teal-700 mb-2">Video Tags</h4>
                     <div className="bg-[#EAF1EC] p-4 rounded-md flex flex-wrap gap-2">
                        {ideas.tags.map((tag, index) => (
                            <span key={index} className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full">{tag}</span>
                        ))}
                    </div>
                </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};