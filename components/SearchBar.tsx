import React from 'react';
import { Search, SlidersHorizontal, Zap, BrainCircuit } from 'lucide-react';
import { SearchMode } from '../types';

interface SearchBarProps {
  value: string;
  mode: SearchMode;
  onChange: (val: string) => void;
  onModeChange: (mode: SearchMode) => void;
  onToggleFilters: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, mode, onChange, onModeChange, onToggleFilters }) => {
  return (
    <div className="relative max-w-2xl mx-auto mb-8 group">
      <div className={`absolute -inset-1 bg-gradient-to-r rounded-xl opacity-20 group-hover:opacity-40 blur transition duration-200 ${mode === 'SMART' ? 'from-emerald-500 to-cyan-500' : 'from-blue-500 to-indigo-500'}`}></div>
      
      <div className="relative flex flex-col gap-2">
        <div className="relative flex items-center bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden">
          <div className="pl-4 text-slate-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={mode === 'SMART' ? "예: 마진율 10% 이상인 대형 반도체주 (Smart NLP)" : "기업명, 코드, 업종으로 빠른 검색..."}
            className="w-full bg-transparent border-none py-4 px-3 text-lg text-white placeholder-slate-500 focus:ring-0 focus:outline-none"
          />
          
          <div className="flex items-center border-l border-slate-800">
             <button 
              onClick={onToggleFilters}
              className="p-4 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="필터 설정"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mode Toggle & Hints */}
        <div className="flex justify-between items-center px-1">
          <div className="flex items-center bg-slate-800/50 p-1 rounded-lg border border-slate-700/50">
            <button
              onClick={() => onModeChange('FAST')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${mode === 'FAST' ? 'bg-indigo-500 text-white shadow-lg' : 'text-slate-400 hover:text-slate-300'}`}
            >
              <Zap className="w-3 h-3" /> 빠른 검색
            </button>
            <button
              onClick={() => onModeChange('SMART')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${mode === 'SMART' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-400 hover:text-slate-300'}`}
            >
              <BrainCircuit className="w-3 h-3" /> 스마트 검색
            </button>
          </div>
          
          <div className="text-xs text-slate-500">
            {mode === 'SMART' ? (
              <span>팁: <span className="text-emerald-400">"매출 1조 이상 바이오 기업"</span> 처럼 검색해보세요</span>
            ) : (
              <span>단순 텍스트 매칭</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;