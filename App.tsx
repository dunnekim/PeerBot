import React, { useState, useEffect, useMemo } from 'react';
import Layout from './components/Layout';
import SearchBar from './components/SearchBar';
import CompanyTable from './components/CompanyTable';
import DetailPanel from './components/DetailPanel';
import { CompanyData, FilterState, MarketType, SearchMode, CompanySize } from './types';
import { MOCK_DATA } from './constants';
import { filterCompanies, parseCSV } from './services/dataService';
import { Upload, Filter } from 'lucide-react';

// Use HashRouter as recommended for SPA without server side routing
import { HashRouter } from 'react-router-dom';

function App() {
  // State
  const [data, setData] = useState<CompanyData[]>(MOCK_DATA);
  const [selectedCompany, setSelectedCompany] = useState<CompanyData | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    keyword: '',
    minOpMargin: 0,
    minSales: 0,
    market: 'ALL',
    size: 'ALL',
    mode: 'SMART' 
  });

  // Derived state (Filtered Data)
  const filteredData = useMemo(() => {
    return filterCompanies(data, filters);
  }, [data, filters]);

  // Handlers
  const handleKeywordChange = (keyword: string) => {
    setFilters(prev => ({ ...prev, keyword }));
  };

  const handleModeChange = (mode: SearchMode) => {
    setFilters(prev => ({ ...prev, mode }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        if (evt.target?.result) {
          const parsed = parseCSV(evt.target.result as string);
          if (parsed.length > 0) {
            setData(parsed);
          } else {
            alert("CSV 파싱 실패. 파일 형식을 확인해주세요.");
          }
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <HashRouter>
      <Layout>
        {/* Top Controls Area */}
        <div className="mb-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Find Your Peer Group</h2>
            <p className="text-slate-400">KOSPI/KOSDAQ 기업을 재무제표와 사업 내용으로 검색해보세요.</p>
          </div>

          <SearchBar 
            value={filters.keyword} 
            mode={filters.mode}
            onChange={handleKeywordChange}
            onModeChange={handleModeChange}
            onToggleFilters={() => setShowFilters(!showFilters)}
          />

          {/* Collapsible Filter Panel */}
          {showFilters && (
            <div className="max-w-4xl mx-auto bg-slate-900 border border-slate-700 rounded-xl p-6 mb-8 shadow-xl animate-fade-in">
              <div className="flex items-center gap-2 mb-4 text-emerald-400 font-semibold uppercase text-xs tracking-wider">
                <Filter className="w-4 h-4" /> 상세 필터
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Market Segment */}
                <div>
                  <label className="block text-sm text-slate-400 mb-2">시장 구분</label>
                  <select 
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none"
                    value={filters.market}
                    onChange={(e) => setFilters(prev => ({ ...prev, market: e.target.value as any }))}
                  >
                    <option value="ALL">전체</option>
                    <option value={MarketType.KOSPI}>KOSPI</option>
                    <option value={MarketType.KOSDAQ}>KOSDAQ</option>
                  </select>
                </div>

                {/* Size Segment (New UI) */}
                <div>
                  <label className="block text-sm text-slate-400 mb-2">기업 규모 (시가총액)</label>
                  <select 
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none"
                    value={filters.size}
                    onChange={(e) => setFilters(prev => ({ ...prev, size: e.target.value as CompanySize }))}
                  >
                    <option value="ALL">전체 규모</option>
                    <option value="LARGE">대형주 (10조원 이상)</option>
                    <option value="MID">중형주 (1조~10조)</option>
                    <option value="SMALL">소형주 (1조원 미만)</option>
                  </select>
                </div>

                {/* Min Sales */}
                <div>
                  <label className="block text-sm text-slate-400 mb-2">최소 매출액 (억원)</label>
                  <input 
                    type="number" 
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none"
                    value={filters.minSales}
                    onChange={(e) => setFilters(prev => ({ ...prev, minSales: Number(e.target.value) }))}
                  />
                </div>

                {/* Min Op Margin */}
                <div>
                  <label className="block text-sm text-slate-400 mb-2">최소 영업이익률 (%)</label>
                  <div className="flex items-center gap-3">
                    <input 
                      type="range" 
                      min="0" 
                      max="50" 
                      step="1"
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      value={filters.minOpMargin}
                      onChange={(e) => setFilters(prev => ({ ...prev, minOpMargin: Number(e.target.value) }))}
                    />
                    <span className="text-white font-mono w-10 text-right">{filters.minOpMargin}%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stats Bar */}
          <div className="flex justify-between items-center text-sm text-slate-500 mb-4 px-2">
            <div>
              검색 결과: <span className="text-white font-bold">{filteredData.length}</span> 개 기업
            </div>
            <div className="flex items-center gap-4">
               {/* CSV Upload Logic */}
               <label className="flex items-center gap-2 cursor-pointer hover:text-emerald-400 transition-colors">
                 <Upload className="w-4 h-4" />
                 <span>CSV 데이터 업로드</span>
                 <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
               </label>
            </div>
          </div>
        </div>

        {/* Main Data Table */}
        <CompanyTable 
          data={filteredData} 
          onSelect={setSelectedCompany}
        />

        {/* Detail View Sidebar */}
        {selectedCompany && (
          <>
            <div 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
              onClick={() => setSelectedCompany(null)}
            ></div>
            <DetailPanel 
              company={selectedCompany} 
              onClose={() => setSelectedCompany(null)} 
            />
          </>
        )}

      </Layout>
    </HashRouter>
  );
}

export default App;