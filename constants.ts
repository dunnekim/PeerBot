import { CompanyData, MarketType } from './types';

// Simulation of what "peerbot_rawdata.csv" would look like after Python processing
export const MOCK_DATA: CompanyData[] = [
  {
    corp_code: "00126380",
    stock_code: "005930",
    corp_name: "Samsung Electronics",
    market: MarketType.KOSPI,
    sector: "Electronics",
    sales: 3022314, // ~300 Trillion KRW
    op_profit: 433766,
    net_income: 399074,
    assets: 4484245,
    liabilities: 936749,
    equity: 3547496,
    market_cap: 4500000, // ~450 Trillion (Large)
    per: 15.2,
    pbr: 1.4,
    roe: 11.5,
    biz_description_raw: "The company operates in four business divisions: DX (Device eXperience), DS (Device Solutions), SDC (Display), and Harman. The DX division includes mobile phones, TVs, monitors, refrigerators, etc. The DS division manufactures DRAM, NAND Flash, and system semiconductors. We are leading the global memory market."
  },
  {
    corp_code: "00164779",
    stock_code: "000660",
    corp_name: "SK Hynix",
    market: MarketType.KOSPI,
    sector: "Electronics",
    sales: 446216,
    op_profit: 68094,
    net_income: 22416,
    assets: 1039754,
    liabilities: 388523,
    equity: 651231,
    market_cap: 950000, // ~95 Trillion (Mid/Large borderline, usually Large)
    per: 22.1,
    pbr: 1.8,
    roe: 4.5,
    biz_description_raw: "Mainly engaged in the production and sale of semiconductor products such as DRAM, NAND Flash, and MCP. We are focusing on high-bandwidth memory (HBM) for AI servers and expanding our market share in the premium memory sector."
  },
  {
    corp_code: "00266961",
    stock_code: "035420",
    corp_name: "NAVER",
    market: MarketType.KOSPI,
    sector: "Services",
    sales: 96706,
    op_profit: 14888,
    net_income: 8556,
    assets: 342111,
    liabilities: 98774,
    equity: 243337,
    market_cap: 350000, // 35T (Large)
    per: 35.4,
    pbr: 1.6,
    roe: 5.2,
    biz_description_raw: "Korea's leading internet platform. Major services include Search, Commerce (Shopping), Fintech (Naver Pay), Content (Webtoon), and Cloud. We are investing heavily in HyperCLOVA X, our hyperscale AI model."
  },
  {
    corp_code: "00258801",
    stock_code: "035720",
    corp_name: "Kakao",
    market: MarketType.KOSPI,
    sector: "Services",
    sales: 81058,
    op_profit: 5019,
    net_income: 1452,
    assets: 235112,
    liabilities: 91002,
    equity: 144110,
    market_cap: 250000, // 25T (Large)
    per: 45.1,
    pbr: 1.9,
    roe: 1.2,
    biz_description_raw: "Operates the Kakao Talk platform. Business areas include Platform (TalkBiz, PortalBiz, Mobility, Pay) and Content (Game, Music, Story, Media). We focus on connecting people and technology."
  },
  {
    corp_code: "00356361",
    stock_code: "068270",
    corp_name: "Celltrion",
    market: MarketType.KOSPI,
    sector: "Pharmaceuticals",
    sales: 24502,
    op_profit: 6452,
    net_income: 5122,
    assets: 65112,
    liabilities: 15442,
    equity: 49670,
    market_cap: 380000, // 38T (Large)
    per: 38.2,
    pbr: 3.5,
    roe: 10.1,
    biz_description_raw: "Specializes in biosimilars. We develop, manufacture, and sell antibody biosimilars for various therapeutic areas including oncology and immunology. Key products include Remsima and Truxima."
  },
  {
    corp_code: "00523414",
    stock_code: "247540",
    corp_name: "Ecopro BM",
    market: MarketType.KOSDAQ,
    sector: "Chemicals",
    sales: 58112,
    op_profit: 3211,
    net_income: 2511,
    assets: 41223,
    liabilities: 20112,
    equity: 21111,
    market_cap: 220000, // 22T (Mid-Large)
    per: 65.2,
    pbr: 8.5,
    roe: 15.2,
    biz_description_raw: "Produces cathode materials for secondary batteries, specifically high-nickel NCA and NCM cathode materials used in electric vehicles (EVs) and power tools. A key player in the EV supply chain."
  },
  {
    corp_code: "01234567",
    stock_code: "277810",
    corp_name: "Rainbow Robotics",
    market: MarketType.KOSDAQ,
    sector: "Machinery",
    sales: 150,
    op_profit: -10,
    net_income: -5,
    assets: 3000,
    liabilities: 500,
    equity: 2500,
    market_cap: 35000, // 3.5T (Mid)
    per: 0,
    pbr: 12.5,
    roe: -0.5,
    biz_description_raw: "Develops and manufactures collaborative robots and bipedal robots (HUBO). We provide robot platforms for various industries including manufacturing, F&B, and service sectors."
  }
];

export const INITIAL_PROMPT = `
You are an expert financial analyst. 
Analyze the following company business description.
Provide the output in JSON format with the following keys:
- summary: A 2-sentence summary of what the company does.
- strengths: An array of 3 key strengths or growth areas.
- risks: An array of 2 potential risks or competitive challenges.

Business Description:
`;