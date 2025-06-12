export interface ApiResponse<T> {
  // 성공 여부
  success: boolean;
  // 메시지
  message: string;
  // 데이터
  data: T;
}

export interface Stock {
  symbol: string;
  name: string;
  price: string;
  change: string;
  changePercent: string;
  logoUrl?: string;
  volume?: string;
  marketCap?: string;
  description?: string;
}

export interface StockDetails {
  /** 종목 고유 ID */
  stockId: number;
  /** 종목 코드 (예: AAPL) */
  symbol: string;
  /** 종목명 (예: Apple Inc.) */
  name: string;
  /** 자기자본이익률 (Return on Equity) */
  roe: number;
  /** 주당순이익 (Earnings Per Share) */
  eps: number;
  /** 주당순자산 (Book Value Per Share) */
  bps: number;
  /** 베타 계수 (시장 대비 변동성) */
  beta: number;
  /** 시가총액 (Market Capitalization) */
  marketCap: number;
  /** 배당수익률 (Dividend Yield) */
  dividendYield: number;
  /** 유동비율 (Current Ratio) */
  currentRatio: number;
  /** 부채비율 (Debt Ratio) */
  debtRatio: number;
  /** 섹터 (예: Technology) */
  sector: string;
  /** 산업군 (예: Consumer Electronics) */
  industry: string;
  /** 전일 종가 */
  lastPrice: number;
  /** 현재가 */
  currentPrice: number;
  /** 가격 변화율 */
  priceDelta: number;
  /** 시간당 거래량 */
  hourlyVolume: number;
  /** 시가총액 (예: 4.4조원) */
  marketCapText?: string;
  /** 운용사 (예: 삼성자산운용(ETF)) */
  company?: string;
  /** 상장일 (예: 2021년 4월 9일) */
  listingDate?: string;
  /** 운용자산 (예: 4.4조원) */
  assets?: string;
  /** 발행주수 (예: 230,800,000주) */
  shares?: string;
}

export interface ChartData {
  date: string;
  value: number;
}

export interface ChartDataResponse {
  prices: ChartData[];
  volumes: ChartData[];
}

export interface NewsItem {
  id: number;
  title: string;
  source: string;
  time: string;
  imageUrl: string;
}

export interface GetStockChartDataRequest {
  symbol: string;
  interval: "1h" | "1day" | "1week" | "1month";
  limit: number;
}

export interface GetStockChartDataResponse {
  // 시간스탬프
  timestamp: string;
  // 시가
  open: number;
  // 고가
  high: number;
  // 저가
  low: number;
  // 종가
  close: number;
  // 거래량
  volume: number;
}

export interface GetStockListRequest {
  // 검색 옵션 (hot, owned, liked)
  option: "hot" | "owned" | "liked";
  // 검색 결과 개수
  limit: number;
}

export interface GetStockListResponse {
  // 종목 심볼
  symbol: string;
  // 종목 이름
  name: string;
  // 현재 가격
  currentPrice: number;
  // 가격 변동
  priceDelta: number;
}
//회원가입
export interface SignUpRequest {
  // 이메일
  email: string;
  // 비밀번호
  password: string;
  // 닉네임
  nickname: string;
}

export interface SignUpResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    email: string;
    nick: string;
  };
}
//로그인
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
}
export interface UserProfile {
  id: number;
  email: string;
  nick: string;
}
export interface EditProfileRequest {
  nickname: string;
  profileImageUrl?: string;
}

export interface WalletResponse {
  success: boolean;
  message: string;
  data: {
    email?: string;
    nick?: string;
    cyberDollar: number;
    updatedAt: string;
  };
}

export interface WalletErrorResponse {
  success: false;
  message: string;
}

export interface TradeRequest {
  symbol: string;
  quantity: number;
  price: number;
}

export interface TradeResponse {
  success: boolean;
  message: string;
  data: {
    symbol: string;
    price: number;
    balance: number;
    share: number;
    tradedAt: string;
  };
}
export interface ErrorResponse {
  success: false;
  message: string;
}
export interface GetStockSearchRequest {
  query: string;
  limit: number;
}

