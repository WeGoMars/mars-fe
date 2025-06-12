import type {
  SignUpRequest,
  SignUpResponse,
  WalletResponse,
  TradeResponse,
  TradeRequest,
  GetTradeHistoryResponse,
  OverallPortfolioResponse,
  GetStockPortfolioResponse,
  UserPreferenceRequest,
  UserPreferenceResponse,
  GetUserPreferenceResponse,
  GetAiRecommendationsResponse,
} from "./types";
import type {
  StockDetails,
  ChartDataResponse,
  NewsItem,
  ApiResponse,
  GetStockChartDataRequest,
  GetStockChartDataResponse,
  GetStockListResponse,
  GetStockListRequest,
  GetStockSearchRequest,
  GetStockSearchResponse,
  GetStockDetailsResponse,
  LikeStockRequest,
  LikeStockResponse,
  UnlikeStockResponse,
  GetLikedStocksResponse,
  GetMyStocksResponse,
} from "./types";
import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import type { LoginRequest, LoginResponse, UserProfile } from "./types";

// 종목 상세 정보 가져오기
export async function getStockDetails(
  symbol: string
): Promise<GetStockDetailsResponse> {
  const response = await fetch(`/api/stocks/${symbol}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch stock details");
  }

  return response.json();
}

// 차트 데이터 조회
export async function getStockChartData(
  params: GetStockChartDataRequest
): Promise<ApiResponse<GetStockChartDataResponse>> {
  const { symbol, interval, limit } = params;
  const response = await fetch(
    `api/stocks/chart?symbol=${symbol}&interval=${interval}&limit=${limit}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch stock data");
  }

  return response.json();
}

// 주식 종목 검색
export async function getStockList(
  params: GetStockListRequest
): Promise<ApiResponse<GetStockListResponse>> {
  const { option, limit } = params;
  const response = await fetch(
    `api/stocks/list?option=${option}&limit=${limit}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch stock list");
  }

  return response.json();
}

// 종목 검색 (query 기반)
export async function searchStockList(
  params: GetStockSearchRequest
): Promise<ApiResponse<GetStockSearchResponse[]>> {
  const { query, limit } = params;
  const response = await fetch(
    `api/stocks/search?query=${encodeURIComponent(query)}&limit=${limit}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch search results");
  }
  return response.json();
}

// 관심 종목 추가
export async function addToFavorites(
  params: LikeStockRequest
): Promise<LikeStockResponse> {
  const response = await fetch("/api/portfolios/like", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error("Failed to add stock to favorites");
  }

  return response.json();
}

// 관심 종목 삭제
export async function removeFromFavorites(
  params: LikeStockRequest
): Promise<UnlikeStockResponse> {
  const response = await fetch("/api/portfolios/like", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error("Failed to remove stock from favorites");
  }

  return response.json();
}

// 관심 종목 목록 조회
export async function getFavoriteStocks(): Promise<GetLikedStocksResponse> {
  const response = await fetch("/api/portfolios/like", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch favorite stocks");
  }

  return response.json();
}

// 내 종목 목록 조회(내가 구매한 종목)
export async function getMyStocks(): Promise<GetMyStocksResponse> {
  const response = await fetch("/api/portfolios/list", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // 로그인 필수
  });

  if (!response.ok) {
    throw new Error("Failed to fetch my stocks");
  }

  return response.json();
}

// 주식 거래내역 조회 api test 2번 째
export async function getTradeHistory(): Promise<GetTradeHistoryResponse> {
  const response = await fetch("/api/portfolios/history", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // 로그인 필수
  });

  if (!response.ok) {
    throw new Error("Failed to fetch trade history");
  }

  return response.json();
}

//회원가입,로그인, 프로필 수정, 프로필 조회, 로그아웃 API
export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api", credentials: "include" }),
  endpoints: (builder) => ({
    signUp: builder.mutation<SignUpResponse, SignUpRequest>({
      query: ({ email, password, nickname }) => ({
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
      query: ({ email, password }) => ({
        url: "/users/login",
        method: "POST",
        body: {
          email,
          password,
        },
      }),
    }),
    editProfile: builder.mutation<
      void,
      { nickname: string; profileImageUrl?: string }
    >({
      query: ({ nickname, profileImageUrl }) => ({
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
    logout: builder.mutation<{ success: string; message: string }, void>({
      query: () => ({
        url: "/users/logout",
        method: "GET",
        credentials: "include", // 세션 쿠키 사용 시 필수
      }),
    }),
  }),
});
export const {
  useSignUpMutation,
  useLogInMutation,
  useEditProfileMutation,
  useGetProfileQuery,
  useLogoutMutation,
} = userApi;
//지갑 관련 API
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
  reducerPath: "tradesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/trades",
    credentials: "include", // 쿠키 포함 (로그인 필수)
  }),
  endpoints: (builder) => ({
    buyStock: builder.mutation<TradeResponse, TradeRequest>({
      query: (body) => ({
        url: "buy",
        method: "POST",
        body,
        headers: { "Content-Type": "application/json" },
      }),
    }),
    sellStock: builder.mutation<TradeResponse, TradeRequest>({
      query: (body) => ({
        url: "sell",
        method: "POST",
        body,
        headers: { "Content-Type": "application/json" },
      }),
    }),
  }),
});

export const { useBuyStockMutation, useSellStockMutation } = tradesApi;

export const portfolioApi = createApi({
  reducerPath: "portfolioApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/portfolios",
    credentials: "include", // 로그인 세션 유지
  }),
  endpoints: (builder) => ({
    getOverallPortfolio: builder.query<OverallPortfolioResponse, void>({
      query: () => ({
        url: "overall",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetOverallPortfolioQuery } = portfolioApi;
// 주식 매수 (직접 호출용)
export async function buyStock(params: TradeRequest): Promise<TradeResponse> {
  const response = await fetch("/api/trades/buy", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
    credentials: "include",
  });
  if (!response.ok) throw new Error("매수 실패");
  return response.json();
}

// 주식 매도 (직접 호출용)
export async function sellStock(params: TradeRequest): Promise<TradeResponse> {
  const response = await fetch("/api/trades/sell", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
    credentials: "include",
  });
  if (!response.ok) throw new Error("매도 실패");
  return response.json();
}

// 보유종목/상품현황(주식 종목별 포트폴리오 조회 api)
export async function getStockPortfolio(): Promise<GetStockPortfolioResponse> {
  const response = await fetch("/api/portfolios/stock", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // 로그인 필수
  });

  if (!response.ok) {
    throw new Error("Failed to fetch stock portfolio");
  }

  return response.json();
}

// AI 추천을 위한 사용자 선호도 저장
export async function saveUserPreference(
  params: UserPreferenceRequest
): Promise<UserPreferenceResponse> {
  const response = await fetch("/api/ai/preference", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
    credentials: "include", // 로그인 필수
  });

  if (!response.ok) {
    throw new Error("Failed to save user preference");
  }

  return response.json();
}

// 내 선호 조회
export async function getUserPreference(): Promise<GetUserPreferenceResponse> {
  const response = await fetch("/api/ai/preference", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // 로그인 필수
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user preference");
  }

  return response.json();
}

// AI 추천 종목/이유 조회
export async function getAiRecommendations(): Promise<GetAiRecommendationsResponse> {
  const response = await fetch("/api/ai/recommend", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to fetch AI recommendations");
  return response.json();
}
