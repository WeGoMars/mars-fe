'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { getStockDetails } from '@/lib/api';
import type { StockDetails, NewsItem, Stock } from '@/lib/types';
import { Check, ChevronDown, ChevronLeft, Heart } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
// import mockPortfolio from "@/lib/mock/mockportfolio";
import { TrendingUp, TrendingDown } from "lucide-react"
import { useGetOverallPortfolioQuery,useGetWalletQuery } from "@/lib/api"; 
// 주식 상세 정보를 보여주는 컴포넌트(종목정보 상세, 내 계좌, AI 추천 탭)   
interface StockDetailsProps {
  symbol: string; // 주식 심볼
  activeTab: '종목정보 상세' | '내 계좌' | 'AI 추천'; // 현재 활성화된 탭
  onTabChange: (tab: '종목정보 상세' | '내 계좌' | 'AI 추천') => void; // 탭 변경 핸들러
  favoriteStocks: Stock[]; // 관심 종목 목록
  setFavoriteStocks: React.Dispatch<React.SetStateAction<Stock[]>>; // 관심 종목 설정 함수
  isLoggedIn: boolean; // 로그인 상태
}

export default function StockDetails({ symbol, activeTab, onTabChange, favoriteStocks, setFavoriteStocks, isLoggedIn }: StockDetailsProps) {
  const [details, setDetails] = useState<StockDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [expandedReasons, setExpandedReasons] = useState<number[]>([]);
  const [showReasonDetail, setShowReasonDetail] = useState(false);
  const [aiSubmitted, setAiSubmitted] = useState(false);
  const [isHeartFilled, setIsHeartFilled] = useState(false);
  // const [portfolioData, setPortfolioData] = useState(mockPortfolio);

  // RTK Query 호출
const {
  data: portfolioResponse,
  isLoading: portfolioLoading,
  isError: portfolioError,
} = useGetOverallPortfolioQuery(undefined, {
  skip: !isLoggedIn, // 로그인 안 되어 있으면 호출 안 함
});

const {
  data: walletResponse,
  isLoading: walletLoading,
  isError: walletError,
} = useGetWalletQuery(undefined, {
  skip: !isLoggedIn,
});
// 로딩 처리
if (!isLoggedIn) {
  return <div>로그인이 필요합니다.</div>;
}

if (portfolioLoading || walletLoading) return <div>로딩 중...</div>;
if (portfolioError || walletError) return <div>에러 발생</div>;
// 에러 처리 (응답 자체가 실패한 경우)
if (portfolioError || walletError) {
  console.error("에러 발생", {
    portfolioError,
    walletError,
    portfolioResponse,
    walletResponse,
  });
  return <div>에러 발생</div>;
}

// 안전한 기본값 처리
const portfolioData = portfolioResponse?.data && typeof portfolioResponse.data.totalAsset === 'number'
  ? portfolioResponse.data
  : {
      totalAsset: 0,
      investedAmount: 0,
      evalGain: 0,
      returnRate: 0,
    };

const walletData = walletResponse?.data && typeof walletResponse.data.cyberDollar === 'number'
  ? walletResponse.data
  : {
      cyberDollar: 100000,
    };
  
 
  useEffect(() => {
    const fetchData = async () => {
      if (!symbol) return; // symbol이 없으면 실행하지 않음
      
      setIsLoading(true);
      setError(null);
      try {
        const response = await getStockDetails(symbol);
        if (response.success) {
          setDetails(response.data);
          // 상위 컴포넌트에 데이터 업데이트 알림
          if (response.data) {
            const price = response.data.currentPrice;
            const lastPrice = response.data.lastPrice;
            const change = lastPrice !== 0 && lastPrice !== undefined && lastPrice !== null 
              ? ((price - lastPrice) / lastPrice) * 100 
              : 0;
            onTabChange(activeTab); // 탭 변경을 통해 상위 컴포넌트에 데이터 업데이트 알림
          }
        } else {
          setError(response.message);
        }
      } catch (err) {
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
        console.error('Failed to fetch stock details:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [symbol, activeTab, onTabChange]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-gray-400">데이터 로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  const handleTabClick = (tab: '종목정보 상세' | '내 계좌' | 'AI 추천') => {
    onTabChange(tab);
  };

  if (showReasonDetail) {
    return (
      <div className="flex-1 overflow-auto flex flex-col">
        {/* Top Navigation with Gray Boxes */}
        <div className="flex justify-between gap-1 md:gap-2 mb-4 overflow-x-auto">
          {(['종목정보 상세', '내 계좌', 'AI 추천'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                onTabChange(tab);
                setShowReasonDetail(false);
              }}
              className={`px-2 md:px-4 py-2 rounded-xl font-medium text-xs md:text-sm whitespace-nowrap transition-colors ${
                activeTab === tab ? 'bg-[#f5f7f9]' : 'bg-[#f5f7f9] hover:bg-gray-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="max-w-md mx-auto bg-white rounded-2xl p-6">
          {/* AI Recommendation Button */}
          <div className="mb-8">
            <Button
              className="w-full h-12 bg-white border-2 border-[#006ffd] text-[#006ffd] hover:bg-[#eaf2ff] rounded-xl text-base font-medium"
              variant="outline"
            >
              AI의 추천 이유
            </Button>
          </div>

          {/* Google Section */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="text-[#1f2024] text-base font-medium">구글</div>

            {/* Microsoft-style logo */}
            <div className="grid grid-cols-2 gap-0.5 w-6 h-6">
              <div className="bg-[#ff4444] rounded-sm"></div>
              <div className="bg-[#00aa00] rounded-sm"></div>
              <div className="bg-[#0066ff] rounded-sm"></div>
              <div className="bg-[#ffaa00] rounded-sm"></div>
            </div>

            <span className="text-[#71727a] text-xs bg-gray-100 px-1.5 py-0.5 rounded-full">#빅테크</span>
          </div>

          {/* Information Cards */}
          <div className="space-y-4 mb-8">
            {/* Portfolio Balance Card */}
            <Card className="bg-[#fff4e4] border-none shadow-none">
              <CardContent className="p-4">
                <div className="bg-[#eaf2ff] text-[#1f2024] px-3 py-1.5 rounded-lg text-center mb-3 text-sm font-medium">
                  포트폴리오 균형 기준
                </div>
                <p className="text-[#1f2024] text-center text-sm leading-relaxed">
                  당신의 포트폴리오 상 XX주의 비중이 낮아 추천드립니다.
                </p>
              </CardContent>
            </Card>

            {/* Industry Trends Card */}
            <Card className="bg-[#fff4e4] border-none shadow-none">
              <CardContent className="p-4">
                <div className="bg-[#eaf2ff] text-[#1f2024] px-3 py-1.5 rounded-lg text-center mb-3 text-sm font-medium">
                  최근 업계 동향 기준
                </div>
                <p className="text-[#1f2024] text-center text-sm leading-relaxed">
                  당신의 포트폴리오 상 XX주의 비중이 낮아 추천드립니다.
                </p>
              </CardContent>
            </Card>

            {/* AI Estimation Card */}
            <Card className="bg-[#fff4e4] border-none shadow-none">
              <CardContent className="p-4">
                <div className="bg-[#eaf2ff] text-[#1f2024] px-3 py-1.5 rounded-lg text-center mb-3 text-sm font-medium">
                  AI의 추정
                </div>
                <p className="text-[#1f2024] text-center text-sm leading-relaxed">
                  당신의 포트폴리오 상 XX주의 비중이 낮아 추천드립니다.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Action */}
          <div className="flex items-center justify-center gap-2">
            <ChevronLeft className="w-5 h-5 text-[#006ffd] cursor-pointer" onClick={() => setShowReasonDetail(false)} />
            <span className="text-[#1f2024] text-base font-medium">관심 종목으로 저장</span>
            <button
              onClick={() => {
                const newIsHeartFilled = !isHeartFilled;
                setIsHeartFilled(newIsHeartFilled);
                
                if (newIsHeartFilled) {
                  // 구글 주식 정보를 직접 추가
                  const googleStock: Stock = {
                    symbol: 'GOOGL',
                    name: 'Alphabet Inc.',
                    price: '142.65',
                    change: '+2.35',
                    changePercent: '+1.67%'
                  };
                  if (!favoriteStocks.some(stock => stock.symbol === googleStock.symbol)) {
                    setFavoriteStocks(prev => [...prev, googleStock]);
                  }
                } else {
                  setFavoriteStocks(prev => prev.filter(stock => stock.symbol !== 'GOOGL'));
                }
              }}
              className="flex items-center justify-center"
            >
              <Heart 
                className={`w-4 h-4 cursor-pointer transition-colors ${
                  isHeartFilled ? 'text-red-500 fill-red-500' : 'text-[#1f2024]'
                }`} 
              />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto flex flex-col">
      {/* 종목정보 상세, 내 계좌, AI 추천 탭 */}
      <div className="flex justify-between gap-1 md:gap-2 mb-4 overflow-x-auto">
        {(['종목정보 상세', '내 계좌', 'AI 추천'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              onTabChange(tab);
              setAiSubmitted(false);
            }}
            className={`px-2 md:px-4 py-2 rounded-xl font-medium text-xs md:text-sm whitespace-nowrap transition-colors ${
              activeTab === tab ? 'bg-[#f5f7f9]' : 'bg-[#f5f7f9] hover:bg-gray-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === '내 계좌' ? (
        isLoggedIn ? (
          <div className="flex-1 flex flex-col mt-12">
            {/* Financial Information */}
            <div className="space-y-8">
              {/* Total Assets */}
              <div className="flex justify-between py-3 md:py-5 px-3 md:px-4 border rounded-full">
                <span className="text-sm text-gray-500">총자산</span>
                <div className="text-xl font-bold text-[#197bbd] group-hover:text-[#1565a0] transition-colors">
                  <span className="text-[#197bbd] text-xs mr-1">$</span>
                  {portfolioData.totalAsset.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
              </div>
              {/* 시드머니 */}
              <div className="flex justify-between py-3 md:py-5 px-3 md:px-4 border rounded-full">
                <span className="text-sm text-gray-500">시드머니</span>
                <div className="text-xl font-bold group-hover:text-[#1565a0] transition-colors">
                  <span className="text-xs mr-1">$</span>
                  {walletData.cyberDollar.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
              </div>
              {/* Investment Amount */}
              <div className="flex justify-between py-3 md:py-5 px-3 md:px-4 border rounded-full">
                <span className="text-sm text-gray-500">투자금액</span>
                <div>
                <span className="text-[#439a86] text-xs mr-1">$</span>
                <span className="text-xl font-bold text-[#439a86] ">
                  {portfolioData.investedAmount.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
              </div>
              {/* Unrealized P&L */}
              <div className="flex justify-between py-3 md:py-5 px-3 md:px-4 border rounded-full">
                <span className="text-sm text-gray-500">평가손익</span>
                  <div
                    className={`flex items-center text-xl font-bold transition-colors 
                      ${portfolioData.evalGain >= 0 
                        ? "text-[#e74c3c] group-hover:text-[#c0392b]" 
                        : "text-[#3498db] group-hover:text-[#2c80b4]"}
                    `}
                  >
              <span className="text-xs mr-1">$</span>
              <span>
                {portfolioData.evalGain >= 0 ? "+" : "-"}
                {Math.abs(portfolioData.evalGain).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
              </div>
              {/* Return Rate */}
              <div className="flex justify-between py-3 md:py-5 px-3 md:px-4 border rounded-full">
                <span className="text-sm text-gray-500">수익률</span>
                <span className="text-sm font-medium">
                  <div
                  className={`text-xl font-bold transition-colors flex items-center gap-1 
                    ${portfolioData.returnRate >= 0 
                      ? "text-[#e74c3c] group-hover:text-[#4caf50]" 
                      : "text-[#3498db] group-hover:text-[#a73d2a]"}
                  `}
                  >
                    {portfolioData.returnRate >= 0 ? (
                    <TrendingUp className="h-5 w-5" />
                  ) : (
                    <TrendingDown className="h-5 w-5" />
                  )}
                  {portfolioData.returnRate >= 0 ? "+" : "-"}
                  {Math.abs(portfolioData.returnRate).toFixed(2)}%
                </div>
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <span className="text-xl text-gray-400 font-semibold mb-2">계좌 정보</span>
            <span className="text-gray-300">로그인이 필요합니다.</span>
          </div>
        )
      ) : activeTab === 'AI 추천' ? (
        <div className="max-w-md mx-auto bg-white rounded-2xl p-6">
          {!showResult ? (
            <>
              {/* Blue Message Box */}
              <div className="bg-[#eaf2ff] border-2 border-[#006ffd] rounded-2xl p-4 mb-6 text-center">
                <p className="text-[#006ffd] text-xs font-semibold leading-relaxed tracking-tight">
                  당신의 투자 성향, <span className="whitespace-nowrap">AI가 알고 싶어해요!</span><br />
                  알려주시면 딱 맞게 추천해드릴게요.
                </p>
              </div>
              {/* Investment Preference Section */}
              <div className="bg-[#e7f4e8] rounded-2xl p-4 mb-6">
                <h2 className="text-[#000000] text-base font-bold text-center mb-3 tracking-tight">당신의 투자 성향</h2>
                <div className="flex gap-2">
                  <button className="flex-1 bg-[#ffe2e5] rounded-xl py-2 px-2 flex items-center justify-center gap-1 whitespace-nowrap">
                    <div className="w-5 h-5 bg-[#ff616d] rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">!</span>
                    </div>
                    <span className="text-[#000000] font-medium text-sm tracking-tight">고위험</span>
                  </button>
                  <button className="flex-1 bg-[#c3e7f2] rounded-xl py-2 px-2 flex items-center justify-center gap-1 whitespace-nowrap">
                    <div className="w-5 h-5 bg-[#006ffd] rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">↓</span>
                    </div>
                    <span className="text-[#000000] font-medium text-sm tracking-tight">저위험</span>
                  </button>
                </div>
              </div>
              {/* Preferred Strategy Section */}
              <div className="bg-[#fff4e4] rounded-2xl p-4 mb-6">
                <h2 className="text-[#000000] text-base font-bold text-center mb-3 tracking-tight">당신의 선호 전략</h2>
                <div className="flex gap-2">
                  <button className="flex-1 bg-[#ffffff] rounded-xl py-2 px-2 whitespace-nowrap">
                    <span className="text-[#000000] font-medium text-sm tracking-tight">가치투자</span>
                  </button>
                  <button className="flex-1 bg-[#ffffff] rounded-xl py-2 px-2 whitespace-nowrap">
                    <span className="text-[#000000] font-medium text-sm tracking-tight">성장투자</span>
                  </button>
                  <button className="flex-1 bg-[#ffffff] rounded-xl py-2 px-2 whitespace-nowrap">
                    <span className="text-[#000000] font-medium text-sm tracking-tight">모멘텀</span>
                  </button>
                </div>
              </div>
              {/* Interest Areas Section */}
              <div className="bg-[#c3e7f2] rounded-2xl p-4 mb-6">
                <h2 className="text-[#000000] text-base font-bold text-center mb-3 tracking-tight">당신의 관심 산업 분야</h2>
                <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto overflow-x-hidden">
                  {[
                    '# 빅테크', '# 2차전지', '# 반도체', '# 바이오', '# 친환경', '# 클라우드', '# AI', '# 모빌리티',
                    '# 게임', '# 엔터', '# 금융', '# 로봇', '# 우주항공', '# 헬스케어', '# 에너지', '# 소재',
                    '# 유통', '# 소비재', '# 통신', '# 미디어', '# 여행', '# 식품', '# 건설', '# 부동산',
                    '# 패션', '# 교육', '# 물류', '# 광고', '# 데이터', '# 보안', '# IoT', '# 스마트팜',
                  ].map((tag, index) => (
                    <button key={index} className="bg-[#ffffff] rounded-xl py-1 px-2 whitespace-nowrap">
                      <span className="text-[#000000] font-medium text-xs tracking-tight">{tag}</span>
                    </button>
                  ))}
                </div>
              </div>
              {/* 제출 버튼 */}
              <div className="bg-[#f4f5f9] rounded-2xl p-4 text-center">
                <button
                  className="text-[#71727a] font-medium text-sm tracking-tight border-2 border-[#2563eb] rounded-md px-4 py-2"
                  onClick={() => {
                    if (!isLoggedIn) {
                      setShowResult(true);
                    } else {
                      setShowResult(true);
                    }
                  }}
                >
                  제출
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col">
              {!isLoggedIn ? (
                <div className="flex flex-col items-center justify-center h-full mt-[359px]">
                  <span className="text-xl text-gray-400 font-semibold mb-2">AI 추천</span>
                  <span className="text-gray-300">로그인이 필요합니다.</span>
                </div>
              ) : (
                <>
                  <div className="bg-transparent border-2 border-[#006ffd] rounded-2xl p-3 mb-3">
                    <p className="text-[#006ffd] text-center font-medium text-sm">회원님의 투자 전략 알려드릴게요.</p>
                  </div>
                  <div className="bg-[#e7f4e8] border-0 rounded-2xl p-4 space-y-3 mb-3">
                    <h2 className="text-[#1f2024] text-base font-semibold text-center">현재 회원님의 투자 전략</h2>
                    <div className="flex gap-2 justify-center">
                      <div className="bg-[#ffe2e5] px-3 py-1 rounded-full flex items-center gap-1">
                        <div className="w-5 h-5 bg-[#ff9500] rounded-full flex items-center justify-center">
                          <span className="text-white text-[10px] font-bold">!</span>
                        </div>
                        <span className="text-[#1f2024] text-xs font-medium">저위험</span>
                      </div>
                      <div className="bg-[#eaf2ff] px-3 py-1 rounded-full flex items-center gap-1">
                        <div className="w-5 h-5 bg-[#006ffd] rounded-full flex items-center justify-center">
                          <span className="text-white text-[10px] font-bold">!</span>
                        </div>
                        <span className="text-[#1f2024] text-xs font-medium">가치투자</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 mb-3">
                    {[1, 2, 3, 4].map((index) => (
                      <div key={index} className="bg-[#fff4e4] border-0 rounded-2xl p-3 mb-1">
                        <div className="space-y-2">
                          <div className="flex items-center justify-center gap-2">
                            <span className="text-[#1f2024] text-base font-semibold">구글</span>
                            <div className="grid grid-cols-2 gap-0.5 w-5 h-5">
                              <div className="bg-red-500 rounded-sm"></div>
                              <div className="bg-green-500 rounded-sm"></div>
                              <div className="bg-blue-500 rounded-sm"></div>
                              <div className="bg-yellow-500 rounded-sm"></div>
                            </div>
                            <span className="text-[#71727a] text-xs bg-gray-100 px-1.5 py-0.5 rounded-full">#빅테크</span>
                          </div>
                          <div className="border-t border-gray-200 pt-2">
                            <div 
                              className="flex items-center justify-center gap-1 cursor-pointer hover:bg-gray-50 rounded-lg py-1 transition-colors"
                              onClick={() => setShowReasonDetail(true)}
                            >
                              <span className="text-[#1f2024] font-medium text-sm flex items-center gap-1">
                                AI의 추천 이유
                                <ChevronDown className="w-4 h-4 text-[#71727a]" />
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-[#71727a] text-xs">좀 더 젊고 MZ한 종목으로 추천 해봐!</p>
                    <button
                      className="bg-[#006ffd] hover:bg-[#0056cc] text-white rounded-full px-4 py-1.5 flex items-center gap-1 mx-auto text-sm"
                      onClick={() => setShowResult(false)}
                    >
                      다시 추천!
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      ) : (
        activeTab === '종목정보 상세' && details ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="bg-gray-200 w-8 h-8 flex items-center justify-center rounded overflow-hidden">
                  <Image
                    src={`https://logo.clearbit.com/${details.symbol.toLowerCase()}.com`}
                    alt={`${details.symbol} 로고`}
                    width={32}
                    height={32}
                    style={{ objectFit: 'contain' }}
                    onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg?height=32&width=32&query=stock' }}
                  />
                </div>
                <h3 className="text-lg md:text-xl font-bold">{details.name}</h3>
              </div>
              <div>
                <div className="font-bold text-right">{details.currentPrice !== undefined ? `$${details.currentPrice.toFixed(2)}` : '-'}</div>
              </div>
            </div>
            <div className="space-y-3 mb-4">
              <div className="flex justify-between py-2 md:py-3 px-3 md:px-4 border rounded-full">
                <span className="text-sm text-gray-500">시가총액</span>
                <span className="text-sm font-medium">{details.marketCap ? `$${details.marketCap.toLocaleString()}` : '-'}</span>
              </div>
              <div className="flex justify-between py-2 md:py-3 px-3 md:px-4 border rounded-full">
                <span className="text-sm text-gray-500">섹터</span>
                <span className="text-sm font-medium">{details.sector || '-'}</span>
              </div>
              <div className="flex justify-between py-2 md:py-3 px-3 md:px-4 border rounded-full">
                <span className="text-sm text-gray-500">산업군</span>
                <span className="text-sm font-medium">{details.industry || '-'}</span>
              </div>
              <div className="flex justify-between py-2 md:py-3 px-3 md:px-4 border rounded-full">
                <span className="text-sm text-gray-500">전일 종가</span>
                <span className="text-sm font-medium">{details.lastPrice !== undefined ? `$${details.lastPrice.toFixed(2)}` : '-'}</span>
              </div>
              <div className="flex justify-between py-2 md:py-3 px-3 md:px-4 border rounded-full">
                <span className="text-sm text-gray-500">ROE</span>
                <span className="text-sm font-medium">{details.roe !== undefined ? `${details.roe.toFixed(2)}%` : '-'}</span>
              </div>
              <div className="flex justify-between py-2 md:py-3 px-3 md:px-4 border rounded-full">
                <span className="text-sm text-gray-500">EPS</span>
                <span className="text-sm font-medium">{details.eps !== undefined ? details.eps.toFixed(2) : '-'}</span>
              </div>
              <div className="flex justify-between py-2 md:py-3 px-3 md:px-4 border rounded-full">
                <span className="text-sm text-gray-500">BPS</span>
                <span className="text-sm font-medium">{details.bps !== undefined ? details.bps.toFixed(2) : '-'}</span>
              </div>
              <div className="flex justify-between py-2 md:py-3 px-3 md:px-4 border rounded-full">
                <span className="text-sm text-gray-500">베타</span>
                <span className="text-sm font-medium">{details.beta !== undefined ? details.beta.toFixed(2) : '-'}</span>
              </div>
              <div className="flex justify-between py-2 md:py-3 px-3 md:px-4 border rounded-full">
                <span className="text-sm text-gray-500">배당수익률</span>
                <span className="text-sm font-medium">{details.dividendYield !== undefined ? `${(details.dividendYield * 100).toFixed(2)}%` : '-'}</span>
              </div>
              <div className="flex justify-between py-2 md:py-3 px-3 md:px-4 border rounded-full">
                <span className="text-sm text-gray-500">유동비율</span>
                <span className="text-sm font-medium">{details.currentRatio !== undefined ? `${details.currentRatio.toFixed(2)}%` : '-'}</span>
              </div>
              <div className="flex justify-between py-2 md:py-3 px-3 md:px-4 border rounded-full">
                <span className="text-sm text-gray-500">부채비율</span>
                <span className="text-sm font-medium">{details.debtRatio !== undefined ? `${details.debtRatio.toFixed(2)}%` : '-'}</span>
              </div>
            </div>
          </>
        ) : null
      )}
    </div>
  );
}