export interface GetStockSearchResponse {
  symbol: string;
  name: string;
  sector: string;
  industry: string;
  currentPrice: number;
  priceDelta: number;
  hourlyVolume: number;
}

/** 종목 상세 정보 API 응답 인터페이스 */
export interface GetStockDetailsResponse {
  /** API 호출 성공 여부 */
  success: boolean;
  /** 응답 메시지 */
  message: string;
  /** 종목 상세 정보 데이터 */
  data: StockDetails;
}

export interface LikeStockRequest {
  symbol: string;
}

export interface LikeStockResponse {
  success: boolean;
  message: string;
  data: {
    symbol: string;
    createdAt: string;
  };
}

export interface UnlikeStockResponse {
  success: boolean;
  message: string;
  data: boolean;
}

export interface GetLikedStocksResponse {
  success: boolean;
  message: string;
  data: {
    symbol: string;
    name: string;
    sector: string;
    industry: string;
    currentPrice: number;
    priceDelta: number;
  }[];
}

export interface OverallPortfolioResponse {
  success: boolean;
  message: string;
  data: {
    totalAsset: number;
    investedAmount: number;
    evalGain: number;
    returnRate: number;
    totalSeed: number;
    investRatio: number;
    cash: number;
  };
}
// 내 종목 목록 조회(내가 구매한 종목)
export interface GetMyStocksResponse {
  success: boolean;
  message: string;
  data: {
    symbol: string;
    name: string;
    currentPrice: number;
    priceDelta: number;
  }[];
}

// 주식 거래내역 api test, type 정의
export interface GetTradeHistoryResponse {
  success: boolean;
  message: string;
  data: {
    symbol: string;
    name: string;
    quantity: number;
    currentPrice: number;
    date: string;
    returnRate: number;
  }[];
}

// 보유종목/상품현황 type 정의(주식 종목별 포트폴리오 조회 응답)
export interface GetStockPortfolioResponse {
  success: boolean;
  message: string;
  data: {
    symbol: string;
    name: string;
    quantity: number;
    avgBuyPrice: number;
    evalAmount: number;
    evalGain: number;
    returnRate: number;
  }[];
}

// 당신의 투자 성향(유저 선호 추가 api)
export type RiskLevel = 'high' | 'low';

// 당신의 선호 전략(유저 선호 추가 api)
export type PreferredStrategy = 
  | 'dividend_stability'
  | 'portfolio_balance'
  | 'value_stability'
  | 'momentum'
  | 'sector_rotation'
  | 'rebound_buy';

// 당신의 관심 산업 분야(유저 선호 추가 api)
export type PreferredSector = 
  | 'Basic Materials'
  | 'Communication Services'
  | 'Consumer Cyclical'
  | 'Consumer Defensive'
  | 'Energy'
  | 'Financial Services'
  | 'Healthcare'
  | 'Industrials'
  | 'Real Estate'
  | 'Technology'
  | 'Utilities';

export interface UserPreferenceRequest {
  riskLevel: RiskLevel;
  preferredStrategies: PreferredStrategy[];
  preferredSectors: PreferredSector[];
}

export interface UserPreferenceResponse {
  success: boolean;
  message: string;
  data: {
    riskLevel: RiskLevel;
    preferredStrategies: PreferredStrategy[];
    preferredSectors: PreferredSector[];
    createdAt: string;
    updatedAt: string;
  };
}

export interface GetUserPreferenceResponse {
  success: boolean;
  message: string;
  data: {
    riskLevel: RiskLevel;
    preferredStrategies: PreferredStrategy[];
    preferredSectors: PreferredSector[];
    createdAt: string;
    updatedAt: string;
  };
}

// AI추천이유 type 정의
export interface AiRecommendationReason {
  portfolio: string;
  industry: string;
  ai: string;
}

export interface AiRecommendationItem {
  symbol: string;
  name: string;
  sector: string;
  hashtag: string;
  logoUrl: string;
  aiReason: AiRecommendationReason;
}

export interface GetAiRecommendationsResponse {
  success: boolean;
  message: string;
  data: {
    stocks: AiRecommendationItem[];
  };
}
