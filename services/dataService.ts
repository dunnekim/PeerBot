import { CompanyData, MarketType, FilterState } from '../types';

// Step 4.1: Load CSV
export const parseCSV = (csvText: string): CompanyData[] => {
  const lines = csvText.split('\n');
  const data: CompanyData[] = [];

  for(let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Simple CSV split (Note: robust CSV parsing might need a library if fields contain commas)
    const values = line.split(',');
    
    if(values.length < 10) continue; 

    data.push({
      corp_code: values[0],
      stock_code: values[1],
      corp_name: values[2],
      market: values[3] as MarketType,
      sector: values[4],
      sales: parseFloat(values[5]) || 0,
      op_profit: parseFloat(values[6]) || 0,
      net_income: parseFloat(values[7]) || 0,
      assets: parseFloat(values[8]) || 0,
      liabilities: parseFloat(values[9]) || 0,
      equity: parseFloat(values[10]) || 0,
      market_cap: parseFloat(values[11]) || 0,
      per: parseFloat(values[12]) || 0,
      pbr: parseFloat(values[13]) || 0,
      roe: parseFloat(values[14]) || 0,
      biz_description_raw: values.slice(15).join(',') 
    });
  }
  return data;
};

export const getOpMargin = (c: CompanyData) => {
  if (c.sales === 0) return 0;
  return ((c.op_profit / c.sales) * 100);
};

// --- SMART SEARCH LOGIC ---

const KEYWORD_TRANSLATIONS: Record<string, string[]> = {
  '반도체': ['Semiconductor', 'Memory', 'Chip', 'Foundry'],
  '배터리': ['Battery', 'Cathode', 'Anode', 'EV', 'Energy'],
  '2차전지': ['Battery', 'Cathode', 'EV'],
  '바이오': ['Bio', 'Pharmaceutical', 'Drug'],
  '제약': ['Pharmaceutical', 'Drug', 'Medicine'],
  '자동차': ['Auto', 'Vehicle', 'Car', 'Mobility'],
  '플랫폼': ['Platform', 'Internet', 'Service', 'App'],
  '게임': ['Game', 'Gaming'],
  '인공지능': ['AI', 'Artificial Intelligence', 'Data'],
  '로봇': ['Robot', 'Robotics'],
  '화학': ['Chemical'],
  '전자': ['Electronics', 'Device'],
};

interface SmartQueryParsed {
  minSales: number;
  minOpMargin: number;
  targetMarket: MarketType | null;
  sizeCategory: 'LARGE' | 'MID' | 'SMALL' | null;
  keywords: string[];
}

