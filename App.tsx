import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { SearchForm } from './components/SearchForm';
import { ResultsDisplay } from './components/ResultsDisplay';
import { ContentIdeasModal } from './components/ContentIdeasModal';
import { Keyword, KeywordData } from './types';
import { generateKeywordsAndClusters } from './services/geminiService';
import { GemIcon, SearchIcon } from './components/icons';

const App: React.FC = () => {
  const [topic, setTopic] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [keywordData, setKeywordData] = useState<KeywordData | null>(null);
  
  const [selectedKeyword, setSelectedKeyword] = useState<Keyword | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleSearch = useCallback(async (searchTopic: string) => {
    if (!searchTopic) return;
    setIsLoading(true);
    setError(null);
    setKeywordData(null);
    try {
      const results = await generateKeywordsAndClusters(searchTopic);
      setKeywordData(results);
    } catch (err) {
      setError('Failed to generate keyword intelligence. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleGenerateContentIdeas = useCallback((keyword: Keyword) => {
    setSelectedKeyword(keyword);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedKeyword(null);
  }, []);

  return (
    <div className="min-h-screen font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-teal-600">
            YouTube Keyword Intelligence
          </h2>
          <p className="text-center text-[#679483] mb-8">
            Enter a topic to discover keyword clusters, opportunity scores, and generate content ideas.
          </p>
          <SearchForm
            topic={topic}
            setTopic={setTopic}
            onSearch={handleSearch}
            isLoading={isLoading}
          />
          
          <div className="mt-12">
            {isLoading && (
              <div className="flex flex-col items-center justify-center text-center p-8">
                <GemIcon className="w-12 h-12 text-green-500 animate-spin mb-4" />
                <p className="text-lg font-semibold">Analyzing keywords...</p>
                <p className="text-[#679483]">Our AI is finding the best opportunities for you.</p>
              </div>
            )}
            {error && <p className="text-center text-red-700 bg-red-100 border border-red-200 p-4 rounded-lg">{error}</p>}
            
            {!isLoading && !keywordData && !error && (
               <div className="text-center text-gray-500 py-16 px-6 bg-white/50 rounded-lg border border-dashed border-[#C1D7CF]">
                  <SearchIcon className="w-16 h-16 mx-auto mb-4 text-gray-400"/>
                  <h3 className="text-xl font-semibold text-[#036666]">Ready to boost your channel?</h3>
                  <p className="text-[#679483]">Your AI-powered keyword results will appear here.</p>
               </div>
            )}

            {keywordData && (
              <ResultsDisplay
                data={keywordData}
                onGenerateIdeas={handleGenerateContentIdeas}
              />
            )}
          </div>
        </div>
      </main>
      
      {isModalOpen && selectedKeyword && (
        <ContentIdeasModal
          keyword={selectedKeyword}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default App;