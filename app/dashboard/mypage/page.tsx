"use client"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, ChevronRight, Menu,PieChart } from "lucide-react"
import Image from "next/image";
import { useRouter } from "next/navigation" 
import { useEffect, useState } from "react"
import ProfileModal from "@/components/common/ProfileModal"

import { useGetProfileQuery,useGetWalletQuery,getStockPortfolio, getTradeHistory, getFavoriteStocks, getMyStocks  } from "@/lib/api"
import { useGetOverallPortfolioQuery } from "@/lib/api"; 
import ProfileHandler from "@/components/common/ProfileHandler";
import LogoutButton from "@/components/common/LogoutButton"

export default function MyPage() {


  const holdings = [{ name: "테슬라", purchasePrice: 300, currentPrice: 344, Quantity: 2 , gain: 44, returnRate: 14.67 }]
  const router = useRouter()
  const [nickname, setNickname] = useState<string | null>(null)
  
  const handleAvatarClick = () => {
  const url = new URL(window.location.href)
  url.searchParams.set("modal", "edit")
  router.push(url.toString())
  }
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  // const { data: walletData, isLoading, isError,refetch: refetchWallet } = useGetWalletQuery();
  // const { data, isLoading: Loading, isError:error,refetch: refetchPortfolio } = useGetOverallPortfolioQuery();
  const [stockPortfolio, setStockPortfolio] = useState<any[]>([]);
  const [isLoadingPortfolio, setIsLoadingPortfolio] = useState(true);
  const [tradeHistory, setTradeHistory] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [favoriteStocks, setFavoriteStocks] = useState<any[]>([]);
  const [myStocks, setMyStocks] = useState<any[]>([]);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(true);
  const [isLoadingMyStocks, setIsLoadingMyStocks] = useState(true);
  

  const { data: walletData, isLoading, isError, refetch: refetchWallet } = useGetWalletQuery(undefined, {
    skip: !isLoggedIn, // 로그인하지 않은 경우 쿼리 실행하지 않음
  });
  const { data, isLoading: Loading, isError:error, refetch: refetchPortfolio } = useGetOverallPortfolioQuery(undefined, {
    skip: !isLoggedIn, // 로그인하지 않은 경우 쿼리 실행하지 않음
  });
  useEffect(() => {
    const fetchStockPortfolio = async () => {
      try {
        const response = await getStockPortfolio();
        console.log('주식 포트폴리오 데이터:', response);
        setStockPortfolio(response.data);
      } catch (error) {
        console.error('주식 포트폴리오 조회 실패:', error);
      } finally {
        setIsLoadingPortfolio(false);
      }
    };

    fetchStockPortfolio();
  }, []);

  useEffect(() => {
    const fetchTradeHistory = async () => {
      try {
        const response = await getTradeHistory();
        console.log('주식 거래내역 데이터:', response);
        setTradeHistory(response.data);
      } catch (error) {
        console.error('주식 거래내역 조회 실패:', error);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    fetchTradeHistory();
  }, []);

  useEffect(() => {
    const fetchFavoriteStocks = async () => {
      try {
        const response = await getFavoriteStocks();
        console.log('관심 종목 데이터:', response);
        setFavoriteStocks(response.data);
      } catch (error) {
        console.error('관심 종목 조회 실패:', error);
      } finally {
        setIsLoadingFavorites(false);
      }
    };

    fetchFavoriteStocks();
  }, []);

  useEffect(() => {
    const fetchMyStocks = async () => {
      try {
        const response = await getMyStocks();
        console.log('내가 구매한 종목 데이터:', response);
        setMyStocks(response.data);
      } catch (error) {
        console.error('내가 구매한 종목 조회 실패:', error);
      } finally {
        setIsLoadingMyStocks(false);
      }
    };

    fetchMyStocks();
  }, []);
  // 로그인 상태가 변경될 때마다 데이터 새로고침
  useEffect(() => {
    if (isLoggedIn) {
      refetchPortfolio();
      refetchWallet();
    }
  }, [isLoggedIn, refetchPortfolio, refetchWallet]);

  if (isLoading) return <div>로딩 중...</div>;
  if (error || !data?.data) return <div>에러 발생</div>;
  
 //포트폴리오 데이터
  const portfolioData = {
    totalAssets: data.data.totalAsset, //총자산
    investmentAmount: data.data.investedAmount, //투자금액
    profitLoss: data.data.evalGain,   //평가손익
    returnRate: data.data.returnRate * 10, // %로 보기 좋게
    investRatio: data.data.investRatio * 100, // 총 투자비율
    cash: data.data.cash,// 현금자산
  };

  return (
    
    <div className="min-h-screen bg-[#f5f7f9]">
      <header className="bg-white border-b">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <a href="/dashboard">
            <Image
              src="/mars_logo_main.png"
              alt="Mars 로고"
              width={40}
              height={40}
              className="rounded-full cursor-pointer"
            />
            </a>
            {/* <span className="text-lg font-medium">Mars</span> */}
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-[#747480]">
              {nickname ? `${nickname}님 환영합니다` : "mars 모투에 오신걸 환영합니다"}
            </span>
            <ProfileHandler
                onNicknameUpdate={setNickname}
                onLoginStatusUpdate={setIsLoggedIn}
              />
            <LogoutButton redirectTo="/" >
              <span className="bg-[#006ffd] text-white px-4 py-2 rounded-md w-full block text-center">
                로그아웃
              </span>
            </LogoutButton>
          </div>
        </div>
      </header>
      
        <div className="flex flex-col lg:flex-row p-4 gap-4">
        {/* Left Column - Hidden on mobile, visible on lg screens */}
        <div className="lg:flex lg:w-64 flex-col">
          {/* Interest Stocks Section */}
          <div className="bg-[#f0f0f0] rounded-xl p-3 mb-4 text-center shadow-md">
            <span className="text-sm">관심 종목</span>
          </div>
  
          <div className="bg-white rounded-xl p-4 shadow-lg flex-1 overflow-auto">
            <div className="space-y-6">
              {isLoadingFavorites ? (
                <div className="text-center py-4">로딩 중...</div>
              ) : favoriteStocks.length === 0 ? (
                <div className="text-center text-gray-500 py-4">관심 종목이 없습니다.</div>
              ) : (
                favoriteStocks.map((stock, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8">
                        <Image
                          src={`/logos/${stock.symbol}.png`}
                          alt={stock.symbol}
                          width={32}
                          height={32}
                          className="rounded-full"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                            const parent = target.parentElement;
                            if (parent) {
                              const fallback = document.createElement("div");
                              fallback.className = "w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center";
                              fallback.innerHTML = `<span class='text-xs font-bold'>${stock.symbol.slice(0, 2)}</span>`;
                              parent.appendChild(fallback);
                            }
                          }}
                        />
                      </div>
                      <div>
                        <div className="font-bold text-base">{stock.symbol}</div>
                        <div className="text-xs text-gray-500">{stock.name}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-base">${stock.currentPrice.toFixed(2)}</div>
                      <div className={`text-xs ${stock.priceDelta >= 0 ? "text-[#41c3a9]" : "text-red-500"}`}>
                        {stock.priceDelta >= 0 ? "+" : ""}{stock.priceDelta.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
      
      
      {/* Purchased Stocks Section */}
      <div className="bg-[#f0f0f0] rounded-xl p-3 my-4 text-center shadow-md">
        <span className="text-sm">내가 구매한 종목</span>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-lg flex-1 overflow-auto">
        <div className="space-y-6">
          {isLoadingMyStocks ? (
            <div className="text-center py-4">로딩 중...</div>
          ) : myStocks.length === 0 ? (
            <div className="text-center text-gray-500 py-4">내가 구매한 종목이 없습니다.</div>
          ) : (
            myStocks.map((stock, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8">
                    <Image
                      src={`/logos/${stock.symbol}.png`}
                      alt={stock.symbol}
                      width={32}
                      height={32}
                      className="rounded-full"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        const parent = target.parentElement;
                        if (parent) {
                          const fallback = document.createElement("div");
                          fallback.className = "w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center";
                          fallback.innerHTML = `<span class='text-xs font-bold'>${stock.symbol.slice(0, 2)}</span>`;
                          parent.appendChild(fallback);
                        }
                      }}
                    />
                  </div>
                  <div>
                    <div className="font-bold text-base">{stock.symbol}</div>
                    <div className="text-xs text-gray-500">{stock.name}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-base">${stock.currentPrice.toFixed(2)}</div>
                  <div className={`text-xs ${stock.priceDelta >= 0 ? "text-[#41c3a9]" : "text-red-500"}`}>
                    {stock.priceDelta >= 0 ? "+" : ""}{stock.priceDelta.toFixed(2)}%
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
    
    {/* Main Content */}
    {/* <div className="flex-1 max-w-4xl mx-auto px-4"> */}
    <div className="flex-1 max-w-6xl mx-auto px-4">
    
      <div className="text-center mb-8">
        <span className="text-2xl font-bold text-[#1c2730] mb-2">
          {`${nickname}님 자산현황 입니다.`}</span>
      </div>

      {/* Integrated Portfolio Overview Block */}
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-2xl rounded-3xl overflow-hidden">
         <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-700 text-white p-8">
              <CardTitle className="text-2xl font-bold flex items-center gap-3">
                <PieChart className="w-8 h-8" />
                포트폴리오 현황
              </CardTitle>
              <p className="text-slate-200 mt-2">실시간 투자 성과 분석</p>
            </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 총자산 */}
            
              <div className="p-4 rounded-lg border border-[#e8e8e8] hover:border-[#197bbd] hover:shadow-md transition-all duration-200 cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-[#8f9098]">총자산</div>
                </div>
                <div className="text-2xl font-bold text-[#197bbd] group-hover:text-[#1565a0] transition-colors">
                  ${" "}
                  {portfolioData.totalAssets.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
                <div className="text-xs text-[#8f9098] mt-1">Total Assets</div>
              </div>
            

            {/* 투자금액 */}
            
              <div className="p-4 rounded-lg border border-[#e8e8e8] hover:border-[#197bbd] hover:shadow-md transition-all duration-200 cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-[#8f9098]">투자금액</div>
                </div>
                <div className="text-2xl font-bold  group-hover:text-[#1565a0] transition-colors">
                  ${" "}
                  {portfolioData.investmentAmount.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
                <div className="text-xs text-[#8f9098] mt-1">Investment Amount</div>
              </div>
            

            {/* 평가손익 */}
            
              <div className="p-4 rounded-lg border border-[#e8e8e8] hover:border-[#bb4430] hover:shadow-md transition-all duration-200 cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-[#8f9098]">평가손익</div>
                </div>
                <div
                  className={`text-2xl font-bold transition-colors 
                    ${portfolioData.profitLoss >= 0 
                      ? "text-[#41c3a9] group-hover:text-[#c0392b]" 
                      : "text-[#e74c3c] group-hover:text-[#2c80b4]"}
                  `}
                >
                  {portfolioData.profitLoss >= 0 ? "+$" : "-$"}
                  {Math.abs(portfolioData.profitLoss).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
                <div className="text-xs text-[#8f9098] mt-1">Profit & Loss</div>
              </div>
            

            {/* 수익률 */}
            
              <div className="p-4 rounded-lg border border-[#e8e8e8] hover:border-[#63c89b] hover:shadow-md transition-all duration-200 cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-[#8f9098]">수익률</div>
                </div>
                <div
                  className={`text-2xl font-bold transition-colors flex items-center gap-1 
                    ${portfolioData.returnRate >= 0 
                      ? "text-[#41c3a9] group-hover:text-[#4caf50]" 
                      : "text-[#e74c3c] group-hover:text-[#a73d2a]"}
                  `}//#41c3a9
                  >
                    {portfolioData.returnRate >= 0 ? (
                    <TrendingUp className="h-5 w-5" />
                  ) : (
                    <TrendingDown className="h-5 w-5" />
                  )}
                  {portfolioData.returnRate >= 0 ? "+" : "-"}
                  {Math.abs(portfolioData.returnRate*100).toFixed(2)}%
                </div>

                <div className="text-xs text-[#8f9098] mt-1">Return Rate</div>
              </div>
            

            {/* 제공시드머니 */}
            
             <div className="p-4 rounded-lg border border-[#e8e8e8] hover:border-[#197bbd] hover:shadow-md transition-all duration-200 cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-[#8f9098]">제공시드머니</div>
              </div>
              <div className="text-2xl font-bold text-[#197bbd] group-hover:text-[#1565a0] transition-colors">
                {isLoading ? "Loading..." : isError || !walletData?.data ? (
                  "$0.00"
                ) : (
                  `$ ${walletData.data.cyberDollar.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`
                )}
              </div>
              <div className="text-xs text-[#8f9098] mt-1">Provided Seed Money</div>
            </div>
                        

            {/* 시드머니 문의 */}
            
              <div className="p-4 rounded-lg border border-[#e8e8e8] hover:border-[#f99f01] hover:shadow-md transition-all duration-200 cursor-pointer"
              onClick={() => alert("준비중입니다. 곧 제공될 예정입니다.")}>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-[#8f9098]">시드머니 문의</div>
                </div>
                <div className="text-lg font-semibold text-[#1c2730] group-hover:text-[#f99f01] transition-colors">
                  챗봇에게 문의하기
                </div>
                <div className="text-xs text-[#8f9098] mt-1">Seed Money Inquiry</div>
              </div>
            
          </div>

          {/* Summary Bar */}
          <div className="mt-6 pt-6 border-t border-[#e8e8e8]">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-xs text-[#8f9098] mb-1">총 투자 비율</div>
                  <div className="text-lg font-semibold text-[#1c2730]">
                    {(portfolioData.investRatio).toFixed(1)}%
                  </div>
                </div>
               
                  <div className="text-center">
                    <div className="text-xs text-[#8f9098] mb-1">현금 자산</div>
                    <div className="text-lg font-semibold">
                      ${" "}
                      {portfolioData.cash.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </div>
                  </div>
              </div>
              
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Holdings Table */}
      <Card className="bg-white border-[#e8e8e8] mb-6 shadow-lg">
        <CardHeader>
          <CardTitle className="text-[#1c2730]">보유종목/상품현황</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e8e8e8]">
                  <th className="text-left py-3 text-sm font-medium text-[#8f9098]">상품/종목명</th>
                  <th className="text-right py-3 text-sm font-medium text-[#8f9098]">매수금액</th>
                  <th className="text-right py-3 text-sm font-medium text-[#8f9098]">보유수량</th>
                  <th className="text-right py-3 text-sm font-medium text-[#8f9098]">평가금액</th>
                  <th className="text-right py-3 text-sm font-medium text-[#8f9098]">평가손익</th>
                  <th className="text-right py-3 text-sm font-medium text-[#8f9098]">수익률</th>
                </tr>
              </thead>
              <tbody>
                {isLoadingPortfolio ? (
                  <tr>
                    <td colSpan={6} className="text-center py-4">로딩 중...</td>
                  </tr>
                ) : stockPortfolio.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-4">보유 중인 종목이 없습니다.</td>
                  </tr>
                ) : (
                  stockPortfolio.map((stock, index) => (
                    <tr key={index} className="border-b border-[#f5f7f9] hover:bg-[#f5f7f9] transition-colors">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8">
                            <Image
                              src={`/logos/${stock.symbol}.png`}
                              alt={stock.symbol}
                              width={32}
                              height={32}
                              className="rounded-full"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = "none";
                                const parent = target.parentElement;
                                if (parent) {
                                  const fallback = document.createElement("div");
                                  fallback.className = "w-8 h-8 bg-[#f99f01] rounded-full flex items-center justify-center text-white text-sm font-bold";
                                  fallback.innerHTML = `<span>${stock.symbol.charAt(0)}</span>`;
                                  parent.appendChild(fallback);
                                }
                              }}
                            />
                          </div>
                          <span className="font-medium text-[#1c2730]">{stock.name}</span>
                        </div>
                      </td>
                      <td className="text-right py-4 text-[#1c2730]">
                        ${stock.avgBuyPrice.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="text-right py-4 text-[#63c89b]">{stock.quantity}</td>
                      <td className="text-right py-4 text-[#1c2730]">
                        ${stock.evalAmount.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className={`text-right py-4 ${stock.evalGain >= 0 ? 'text-[#63c89b]' : 'text-[#e74c3c]'}`}>
                        {stock.evalGain >= 0 ? '+' : ''}${stock.evalGain.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className={`text-right py-4 ${stock.returnRate >= 0 ? 'text-[#63c89b]' : 'text-[#e74c3c]'}`}>
                        {stock.returnRate >= 0 ? '+' : ''}{(stock.returnRate * 100).toFixed(2)}%
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Stock Performance Table */}
      <Card className="bg-white border-[#e8e8e8] shadow-lg">
        <CardHeader>
          <CardTitle className="text-[#1c2730]">주식 거래내역</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="max-h-[400px] overflow-y-auto">
              <table className="w-full">
                <thead className="sticky top-0 bg-white z-10">
                  <tr className="border-b border-[#e8e8e8]">
                    <th className="text-left py-3 text-sm font-medium text-[#8f9098]">일자</th>
                    <th className="text-left py-3 text-sm font-medium text-[#8f9098]">상품/종목명</th>
                    <th className="text-right py-3 text-sm font-medium text-[#8f9098]">거래단가</th>
                    <th className="text-right py-3 text-sm font-medium text-[#8f9098]">체결수량</th>
                    <th className="text-right py-3 text-sm font-medium text-[#8f9098]">수익률</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoadingHistory ? (
                    <tr>
                      <td colSpan={5} className="text-center py-4">로딩 중...</td>
                    </tr>
                  ) : tradeHistory.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-4">거래 내역이 없습니다.</td>
                    </tr>
                  ) : (
                    tradeHistory.map((trade, index) => (
                      <tr key={index} className="border-b border-[#f5f7f9] hover:bg-[#f5f7f9] transition-colors">
                        <td className="py-4 text-[#1c2730]">
                          {(() => {
                            try {
                              const date = new Date(trade.date);
                              if (isNaN(date.getTime())) {
                                console.error('Invalid date:', trade.date);
                                return '날짜 정보 없음';
                              }
                              return date.toLocaleDateString('ko-KR', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit'
                              });
                            } catch (error) {
                              console.error('Date parsing error:', error);
                              return '날짜 정보 없음';
                            }
                          })()}
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8">
                              <Image
                                src={`/logos/${trade.symbol}.png`}
                                alt={trade.symbol}
                                width={32}
                                height={32}
                                className="rounded-full"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = "none";
                                  const parent = target.parentElement;
                                  if (parent) {
                                    const fallback = document.createElement("div");
                                    fallback.className = "w-8 h-8 bg-[#f99f01] rounded-full flex items-center justify-center text-white text-sm font-bold";
                                    fallback.innerHTML = `<span>${trade.symbol.charAt(0)}</span>`;
                                    parent.appendChild(fallback);
                                  }
                                }}
                              />
                            </div>
                            <span className="font-medium text-[#1c2730]">{trade.name}</span>
                          </div>
                        </td>
                        <td className="text-right py-4 text-[#1c2730]">
                          ${trade.currentPrice.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td className="text-right py-4 text-[#63c89b]">{trade.quantity}</td>
                        <td className={`text-right py-4 ${trade.returnRate >= 0 ? 'text-[#63c89b]' : 'text-[#e74c3c]'}`}>
                          {trade.returnRate >= 0 ? '+' : ''}{(trade.returnRate * 100).toFixed(2)}%
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
  <ProfileModal />
</div>
)
}
