"use client";

import { useState, useEffect } from "react";
import { Search, X, Menu, ChevronLeft, Minus, Plus } from "lucide-react";
import Image from "next/image";
import StockChart from "@/components/StockChart";
import SearchBar from "@/components/SearchBar";
import StockDetails from "@/components/StockDetails";
import StockList from "@/components/StockList";
import BuyConfirmModal from "@/components/BuyConfirmModal";
import SellConfirmModal from "@/components/SellConfirmModal";
import { getStockList } from "@/lib/api";
import type { Stock } from "@/lib/types";
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button";
import MyPage from "@/components/common/profile"

export default function Dashboard() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStock, setSelectedStock] = useState<string>("SPY");
  const [activeTab, setActiveTab] = useState<"매수" | "매도">("매수");
  const [activePeriod, setActivePeriod] = useState<"일" | "주" | "월" | "분">("일");
  const [activeRightTab, setActiveRightTab] = useState<"종목정보 상세" | "내 계좌" | "AI 추천">("종목정보 상세");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [nickname, setNickname] = useState<string | null>(null);
  const [showPanel, setShowPanel] = useState<false | 'buy' | 'sell'>(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSellConfirmModal, setShowSellConfirmModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("logInUser")
    if (!user) {
      window.location.href = "/"
    }
    const saveUser = localStorage.getItem("logInUser") 
    if (saveUser) {
      try {
        const user = JSON.parse(saveUser)
        setNickname(user.nickname)
      } catch (err) {
        console.error("failed to parse user:", err)
      }
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

  const handleAvatarClick = () => {
    const url = new URL(window.location.href)
    url.searchParams.set("modal", "edit")
    router.push(url.toString())
  }

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

        <div className="hidden md:flex items-center gap-4">
          <Link
            href="dashboard/mypage"
            className="flex items-center gap-2 text-sm text-gray-600 hover:opacity-80 transition-opacity">
            <span>{nickname ? `${nickname}님 환영합니다` : "mars 모투에 오신걸 환영합니다"}</span>
          </Link>

          <Avatar className="w-8 h-8 cursor-pointer hover:opacity-80" onClick={handleAvatarClick}>
            <AvatarImage src="/placeholder.svg?height=32&width=32&query=user+avatar" />
            <AvatarFallback>M</AvatarFallback>
          </Avatar>

          <Link
            href="dashboard/mypage"
            className="flex items-center gap-2 text-sm text-gray-600 hover:opacity-80 transition-opacity"
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
              onSelectStock={(symbol: string) => {
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
          {/* Interest Stocks Section */}
          <div className="bg-[#f0f0f0] rounded-xl p-3 mb-4 text-center">
            <span className="text-sm">관심 종목</span>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm flex-1 overflow-auto">
            <div className="space-y-6">
              {[
                {
                  symbol: "MSFT",
                  name: "Microsoft Corp.",
                  price: "$213.10",
                  change: "+2.5%",
                },
                {
                  symbol: "GOOGL",
                  name: "Alphabet Inc.",
                  price: "$213.10",
                  change: "+1.1%",
                },
                {
                  symbol: "SPOT",
                  name: "Microsoft Corp.",
                  price: "$213.10",
                  change: "+2.5%",
                },
                {
                  symbol: "MSFT",
                  name: "Microsoft Corp.",
                  price: "$213.10",
                  change: "+2.5%",
                },
                {
                  symbol: "GOOGL",
                  name: "Alphabet Inc.",
                  price: "$213.10",
                  change: "+1.1%",
                },
                {
                  symbol: "SPOT",
                  name: "Microsoft Corp.",
                  price: "$213.10",
                  change: "+2.5%",
                },
              ].map((stock, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8">
                      {stock.symbol === "MSFT" && (
                        <div className="w-8 h-8 bg-[#f25022] grid grid-cols-2 grid-rows-2">
                          <div className="bg-[#f25022]"></div>
                          <div className="bg-[#7fba00]"></div>
                          <div className="bg-[#00a4ef]"></div>
                          <div className="bg-[#ffb900]"></div>
                        </div>
                      )}
                      {stock.symbol === "GOOGL" && (
                        <Image
                          src="/google-logo.png"
                          alt="Google"
                          width={32}
                          height={32}
                        />
                      )}
                      {stock.symbol === "SPOT" && (
                        <Image
                          src="/spotify-logo.png"
                          alt="Spotify"
                          width={32}
                          height={32}
                        />
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-base">{stock.symbol}</div>
                      <div className="text-xs text-gray-500">{stock.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-base">{stock.price}</div>
                    <div className="text-xs text-[#41c3a9]">{stock.change}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Purchased Stocks Section */}
          <div className="bg-[#f0f0f0] rounded-xl p-3 my-4 text-center">
            <span className="text-sm">내가 구매한 종목</span>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm flex-1 overflow-auto">
            <div className="space-y-6">
              {[
                {
                  symbol: "MSFT",
                  name: "Microsoft Corp.",
                  price: "$213.10",
                  change: "+2.5%",
                },
                {
                  symbol: "GOOGL",
                  name: "Alphabet Inc.",
                  price: "$213.10",
                  change: "+1.1%",
                },
                {
                  symbol: "SPOT",
                  name: "Microsoft Corp.",
                  price: "$213.10",
                  change: "+2.5%",
                },
                {
                  symbol: "MSFT",
                  name: "Microsoft Corp.",
                  price: "$213.10",
                  change: "+2.5%",
                },
                {
                  symbol: "GOOGL",
                  name: "Alphabet Inc.",
                  price: "$213.10",
                  change: "+1.1%",
                },
                {
                  symbol: "SPOT",
                  name: "Microsoft Corp.",
                  price: "$213.10",
                  change: "+2.5%",
                },
              ].map((stock, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8">
                      {stock.symbol === "MSFT" && (
                        <div className="w-8 h-8 bg-[#f25022] grid grid-cols-2 grid-rows-2">
                          <div className="bg-[#f25022]"></div>
                          <div className="bg-[#7fba00]"></div>
                          <div className="bg-[#00a4ef]"></div>
                          <div className="bg-[#ffb900]"></div>
                        </div>
                      )}
                      {stock.symbol === "GOOGL" && (
                        <Image
                          src="/google-logo.png"
                          alt="Google"
                          width={32}
                          height={32}
                        />
                      )}
                      {stock.symbol === "SPOT" && (
                        <Image
                          src="/spotify-logo.png"
                          alt="Spotify"
                          width={32}
                          height={32}
                        />
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-base">{stock.symbol}</div>
                      <div className="text-xs text-gray-500">{stock.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-base">{stock.price}</div>
                    <div className="text-xs text-[#41c3a9]">{stock.change}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Middle Column */}
        <div className="flex-1 flex flex-col">
          {/* Search Bar */}
          <div className="flex justify-center mb-4">
            <div className="relative w-full max-w-2xl">
              <SearchBar onSelectStock={selectStock} />
            </div>
          </div>

          {/* Main Chart Area */}
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm flex-1 overflow-auto">
            {/* S&P 500 Header with Tabs */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-3">
              <div className="flex items-center gap-2">
                <div className="bg-gray-200 w-8 h-8 flex items-center justify-center rounded text-xs">
                  <span className="text-[10px]">S&P</span>
                  <span className="text-[10px]">500</span>
                </div>
                <h2 className="text-xl font-bold">S&P 500</h2>
              </div>

              {/* Buy/Sell and Time Period Tabs */}
              <div className="flex flex-wrap gap-2">
                {/* Buy/Sell Tabs */}
                <button
                  onClick={() => setShowPanel('buy')}
                  className={`px-4 py-1.5 rounded-full font-medium text-xs transition-colors ${
                    activeTab === "매수"
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
            <div className="h-[740px] flex flex-col items-center justify-center">
              <div
                id="chart-container"
                className="w-full h-full flex flex-col items-center justify-center"
              >
                <StockChart symbol="SPY" period={activePeriod} />
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
                  <p className="text-gray-400 text-center text-base font-semibold">S&P 500에 투자하여 배당금을 채투자하는 ETF</p>
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
                  <p className="text-gray-400 text-center text-base font-semibold">S&P 500에 투자하여 배당금을 채투자하는 ETF</p>
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
              {selectedStock && (
                <StockDetails
                  symbol={selectedStock}
                  activeTab={activeRightTab}
                  onTabChange={(tab) => {
                    console.log('Tab change requested:', tab);
                    setActiveRightTab(tab);
                  }}
                />
              )}
            </div>
          )}
        </div>
      </div>
      <MyPage />
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
