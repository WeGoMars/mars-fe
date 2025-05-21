"use client"

import type React from "react"
import type { Stock } from "../types/stock"

interface StockListProps {
  stocks: Stock[]
  onSelectStock: (symbol: string) => void
}

const StockList: React.FC<StockListProps> = ({ stocks, onSelectStock }) => {
  return (
    <div className="space-y-6">
      {stocks.map((stock, index) => (
        <div
          key={index}
          className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
          onClick={() => onSelectStock(stock.symbol)}
        >
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
              {stock.symbol === "GOOGL" && <img src="/assets/google-logo.png" alt="Google" width={32} height={32} />}
              {stock.symbol === "SPOT" && <img src="/assets/spotify-logo.png" alt="Spotify" width={32} height={32} />}
              {!["MSFT", "GOOGL", "SPOT"].includes(stock.symbol) && (
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold">{stock.symbol.substring(0, 2)}</span>
                </div>
              )}
            </div>
            <div>
              <div className="font-bold text-base">{stock.symbol}</div>
              <div className="text-xs text-gray-500">{stock.name}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-bold text-base">{stock.price}</div>
            <div className={`text-xs ${stock.change.startsWith("+") ? "text-[#41c3a9]" : "text-red-500"}`}>
              {stock.change}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default StockList
