import axios from "axios"

// API 기본 설정
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
})

// 종목 목록 가져오기
export const getStockList = async () => {
  try {
    const response = await api.get("/stocks")
    return response.data
  } catch (error) {
    console.error("Failed to fetch stock list:", error)
    throw error
  }
}

// 종목 상세 정보 가져오기
export const getStockDetails = async (symbol: string) => {
  try {
    const response = await api.get(`/stocks/${symbol}`)
    return response.data
  } catch (error) {
    console.error(`Failed to fetch details for ${symbol}:`, error)
    throw error
  }
}

// 종목 차트 데이터 가져오기
export const getStockChartData = async (symbol: string, period: string) => {
  try {
    const response = await api.get(`/stocks/${symbol}/chart`, {
      params: { period },
    })
    return response.data
  } catch (error) {
    console.error(`Failed to fetch chart data for ${symbol}:`, error)
    throw error
  }
}

// 종목 검색하기
export const searchStocks = async (query: string) => {
  try {
    const response = await api.get("/stocks/search", {
      params: { query },
    })
    return response.data
  } catch (error) {
    console.error("Failed to search stocks:", error)
    throw error
  }
}

// 뉴스 가져오기
export const getStockNews = async (symbol?: string) => {
  try {
    const endpoint = symbol ? `/news/${symbol}` : "/news"
    const response = await api.get(endpoint)
    return response.data
  } catch (error) {
    console.error("Failed to fetch news:", error)
    throw error
  }
}
