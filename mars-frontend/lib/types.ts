export interface Stock {
  symbol: string
  name: string
  price: string
  change: string
  changePercent: string
  logoUrl?: string
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
