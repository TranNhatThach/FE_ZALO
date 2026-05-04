import React from 'react';
import { Spin } from 'antd';
import { useThemeStore } from '@/stores/theme.store';

export const LoadingScreen: React.FC = () => {
  const { isDarkMode } = useThemeStore();

  return (
    <div className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-colors duration-500 ${isDarkMode ? 'bg-[#121212]' : 'bg-[#fcfdff]'}`}>
      <div className="relative flex items-center justify-center">
        {/* Outer pulse rings */}
        <div className="absolute w-32 h-32 rounded-full border-2 border-blue-500/20 animate-ping" />
        <div className="absolute w-24 h-24 rounded-full border-2 border-blue-500/40 animate-pulse" />
        
        {/* Central Logo/Spinner container */}
        <div className={`relative w-20 h-20 rounded-[24px] shadow-2xl flex items-center justify-center overflow-hidden transition-all duration-300 ${isDarkMode ? 'bg-gray-800 shadow-blue-500/10' : 'bg-white shadow-blue-500/5'}`}>
             <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 to-indigo-600/10 animate-pulse" />
             <Spin size="large" />
        </div>
      </div>
      
      <div className="mt-10 flex flex-col items-center">
        <h2 className={`text-[20px] font-black tracking-tighter mb-1 transition-colors ${isDarkMode ? 'text-white' : 'text-[#1e3ba1]'}`}>
          VANGUARD
        </h2>
        <div className="flex items-center gap-2">
            <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.3s]" />
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.15s]" />
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" />
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-[0.3em] opacity-40 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Enterprise OS
            </span>
        </div>
      </div>
      
      <p className="absolute bottom-10 text-[11px] font-medium text-gray-400 opacity-60">
        © 2026 Vanguard Solutions. All rights reserved.
      </p>
    </div>
  );
};
