import type { Stock, StockDetails, ChartDataResponse, NewsItem, StockChartResponse } from "./types"

// 종목 목록 가져오기
export async function getStockList(): Promise<Stock[]> {
  // 실제 API 호출 대신 더미 데이터 반환
  return [
    { symbol: "MSFT", name: "Microsoft Corp.", price: "$213.10", change: "+2.5%", changePercent: "2.5%" },
    { symbol: "GOOGL", name: "Alphabet Inc.", price: "$213.10", change: "+1.1%", changePercent: "1.1%" },
    { symbol: "SPOT", name: "Spotify Technology", price: "$213.10", change: "+2.5%", changePercent: "2.5%" },
    { symbol: "AAPL", name: "Apple Inc.", price: "$213.10", change: "+2.5%", changePercent: "2.5%" },
    { symbol: "AMZN", name: "Amazon.com Inc.", price: "$213.10", change: "+1.1%", changePercent: "1.1%" },
    { symbol: "NFLX", name: "Netflix Inc.", price: "$213.10", change: "+2.5%", changePercent: "2.5%" },
  ]
}

// 종목 상세 정보 가져오기
export async function getStockDetails(symbol: string): Promise<StockDetails> {
  // 실제 API 호출 대신 더미 데이터 반환
  return {
    symbol,
    name: symbol === "MSFT" ? "Microsoft Corp." : symbol === "GOOGL" ? "Alphabet Inc." : "Spotify Technology",
    price: "$213.10",
    change: "+1.1%",
    changePercent: "1.1%",
    marketCap: "4.4조원",
    company: "삼성자산운용(ETF)",
    listingDate: "2021년 4월 9일",
    assets: "4.4조원",
    shares: "230,800,000주",
    description: "S&P 500에 투자하여 배당금을 제공하는 ETF",
  }
}

// 종목 차트 데이터 가져오기
export async function getStockChartData(symbol: string, period: string): Promise<ChartDataResponse> {
  // 실제 API 호출 대신 더미 데이터 반환
  const prices = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
    value: 100 + Math.random() * 50,
  }))

  const volumes = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
    value: 1000000 + Math.random() * 5000000,
  }))

  return { prices, volumes }
}

// 종목 검색하기
export async function searchStocks(query: string): Promise<Stock[]> {
  // 실제 API 호출 대신 더미 데이터 반환
  if (!query) return []

  const allStocks = await getStockList()
  return allStocks.filter(
    (stock) =>
      stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
      stock.name.toLowerCase().includes(query.toLowerCase()),
  )
}

// 뉴스 가져오기
export async function getStockNews(symbol?: string): Promise<NewsItem[]> {
  // 실제 API 호출 대신 더미 데이터 반환
  return [
    {
      id: 1,
      title: "홍콩그룹과 경영권 분쟁 가능성에...한진칼 상한가",
      source: "한국경제",
      time: "1시간 전",
      imageUrl: "/placeholder.svg?height=56&width=56&query=financial news",
    },
    {
      id: 2,
      title: "미 연준, 금리 인하 시기 놓고 의견 분분...시장 혼란",
      source: "매일경제",
      time: "3시간 전",
      imageUrl: "/placeholder.svg?height=56&width=56&query=financial news",
    },
    {
      id: 3,
      title: "테슬라, 전기차 판매량 예상치 하회...주가 급락",
      source: "조선비즈",
      time: "5시간 전",
      imageUrl: "/placeholder.svg?height=56&width=56&query=financial news",
    },
  ]
}

// 주식 차트 데이터 가져오기 (RTK)
export async function getStockData(params: {
  symbol: string
  interval: '1h' | '1day' | '1week' | '1month'
  limit: number
}): Promise<StockChartResponse> {
  const { symbol, interval, limit } = params
  const response = await fetch(
    `api/stocks/chart?symbol=${symbol}&interval=${interval}&limit=${limit}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )

  if (!response.ok) {
    throw new Error('Failed to fetch stock data')
  }

  return response.json()
}
