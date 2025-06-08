import type { StockDetails, ChartDataResponse, NewsItem, ApiResponse, GetStockChartDataRequest, GetStockChartDataResponse, GetStockListResponse, GetStockListRequest } from "./types"
import type { SignUpRequest, SignUpResponse, WalletResponse, TradeResponse, TradeRequest } from "./types"
import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react';
import type { LoginRequest, LoginResponse, UserProfile } from "./types"


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

// 차트 데이터 조회
export async function getStockChartData(params: GetStockChartDataRequest): Promise<ApiResponse<GetStockChartDataResponse>> {
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

// 주식 종목 검색
export async function getStockList(params: GetStockListRequest): Promise<ApiResponse<GetStockListResponse>>{
  const { query, limit } = params
  const response = await fetch(
    `api/stocks/search?query=${query}&limit=${limit}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )

  if (!response.ok) {
    throw new Error('Failed to fetch stock list')
  }

  return response.json()
}

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api", credentials: "include" }),
  endpoints: (builder) => ({
    signUp: builder.mutation<SignUpResponse, SignUpRequest>({
      query: ({email, password, nickname}) => ({
        url: "/users",
        method: "POST",
        body: {
          email,
          password,
          nick: nickname,
        },
      }),
    }),
    logIn: builder.mutation<LoginResponse, LoginRequest>({
      query: ({email, password}) => ({
        url: "/users/login",
        method: "POST",
        body: {
          email,
          password,
        },
      }),
    }),
    editProfile: builder.mutation<void, { nickname: string; profileImageUrl?: string }>({
      query: ({nickname, profileImageUrl}) => ({
        url: "/users",
        method: "PATCH",
        body: { 
          nick: nickname,
          ...(profileImageUrl && { profileImageUrl }),
        },
      }),
    }),
    getProfile: builder.query<UserProfile, void>({
      query: () => ({
        url: "/users/whoami",
        method: "GET",
        credentials: "include",
      }),
    }),
  }),
});
export const {
  useSignUpMutation,
  useLogInMutation,
  useEditProfileMutation,
  useGetProfileQuery,
} = userApi;

export const walletApi = createApi({
  reducerPath: "walletApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api", credentials: "include" }),
  endpoints: (builder) => ({
    // 지갑 생성
    createWallet: builder.mutation<WalletResponse, { amount: number }>({
      query: ({ amount }) => ({
        url: "/wallets",
        method: "POST",
        body: { amount },
      }),
    }),

    // 지갑 잔고 조회
    getWallet: builder.query<WalletResponse, void>({
      query: () => ({
        url: "/wallets",
        method: "GET",
      }),
    }),

    // 지갑 잔고 수정
    updateWallet: builder.mutation<WalletResponse, { amount: number }>({
      query: ({ amount }) => ({
        url: "/wallets",
        method: "PUT",
        body: { amount },
      }),
    }),
  }),
});

export const {
  useCreateWalletMutation,
  useGetWalletQuery,
  useUpdateWalletMutation,
} = walletApi;

export const tradesApi = createApi({
  reducerPath: 'tradesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/trades',
    credentials: 'include', // 쿠키 포함 (로그인 필수)
  }),
  endpoints: (builder) => ({
    buyStock: builder.mutation<TradeResponse, TradeRequest>({
      query: (body) => ({
        url: 'buy',
        method: 'POST',
        body,
        headers: { 'Content-Type': 'application/json' },
      }),
    }),
    sellStock: builder.mutation<TradeResponse, TradeRequest>({
      query: (body) => ({
        url: 'sell',
        method: 'POST',
        body,
        headers: { 'Content-Type': 'application/json' },
      }),
    }),
  }),
});

export const { useBuyStockMutation, useSellStockMutation } = tradesApi;