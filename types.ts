export enum MarketType {
  KOSPI = 'KOSPI',
  KOSDAQ = 'KOSDAQ'
}

export type SearchMode = 'FAST' | 'SMART';

export type CompanySize = 'ALL' | 'LARGE' | 'MID' | 'SMALL';

export interface CompanyData {
  corp_code: string;
  stock_code: string;
  corp_name: string;
  market: MarketType;
  sector: string;
  // Financials (Unit: 100 million KRW usually, but depends on raw data)
  sales: number;
  op_profit: number; // Operating Profit
  net_income: number;
  assets: number;
  liabilities: number;
  equity: number;
  market_cap: number; // Added Market Cap
  per?: number;
  pbr?: number;
  roe?: number;
  // Text Data
  biz_description_raw: string;
}

export interface FilterState {
  keyword: string;
  minOpMargin: number; // %
  minSales: number;
  market: 'ALL' | MarketType;
  size: CompanySize;
  mode: SearchMode;
}

export interface AnalysisResult {
  summary: string;
  strengths: string[];
  risks: string[];
}