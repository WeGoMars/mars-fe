"use client";

import { X, Minus, Plus } from "lucide-react";
import { useState } from "react";
import type { Stock } from "@/lib/types";

interface TradePanelProps {
  showPanel: false | "buy" | "sell";
  onClose: () => void;
  onBuyConfirm: () => void;
  onSellConfirm: () => void;
  selectedStock: string;
  portfolioData: {
    totalAssets: number;
    seedMoney: number;
    investmentAmount: number;
    profitLoss: number;
  };
}

export default function TradePanel({
  showPanel,
  onClose,
  onBuyConfirm,
  onSellConfirm,
  selectedStock,
  portfolioData
}: TradePanelProps) {
  const [quantity, setQuantity] = useState(1);

  const cashAsset = portfolioData.seedMoney - portfolioData.investmentAmount;

  const isBuy = showPanel === "buy";
  const isSell = showPanel === "sell";

  if (!showPanel) return null;

  return (
    <div className="bg-white rounded-3xl border border-gray-200 p-6 w-full max-w-md md:max-w-md lg:max-w-md xl:max-w-lg flex flex-col fixed top-0 right-0 h-full z-50 shadow-lg transform transition-transform duration-500 animate-slide-in-right">
      {/* 패널 헤더 */}
      <div className="flex items-center justify-center mb-8 relative">
        <span className="px-8 py-2 rounded-full bg-[#f4f5f9] text-base font-semibold text-center">
          {isBuy ? "매수" : "매도"}
        </span>
        <button onClick={onClose} className="absolute right-0 top-1/2 -translate-y-1/2">
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* 종목 요약 */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 space-y-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center border border-gray-200">
            <div className="text-center">
              <div className="text-xs font-bold">{selectedStock}</div>
              <div className="text-xs">종목</div>
            </div>
          </div>
          <h2 className="text-xl font-extrabold">{selectedStock}</h2>
        </div>
        <p className="text-gray-400 text-center text-base font-semibold">
          {selectedStock}에 투자하여 수익을 창출하세요.
        </p>

        {/* 수량 */}
        <div className="flex items-center justify-between mt-6">
          <div className="font-bold text-base">수량</div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded-full bg-[#f4f7fd] flex items-center justify-center text-[#b3c6e6] text-lg font-bold"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-lg font-bold">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-full bg-[#f4f7fd] flex items-center justify-center text-[#b3c6e6] text-lg font-bold"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="text-lg font-extrabold">€ {(quantity * 12).toFixed(2)}</div>
        </div>

        <button
          className={`w-full py-4 rounded-2xl text-center font-bold text-base text-black mt-6 ${
            isBuy ? "bg-[#f9e0de]" : "bg-[#b3c6e6]"
          }`}
          onClick={isBuy ? onBuyConfirm : onSellConfirm}
        >
          {isBuy ? "매수" : "매도"}
        </button>
      </div>

      {/* 내 계좌 */}
      <div>
        <div className="flex justify-center mb-6">
          <span className="px-8 py-2 rounded-full bg-[#f4f5f9] text-base font-semibold text-center">
            내 계좌
          </span>
        </div>
        <div className="bg-white rounded-3xl border border-gray-200 p-6 space-y-6">
          <InfoRow label="총자산" value={portfolioData.totalAssets} color="#006ffd" />
          <InfoRow label="현금자산" value={cashAsset} />
          <InfoRow label="시드머니" value={portfolioData.seedMoney} color="#006ffd" />
          <InfoRow label="투자금액" value={portfolioData.investmentAmount} color="#439a86" />
          <InfoRow
            label="평가손익"
            value={portfolioData.profitLoss}
            color={portfolioData.profitLoss >= 0 ? "#e74c3c" : "#3498db"}
            isProfit
          />
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  label,
  value,
  color,
  isProfit = false,
}: {
  label: string;
  value: number;
  color?: string;
  isProfit?: boolean;
}) {
  return (
    <div className="flex justify-between items-center">
      <div className="font-bold text-base">{label}</div>
      <div className="flex items-center">
        <span
          className={`text-xs mr-1 ${
            isProfit ? (value >= 0 ? "text-[#e74c3c]" : "text-[#3498db]") : color ? `text-[${color}]` : ""
          }`}
        >
          $
        </span>
        <span
          className={`text-xl font-bold ${
            isProfit ? (value >= 0 ? "text-[#e74c3c]" : "text-[#3498db]") : color ? `text-[${color}]` : ""
          }`}
        >
          {isProfit ? (value >= 0 ? "+" : "-") : ""}
          {Math.abs(value).toFixed(2)}
        </span>
      </div>
    </div>
  );
}