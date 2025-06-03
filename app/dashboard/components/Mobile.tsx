"use client";

import { ChevronLeft } from "lucide-react";
import { Stock } from "@/lib/types";
import StockList from "@/components/StockList";

interface MobilePanelProps {
  mobileMenuOpen: boolean;
  mobileSidebarOpen: boolean;
  onCloseMenu: () => void;
  onCloseSidebar: () => void;
  onOpenSidebar: () => void;
  onSelectStock: (symbol: string) => void;
  stocks: Stock[];
  isLoading: boolean;
  error: string | null;
}

export default function MobilePanel({
  mobileMenuOpen,
  mobileSidebarOpen,
  onCloseMenu,
  onCloseSidebar,
  onOpenSidebar,
  onSelectStock,
  stocks,
  isLoading,
  error
}: MobilePanelProps) {
  if (mobileMenuOpen) {
    return (
      <div className="lg:hidden bg-white p-4 border-b">
        <div className="flex flex-col space-y-3">
          <div className="text-sm text-gray-600">
            oo님 mars 모투에 오신걸 환영합니다
          </div>
          <button
            className="bg-[#006ffd] text-white px-4 py-2 rounded-md w-full"
            onClick={() => {
              localStorage.removeItem("logInUser");
              alert("로그아웃 되었습니다.");
              window.location.href = "/";
            }}
          >
            로그아웃
          </button>
          <button
            className="flex items-center justify-center gap-2 bg-[#f0f0f0] p-3 rounded-xl w-full"
            onClick={() => {
              onCloseMenu();
              onOpenSidebar();
            }}
          >
            <span className="text-sm">해외종목 목록 보기</span>
          </button>
        </div>
      </div>
    );
  }

  if (mobileSidebarOpen) {
    return (
      <div className="fixed inset-0 bg-white z-50 p-4 overflow-auto lg:hidden">
        <div className="flex items-center mb-4">
          <button className="mr-2" onClick={onCloseSidebar}>
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h2 className="text-lg font-medium">해외종목 목록</h2>
        </div>

        {isLoading ? (
          <div className="text-center py-4">로딩 중...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-4">{error}</div>
        ) : (
          <StockList
            stocks={stocks}
            onSelectStock={(symbol: string) => {
              onSelectStock(symbol);
              onCloseSidebar();
            }}
          />
        )}
      </div>
    );
  }

  return null;
}