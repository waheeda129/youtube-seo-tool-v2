import React from 'react';
import { SearchIcon, GemIcon } from './icons';

interface SearchFormProps {
  topic: string;
  setTopic: (topic: string) => void;
  onSearch: (topic:string) => void;
  isLoading: boolean;
}

export const SearchForm: React.FC<SearchFormProps> = ({ topic, setTopic, onSearch, isLoading }) => {
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(topic);
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <SearchIcon className="w-5 h-5 text-[#679483]" />
      </div>
      <input
        type="text"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="e.g., 'React performance optimization'"
        className="w-full pl-12 pr-40 py-4 text-lg bg-white border-2 border-[#C1D7CF] rounded-full focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition duration-300 placeholder:text-gray-400"
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={isLoading || !topic.trim()}
        className="absolute inset-y-0 right-0 m-2 px-6 py-2 bg-green-500 text-white font-semibold rounded-full hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center space-x-2"
      >
        {isLoading ? (
          <>
            <GemIcon className="w-5 h-5 animate-spin" />
            <span>Analyzing...</span>
          </>
        ) : (
          <>
            <GemIcon className="w-5 h-5" />
            <span>Generate</span>
          </>
        )}
      </button>
    </form>
  );
};