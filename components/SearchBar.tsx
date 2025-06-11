"use client"

import { useState, useEffect, useRef } from "react"
import { Search, X } from "lucide-react"
import { searchStockList } from "@/lib/api"
import type { GetStockSearchResponse } from "@/lib/types"

// 주식 종목 검색바 컴포넌트
interface SearchBarProps {
  onSelectStock: (stock: GetStockSearchResponse) => void
}

export default function SearchBar({ onSelectStock }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<GetStockSearchResponse[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [recentSearches, setRecentSearches] = useState<GetStockSearchResponse[]>([])
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
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length > 0) {
        setIsLoading(true)
        try {
          const response = await searchStockList({
            query: searchQuery,
            limit: 20
          })
          if (response.success) {
            setSearchResults(response.data)
            setShowResults(true)
          }
        } catch (error) {
          console.error('Failed to fetch search results:', error)
          setSearchResults([])
        } finally {
          setIsLoading(false)
        }
      } else {
        setSearchResults([])
      }
    }, 200)
    return () => clearTimeout(delayDebounceFn)
  }, [searchQuery])

  // 종목 선택 시
  const handleSelectStock = (stock: GetStockSearchResponse) => {
    onSelectStock(stock)
    setSearchQuery("")
    setShowResults(false)
    setRecentSearches(prev => [stock, ...prev.filter(s => s.symbol !== stock.symbol)].slice(0, 4))
  }

  return (
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

      {showResults && (
        <div className="absolute top-full left-0 right-0 z-50">
          <div className="bg-[#ffffff] rounded-lg shadow-xl w-full mt-2">
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
            <div className="p-4 space-y-4 max-h-[300px] overflow-y-auto">
              {isLoading ? (
                <div className="text-center text-gray-400 text-sm py-8">검색 중...</div>
              ) : (searchQuery ? searchResults : recentSearches).length === 0 ? (
                <div className="text-center text-gray-400 text-sm py-8">검색 결과가 없습니다</div>
              ) : (
                (searchQuery ? searchResults : recentSearches).map((item, index) => (
                  <div
                    key={`${item.symbol}-${index}`}
                    className="flex items-center cursor-pointer"
                    onClick={() => handleSelectStock(item)}
                  >
                    {/* Left side - Number */}
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
                    {/* Right side - Price and Delta */}
                    <div className="flex flex-col items-end">
                      <div className="text-sm font-medium">${item.currentPrice.toFixed(2)}</div>
                      <div className={`text-xs ${item.priceDelta >= 0 ? "text-[#289bf6]" : "text-red-500"}`}>
                        {item.priceDelta >= 0 ? "+" : ""}{item.priceDelta.toFixed(2)}
                      </div>
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
