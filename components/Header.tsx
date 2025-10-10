import React from 'react';
import { LogoIcon, CrownIcon } from './icons';

export const Header: React.FC = () => {
  return (
    <header className="bg-[#F3F6F1]/80 backdrop-blur-sm sticky top-0 z-50 border-b border-[#C1D7CF]">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <LogoIcon className="w-8 h-8 text-green-500" />
            <span className="text-xl font-bold text-[#036666]">YTBoost</span>
          </div>
          <CrownIcon className="w-6 h-6 text-green-500" />
        </div>
      </div>
    </header>
  );
};