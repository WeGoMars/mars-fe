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

export interface StockChartData {
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

export interface StockChartResponse {
  // 성공 여부
  success: boolean
  // 메시지
  message: string
  // 데이터
  data: StockChartData[]
}
