"use client"

import { useState } from "react"
import { Search, X, Menu, ChevronLeft } from "lucide-react"
import Image from "next/image"

export default function FinanceDashboard() {
  const [activeTab, setActiveTab] = useState<"매수" | "매도">("매수")
  const [activePeriod, setActivePeriod] = useState<"일" | "주" | "월" | "분">("일")
  const [activeRightTab, setActiveRightTab] = useState<"종목정보 상세" | "내 계좌" | "AI 추천">("종목정보 상세")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#f5f7f9]">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-white border-b">
        <div className="flex items-center gap-2">
          <button className="lg:hidden mr-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
          <Image src="/orange-planet-logo.png" alt="Mars 로고" width={40} height={40} className="rounded-full" />
          <span className="text-lg font-medium">mars</span>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button className="border border-[#006ffd] text-[#006ffd] px-4 py-2 rounded-md hover:bg-[#f0f7ff] transition-colors">
            회원가입
          </button>
          <button className="bg-[#006ffd] text-white px-4 py-2 rounded-md hover:bg-[#0057cc] transition-colors">
            로그인
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
            <div className="text-sm text-gray-600">oo님 mars 모투에 오신걸 환영합니다</div>
            <button className="bg-[#006ffd] text-white px-4 py-2 rounded-md w-full">로그아웃</button>
            <button
              className="flex items-center justify-center gap-2 bg-[#f0f0f0] p-3 rounded-xl w-full"
              onClick={() => {
                setMobileSidebarOpen(true)
                setMobileMenuOpen(false)
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
            <button className="mr-2" onClick={() => setMobileSidebarOpen(false)}>
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
            <h2 className="text-lg font-medium">해외종목 목록</h2>
          </div>

          <div className="space-y-6">
            {[
              { symbol: "MSFT", name: "Microsoft Corp.", price: "$213.10", change: "+2.5%" },
              { symbol: "GOOGL", name: "Alphabet Inc.", price: "$213.10", change: "+1.1%" },
              { symbol: "SPOT", name: "Microsoft Corp.", price: "$213.10", change: "+2.5%" },
              { symbol: "MSFT", name: "Microsoft Corp.", price: "$213.10", change: "+2.5%" },
              { symbol: "GOOGL", name: "Alphabet Inc.", price: "$213.10", change: "+1.1%" },
              { symbol: "SPOT", name: "Microsoft Corp.", price: "$213.10", change: "+2.5%" },
              { symbol: "MSFT", name: "Microsoft Corp.", price: "$213.10", change: "+2.5%" },
              { symbol: "GOOGL", name: "Alphabet Inc.", price: "$213.10", change: "+1.1%" },
              { symbol: "SPOT", name: "Microsoft Corp.", price: "$213.10", change: "+2.5%" },
              { symbol: "MSFT", name: "Microsoft Corp.", price: "$213.10", change: "+2.5%" },
              { symbol: "GOOGL", name: "Alphabet Inc.", price: "$213.10", change: "+1.1%" },
              { symbol: "SPOT", name: "Microsoft Corp.", price: "$213.10", change: "+2.5%" },
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
                    {stock.symbol === "GOOGL" && <Image src="/google-logo.png" alt="Google" width={32} height={32} />}
                    {stock.symbol === "SPOT" && <Image src="/spotify-logo.png" alt="Spotify" width={32} height={32} />}
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
            <span className="text-sm">해외종목 목록 보기</span>
          </div>

          {/* Stock List */}
          <div className="bg-white rounded-xl p-4 shadow-sm flex-1 overflow-auto">
            <div className="space-y-6">
              {[
                { symbol: "MSFT", name: "Microsoft Corp.", price: "$213.10", change: "+2.5%" },
                { symbol: "GOOGL", name: "Alphabet Inc.", price: "$213.10", change: "+1.1%" },
                { symbol: "SPOT", name: "Microsoft Corp.", price: "$213.10", change: "+2.5%" },
                { symbol: "MSFT", name: "Microsoft Corp.", price: "$213.10", change: "+2.5%" },
                { symbol: "GOOGL", name: "Alphabet Inc.", price: "$213.10", change: "+1.1%" },
                { symbol: "SPOT", name: "Microsoft Corp.", price: "$213.10", change: "+2.5%" },
                { symbol: "MSFT", name: "Microsoft Corp.", price: "$213.10", change: "+2.5%" },
                { symbol: "GOOGL", name: "Alphabet Inc.", price: "$213.10", change: "+1.1%" },
                { symbol: "SPOT", name: "Microsoft Corp.", price: "$213.10", change: "+2.5%" },
                { symbol: "MSFT", name: "Microsoft Corp.", price: "$213.10", change: "+2.5%" },
                { symbol: "GOOGL", name: "Alphabet Inc.", price: "$213.10", change: "+1.1%" },
                { symbol: "SPOT", name: "Microsoft Corp.", price: "$213.10", change: "+2.5%" },
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
                      {stock.symbol === "GOOGL" && <Image src="/google-logo.png" alt="Google" width={32} height={32} />}
                      {stock.symbol === "SPOT" && (
                        <Image src="/spotify-logo.png" alt="Spotify" width={32} height={32} />
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
              <div className="flex items-center bg-[#f0f0f0] rounded-full px-4 py-3">
                <Search className="text-gray-500 w-5 h-5 mr-3" />
                <input
                  type="text"
                  placeholder="종목 검색"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent border-0 focus:outline-none text-base text-gray-700 placeholder-gray-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="bg-[#e0e0e0] rounded-full p-1.5 ml-2 hover:bg-gray-300 transition-colors"
                  >
                    <X className="text-gray-600 w-4 h-4" />
                  </button>
                )}
              </div>
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
                  onClick={() => setActiveTab("매수")}
                  className={`px-4 py-1.5 rounded-full font-medium text-xs transition-colors ${
                    activeTab === "매수" ? "bg-[#fce7e7]" : "bg-white hover:bg-gray-50"
                  }`}
                >
                  매수
                </button>
                <button
                  onClick={() => setActiveTab("매도")}
                  className={`px-4 py-1.5 rounded-full font-medium text-xs transition-colors ${
                    activeTab === "매도" ? "bg-[#e7ecfc]" : "bg-white hover:bg-gray-50"
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
                        activePeriod === period ? "bg-white shadow-sm" : "hover:bg-gray-100"
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
                <span className="text-[#41c3a9] bg-[#e6f7f4] px-2 py-0.5 rounded-md text-sm">+1.66%</span>
              </div>
            </div>

            <div className="text-xs text-gray-500 mb-6">Oct 25, 5:26:38PM UTC-4 · INDEXSP · Disclaimer</div>

            {/* Empty Chart Area (for user to add their own chart) */}
            <div className="h-60 md:h-80 mb-6 flex items-center justify-center">
              <div className="text-gray-400 text-center">
                <p>차트 영역</p>
                <p className="text-sm">이 부분에 차트를 직접 추가하세요</p>
              </div>
            </div>

            {/* Volume Chart */}
            <div className="h-32 md:h-40 flex items-center justify-center border-t pt-4">
              <div className="text-gray-400 text-center">
                <p>거래량 차트 영역</p>
              </div>
            </div>

            <div className="text-xs text-gray-500 text-right mt-4">2025.5.13 17:18:37 기준</div>
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
            {/* 종목정보 상세, 내 계좌, AI 추천 탭 */}
            <div className="flex justify-between gap-1 md:gap-2 mb-4 overflow-x-auto">
              {(["종목정보 상세", "내 계좌", "AI 추천"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveRightTab(tab)}
                  className={`px-2 md:px-4 py-2 rounded-xl font-medium text-xs md:text-sm whitespace-nowrap transition-colors ${
                    activeRightTab === tab ? "bg-[#f5f7f9]" : "bg-[#f5f7f9] hover:bg-gray-200"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="bg-gray-200 w-8 h-8 flex items-center justify-center rounded text-xs">
                  <span className="text-[10px]">S&P</span>
                  <span className="text-[10px]">500</span>
                </div>
                <h3 className="text-lg md:text-xl font-bold">S&P 500</h3>
              </div>
              <div className="flex items-center gap-3">
                <div className="font-bold">$213.10</div>
                <div className="text-xs text-[#41c3a9] bg-[#e6f7f4] px-2 py-0.5 rounded-md">↑ 1.1%</div>
              </div>
            </div>

            <div className="text-sm text-gray-500 mb-4">S&P 500에 투자하여 배당금을 제공하는 ETF</div>

            {/* Stock Details */}
            <div className="space-y-3 mb-4">
              <div className="flex justify-between py-2 md:py-3 px-3 md:px-4 border rounded-full">
                <span className="text-sm text-gray-500">시가총액</span>
                <span className="text-sm font-medium">4.4조원</span>
              </div>
              <div className="flex justify-between py-2 md:py-3 px-3 md:px-4 border rounded-full">
                <span className="text-sm text-gray-500">운용사</span>
                <span className="text-sm font-medium">삼성자산운용(ETF)</span>
              </div>
              <div className="flex justify-between py-2 md:py-3 px-3 md:px-4 border rounded-full">
                <span className="text-sm text-gray-500">상장일</span>
                <span className="text-sm font-medium">2021년 4월 9일</span>
              </div>
              <div className="flex justify-between py-2 md:py-3 px-3 md:px-4 border rounded-full">
                <span className="text-sm text-gray-500">운용자산</span>
                <span className="text-sm font-medium">4.4조원</span>
              </div>
              <div className="flex justify-between py-2 md:py-3 px-3 md:px-4 border rounded-full">
                <span className="text-sm text-gray-500">발행주수</span>
                <span className="text-sm font-medium">230,800,000주</span>
              </div>
            </div>

            {/* News */}
            <div className="mt-4 flex-1 flex flex-col">
              <div className="py-2 md:py-2.5 px-3 md:px-4 bg-[#f5f7f9] rounded-full mb-3">
                <h3 className="font-medium text-sm">주요 뉴스</h3>
              </div>
              <div className="space-y-3 flex-1">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex gap-3">
                    <div className="w-14 h-14 md:w-16 md:h-16 bg-[#f5f7f9] rounded-xl flex items-center justify-center">
                      <Image
                        src="/financial-news.png"
                        alt="뉴스 이미지"
                        width={56}
                        height={56}
                        className="md:w-16 md:h-16"
                      />
                    </div>
                    <div>
                      <h4 className="text-xs md:text-sm font-medium">
                        홍콩그룹과 경영권 분쟁 가능성에...한진칼 상한가
                      </h4>
                      <div className="text-xs text-gray-500 mt-1">1시간 전 / 한국경제</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
