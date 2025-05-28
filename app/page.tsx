"use client";

import { useState } from "react";
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

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function FinanceDashboard() {
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const modal = searchParams.get("modal")

    if (modal === "register") {
      setLoginOpen(false)
      setRegisterOpen(true)
    } else if (modal ==="login") {
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

  const [selectedStock, setSelectedStock] = useState<string>("SPY");
  const [activeTab, setActiveTab] = useState<"매수" | "매도">("매수");
  const [activePeriod, setActivePeriod] = useState<"일" | "주" | "월" | "분">(
    "일"
  );
  const [activeRightTab, setActiveRightTab] = useState<
    "종목정보 상세" | "내 계좌" | "AI 추천"
  >("종목정보 상세");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [showPanel, setShowPanel] = useState<false | 'buy' | 'sell'>(false);
  const [panelTab, setPanelTab] = useState<'매수' | '내 계좌'>('매수');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSellConfirmModal, setShowSellConfirmModal] = useState(false);

  console.log('searchQuery:', searchQuery)

  const handleStockSelect = (symbol: string) => {
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
            <button onClick={() => {
              localStorage.removeItem("logInUser") // 저장된 로그인정보 제거
              alert("로그아웃 되었습니다.")
              router.push("/")
            }}
              className="bg-[#006ffd] text-white px-4 py-2 rounded-md w-full">
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
      )}

      <div className="flex flex-col lg:flex-row p-4 gap-4">
        {/* Left Column - Hidden on mobile, visible on lg screens */}
        <div className="hidden lg:flex lg:w-64 flex-col">
          {/* 해외종목 목록 보기 */}
          <div className="bg-[#f0f0f0] rounded-xl p-3 mb-4 text-center">
            <span className="text-sm">오늘의 핫 종목</span>
          </div>

          {/* Stock List */}
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
             {/* Empty Chart Area (for user to add their own chart) */}
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
