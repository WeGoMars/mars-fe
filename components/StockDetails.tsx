'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { getStockDetails, saveUserPreference, getUserPreference, getAiRecommendations, addToFavorites, removeFromFavorites } from '@/lib/api';
import type { StockDetails, NewsItem, Stock, RiskLevel, PreferredStrategy, PreferredSector, GetUserPreferenceResponse, GetAiRecommendationsResponse, AiRecommendationItem } from '@/lib/types';
import { Check, ChevronDown, ChevronLeft, Heart } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import mockPortfolio from "@/lib/mock/mockportfolio";
import { TrendingUp, TrendingDown } from "lucide-react"
import { mutate } from 'swr';

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
  const [portfolioData, setPortfolioData] = useState(mockPortfolio);
  const [selectedRiskLevel, setSelectedRiskLevel] = useState<RiskLevel | null>(null);
  const [selectedStrategies, setSelectedStrategies] = useState<PreferredStrategy[]>([]);
  const [selectedSectors, setSelectedSectors] = useState<PreferredSector[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [userPreference, setUserPreference] = useState<GetUserPreferenceResponse | null>(null);
  const [isLoadingPreference, setIsLoadingPreference] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState<AiRecommendationItem[]>([]);
  const [selectedAiIndex, setSelectedAiIndex] = useState<number | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

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

  // 선호도 데이터 가져오기
  useEffect(() => {
    const fetchUserPreference = async () => {
      if (!isLoggedIn) return;
      
      setIsLoadingPreference(true);
      try {
        const response = await getUserPreference();
        setUserPreference(response);
      } catch (error) {
        console.error('Failed to fetch user preference:', error);
      } finally {
        setIsLoadingPreference(false);
      }
    };

    fetchUserPreference();
  }, [isLoggedIn]);

  // AI 추천 종목 데이터 가져오기
  useEffect(() => {
    const fetchAiRecommendations = async () => {
      if (!isLoggedIn) return;
      setIsLoadingAi(true);
      try {
        const res = await getAiRecommendations();
        if (res.success && Array.isArray(res.data.stocks)) {
          setAiRecommendations(res.data.stocks.slice(0, 3));
        }
      } catch (e) {
        setAiRecommendations([]);
      } finally {
        setIsLoadingAi(false);
      }
    };
    if (showResult && isLoggedIn) fetchAiRecommendations();
  }, [showResult, isLoggedIn]);

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

  const handleStrategyClick = (strategy: PreferredStrategy) => {
    setSelectedStrategies(prev => 
      prev.includes(strategy)
        ? prev.filter(s => s !== strategy)
        : [...prev, strategy]
    );
  };

  const handleSectorClick = (sector: PreferredSector) => {
    setSelectedSectors(prev => 
      prev.includes(sector)
        ? prev.filter(s => s !== sector)
        : [...prev, sector]
    );
  };

  const handleSubmit = async () => {
    if (!isLoggedIn) {
      setShowResult(true);
      return;
    }

    if (!selectedRiskLevel) {
      setSubmitError('투자 성향을 선택해주세요.');
      return;
    }

    if (selectedStrategies.length === 0) {
      setSubmitError('선호 전략을 하나 이상 선택해주세요.');
      return;
    }

    if (selectedSectors.length === 0) {
      setSubmitError('관심 산업 분야를 하나 이상 선택해주세요.');
      return;
    }

    setSubmitError('');
    setIsSubmitting(true);

    try {
      const requestData = {
        riskLevel: selectedRiskLevel,
        preferredStrategies: selectedStrategies,
        preferredSectors: selectedSectors,
      };

      console.log('API 요청 데이터:', requestData);
      const response = await saveUserPreference(requestData);
      console.log('API 응답 데이터:', response);
      
      // 선호도 저장 후 데이터 다시 가져오기
      const updatedPreference = await getUserPreference();
      setUserPreference(updatedPreference);
      
      setShowResult(true);
    } catch (error) {
      console.error('API 에러:', error);
      setSubmitError('선호도 저장 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 추천 이유 파싱 함수
  const parseAiReason = (reasons: any[]): { portfolio: string; industry: string; ai: string } => {
    // 전략 중 업계/포트폴리오 구분이 명확하지 않으면 첫 번째/두 번째 strategy로 분리
    const strategyReasons = reasons.filter(r => r.type === 'strategy');
    
    // 각 전략을 정규식으로 파싱
    const parsedStrategies = strategyReasons.map(reason => {
      const match = reason.detail.match(/^(.+? 전략):\s*(.+)$/);
      if (match) {
        return {
          name: match[1],
          detail: match[2]
        };
      }
      return {
        name: reason.detail.split(':')[0],
        detail: reason.detail.split(':')[1] || ''
      };
    });

    // 첫 번째 전략은 포트폴리오 균형 기준으로
    // 두 번째 전략은 업계 동향 기준으로 사용
    return {
      portfolio: parsedStrategies[0]?.detail || '',
      industry: parsedStrategies[1]?.detail || '',
      ai: reasons.find(r => r.type === 'commentary')?.detail || '',
    };
  };

  // 관심 종목 추가/삭제 핸들러
  const handleToggleFavorite = async (symbol: string, name: string) => {
    if (!isLoggedIn) {
      alert("로그인이 필요한 기능입니다.");
      return;
    }

    try {
      const isFavorite = favoriteStocks.some(stock => stock.symbol === symbol);

      if (isFavorite) {
        await removeFromFavorites({ symbol });
      } else {
        await addToFavorites({ symbol });
      }

      // 관심 종목 목록 새로고침
      await mutate("/api/portfolios/like");
    } catch (error) {
      console.error("Failed to update favorite status:", error);
      alert("관심 종목 업데이트에 실패했습니다.");
    }
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
                  {portfolioData.totalAssets.toLocaleString("en-US", {
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
                  {portfolioData.seedMoney.toLocaleString("en-US", {
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
                  {portfolioData.investmentAmount.toLocaleString("en-US", {
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
                      ${portfolioData.profitLoss >= 0 
                        ? "text-[#e74c3c] group-hover:text-[#c0392b]" 
                        : "text-[#3498db] group-hover:text-[#2c80b4]"}
                    `}
                  >
              <span className="text-xs mr-1">$</span>
              <span>
                {portfolioData.profitLoss >= 0 ? "+" : "-"}
                {Math.abs(portfolioData.profitLoss).toLocaleString("en-US", {
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
                  <button 
                    className={`flex-1 rounded-xl py-2 px-2 flex items-center justify-center gap-1 whitespace-nowrap ${
                      selectedRiskLevel === 'high' ? 'bg-[#ffe2e5]' : 'bg-[#ffe2e5] opacity-50'
                    }`}
                    onClick={() => setSelectedRiskLevel('high')}
                  >
                    <div className="w-5 h-5 bg-[#ff616d] rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">!</span>
                    </div>
                    <span className="text-[#000000] font-medium text-sm tracking-tight">고위험</span>
                  </button>
                  <button 
                    className={`flex-1 rounded-xl py-2 px-2 flex items-center justify-center gap-1 whitespace-nowrap ${
                      selectedRiskLevel === 'low' ? 'bg-[#c3e7f2]' : 'bg-[#c3e7f2] opacity-50'
                    }`}
                    onClick={() => setSelectedRiskLevel('low')}
                  >
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
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: 'dividend_stability', label: '배당 안정성' },
                    { value: 'portfolio_balance', label: '포트폴리오 균형' },
                    { value: 'value_stability', label: '가치 안정성' },
                    { value: 'momentum', label: '모멘텀' },
                    { value: 'sector_rotation', label: '섹터 로테이션' },
                    { value: 'rebound_buy', label: '반등 매수' },
                  ].map((strategy) => (
                    <button
                      key={strategy.value}
                      className={`flex-1 bg-[#ffffff] rounded-xl py-2 px-2 whitespace-nowrap ${
                        selectedStrategies.includes(strategy.value as PreferredStrategy) ? 'border-2 border-[#006ffd]' : ''
                      }`}
                      onClick={() => handleStrategyClick(strategy.value as PreferredStrategy)}
                    >
                      <span className="text-[#000000] font-medium text-sm tracking-tight">{strategy.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              {/* Interest Areas Section */}
              <div className="bg-[#c3e7f2] rounded-2xl p-4 mb-6">
                <h2 className="text-[#000000] text-base font-bold text-center mb-3 tracking-tight">당신의 관심 산업 분야</h2>
                <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto overflow-x-hidden">
                  {[
                    'Basic Materials',
                    'Communication Services',
                    'Consumer Cyclical',
                    'Consumer Defensive',
                    'Energy',
                    'Financial Services',
                    'Healthcare',
                    'Industrials',
                    'Real Estate',
                    'Technology',
                    'Utilities',
                  ].map((sector) => (
                    <button
                      key={sector}
                      className={`bg-[#ffffff] rounded-xl py-1 px-2 whitespace-nowrap ${
                        selectedSectors.includes(sector as PreferredSector) ? 'border-2 border-[#006ffd]' : ''
                      }`}
                      onClick={() => handleSectorClick(sector as PreferredSector)}
                    >
                      <span className="text-[#000000] font-medium text-xs tracking-tight">{sector}</span>
                    </button>
                  ))}
                </div>
              </div>
              {/* 제출 버튼 */}
              <div className="bg-[#f4f5f9] rounded-2xl p-4 text-center">
                {submitError && (
                  <p className="text-red-500 text-sm mb-2">{submitError}</p>
                )}
                <button
                  className={`text-[#71727a] font-medium text-sm tracking-tight border-2 border-[#2563eb] rounded-md px-4 py-2 ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? '제출 중...' : '제출'}
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full w-full">
              {!isLoggedIn ? (
                <>
                  <span className="text-xl text-gray-400 font-semibold mb-2">AI 추천</span>
                  <span className="text-gray-300">로그인이 필요합니다.</span>
                </>
              ) : isLoadingPreference ? (
                <div className="text-gray-400">로딩 중...</div>
              ) : userPreference ? (
                <div className="w-full space-y-6">
                  {/* 'AI의 추천 이유' 상세 화면이 아닐 때만 투자 전략 박스 노출 */}
                  {selectedAiIndex === null && (
                    <div className="bg-[#e7f4e8] rounded-2xl p-4">
                      <h2 className="text-[#000000] text-base font-bold text-center mb-3 tracking-tight">현재 회원님의 투자 전략</h2>
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-semibold mb-2">투자 성향</h3>
                          <div className="flex gap-2">
                            <button className={`flex-1 rounded-xl py-2 px-2 flex items-center justify-center gap-1 whitespace-nowrap ${
                              userPreference.data.riskLevel === 'high' ? 'bg-[#ffe2e5]' : 'bg-[#c3e7f2]'
                            }`}>
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                                userPreference.data.riskLevel === 'high' ? 'bg-[#ff616d]' : 'bg-[#006ffd]'
                              }`}>
                                <span className="text-white text-xs font-bold">
                                  {userPreference.data.riskLevel === 'high' ? '!' : '↓'}
                                </span>
                              </div>
                              <span className="text-[#000000] font-medium text-sm tracking-tight">
                                {userPreference.data.riskLevel === 'high' ? '고위험' : '저위험'}
                              </span>
                            </button>
                          </div>
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold mb-2">선호 전략</h3>
                          <div className="flex flex-wrap gap-2">
                            {userPreference.data.preferredStrategies.map((strategy) => (
                              <div key={strategy} className="bg-[#ffffff] rounded-xl py-2 px-2 border-2 border-[#006ffd]">
                                <span className="text-[#000000] font-medium text-sm tracking-tight">
                                  {strategy === 'dividend_stability' ? '배당 안정성' :
                                   strategy === 'portfolio_balance' ? '포트폴리오 균형' :
                                   strategy === 'value_stability' ? '가치 안정성' :
                                   strategy === 'momentum' ? '모멘텀' :
                                   strategy === 'sector_rotation' ? '섹터 로테이션' :
                                   '반등 매수'}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold mb-2">관심 산업 분야</h3>
                          <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto overflow-x-hidden">
                            {userPreference.data.preferredSectors.map((sector) => (
                              <div key={sector} className="bg-[#ffffff] rounded-xl py-1 px-2 border-2 border-[#006ffd]">
                                <span className="text-[#000000] font-medium text-xs tracking-tight">{sector}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {/* AI 추천 종목 카드 3개 */}
                  <div className="space-y-4">
                    {isLoadingAi ? (
                      <div className="text-gray-400">AI 추천 로딩 중...</div>
                    ) : aiRecommendations.length === 0 ? (
                      <div className="text-gray-400">AI 추천 종목이 없습니다.</div>
                    ) : selectedAiIndex === null ? (
                      aiRecommendations.map((item, idx) => (
                        <div key={item.symbol} className="bg-[#fff4e4] rounded-2xl p-4 flex flex-col gap-2">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-base">{item.name}</span>
                              <span className="text-[#71727a] text-xs bg-gray-100 px-2 py-1 rounded-full">{item.sector}</span>
                            </div>
                          </div>
                          <hr className="my-2" />
                          <button className="flex items-center gap-1 font-semibold text-base text-[#222]" onClick={() => setSelectedAiIndex(idx)}>
                            AI의 추천 이유 <ChevronDown className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="w-full">
                        <Button className="w-full h-12 bg-white border-2 border-[#006ffd] text-[#006ffd] hover:bg-[#eaf2ff] rounded-xl text-base font-medium mb-4" variant="outline" onClick={() => setSelectedAiIndex(null)}>
                          AI의 추천 이유
                        </Button>
                        {selectedAiIndex !== null && aiRecommendations[selectedAiIndex] && (
                          <>
                            <div className="flex items-center justify-center gap-4 mb-8">
                              <span className="text-[#1f2024] text-base font-medium">{aiRecommendations[selectedAiIndex].name}</span>
                              <span className="text-[#71727a] text-xs bg-gray-100 px-1.5 py-0.5 rounded-full">{aiRecommendations[selectedAiIndex].sector}</span>
                            </div>
                            <div className="space-y-4 mb-8">
                              {(() => {
                                const parsed = parseAiReason(aiRecommendations[selectedAiIndex].reasons);
                                return (
                                  <>
                                    <Card className="bg-[#fff4e4] border-none shadow-none">
                                      <CardContent className="p-4">
                                        <div className="bg-[#eaf2ff] text-[#1f2024] px-3 py-1.5 rounded-lg text-center mb-3 text-sm font-medium">
                                          포트폴리오 균형 기준
                                        </div>
                                        <p className="text-[#1f2024] text-center text-sm leading-relaxed">
                                          {parsed.portfolio}
                                        </p>
                                      </CardContent>
                                    </Card>
                                    <Card className="bg-[#fff4e4] border-none shadow-none">
                                      <CardContent className="p-4">
                                        <div className="bg-[#eaf2ff] text-[#1f2024] px-3 py-1.5 rounded-lg text-center mb-3 text-sm font-medium">
                                          최근 업계 동향 기준
                                        </div>
                                        <p className="text-[#1f2024] text-center text-sm leading-relaxed">
                                          {parsed.industry}
                                        </p>
                                      </CardContent>
                                    </Card>
                                    <Card className="bg-[#fff4e4] border-none shadow-none">
                                      <CardContent className="p-4">
                                        <div className="bg-[#eaf2ff] text-[#1f2024] px-3 py-1.5 rounded-lg text-center mb-3 text-sm font-medium">
                                          AI의 추정
                                        </div>
                                        <p className="text-[#1f2024] text-center text-sm leading-relaxed">
                                          {parsed.ai}
                                        </p>
                                      </CardContent>
                                    </Card>
                                  </>
                                );
                              })()}
                            </div>
                            <div className="flex items-center justify-center gap-2">
                              <ChevronLeft className="w-5 h-5 text-[#006ffd] cursor-pointer" onClick={() => setSelectedAiIndex(null)} />
                              <span className="text-[#1f2024] text-base font-medium">관심 종목으로 저장</span>
                              {isLoggedIn && (
                                <button
                                  onClick={() => handleToggleFavorite(aiRecommendations[selectedAiIndex].symbol, aiRecommendations[selectedAiIndex].name)}
                                  className="flex items-center justify-center"
                                >
                                  <Heart 
                                    className={`w-4 h-4 cursor-pointer transition-colors ${
                                      favoriteStocks.some(stock => stock.symbol === aiRecommendations[selectedAiIndex].symbol) 
                                        ? 'text-red-500 fill-red-500' 
                                        : 'text-[#1f2024]'
                                    }`} 
                                  />
                                </button>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="text-center text-gray-500">
                    <p>마지막 업데이트: {new Date(userPreference.data.updatedAt).toLocaleString()}</p>
                  </div>
                </div>
              ) : (
                <div className="text-gray-400">선호도 정보를 불러오는데 실패했습니다.</div>
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