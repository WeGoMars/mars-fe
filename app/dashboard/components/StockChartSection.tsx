"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import type { Stock } from "@/lib/types";
import StockChart from "@/components/StockChart";

interface StockChartSectionProps {
  selectedStock: string;
  stocks: Stock[];
  favoriteStocks: Stock[];
  setFavoriteStocks: React.Dispatch<React.SetStateAction<Stock[]>>;
  activePeriod: "일" | "주" | "월" | "분";
  setActivePeriod: (period: "일" | "주" | "월" | "분") => void;
  selectedMinute: "15분" | "1시간";
  setSelectedMinute: (value: "15분" | "1시간") => void;
  activeTab: "매수" | "매도";
  setActiveTab: (tab: "매수" | "매도") => void;
  setShowPanel: (panel: "buy" | "sell") => void;
}

export default function StockChartSection({
  selectedStock,
  stocks,
  favoriteStocks,
  setFavoriteStocks,
  activePeriod,
  setActivePeriod,
  selectedMinute,
  setSelectedMinute,
  activeTab,
  setActiveTab,
  setShowPanel,
}: StockChartSectionProps) {
  const [showMinuteOptions, setShowMinuteOptions] = useState(false);

  const isHeartFilled = favoriteStocks.some(
    (stock) => stock.symbol === selectedStock
  );

  const currentStock = stocks.find((s) => s.symbol === selectedStock);

  return (
    <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm flex-1 overflow-auto">
      {/* 종목 헤더 */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-3">
        <div className="flex items-center gap-2">
          <div className="bg-gray-200 w-8 h-8 flex items-center justify-center rounded text-xs">
            <span className="text-[10px]">{selectedStock}</span>
          </div>
          <h2 className="text-xl font-bold">{selectedStock}</h2>
          <button
            onClick={() => {
              if (!currentStock) return;
              if (isHeartFilled) {
                setFavoriteStocks((prev) =>
                  prev.filter((s) => s.symbol !== selectedStock)
                );
              } else {
                setFavoriteStocks((prev) => [...prev, currentStock]);
              }
            }}
            className="flex items-center justify-center"
          >
            <Heart
              className={`w-4 h-4 cursor-pointer transition-colors ${
                isHeartFilled ? "text-red-500 fill-red-500" : "text-[#1f2024]"
              }`}
            />
          </button>
        </div>

        {/* 매수/매도 + 기간 선택 */}
        <div className="flex flex-wrap gap-2">
          {/* 매수 / 매도 버튼 */}
          <button
            onClick={() => {
              setActiveTab("매수");
              setShowPanel("buy");
            }}
            className={`px-4 py-1.5 rounded-full font-medium text-xs transition-colors ${
              activeTab === "매수"
                ? "bg-[#fce7e7]"
                : "bg-white hover:bg-gray-50"
            }`}
          >
            매수
          </button>
          <button
            onClick={() => {
              setActiveTab("매도");
              setShowPanel("sell");
            }}
            className={`px-4 py-1.5 rounded-full font-medium text-xs transition-colors ${
              activeTab === "매도"
                ? "bg-[#b3c6e6]"
                : "bg-white hover:bg-gray-50"
            }`}
          >
            매도
          </button>

          {/* 기간 선택 탭 */}
          <div className="flex ml-0 md:ml-2 bg-[#f5f7f9] rounded-full relative">
            {(["월", "주", "일", "분"] as const).map((period) =>
              period === "분" ? (
                <div key={period} className="relative">
                  <button
                    onClick={() => {
                      if (activePeriod === "분") {
                        setShowMinuteOptions((prev) => !prev);
                      } else {
                        setActivePeriod("분");
                        setShowMinuteOptions(true);
                      }
                    }}
                    className={`px-3 md:px-4 py-1.5 rounded-full font-medium text-xs transition-colors ${
                      activePeriod === "분"
                        ? "bg-white shadow-sm"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {activePeriod === "분" ? selectedMinute : period}
                  </button>
                  {activePeriod === "분" && showMinuteOptions && (
                    <div className="absolute left-1/2 -translate-x-1/2 mt-2 bg-white border rounded-xl shadow-lg z-10 w-24 flex flex-col">
                      {["15분", "1시간"].map((min) => (
                        <button
                          key={min}
                          className={`py-2 px-4 text-sm hover:bg-gray-100 ${
                            selectedMinute === min
                              ? "font-bold text-blue-600"
                              : ""
                          }`}
                          onClick={() => {
                            setSelectedMinute(min as "15분" | "1시간");
                            setShowMinuteOptions(false);
                          }}
                        >
                          {min}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <button
                  key={period}
                  onClick={() => {
                    setActivePeriod(period);
                    setShowMinuteOptions(false);
                  }}
                  className={`px-3 md:px-4 py-1.5 rounded-full font-medium text-xs transition-colors ${
                    activePeriod === period
                      ? "bg-white shadow-sm"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {period}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* 가격 및 차트 */}
      <div className="mb-1">
        <div className="flex items-center gap-2">
          <span className="text-2xl md:text-3xl font-bold">
            {currentStock?.price.replace("$", "") || "0.00"}
          </span>
          <span
            className={`${
              currentStock?.change?.startsWith("+")
                ? "text-[#41c3a9] bg-[#e6f7f4]"
                : "text-red-500 bg-red-50"
            } px-2 py-0.5 rounded-md text-sm`}
          >
            {currentStock?.change || "0.00%"}
          </span>
        </div>
      </div>
      <div className="text-xs text-gray-500 mb-6">
        {new Date().toLocaleString()} · {selectedStock} · Disclaimer
      </div>

      <div className="h-[740px] flex flex-col items-center justify-center">
        <div className="w-full h-full flex flex-col items-center justify-center">
          <StockChart symbol={selectedStock} period={activePeriod} />
        </div>
      </div>
    </div>
  );
}