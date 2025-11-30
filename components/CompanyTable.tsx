import React, { useState, useEffect } from 'react';
import { CompanyData, MarketType } from '../types';
import { getOpMargin } from '../services/dataService';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface CompanyTableProps {
  data: CompanyData[];
  onSelect: (company: CompanyData) => void;
}

const ITEMS_PER_PAGE = 50;

const CompanyTable: React.FC<CompanyTableProps> = ({ data, onSelect }) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 when data changes (e.g. filter applied)
  useEffect(() => {
    setCurrentPage(1);
  }, [data.length]);

  if (data.length === 0) {
    return (
      <div className="text-center py-20 bg-slate-800/50 rounded-xl border border-dashed border-slate-700">
        <p className="text-slate-400 text-lg">조건에 맞는 기업을 찾을 수 없습니다.</p>
        <p className="text-slate-600 text-sm mt-2">필터나 검색 키워드를 조정해보세요.</p>
      </div>
    );
  }

  // Pagination Logic
  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentData = data.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">기업명</th>
                <th className="px-6 py-4">업종</th>
                <th className="px-6 py-4 text-right">시가총액 (억원)</th>
                <th className="px-6 py-4 text-right">매출액 (억원)</th>
                <th className="px-6 py-4 text-right">영업이익률</th>
                <th className="px-6 py-4 text-right">PER</th>
                <th className="px-6 py-4 text-right">ROE</th>
                <th className="px-6 py-4 text-center">상세</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {currentData.map((company) => {
                const opMargin = getOpMargin(company);
                const isProfitable = opMargin > 0;

                return (
                  <tr 
                    key={company.corp_code} 
                    onClick={() => onSelect(company)}
                    className="hover:bg-slate-800/50 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div>
                          <div className="font-medium text-white group-hover:text-emerald-400 transition-colors">
                            {company.corp_name}
                          </div>
                          <div className="text-xs text-slate-500 flex items-center gap-1">
                            <span className={`px-1 py-0.5 rounded text-[10px] font-bold ${company.market === MarketType.KOSPI ? 'bg-blue-900/30 text-blue-400' : 'bg-green-900/30 text-green-400'}`}>
                              {company.market}
                            </span>
                            {company.stock_code}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-full bg-slate-800 text-slate-300 text-xs border border-slate-700">
                        {company.sector}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-emerald-100">
                      {company.market_cap.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-slate-300">
                      {company.sales.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right font-mono">
                      <span className={`${isProfitable ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {opMargin.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-slate-300">
                      {company.per ? company.per.toFixed(1) : '-'}x
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-slate-300">
                      {company.roe ? company.roe.toFixed(1) : '-'}%
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 group-hover:text-white transition-colors">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2 text-sm">
          <div className="text-slate-500">
            {currentPage} / {totalPages} 페이지
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyTable;