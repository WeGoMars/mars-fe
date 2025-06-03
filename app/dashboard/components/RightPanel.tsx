"use client";

import StockDetails from "@/components/StockDetails";
import type { Stock } from "@/lib/types";
import type { Dispatch, SetStateAction } from "react"

interface DashboardRightPanelProps {
  selectedStock: string;
  activeRightTab: "종목정보 상세" | "내 계좌" | "AI 추천";
  setActiveRightTab: (tab: "종목정보 상세" | "내 계좌" | "AI 추천") => void;
  favoriteStocks: Stock[];
  setFavoriteStocks: Dispatch<SetStateAction<Stock[]>>;
  isLoggedIn: boolean;
}

export default function DashboardRightPanel({
  selectedStock,
  activeRightTab,
  setActiveRightTab,
  favoriteStocks,
  setFavoriteStocks,
  isLoggedIn
}: DashboardRightPanelProps) {
  if (!selectedStock) return null;

  return (
    <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm flex-1 overflow-auto flex flex-col">
      <StockDetails
        symbol={selectedStock}
        activeTab={activeRightTab}
        onTabChange={setActiveRightTab}
        favoriteStocks={favoriteStocks}
        setFavoriteStocks={setFavoriteStocks}
        isLoggedIn={isLoggedIn}
      />
    </div>
  );
}