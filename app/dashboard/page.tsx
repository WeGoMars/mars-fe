"use client";

import { useState, useEffect } from "react";
import { X, Menu, ChevronLeft, Minus, Plus } from "lucide-react";
import Image from "next/image";
import StockChart from "@/components/StockChart";
import SearchBar from "@/components/SearchBar";
import StockDetails from "@/components/StockDetails";
import StockList from "@/components/StockList";
import BuyConfirmModal from "@/components/BuyConfirmModal";
import SellConfirmModal from "@/components/SellConfirmModal";
import type { Stock, GetStockSearchResponse } from "@/lib/types";
import { useRouter } from "next/navigation"
import Link from "next/link"

import { Button } from "@/components/ui/button";
import ProfileModal from "@/components/common/ProfileModal"
import { Heart } from 'lucide-react';
import mockPortfolio from "@/lib/mock/mockportfolio";

import ProfileHandler from "@/components/common/ProfileHandler"
import useSWR from 'swr';
import { getStockChartData, addToFavorites, removeFromFavorites, getFavoriteStocks, getStockDetails, getMyStocks } from "@/lib/api";

export default function Dashboard() {
  const [stocks, setStocks] = useState<Stock[]>([
    {
      symbol: "SPY",
      name: "S&P 500 ETF",
      price: "$456.48",
      change: "+1.66%",
      changePercent: "+1.66%"
    },
    {
      symbol: "AAPL",
      name: "Apple Inc.",
      price: "$175.04",
      change: "+0.86%",
      changePercent: "+0.86%"
    },
    {
      symbol: "TSLA",
      name: "Tesla Inc.",
      price: "$238.45",
      change: "-2.32%",
      changePercent: "-2.32%"
    }
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // 첫 화면 종목 선택 GOOGL로 설정함.
  const [selectedStock, setSelectedStock] = useState<string>("GOOGL");
  const [activeTab, setActiveTab] = useState<"매수" | "매도">("매수");
  const [activePeriod, setActivePeriod] = useState<"일" | "주" | "월" | "1시간">("일");
  const [activeRightTab, setActiveRightTab] = useState<"종목정보 상세" | "내 계좌" | "AI 추천">("종목정보 상세");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [nickname, setNickname] = useState<string | null>(null);
  const [showPanel, setShowPanel] = useState<false | 'buy' | 'sell'>(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSellConfirmModal, setShowSellConfirmModal] = useState(false);
  const [isHeartFilled, setIsHeartFilled] = useState(false);
  const [favoriteStocks, setFavoriteStocks] = useState<Stock[]>([]);
  const [selectedMinute, setSelectedMinute] = useState<"15분" | "1시간">("15분");
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [selectedInfo, setSelectedInfo] = useState<{
    symbol: string;
    name: string;
    price: number;
    change: number;
  }>({
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    price: 0,
    change: 0
  });
  const [logoError, setLogoError] = useState(false);

  const selectStock = (stock: GetStockSearchResponse) => {
    setSelectedStock(stock.symbol);
    setLogoError(false);
    
    // 중앙 정보 직접 업데이트
    setSelectedInfo({
      symbol: stock.symbol,
      name: stock.name,
      price: stock.currentPrice,
      change: stock.priceDelta
    });
  };

  const portfolioData = mockPortfolio;
  const cashAsset = portfolioData.seedMoney - portfolioData.investmentAmount;

  // 관심 종목 목록을 가져오는 SWR 훅
  const { data: favoriteStocksData, mutate: mutateFavoriteStocks } = useSWR(
    isLoggedIn ? '/api/portfolios/like' : null,
    () => getFavoriteStocks()
  );

  // 관심 종목 상태 업데이트
  useEffect(() => {
    if (favoriteStocksData?.data) {
      setFavoriteStocks(favoriteStocksData.data.map(stock => ({
        symbol: stock.symbol,
        name: stock.name,
        price: `$${stock.currentPrice.toFixed(2)}`,
        change: `${stock.priceDelta >= 0 ? '+' : ''}${stock.priceDelta.toFixed(2)}%`,
        changePercent: `${stock.priceDelta >= 0 ? '+' : ''}${((stock.priceDelta / (stock.currentPrice - stock.priceDelta)) * 100).toFixed(2)}%`
      })));
    }
  }, [favoriteStocksData]);

  // 관심 종목 상태가 변경될 때마다 하트 상태 업데이트
  useEffect(() => {
    const isFavorite = favoriteStocksData?.data?.some(stock => stock.symbol === selectedStock) ?? false;
    setIsHeartFilled(isFavorite);
  }, [selectedStock, favoriteStocksData]);

  // 관심종목 데이터가 로드되면 selectedStock에 해당하는 종목 정보로 selectedInfo를 자동 업데이트 (API만 사용)
  useEffect(() => {
    if (selectedStock && favoriteStocksData?.data) {
      const found = favoriteStocksData.data.find((s: any) => s.symbol === selectedStock);
      if (found) {
        handleFavoriteStockClick(found);
      }
    }
    // eslint-disable-next-line
  }, [favoriteStocksData, selectedStock]);

  const { data: stockChartData, error: stockChartError } = useSWR(
    selectedStock ? ['stockChart', selectedStock, activePeriod, selectedMinute] : null,
    () => getStockChartData({
      symbol: selectedStock,
      interval: activePeriod === "1시간"
        ? "1h"
        : activePeriod === "일"
          ? "1day"
          : activePeriod === "주"
            ? "1week"
            : "1month",
      limit: activePeriod === "1시간" ? 100 : 30
    })
  );

  // 종목 클릭 시 상세정보 API로 받아와서 상단 정보도 즉시 바인딩
  const handleFavoriteStockClick = async (stock: any) => {
    setSelectedStock(stock.symbol);
    setLogoError(false);
    try {
      const res = await getStockDetails(stock.symbol);
      if (res.success && res.data) {
        const price = res.data.currentPrice;
        const lastPrice = res.data.lastPrice;
        const change = lastPrice !== 0 && lastPrice !== undefined && lastPrice !== null ? ((price - lastPrice) / lastPrice) * 100 : 0;
        setSelectedInfo({
          symbol: res.data.symbol,
          name: res.data.name,
          price: price,
          change: change
        });
      } else {
        setSelectedInfo({
          symbol: stock.symbol,
          name: stock.name,
          price: 0,
          change: 0
        });
      }
    } catch {
      setSelectedInfo({
        symbol: stock.symbol,
        name: stock.name,
        price: 0,
        change: 0
      });
    }
  };

  // 하트 버튼 클릭 핸들러
  const handleHeartClick = async () => {
    if (!isLoggedIn) {
      alert('로그인이 필요한 기능입니다.');
      return;
    }

    try {
      const isFavorite = favoriteStocks.some(stock => stock.symbol === selectedStock);
      
      if (isFavorite) {
        await removeFromFavorites({ symbol: selectedStock });
      } else {
        await addToFavorites({ symbol: selectedStock });
      }
      
      // 관심 종목 목록 새로고침
      await mutateFavoriteStocks();
    } catch (error) {
      console.error('Failed to update favorite status:', error);
      alert('관심 종목 업데이트에 실패했습니다.');
    }
  };

  // 내 종목 목록을 가져오는 SWR 훅
  const { data: myStocksData } = useSWR(
    isLoggedIn ? '/api/portfolios/list' : null,
    () => getMyStocks()
  );

  // 내 종목 목록 데이터가 변경될 때마다 콘솔에 출력
  useEffect(() => {
    if (myStocksData) {
      console.log('내 종목 목록:', myStocksData);
    }
  }, [myStocksData]);

  return (
    <div className="min-h-screen bg-[#f5f7f9]">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-white border-b">
        <div className="flex items-center gap-2">
          <button
            className="lg:hidden mr-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
          <Image
            src="/marslogo.png"
            alt="Mars 로고"
            width={40}
            height={40}
            className="rounded-full"
          />
          <span className="text-lg font-medium">mars</span>
        </div>

        {/* 헤더에 있는 "내계좌" 텍스트 클릭 시 "내계좌" 페이지로 이동 코드 */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="dashboard/mypage"
            className="flex items-center gap-2 text-sm text-gray-600 hover:opacity-80 transition-opacity">
            <span>{nickname ? `${nickname}님 환영합니다` : "mars 모투에 오신걸 환영합니다"}</span>
          </Link>

          <ProfileHandler
            onNicknameUpdate={setNickname}
            onLoginStatusUpdate={setIsLoggedIn}
          />
          <Link
            href="dashboard/mypage"
            className="flex items-center gap-2 text-sm text-gray-600 hover:opacity-80 transition-opacity"
            onClick={() => setActiveRightTab('내 계좌')}
          >
            내계좌
          </Link>
          <Button variant="default" size="sm" className="bg-[#5f80f8] hover:bg-[#4c6ef5] text-white"
            onClick={() => {
              localStorage.removeItem("logInUser")
              alert("로그아웃 되었습니다.")
              router.push("/")
            }}>
            로그아웃
          </Button>
        </div>

        <div className="md:hidden">
          <div className="w-8 h-8 bg-gray-100 rounded-full"></div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white p-4 border-b">
          <div className="flex flex-col space-y-3">
            <div className="text-sm text-gray-600">
              oo님 mars 모투에 오신걸 환영합니다
            </div>
            <button className="bg-[#006ffd] text-white px-4 py-2 rounded-md w-full">
              로그아웃
            </button>
            <button
              className="flex items-center justify-center gap-2 bg-[#f0f0f0] p-3 rounded-xl w-full"
              onClick={() => {
                setMobileSidebarOpen(true);
                setMobileMenuOpen(false);
              }}
            >
              <span className="text-sm">해외종목 목록 보기</span>
            </button>
          </div>
        </div>
      )}

      {/* Mobile Sidebar */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 bg-white z-50 p-4 overflow-auto lg:hidden">
          <div className="flex items-center mb-4">
            <button
              className="mr-2"
              onClick={() => setMobileSidebarOpen(false)}
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
            <h2 className="text-lg font-medium">해외종목 목록</h2>
          </div>

          {isLoading ? (
            <div className="text-center py-4">로딩 중...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-4">{error}</div>
          ) : (
            <StockList
              stocks={stocks}
              onSelectStock={(stock: Stock) => {
                selectStock({
                  symbol: stock.symbol,
                  name: stock.name,
                  sector: "",
                  industry: "",
                  currentPrice: parseFloat(stock.price.replace("$", "")),
                  priceDelta: parseFloat(stock.change.replace("%", "")),
                  hourlyVolume: 0
                });
                setMobileSidebarOpen(false);
              }}
            />
          )}
        </div>
      )}

      <div className="flex flex-col lg:flex-row p-4 gap-4">
        {/* Left Column - Hidden on mobile, visible on lg screens */}
        <div className="hidden lg:flex lg:w-64 flex-col">
          {/* Interest Stocks Section */}
          <div className="bg-[#f0f0f0] rounded-xl p-3 mb-4 text-center">
            <span className="text-sm">관심 종목</span>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm flex-1 overflow-auto">
            {!isLoggedIn ? (
              <div className="text-center text-gray-500 py-4">
                로그인이 필요한 기능입니다.
              </div>
            ) : favoriteStocksData === undefined ? (
              <div className="text-center py-4">로딩 중...</div>
            ) : favoriteStocksData.success === false ? (
              <div className="text-center text-red-500 py-4">
                관심 종목을 불러오는데 실패했습니다.
              </div>
            ) : favoriteStocksData.data.length === 0 ? (
              <div className="text-center text-gray-500 py-4">
                관심 종목이 없습니다.
              </div>
            ) : (
              <div className="space-y-6">
                {favoriteStocksData.data.map((stock, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                    onClick={() => {
                      handleFavoriteStockClick(stock);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-gray-200 w-8 h-8 flex items-center justify-center rounded text-xs overflow-hidden">
                        {!logoError ? (
                          <Image
                            src={`/logos/${stock.symbol}.png`}
                            alt={stock.symbol}
                            width={28}
                            height={28}
                            style={{objectFit:'contain'}}
                            onError={() => setLogoError(true)}
                          />
                        ) : (
                          <span className="text-xs font-bold">{stock.symbol}</span>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-base">{stock.symbol}</div>
                        <div className="text-xs text-gray-500">{stock.name}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-base">${stock.currentPrice.toFixed(2)}</div>
                      <div className={`text-xs ${stock.priceDelta >= 0 ? 'text-[#41c3a9]' : 'text-red-500'}`}>
                        {stock.priceDelta >= 0 ? '+' : ''}{stock.priceDelta.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Purchased Stocks Section */}
          <div className="bg-[#f0f0f0] rounded-xl p-3 my-4 text-center">
            <span className="text-sm">내가 구매한 종목</span>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm flex-1 overflow-auto">
            <div className="space-y-6">
              {myStocksData === undefined ? (
                <div className="text-center py-4">로딩 중...</div>
              ) : myStocksData.success === false ? (
                <div className="text-center text-red-500 py-4">
                  내가 구매한 종목을 불러오는데 실패했습니다.
                </div>
              ) : myStocksData.data.length === 0 ? (
                <div className="text-center text-gray-500 py-4">
                  내가 구매한 종목이 없습니다.
                </div>
              ) : (
                myStocksData.data.map((stock, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                    onClick={() => {
                      setSelectedStock(stock.symbol);
                      // 필요시 상세정보 API 연동
                    }}
                  >
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
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              const fallback = document.createElement('div');
                              fallback.className = 'w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center';
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
                      <div className={`text-xs ${stock.priceDelta >= 0 ? 'text-[#41c3a9]' : 'text-red-500'}`}> 
                        {stock.priceDelta >= 0 ? '+' : ''}{stock.priceDelta.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Middle Column */}
        <div className="flex-1 flex flex-col">
          {/* Search Bar - Styled like the screenshot */}
          <div className="flex justify-center mb-4">
            <div className="relative w-full max-w-2xl">
              <SearchBar onSelectStock={selectStock} />
            </div>
          </div>
          {/* Main Chart Area - app/page.tsx 참고하여 UI 통일 */}
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm flex-1 overflow-auto">
            {/* S&P 500 Header with Tabs + 좋아요 하트 */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-3">
              <div className="flex items-center gap-2">
                <div className="bg-gray-200 w-8 h-8 flex items-center justify-center rounded text-xs overflow-hidden">
                  {!logoError ? (
                    <Image
                      src={`/logos/${selectedInfo.symbol}.png`}
                      alt={selectedInfo.symbol}
                      width={28}
                      height={28}
                      style={{objectFit:'contain'}}
                      onError={() => setLogoError(true)}
                    />
                  ) : (
                    <span className="text-xs font-bold">{selectedInfo.symbol}</span>
                  )}
                </div>
                <h2 className="text-xl font-bold">{selectedInfo.symbol}</h2>
                {isLoggedIn && (
                  <button
                    onClick={handleHeartClick}
                    className="flex items-center justify-center"
                  >
                    <Heart
                      className={`w-4 h-4 cursor-pointer transition-colors ${isHeartFilled ? 'text-red-500 fill-red-500' : 'text-[#1f2024]'}`}
                    />
                  </button>
                )}
              </div>
              {/* Buy/Sell and Time Period Tabs */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setShowPanel('buy')}
                  className={`px-4 py-1.5 rounded-full font-medium text-xs transition-colors ${activeTab === "매수" ? "bg-[#fce7e7]" : "bg-white hover:bg-gray-50"}`}
                >
                  매수
                </button>
                <button
                  onClick={() => setShowPanel('sell')}
                  className="px-4 py-1.5 rounded-full font-medium text-xs transition-colors bg-[#b3c6e6]"
                >
                  매도
                </button>
                <div className="flex ml-0 md:ml-2 bg-[#f5f7f9] rounded-full relative">
                  {(["월", "주", "일", "1시간"] as const).map((period) => (
                    <button
                      key={period}
                      onClick={() => setActivePeriod(period)}
                      className={`px-3 md:px-4 py-1.5 rounded-full font-medium text-xs transition-colors ${
                        activePeriod === period ? "bg-white shadow-sm" : "hover:bg-gray-100"
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {/* s&p500 아이콘, 주가, 변동률 표시 영역 */}
            <div className="mb-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl md:text-3xl font-bold">
                  ${Number(selectedInfo.price).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}
                </span>
                <span className={`${Number(selectedInfo.change) >= 0 ? 'text-[#41c3a9] bg-[#e6f7f4]' : 'text-red-500 bg-red-50'} px-2 py-0.5 rounded-md text-sm`}>
                  {Number(selectedInfo.change) >= 0 ? '+' : ''}{Number(selectedInfo.change).toFixed(2)}%
                </span>
              </div>
            </div>
            <div className="text-xs text-gray-500 mb-6">
              {new Date().toLocaleString()} · {selectedInfo.symbol} · Disclaimer
            </div>
            {/* Chart Area */}
            <div className="h-[740px] flex flex-col items-center justify-center">
              <div
                id="chart-container"
                className="w-full h-full flex flex-col items-center justify-center"
              >
                <StockChart
                  data={Array.isArray(stockChartData?.data)
                    ? stockChartData.data.filter(
                        d =>
                          d &&
                          d.timestamp &&
                          d.open != null &&
                          d.close != null &&
                          d.high != null &&
                          d.low != null &&
                          d.volume != null
                      )
                    : []}
                  symbol={selectedInfo.symbol}
                  period={activePeriod}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Full width on mobile, normal width on lg screens */}
        <div className="w-full lg:w-80 flex flex-col mt-4 lg:mt-0">
          {/* 검색창과 동일한 높이의 여백 추가 - 데스크톱에서만 표시 */}
          <div className="mb-4 invisible hidden lg:block">
            <div className="h-11"></div>
          </div>

          {/* showPanel이 true일 때 매수/매도 화면을 위아래로 동시에 보여줌 */}
          {showPanel ? (
            <div className="bg-white rounded-3xl border border-gray-200 p-6 w-full max-w-md md:max-w-md lg:max-w-md xl:max-w-lg flex flex-col fixed top-0 right-0 h-full z-50 shadow-lg transform transition-transform duration-500 animate-slide-in-right">
              {/* 매수/매도 영역 */}
              <div className="flex items-center justify-center mb-8 relative">
                <span className="px-8 py-2 rounded-full bg-[#f4f5f9] text-base font-semibold text-center">
                  {showPanel === 'buy' ? '매수' : '매도'}
                </span>
                <button onClick={() => setShowPanel(false)} className="absolute right-0 top-1/2 -translate-y-1/2">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              {showPanel === 'buy' && (
                <div className="bg-white rounded-3xl border border-gray-200 p-6 space-y-6 mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center border border-gray-200">
                      <div className="text-center">
                        <div className="text-xs font-bold">S&P</div>
                        <div className="text-xs">500</div>
                      </div>
                    </div>
                    <h2 className="text-xl font-extrabold">S&P 500</h2>
                  </div>
                  <p className="text-gray-400 text-center text-base font-semibold">S&P 500에 투자하여 배당금을 재투자하는 ETF</p>
                  <div className="flex items-center justify-between mt-6">
                    <div className="font-bold text-base">수량</div>
                    <div className="flex items-center gap-4">
                      <button className="w-8 h-8 rounded-full bg-[#f4f7fd] flex items-center justify-center text-[#b3c6e6] text-lg font-bold">
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-lg font-bold">1</span>
                      <button className="w-8 h-8 rounded-full bg-[#f4f7fd] flex items-center justify-center text-[#b3c6e6] text-lg font-bold">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-lg font-extrabold">€ 12.00</div>
                  </div>
                  <button
                    className="w-full py-4 bg-[#f9e0de] rounded-2xl text-center font-bold text-base text-black mt-6"
                    onClick={() => setShowConfirmModal(true)}
                  >
                    매수
                  </button>
                </div>
              )}
              {showPanel === 'sell' && (
                <div className="bg-white rounded-3xl border border-gray-200 p-6 space-y-6 mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center border border-gray-200">
                      <div className="text-center">
                        <div className="text-xs font-bold">S&P</div>
                        <div className="text-xs">500</div>
                      </div>
                    </div>
                    <h2 className="text-xl font-extrabold">S&P 500</h2>
                  </div>
                  <p className="text-gray-400 text-center text-base font-semibold">S&P 500에 투자하여 배당금을 재투자하는 ETF</p>
                  <div className="flex items-center justify-between mt-6">
                    <div className="font-bold text-base">수량</div>
                    <div className="flex items-center gap-4">
                      <button className="w-8 h-8 rounded-full bg-[#f4f7fd] flex items-center justify-center text-[#b3c6e6] text-lg font-bold">
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-lg font-bold">1</span>
                      <button className="w-8 h-8 rounded-full bg-[#f4f7fd] flex items-center justify-center text-[#b3c6e6] text-lg font-bold">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-lg font-extrabold">€ 12.00</div>
                  </div>
                  <button
                    className="w-full py-4 bg-[#b3c6e6] rounded-2xl text-center font-bold text-base text-black mt-6"
                    onClick={() => setShowSellConfirmModal(true)}
                  >
                    매도
                  </button>
                </div>
              )}
              {/* 내 계좌 영역 */}
              <div>
                <div className="flex justify-center mb-6">
                  <span className="px-8 py-2 rounded-full bg-[#f4f5f9] text-base font-semibold text-center">내 계좌</span>
                </div>
                <div className="bg-white rounded-3xl border border-gray-200 p-6 space-y-6">
                  <div className="flex justify-between items-center">
                    <div className="font-bold text-base">총자산</div>
                    <div>
                      <span className="text-[#006ffd] text-xs mr-1">$</span>
                      <span className="text-[#006ffd] text-xl font-bold">{portfolioData.totalAssets.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="font-bold text-base">현금자산</div>
                    <div>
                      <span className="text-xs mr-1">$</span>
                      <span className="text-xl font-bold">{cashAsset.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="font-bold text-base">시드머니</div>
                    <div>
                      <span className="text-[#006ffd] text-xs mr-1">$</span>
                      <span className="text-[#006ffd] text-xl font-bold">{portfolioData.seedMoney.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="font-bold text-base">투자금액</div>
                    <div>
                      <span className="text-[#439a86] text-xs mr-1">$</span>
                      <span className="text-[#439a86] text-xl font-bold">{portfolioData.investmentAmount.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="font-bold text-base">평가손익</div>
                    <div className="flex items-center">
                      <span
                        className={`text-xs mr-1 ${portfolioData.profitLoss >= 0 ? "text-[#e74c3c]" : "text-[#3498db]"
                          }`}
                      >
                        $
                      </span>
                      <span
                        className={`text-xl font-bold ${portfolioData.profitLoss >= 0 ? "text-[#e74c3c]" : "text-[#3498db]"
                          }`}
                      >
                        {portfolioData.profitLoss >= 0 ? "+" : "-"}
                        {Math.abs(portfolioData.profitLoss).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // 기존 카드 내용
            <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm flex-1 overflow-auto flex flex-col">
              {selectedInfo.symbol && (
                <StockDetails
                  symbol={selectedInfo.symbol}
                  activeTab={activeRightTab}
                  onTabChange={setActiveRightTab}
                  favoriteStocks={favoriteStocks}
                  setFavoriteStocks={setFavoriteStocks}
                  isLoggedIn={isLoggedIn}
                />
              )}
            </div>
          )}
        </div>
      </div>
      <ProfileModal />
      <BuyConfirmModal
        open={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={() => {
          // TODO: 매수 로직 구현
          setShowConfirmModal(false);
          setShowPanel(false);
        }}
      />
      <SellConfirmModal
        open={showSellConfirmModal}
        onClose={() => setShowSellConfirmModal(false)}
        onConfirm={() => {
          // TODO: 매도 로직 구현
          setShowSellConfirmModal(false);
          setShowPanel(false);
        }}
      />
    </div>
  );
}
