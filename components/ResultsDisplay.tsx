import React, { useState } from 'react';
import { Keyword, KeywordCluster, KeywordData } from '../types';
import { ChevronDownIcon, FireIcon } from './icons';
import { KeywordTable } from './KeywordTable';

interface ResultsDisplayProps {
  data: KeywordData;
  onGenerateIdeas: (keyword: Keyword) => void;
}

const ClusterAccordion: React.FC<{ cluster: KeywordCluster; onGenerateIdeas: (keyword: Keyword) => void; }> = ({ cluster, onGenerateIdeas }) => {
  const [isOpen, setIsOpen] = useState(true);
  
  const topKeyword = cluster.keywords[0];

  return (
    <div className="bg-white border border-[#C1D7CF] rounded-lg overflow-hidden mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 text-left hover:bg-[#EAF1EC] transition-colors"
      >
        <div className="flex items-center space-x-3">
          <span className="font-bold text-lg text-teal-700">{cluster.clusterName}</span>
          <span className="text-sm text-[#679483]">({cluster.keywords.length} keywords)</span>
        </div>
        <div className="flex items-center space-x-4">
            {topKeyword && (
              <div className="hidden sm:flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                  <FireIcon className="w-4 h-4" />
                  <span>Top Opportunity: {topKeyword.keyword}</span>
              </div>
            )}
            <ChevronDownIcon className={`w-6 h-6 text-[#679483] transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>
      {isOpen && (
        <div className="bg-[#fafdfb]">
           <KeywordTable keywords={cluster.keywords} onGenerateIdeas={onGenerateIdeas} />
        </div>
      )}
    </div>
  );
};


export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ data, onGenerateIdeas }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold mb-6 text-[#036666]">Keyword Clusters</h3>
      {data.clusters.map((cluster, index) => (
        <ClusterAccordion key={index} cluster={cluster} onGenerateIdeas={onGenerateIdeas} />
      ))}
    </div>
  );
};