"use client";

import { useState } from "react";
import Image from "next/image";
import type { Stock } from "@/lib/types";

// 주식 클릭 시 목록 보여주는 컴포넌트
interface StockListProps {
  stocks: Stock[];
  onSelectStock: (stock: Stock) => void;
}

export default function StockList({ stocks, onSelectStock }: StockListProps) {
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);

  const handleSelectStock = (stock: Stock) => {
    setSelectedSymbol(stock.symbol);
    onSelectStock(stock);
  };

  return (
    <div className="space-y-6">
      {stocks.map((stock, index) => (
        <div
          key={index}
          className={`flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors ${
            selectedSymbol === stock.symbol ? "bg-gray-50" : ""
          }`}
          onClick={() => handleSelectStock(stock)}
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
              {stock.symbol === "GOOGL" && (
                <Image
                  src="/placeholder.svg?height=32&width=32&query=google logo"
                  alt="Google"
                  width={32}
                  height={32}
                />
              )}
              {stock.symbol === "SPOT" && (
                <Image
                  src="/placeholder.svg?height=32&width=32&query=spotify logo"
                  alt="Spotify"
                  width={32}
                  height={32}
                />
              )}
              {!["MSFT", "GOOGL", "SPOT"].includes(stock.symbol) && (
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold">
                    {stock.symbol.substring(0, 2)}
                  </span>
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
            <div
              className={`text-xs ${stock.change.startsWith("+") ? "text-[#41c3a9]" : "text-red-500"}`}
            >
              {stock.change}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