const parseSmartQuery = (query: string): SmartQueryParsed => {
  const conditions: SmartQueryParsed = {
    minSales: 0,
    minOpMargin: 0,
    targetMarket: null,
    sizeCategory: null,
    keywords: []
  };

  // 1. Numeric Parsers (Enhanced for Korean "마진율 10% 이상")
  
  // SALES: 
  // English: Sales > 1000
  // Korean: 매출 1000억 이상, 매출액이 1000 넘는
  const salesPattern1 = /(?:sales|revenue|매출|매출액)[^\d]*(\d+)/i; // Detect number after keyword
  const salesMatch = query.match(salesPattern1);
  if (salesMatch) {
     conditions.minSales = parseFloat(salesMatch[1]);
  }

  // MARGIN:
  // English: Margin > 10
  // Korean: 마진율 10% 이상, 영업이익률 10프로 넘는
  const marginPatternA = /(?:margin|profit|op|영업이익|마진율|이익률)[^\d]*(\d+(?:\.\d+)?)/i;
  
  const marginMatch = query.match(marginPatternA);
  if (marginMatch) {
    conditions.minOpMargin = parseFloat(marginMatch[1]);
  }

  // 2. Market Parsers
  if (query.match(/kospi|코스피|유가증권/i)) conditions.targetMarket = MarketType.KOSPI;
  if (query.match(/kosdaq|코스닥/i)) conditions.targetMarket = MarketType.KOSDAQ;

  // 3. Size/Market Cap Parsers
  if (query.match(/large|big|대형주/i)) conditions.sizeCategory = 'LARGE';
  else if (query.match(/mid|medium|중형주/i)) conditions.sizeCategory = 'MID';
  else if (query.match(/small|소형주/i)) conditions.sizeCategory = 'SMALL';

  // 4. Keyword Extraction
  let cleanQuery = query
    .replace(/(?:sales|revenue|매출|매출액)[^\d]*(\d+)(?:억|조|원)?(?:이상|넘|초과)?/ig, '')
    .replace(/(?:margin|profit|op|영업이익|마진율|이익률)[^\d]*(\d+(?:\.\d+)?)(?:%|프로)?(?:이상|넘|초과)?/ig, '')
    .replace(/kospi|코스피|유가증권|kosdaq|코스닥/ig, '')
    .replace(/large|big|대형주|mid|medium|중형주|small|소형주/ig, '')
    .replace(/이상|초과|넘는|인|의|가|이|은|는/g, '') // Remove Korean particles
    .trim();

  const rawKeywords = cleanQuery.split(/[\s,]+/).filter(k => k.length > 0 && !k.match(/^[0-9]+$/));
  
  const expandedKeywords: string[] = [];
  rawKeywords.forEach(k => {
    expandedKeywords.push(k);
    const translation = KEYWORD_TRANSLATIONS[k];
    if (translation) {
      expandedKeywords.push(...translation);
    }
  });

  conditions.keywords = expandedKeywords;
  return conditions;
};

export const filterCompanies = (companies: CompanyData[], filter: FilterState): CompanyData[] => {
  let result = companies;
  let effectiveMinSales = filter.minSales;
  let effectiveMinMargin = filter.minOpMargin;
  let effectiveMarket = filter.market;
  let searchKeywords: string[] = [];
  let sizeFilter: 'LARGE' | 'MID' | 'SMALL' | 'ALL' | null = filter.size;

  if (filter.mode === 'SMART' && filter.keyword) {
    const parsed = parseSmartQuery(filter.keyword);
    effectiveMinSales = Math.max(effectiveMinSales, parsed.minSales);
    effectiveMinMargin = Math.max(effectiveMinMargin, parsed.minOpMargin);
    if (parsed.targetMarket) effectiveMarket = parsed.targetMarket; 
    
    // If smart query has size, it overrides the manual filter temporarily for this search
    if (parsed.sizeCategory) sizeFilter = parsed.sizeCategory;
    
    searchKeywords = parsed.keywords;
  } else if (filter.keyword) {
    searchKeywords = [filter.keyword];
  }

  // 1. Market Filter
  if (effectiveMarket !== 'ALL') {
    result = result.filter(c => c.market === effectiveMarket);
  }

  // 2. Numeric Filters
  if (effectiveMinSales > 0) {
    result = result.filter(c => c.sales >= effectiveMinSales);
  }

  if (effectiveMinMargin > 0) {
    result = result.filter(c => getOpMargin(c) >= effectiveMinMargin);
  }

  // 3. Size Filter
  if (sizeFilter && sizeFilter !== 'ALL') {
    if (sizeFilter === 'LARGE') result = result.filter(c => c.market_cap >= 100000); // 10T KRW
    else if (sizeFilter === 'MID') result = result.filter(c => c.market_cap >= 10000 && c.market_cap < 100000); // 1T~10T
    else if (sizeFilter === 'SMALL') result = result.filter(c => c.market_cap < 10000); // < 1T
  }

  // 4. Keyword Filter
  if (searchKeywords.length > 0) {
    result = result.filter(c => {
      const companyText = `${c.corp_name} ${c.stock_code} ${c.sector} ${c.biz_description_raw}`.toLowerCase();
      return searchKeywords.some(kw => companyText.includes(kw.toLowerCase()));
    });
  }

  return result;
};