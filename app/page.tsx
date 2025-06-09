"use client";

import { useState, useEffect } from "react";
import { Search, X, Menu, ChevronLeft, Minus, Plus } from "lucide-react";
import Image from "next/image";
import StockChart from "@/components/StockChart";
import LoginModal from "@/components/common/LoginModal";
import RegistrationModal from "@/components/common/RegistrationModal"
import Link from "next/link";
import BuyConfirmModal from "@/components/BuyConfirmModal";
import SellConfirmModal from "@/components/SellConfirmModal";
import SearchBar from "@/components/SearchBar";
import StockDetails from "@/components/StockDetails";
import type { Stock } from "@/lib/types";
import { getStockChartData, getStockList, searchStockList } from "@/lib/api";
import useSWR from 'swr';
import LogoutButton from "@/components/common/LogoutButton"
import { useBuyStockMutation } from "@/lib/api"; // RTK 훅 import
import BuyPanel from "@/components/BuyPanel";
import { useSearchParams, useRouter } from "next/navigation";

export default function FinanceDashboard() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<string>("");
  const [selectedStock, setSelectedStock] = useState<string>("GOOGL");
  const [activeTab, setActiveTab] = useState<"매수" | "매도">("매수");
  const [activePeriod, setActivePeriod] = useState<"일" | "주" | "월" | "1시간">("일");
  const [activeRightTab, setActiveRightTab] = useState<"종목정보 상세" | "내 계좌" | "AI 추천">("종목정보 상세");
  const [buyStock, { isLoading: isBuying }] = useBuyStockMutation();

  const { data: stockChartData, error } = useSWR(
    selectedStock ? ['stockChart', selectedStock, activePeriod] : null,
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

  const { data: stockListData, error: stockListError } = useSWR(
    ['stockList'],
    () => getStockList({
      option: 'hot',
      limit: 10
    })
  );

  if (stockChartData) {
    console.log('Stock Chart Data:', stockChartData);
  }

  if (stockListData) {
    console.log('Stock List Data:', stockListData);
  }

  if (stockListError) {
    console.error('Failed to fetch stock list:', stockListError);
  }

  if (error) {
    console.error('Failed to fetch stock data:', error);
  }

  useEffect(() => {
    const checkLoginStatus = () => {
      try {
        const loginUser = localStorage.getItem("logInUser");
        const isUserLoggedIn = loginUser !== null && loginUser !== undefined && loginUser !== '';
        setIsLoggedIn(isUserLoggedIn);
      } catch (error) {
        console.error('로그인 상태 체크 중 오류 발생:', error);
        setIsLoggedIn(false);
      }
    };

    // 초기 로그인 상태 체크
    checkLoginStatus();

    // 로그인 상태 변경 감지를 위한 이벤트 리스너 추가
    window.addEventListener('storage', checkLoginStatus);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);

  useEffect(() => {
    const modal = searchParams.get("modal")

    if (modal === "register") {
      setLoginOpen(false)
      setRegisterOpen(true)
    } else if (modal === "login") {
      setRegisterOpen(false)
      setLoginOpen(true)
    } else {
      setLoginOpen(false)
      setRegisterOpen(false)
    }
  }, [searchParams])
  const clearModalQuery = () => {
    const url = new URL(window.location.href)
    url.searchParams.delete("modal")
    router.replace(url.pathname + url.search, { scroll: false })

    setLoginOpen(false)
    setRegisterOpen(false)
  }

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [showPanel, setShowPanel] = useState<false | 'buy' | 'sell'>(false);
  const [panelTab, setPanelTab] = useState<'매수' | '내 계좌'>('매수');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSellConfirmModal, setShowSellConfirmModal] = useState(false);
  const [favoriteStocks, setFavoriteStocks] = useState<Stock[]>([]);

  const [showMinuteOptions, setShowMinuteOptions] = useState(false);

  const [stockData, setStockData] = useState<Stock[]>([
    {
      symbol: "MSFT",
      name: "Microsoft Corp.",
      price: "213.10",
      change: "+2.5%",
      changePercent: "2.5%",
      volume: "25.3M",
      marketCap: "2.5T",
      description: "Microsoft Corporation is an American multinational technology corporation."
    },
    {
      symbol: "GOOGL",
      name: "Alphabet Inc.",
      price: "142.65",
      change: "+1.1%",
      changePercent: "1.1%",
      volume: "18.7M",
      marketCap: "1.8T",
      description: "Alphabet Inc. is an American multinational technology conglomerate holding company."
    },
    {
      symbol: "SPOT",
      name: "Spotify Technology S.A.",
      price: "156.78",
      change: "+2.5%",
      changePercent: "2.5%",
      volume: "3.2M",
      marketCap: "30.5B",
      description: "Spotify is a Swedish audio streaming and media services provider."
    }
  ]);

  const [searchedStockInfo, setSearchedStockInfo] = useState<any | null>(null);

  const handleStockSelect = async (symbol: string) => {
    setSelectedStock(symbol);
    // 종목 검색 결과에서 선택된 경우, 해당 종목의 상세 정보 fetch
    try {
      const res = await searchStockList({ query: symbol, limit: 1 });
      if (res.success && res.data.length > 0) {
        setSearchedStockInfo(res.data[0]);
      } else {
        setSearchedStockInfo(null);
      }
    } catch {
      setSearchedStockInfo(null);
    }
  };

  // 중앙에 표시할 종목 정보 우선순위: 검색된 종목 > stockListData > 목데이터
  const getSelectedStockInfo = () => {
    if (searchedStockInfo && searchedStockInfo.symbol === selectedStock) {
      return {
        symbol: searchedStockInfo.symbol,
        name: searchedStockInfo.name,
        price: searchedStockInfo.currentPrice,
        change: searchedStockInfo.priceDelta,
      };
    }
    // stockListData에서 찾기 (data가 배열임을 명확히 단언)
    const stockListArr = stockListData?.data as any[] | undefined;
    if (stockListArr) {
      const found = stockListArr.find((s: any) => s.symbol === selectedStock);
      if (found) return {
        symbol: found.symbol,
        name: found.name,
        price: found.currentPrice,
        change: found.priceDelta,
      };
    }
    // 목데이터에서 찾기
    const fallback = stockData.find((s) => s.symbol === selectedStock);
    if (fallback) return {
      symbol: fallback.symbol,
      name: fallback.name,
      price: fallback.price,
      change: fallback.change,
    };
    // 기본값
    return {
      symbol: selectedStock,
      name: selectedStock,
      price: 0,
      change: 0,
    };
  };
  const selectedInfo = getSelectedStockInfo();
  const [quantity, setQuantity] = useState<number>(1);


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
          <Link href="/">
            <Image
              src="/marslogo.png"
              alt="Mars 로고"
              width={30}
              height={30}
              className="rounded-full cursor-pointer"
            />
          </Link>
          <span className="text-lg font-medium">Mars</span>
        </div>

        <div className="hidden md:flex items-center gap-3">
          {/* <button onClick={() => setRegisterOpen(true)} */}
          <button
            type="button"
            onClick={() => {
              const url = new URL(window.location.href)
              url.searchParams.set("modal", "register")
              router.push(url.toString())
            }}
            className="border border-[#006ffd] text-[#006ffd] px-4 py-2 rounded-md hover:bg-[#f0f7ff] transition-colors">
            회원가입
          </button>
          <button
            onClick={() => {
              const url = new URL(window.location.href)
              url.searchParams.set("modal", "login")
              router.push(url.toString())
            }}
            className="bg-[#006ffd] text-white px-4 py-2 rounded-md hover:bg-[#0057cc] transition-colors"
          >
            로그인
          </button>
          <LoginModal
            open={loginOpen}
            onOpenChange={(open) => {
              if (!open) clearModalQuery()
            }}
          />
          {/* <RegistrationModal isOpen={registerOpen} onClose={() => setRegisterOpen(false)} /> */}
          {/* <RegistrationModal isOpen={registerOpen} onClose={() => router.back()} /> */}
          <RegistrationModal
            isOpen={registerOpen}
            onClose={clearModalQuery}
          />
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
            <LogoutButton redirectTo="/" >
              <span className="bg-[#006ffd] text-white px-4 py-2 rounded-md w-full block text-center">
                로그아웃
              </span>
            </LogoutButton>
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

          <div className="space-y-6">
            {stockData.map((stock, index) => (
              <div
                key={index}
                className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                onClick={() => {
                  setSelectedStock(stock.symbol);
                  // API 연동 시 여기에 API 호출 로직 추가
                  console.log(`Selected stock: ${stock.symbol}`);
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8">
                    <Image
                      src={`/logos/${stock.symbol}.png`}
                      alt={stock.symbol}
                      width={32}
                      height={32}
                    />
                  </div>
                  <div>
                    <div className="font-bold text-base">{stock.symbol}</div>
                    <div className="text-xs text-gray-500">{stock.name}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-base">${stock.price}</div>
                  <div className={`text-xs ${stock.change.startsWith('+') ? 'text-[#41c3a9]' : 'text-red-500'}`}>
                    {stock.change}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 메인 컨텐츠 영역 */}
      <div className="flex flex-col lg:flex-row p-4 gap-4">
        {/* Left Column - Hidden on mobile, visible on lg screens */}
        <div className="hidden lg:flex lg:w-64 flex-col">
          {/* 오늘의 핫 종목 목록 */}
          <div className="bg-[#f0f0f0] rounded-xl p-3 mb-4 text-center">
            <span className="text-sm">오늘의 핫 종목</span>
          </div>

          {/* 핫 종목 리스트 목 데이터 */}
          <div className="bg-white rounded-xl p-4 shadow-sm flex-1 overflow-auto">
            <div className="space-y-6">
              {(stockListData?.data as any[] | undefined)?.map((stock, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                  onClick={() => {
                    setSelectedStock(stock.symbol);
                    console.log(`Selected stock: ${stock.symbol}`);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-200 w-8 h-8 flex items-center justify-center rounded text-xs overflow-hidden">
                      <Image
                        src={`/logos/${stock.symbol}.png`}
                        alt={stock.symbol}
                        width={28}
                        height={28}
                        style={{ objectFit: 'contain' }}
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
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
              ))}
            </div>
          </div>
        </div>

        {/* 중앙 레이아웃 주식 차트 영역 */}
        <div className="flex-1 flex flex-col">
          {/* Search Bar - Styled like the screenshot */}
          <div className="flex justify-center mb-4">
            <div className="relative w-full max-w-2xl">
              <SearchBar onSelectStock={handleStockSelect} />
            </div>
          </div>
          {/* Main Chart Area */}
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm flex-1 overflow-auto">
            {/* S&P 500 Header with Tabs - Styled like the image */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-3">
              <div className="flex items-center gap-2">
                <div className="bg-gray-200 w-8 h-8 flex items-center justify-center rounded text-xs overflow-hidden">
                  <Image
                    src={`/logos/${selectedInfo.symbol}.png`}
                    alt={selectedInfo.symbol}
                    width={28}
                    height={28}
                    style={{ objectFit: 'contain' }}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                </div>
                <h2 className="text-xl font-bold">{selectedInfo.symbol}</h2>
              </div>

              {/* Buy/Sell and Time Period Tabs */}
              <div className="flex flex-wrap gap-2">
                {/* Buy/Sell Tabs */}
                <button
                  onClick={() => setShowPanel('buy')}
                  className={`px-4 py-1.5 rounded-full font-medium text-xs transition-colors ${activeTab === "매수"
                      ? "bg-[#fce7e7]"
                      : "bg-white hover:bg-gray-50"
                    }`}
                >
                  매수
                </button>
                <button
                  onClick={() => setShowPanel('sell')}
                  className="px-4 py-1.5 rounded-full font-medium text-xs transition-colors bg-[#b3c6e6]"
                >
                  매도
                </button>

                {/* Time Period Tabs */}
                <div className="flex ml-0 md:ml-2 bg-[#f5f7f9] rounded-full relative">
                  {(["월", "주", "일", "1시간"] as const).map((period) => (
                    <button
                      key={period}
                      onClick={() => setActivePeriod(period)}
                      className={`px-3 md:px-4 py-1.5 rounded-full font-medium text-xs transition-colors ${activePeriod === period ? "bg-white shadow-sm" : "hover:bg-gray-100"
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
                  ${Number(selectedInfo.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className={`${Number(selectedInfo.change) >= 0 ? 'text-[#41c3a9] bg-[#e6f7f4]' : 'text-red-500 bg-red-50'} px-2 py-0.5 rounded-md text-sm`}>
                  {Number(selectedInfo.change) >= 0 ? '+' : ''}{Number(selectedInfo.change).toFixed(2)}%
                </span>
              </div>
            </div>

            <div className="text-xs text-gray-500 mb-6">
              {currentTime} · {selectedInfo.symbol} · Disclaimer
            </div>
            {/* Empty Chart Area (for user to add their own chart) */}
            <div className="h-[740px] flex flex-col items-center justify-center">
              <div
                id="chart-container"
                className="w-full h-full flex flex-col items-center justify-center"
              >
                {Array.isArray(stockChartData?.data) && stockChartData.data.length > 0 ? (
                  <StockChart
                    data={stockChartData.data}
                    symbol={selectedInfo.symbol}
                    period={activePeriod}
                  />
                ) : (
                  <div className="text-gray-400">차트 데이터를 불러오는 중입니다...</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 반응형 코드 영역 */}
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
                  {/* 종목 정보 영역 */}
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center border border-gray-200">
                      <div className="text-center">
                        <div className="text-xs font-bold">{selectedInfo.symbol.slice(0, 3)}</div>
                        <div className="text-xs">{selectedInfo.symbol.slice(3)}</div>
                      </div>
                    </div>
                    <h2 className="text-xl font-extrabold">{selectedInfo.name}</h2>
                  </div>

                  {/* 종목 설명: 원래 비워뒀으면 이 부분 생략 가능 */}
                  {/* <p className="text-gray-400 text-center text-base font-semibold">
      {selectedInfo.description}
    </p> */}

                  {/* 수량 조절 영역 */}
                  <div className="flex items-center justify-between mt-6">
                    <div className="font-bold text-base">수량</div>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                        className="w-8 h-8 rounded-full bg-[#f4f7fd] flex items-center justify-center text-[#b3c6e6] text-lg font-bold"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-lg font-bold">{quantity}</span>
                      <button
                        onClick={() => setQuantity((prev) => prev + 1)}
                        className="w-8 h-8 rounded-full bg-[#f4f7fd] flex items-center justify-center text-[#b3c6e6] text-lg font-bold"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-lg font-extrabold">
                      ${Number(selectedInfo.price * quantity).toFixed(2)}
                    </div>
                  </div>

                  {/* 매수 버튼 */}
                  <button
                    className="w-full py-4 bg-[#f9e0de] rounded-2xl text-center font-bold text-base text-black mt-6"
                    onClick={async () => {
                      try {
                        const body = {
                          symbol: selectedInfo.symbol,
                          quantity,
                          price: Number(selectedInfo.price),
                        };
                        const res = await buyStock(body).unwrap();
                        alert(`${res.data.symbol} 매수 완료!`);
                        setShowConfirmModal(true); // 추후 모달로 넘어갈 수 있게
                      } catch (err) {
                        alert("로그인이 필요합니다.");
                        console.error(err);
                        window.location.href = "http://13.220.145.152/?modal=login";
                      }
                    }}
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
                      <span className="text-[#006ffd] text-xl font-bold">2850.75</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="font-bold text-base">현금자산</div>
                    <div>
                      <span className="text-[#006ffd] text-xs mr-1">$</span>
                      <span className="text-[#006ffd] text-xl font-bold">999.75</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="font-bold text-base">시드머니</div>
                    <div>
                      <span className="text-[#006ffd] text-xs mr-1">$</span>
                      <span className="text-[#006ffd] text-xl font-bold">2850.75</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="font-bold text-base">투자금액</div>
                    <div>
                      <span className="text-[#439a86] text-xs mr-1">$</span>
                      <span className="text-[#439a86] text-xl font-bold">1500.50</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="font-bold text-base">평가손익</div>
                    <div className="flex items-center">
                      <span className="text-[#bb4430] text-xs mr-1">$</span>
                      <span className="text-[#bb4430] text-3sl font-bold">350.60</span>
                      <span className="text-[#bb4430] ml-2">+5.5%</span>
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
                  onTabChange={(tab) => {
                    console.log('Tab change requested:', tab);
                    setActiveRightTab(tab);
                  }}
                  favoriteStocks={favoriteStocks}
                  setFavoriteStocks={setFavoriteStocks}
                  isLoggedIn={isLoggedIn}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* BuyConfirmModal과 SellConfirmModal 추가 */}
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