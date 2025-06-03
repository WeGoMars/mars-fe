"use client";

import Image from "next/image";
import type { Stock } from "@/lib/types";

interface LeftSidebarProps {
  favoriteStocks: Stock[];
  onSelectStock: (symbol: string) => void;
}

const dummyPurchasedStocks: Stock[] = [
  {
    symbol: "MSFT",
    name: "Microsoft Corp.",
    price: "$213.10",
    change: "+2.5%",
    changePercent: "+2.5%",
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    price: "$213.10",
    change: "+1.1%",
    changePercent: "+1.1%",
  },
  {
    symbol: "SPOT",
    name: "Spotify Corp.",
    price: "$213.10",
    change: "+2.5%",
    changePercent: "+2.5%",
  },
];

export default function LeftSidebar({
  favoriteStocks,
  onSelectStock,
}: LeftSidebarProps) {
  const renderStockItem = (stock: Stock, index: number) => (
    <div
      key={index}
      className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
      onClick={() => onSelectStock(stock.symbol)}
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8">
          {stock.symbol === "MSFT" && (
            <div className="w-8 h-8 grid grid-cols-2 grid-rows-2">
              <div className="bg-[#f25022]"></div>
              <div className="bg-[#7fba00]"></div>
              <div className="bg-[#00a4ef]"></div>
              <div className="bg-[#ffb900]"></div>
            </div>
          )}
          {stock.symbol === "GOOGL" && (
            <Image src="/google-logo.png" alt="Google" width={32} height={32} />
          )}
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
        <div
          className={`text-xs ${
            stock.change.startsWith("+") ? "text-[#41c3a9]" : "text-red-500"
          }`}
        >
          {stock.change}
        </div>
      </div>
    </div>
  );

  return (
    <div className="hidden lg:flex lg:w-64 flex-col">
      {/* 관심 종목 */}
      <div className="bg-[#f0f0f0] rounded-xl p-3 mb-4 text-center">
        <span className="text-sm">관심 종목</span>
      </div>
      <div className="bg-white rounded-xl p-4 shadow-sm flex-1 overflow-auto">
        <div className="space-y-6">
          {favoriteStocks.map(renderStockItem)}
        </div>
      </div>

      {/* 내가 구매한 종목 */}
      <div className="bg-[#f0f0f0] rounded-xl p-3 my-4 text-center">
        <span className="text-sm">내가 구매한 종목</span>
      </div>
      <div className="bg-white rounded-xl p-4 shadow-sm flex-1 overflow-auto">
        <div className="space-y-6">
          {dummyPurchasedStocks.map(renderStockItem)}
        </div>
      </div>
    </div>
  );
}