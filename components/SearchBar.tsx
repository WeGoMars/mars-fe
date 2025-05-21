"use client"

import { useState, useEffect, useRef } from "react"
import { Search, X } from "lucide-react"
import { searchStocks } from "@/lib/api"
import type { Stock } from "@/lib/types"

interface SearchBarProps {
  onSelectStock: (symbol: string) => void
}

export default function SearchBar({ onSelectStock }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [searchResults, setSearchResults] = useState<Stock[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showResults, setShowResults] = useState<boolean>(false)
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length > 1) {
        setIsLoading(true)
        try {
          const results = await searchStocks(searchQuery)
          setSearchResults(results)
          setShowResults(true)
        } catch (error) {
          console.error("Search error:", error)
        } finally {
          setIsLoading(false)
        }
      } else {
        setSearchResults([])
        setShowResults(false)
      }
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [searchQuery])

  const handleSelectStock = (symbol: string) => {
    onSelectStock(symbol)
    setSearchQuery("")
    setShowResults(false)
  }

  return (
    <div className="flex justify-center mb-4 relative" ref={searchRef}>
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

        {/* Search Results Dropdown */}
        {showResults && searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg z-10 max-h-80 overflow-y-auto">
            {searchResults.map((stock, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                onClick={() => handleSelectStock(stock.symbol)}
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-xs">{stock.symbol.substring(0, 2)}</span>
                  </div>
                  <div>
                    <div className="font-medium">{stock.symbol}</div>
                    <div className="text-xs text-gray-500">{stock.name}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{stock.price}</div>
                  <div className={`text-xs ${stock.change.startsWith("+") ? "text-[#41c3a9]" : "text-red-500"}`}>
                    {stock.change}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {isLoading && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg z-10 p-4 text-center">
            <div className="text-gray-500">검색 중...</div>
          </div>
        )}

        {showResults && searchResults.length === 0 && !isLoading && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg z-10 p-4 text-center">
            <div className="text-gray-500">검색 결과가 없습니다</div>
          </div>
        )}
      </div>
    </div>
  )
}
