"use client";

import { useState, useEffect } from "react";
import { Menu, ChevronLeft } from "lucide-react";
import Image from "next/image";
import SearchBar from "@/components/SearchBar";
import StockList from "@/components/StockList";
import StockChart from "@/components/StockChart";
import StockDetails from "@/components/StockDetails";
import { getStockList } from "@/lib/api";
import type { Stock } from "@/lib/types";
import { useRouter } from "next/navigation"


export default function Dashboard() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStock, setSelectedStock] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"매수" | "매도">("매수");
  const [activePeriod, setActivePeriod] = useState<"일" | "주" | "월" | "분">(
    "일"
  );
  const [activeRightTab, setActiveRightTab] = useState<
    "종목정보 상세" | "내 계좌" | "AI 추천"
  >("종목정보 상세");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [nickname, setNickname] = useState<string | null>(null)
  const router = useRouter()
  
  useEffect(() => {
    // 
    const user = localStorage.getItem("logInUser")
      if (!user) {
        window.location.href = "/"  // 로그인 안 했으면 홈으로 이동
      }
    const saveUser = localStorage.getItem("logInUser") 
    if (saveUser) {
      try {
        const user = JSON.parse(saveUser)
        setNickname(user.nickname)

      }catch (err) {
        console.error("failed to parse user:" , err)
      }
    }else {

    }


    const fetchStocks = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getStockList();
        setStocks(data);
        if (data.length > 0 && !selectedStock) {
          setSelectedStock(data[0].symbol);
        }
      } catch (err) {
        setError("종목 목록을 불러오는 중 오류가 발생했습니다.");
        console.error("Failed to fetch stocks:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStocks();
  }, []);

  const selectStock = (symbol: string) => {
    setSelectedStock(symbol);
  };

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
            src="/orange-planet-logo.png"
            alt="Mars 로고"
            width={40}
            height={40}
            className="rounded-full"
          />
          <span className="text-lg font-medium">mars</span>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <div className="text-sm text-gray-600">
            {nickname ? `${nickname}님 환영합니다 `:"mars 모투에 오신걸 환영합니다"}
          </div>
          <div className="w-8 h-8 bg-gray-100 rounded-full"></div>
          <button onClick={() => {
              localStorage.removeItem("logInUser") // 저장된 로그인정보 제거
              alert("로그아웃 되었습니다.")
              router.push("/")
            }}
          className="bg-[#006ffd] text-white px-4 py-2 rounded-md">
            로그아웃
          </button>
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
              onSelectStock={(symbol) => {
                selectStock(symbol);
                setMobileSidebarOpen(false);
              }}
            />
          )}
        </div>
      )}

      <div className="flex flex-col lg:flex-row p-4 gap-4">
        {/* Left Column - Hidden on mobile, visible on lg screens */}
        <div className="hidden lg:flex lg:w-64 flex-col">
          {/* 해외종목 목록 보기 */}
          <div className="bg-[#f0f0f0] rounded-xl p-3 mb-4 text-center">
            <span className="text-sm">해외종목 목록 보기</span>
          </div>

          {/* Stock List */}
          <div className="bg-white rounded-xl p-4 shadow-sm flex-1 overflow-auto">
            {isLoading ? (
              <div className="text-center py-4">로딩 중...</div>
            ) : error ? (
              <div className="text-center text-red-500 py-4">{error}</div>
            ) : (
              <StockList stocks={stocks} onSelectStock={selectStock} />
            )}
          </div>
        </div>

        {/* Middle Column */}
        <div className="flex-1 flex flex-col">
          {/* Search Bar */}
          <SearchBar onSelectStock={selectStock} />

          {/* Main Chart Area */}
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm flex-1 overflow-auto">
            {/* S&P 500 Header with Tabs */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-3">
              <div className="flex items-center gap-2">
                <div className="bg-gray-200 w-8 h-8 flex items-center justify-center rounded text-xs">
                  <span className="text-[10px]">S&P</span>
                  <span className="text-[10px]">500</span>
                </div>
                <h2 className="text-xl font-bold">
                  {selectedStock || "S&P 500"}
                </h2>
              </div>

              {/* Buy/Sell and Time Period Tabs */}
              <div className="flex flex-wrap gap-2">
                {/* Buy/Sell Tabs */}
                <button
                  onClick={() => setActiveTab("매수")}
                  className={`px-4 py-1.5 rounded-full font-medium text-xs transition-colors ${
                    activeTab === "매수"
                      ? "bg-[#fce7e7]"
                      : "bg-white hover:bg-gray-50"
                  }`}
                >
                  매수
                </button>
                <button
                  onClick={() => setActiveTab("매도")}
                  className={`px-4 py-1.5 rounded-full font-medium text-xs transition-colors ${
                    activeTab === "매도"
                      ? "bg-[#e7ecfc]"
                      : "bg-white hover:bg-gray-50"
                  }`}
                >
                  매도
                </button>

                {/* Time Period Tabs */}
                <div className="flex ml-0 md:ml-2 bg-[#f5f7f9] rounded-full">
                  {(["월", "주", "일", "분"] as const).map((period) => (
                    <button
                      key={period}
                      onClick={() => setActivePeriod(period)}
                      className={`px-3 md:px-4 py-1.5 rounded-full font-medium text-xs transition-colors ${
                        activePeriod === period
                          ? "bg-white shadow-sm"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Price Display */}
            <div className="mb-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl md:text-3xl font-bold">4,566.48</span>
                <span className="text-[#41c3a9] bg-[#e6f7f4] px-2 py-0.5 rounded-md text-sm">
                  +1.66%
                </span>
              </div>
            </div>

            <div className="text-xs text-gray-500 mb-6">
              Oct 25, 5:26:38PM UTC-4 · INDEXSP · Disclaimer
            </div>

            {/* Chart Area */}
            {selectedStock && (
              <StockChart symbol={selectedStock} period={activePeriod} />
            )}

            {/* Volume Chart */}
            <div className="h-32 md:h-40 flex items-center justify-center border-t pt-4">
              {/* <div className="text-gray-400 text-center">
                <p>거래량 차트 영역</p>
              </div> */}
            </div>

            <div className="text-xs text-gray-500 text-right mt-4">
              2025.5.13 17:18:37 기준
            </div>
          </div>
        </div>

        {/* Right Column - Full width on mobile, normal width on lg screens */}
        <div className="w-full lg:w-80 flex flex-col mt-4 lg:mt-0">
          {/* 검색창과 동일한 높이의 여백 추가 - 데스크톱에서만 표시 */}
          <div className="mb-4 invisible hidden lg:block">
            <div className="h-11"></div>
          </div>

          {/* Stock Details with tabs inside the white box */}
          <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm flex-1 overflow-auto flex flex-col">
            {selectedStock && (
              <StockDetails
                symbol={selectedStock}
                activeTab={activeRightTab}
                onTabChange={setActiveRightTab}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
