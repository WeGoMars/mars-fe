"use client"

import { useState, useEffect, useRef } from "react"
import { Search, X } from "lucide-react"
import type { Stock } from "@/lib/types"

interface SearchBarProps {
  onSelectStock: (symbol: string) => void // 종목 선택 시 호출되는 콜백
}

// 목 데이터
const mockStocks: Stock[] = [
  { symbol: "AAPL", name: "Apple Inc.", price: "175.04", change: "+2.5%", changePercent: "+2.5%" },
  { symbol: "MSFT", name: "Microsoft Corporation", price: "415.32", change: "+1.8%", changePercent: "+1.8%" },
  { symbol: "GOOGL", name: "Alphabet Inc.", price: "142.56", change: "-0.5%", changePercent: "-0.5%" },
  { symbol: "AMZN", name: "Amazon.com Inc.", price: "178.75", change: "+3.2%", changePercent: "+3.2%" },
  { symbol: "TSLA", name: "Tesla Inc.", price: "177.77", change: "-1.2%", changePercent: "-1.2%" },
]

// 상태 관리
export default function SearchBar({ onSelectStock }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Stock[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [recentSearches, setRecentSearches] = useState<Stock[]>([])
  const wrapperRef = useRef<HTMLDivElement>(null)

  // 바깥 클릭 시 모달 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }
    if (showResults) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showResults])

  // 검색어 입력 시 결과 필터링(검색 기능)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.length > 0) {
        setIsLoading(true)
        const results = mockStocks.filter(stock =>
          stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
          stock.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        setSearchResults(results)
        setShowResults(true)
        setIsLoading(false)
      } else {
        setSearchResults([])
      }
    }, 200)
    return () => clearTimeout(delayDebounceFn)
  }, [searchQuery])

  // 종목 선택 시
  const handleSelectStock = (symbol: string) => {
    onSelectStock(symbol)
    setSearchQuery("")
    setShowResults(false)
    const selectedStock = mockStocks.find(stock => stock.symbol === symbol)
    if (selectedStock) {
      setRecentSearches(prev => [selectedStock, ...prev.filter(s => s.symbol !== symbol)].slice(0, 4))
    }
  }

  return (
    // 검색 입력 창
    <div className="relative w-full max-w-2xl" ref={wrapperRef}>
      <div className="flex items-center bg-[#f0f0f0] rounded-full px-4 py-3">
        <Search className="text-gray-500 w-5 h-5 mr-3" />
        <input
          type="text"
          placeholder="종목 검색"
          value={searchQuery}
          onChange={e => {
            setSearchQuery(e.target.value)
            setShowResults(true)
          }}
          onFocus={() => setShowResults(true)}
          className="flex-1 bg-transparent border-0 focus:outline-none text-base text-gray-700 placeholder-gray-500"
        />
      </div>

      {/* 모달: 검색창을 완전히 덮도록 absolute top-0 left-0 right-0 */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 z-50">
          <div className="bg-[#ffffff] rounded-lg shadow-xl w-full max-w-sm mx-auto mt-2">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <h1 className="text-[#000000] text-lg font-semibold">
                  {searchQuery ? "검색결과" : "최근검색"}
                </h1>
                <span className="text-[#999898] text-xs">오늘 14:25 기준</span>
              </div>
              <button
                onClick={() => setShowResults(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            {/* Search Items List */}
            <div className="p-4 space-y-5 max-h-80 overflow-y-auto">
              {(searchQuery ? searchResults : recentSearches).length === 0 ? (
                <div className="text-center text-gray-400 text-sm py-8">검색 결과가 없습니다</div>
              ) : (
                (searchQuery ? searchResults : recentSearches).map((item, index) => (
                  <div
                    key={`${item.symbol}-${index}`}
                    className="flex items-center cursor-pointer"
                    onClick={() => handleSelectStock(item.symbol)}
                  >
                    {/* Left side - Heart icon and number */}
                    <div className="flex items-center space-x-3 w-12">
                      <span className="text-base font-medium text-[#049c6b]">
                        {index + 1}
                      </span>
                    </div>
                    {/* Center - Stock info */}
                    <div className="flex-1 ml-4">
                      <div className="flex items-baseline space-x-2">
                        <div className="text-[#000000] text-base font-semibold">{item.symbol}</div>
                        <div className="text-[#cccccc] text-xs">{item.name}</div>
                      </div>
                    </div>
                    {/* Right side - Percentage */}
                    <div className={`text-sm font-medium w-16 text-right ${
                      item.change.startsWith("+") ? "text-[#289bf6]" : "text-red-500"}`}
                    >
                      {item.change}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
