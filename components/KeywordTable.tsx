import React from 'react';
import { Keyword } from '../types';
import { SparklesIcon } from './icons';

interface KeywordTableProps {
  keywords: Keyword[];
  onGenerateIdeas: (keyword: Keyword) => void;
}

const getBarColor = (score: number) => {
  if (score >= 75) return 'bg-green-500';
  if (score >= 40) return 'bg-yellow-500';
  return 'bg-red-500';
};

const getBadgeColor = (level: 'Low' | 'Medium' | 'High', type: 'volume' | 'competition') => {
  if (type === 'volume') {
    if (level === 'High') return 'bg-blue-100 text-blue-800';
    if (level === 'Medium') return 'bg-indigo-100 text-indigo-800';
    return 'bg-gray-100 text-gray-800';
  }
  // competition
  if (level === 'Low') return 'bg-green-100 text-green-800';
  if (level === 'Medium') return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
};

export const KeywordTable: React.FC<KeywordTableProps> = ({ keywords, onGenerateIdeas }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-[#C1D7CF]">
        <thead className="bg-[#EAF1EC]">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#036666] uppercase tracking-wider">
              Keyword
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#036666] uppercase tracking-wider">
              Volume
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#036666] uppercase tracking-wider">
              Competition
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#036666] uppercase tracking-wider">
              Opportunity Score
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-[#C1D7CF]">
          {keywords.map((kw, index) => (
            <tr key={index} className="hover:bg-[#F3F6F1]">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#036666]">{kw.keyword}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                 <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getBadgeColor(kw.volume, 'volume')}`}>
                    {kw.volume}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getBadgeColor(kw.competition, 'competition')}`}>
                    {kw.competition}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-[#036666]">
                <div className="flex items-center">
                  <div className="w-24 bg-gray-200 rounded-full h-2.5 mr-3">
                    <div className={`${getBarColor(kw.opportunityScore)} h-2.5 rounded-full`} style={{ width: `${kw.opportunityScore}%` }}></div>
                  </div>
                  <span className="font-semibold">{kw.opportunityScore}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onGenerateIdeas(kw)}
                  className="flex items-center space-x-2 text-green-600 hover:text-green-500 font-semibold transition-colors"
                >
                    <SparklesIcon className="w-5 h-5" />
                    <span>Ideas</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};