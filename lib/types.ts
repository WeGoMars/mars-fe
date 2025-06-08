export interface ApiResponse<T> {
  // 성공 여부
  success: boolean
  // 메시지
  message: string
  // 데이터
  data: T[]
}

export interface Stock {
  symbol: string
  name: string
  price: string
  change: string
  changePercent: string
  logoUrl?: string
  volume?: string
  marketCap?: string
  description?: string
}

export interface StockDetails {
  symbol: string
  name: string
  price: string
  change: string
  changePercent: string
  marketCap: string
  company: string
  listingDate: string
  assets: string
  shares: string
  description: string
}

export interface ChartData {
  date: string
  value: number
}

export interface ChartDataResponse {
  prices: ChartData[]
  volumes: ChartData[]
}

export interface NewsItem {
  id: number
  title: string
  source: string
  time: string
  imageUrl: string
}

export interface GetStockChartDataRequest{
  symbol: string
  interval: '1h' | '1day' | '1week' | '1month'
  limit: number
}

export interface GetStockChartDataResponse {
  // 시간스탬프
  timestamp: string
  // 시가
  open: number
  // 고가
  high: number 
  // 저가
  low: number
  // 종가
  close: number
  // 거래량
  volume: number
}


export interface GetStockListRequest{
  // 검색어
  query: string
  // 검색 결과 개수
  limit: number
}

export interface GetStockListResponse{
  // 종목 심볼
  symbol: string
  // 종목 이름
  name: string
  // 현재 가격
  currentPrice: number
  // 가격 변동
  priceDelta: number
}
 //회원가입
export interface SignUpRequest
{
  // 이메일
  email: string
  // 비밀번호
  password: string
  // 닉네임
  nickname: string
}

export interface SignUpResponse{
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

