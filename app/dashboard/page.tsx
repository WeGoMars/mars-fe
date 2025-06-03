"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Stock } from "@/lib/types";
import Header from "./components/Header";
import Mobile from "./components/Mobile";
import LeftSidebar from "./components/LeftSidebar";
import StockChartSection from "./components/StockChartSection";
import TradePanel from "./components/TradePanel";
import RightPanel from "./components/RightPanel";
import SearchBar from "@/components/SearchBar";
import BuyConfirmModal from "@/components/BuyConfirmModal";
import SellConfirmModal from "@/components/SellConfirmModal";
import ProfileModal from "@/components/common/ProfileModal";
import mockPortfolio from "@/lib/mock/mockportfolio";

export default function Dashboard() {
  const [stocks, setStocks] = useState<Stock[]>([
    {
      symbol: "SPY",
      name: "S&P 500 ETF",
      price: "$456.48",
      change: "+1.66%",
      changePercent: "+1.66%",
    },
    {
      symbol: "AAPL",
      name: "Apple Inc.",
      price: "$175.04",
      change: "+0.86%",
      changePercent: "+0.86%",
    },
    {
      symbol: "TSLA",
      name: "Tesla Inc.",
      price: "$238.45",
      change: "-2.32%",
      changePercent: "-2.32%",
    },
  ]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStock, setSelectedStock] = useState("SPY");
  const [activeTab, setActiveTab] = useState<"매수" | "매도">("매수");
  const [activePeriod, setActivePeriod] = useState<"일" | "주" | "월" | "분">("일");
  const [activeRightTab, setActiveRightTab] = useState<"종목정보 상세" | "내 계좌" | "AI 추천">("종목정보 상세");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [nickname, setNickname] = useState<string | null>(null);
  const [showPanel, setShowPanel] = useState<false | "buy" | "sell">(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSellConfirmModal, setShowSellConfirmModal] = useState(false);
  const [favoriteStocks, setFavoriteStocks] = useState<Stock[]>([
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
  ]);
  const [selectedMinute, setSelectedMinute] = useState<"15분" | "1시간">("15분");
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const selectStock = (symbol: string) => {
    setSelectedStock(symbol);
  };

  const AvatarClick = () => {
    const url = new URL(window.location.href);
    url.searchParams.set("modal", "edit");
    router.push(url.toString());
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:4000/users/whoami", {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setNickname(data.nick);
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
          window.location.href = "/";
        }
      } catch (err) {
        console.error("유저 정보 불러오기 실패:", err);
        setIsLoggedIn(false);
        window.location.href = "/";
      }
    };

    fetchUser();
  }, []);

  const portfolioData = mockPortfolio;

  return (
    <div className="min-h-screen bg-[#f5f7f9]">
      <Header
        nickname={nickname}
        onAvatarClick={AvatarClick}
        onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
      />

      <Mobile
        mobileMenuOpen={mobileMenuOpen}
        mobileSidebarOpen={mobileSidebarOpen}
        onCloseMenu={() => setMobileMenuOpen(false)}
        onCloseSidebar={() => setMobileSidebarOpen(false)}
        onOpenSidebar={() => setMobileSidebarOpen(true)}
        onSelectStock={selectStock}
        stocks={stocks}
        isLoading={isLoading}
        error={error}
      />

      <div className="flex flex-col lg:flex-row p-4 gap-4">
        <LeftSidebar
          favoriteStocks={favoriteStocks}
          onSelectStock={selectStock}
        />

        <div className="flex-1 flex flex-col">
          <div className="flex justify-center mb-4">
            <div className="relative w-full max-w-2xl">
              <SearchBar onSelectStock={selectStock} />
            </div>
          </div>

          <StockChartSection
            selectedStock={selectedStock}
            stocks={stocks}
            favoriteStocks={favoriteStocks}
            setFavoriteStocks={setFavoriteStocks}
            activePeriod={activePeriod}
            setActivePeriod={setActivePeriod}
            selectedMinute={selectedMinute}
            setSelectedMinute={setSelectedMinute}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            setShowPanel={setShowPanel}
          />
        </div>

        <div className="w-full lg:w-80 flex flex-col mt-4 lg:mt-0">
          <TradePanel
            showPanel={showPanel}
            onClose={() => setShowPanel(false)}
            onBuyConfirm={() => setShowConfirmModal(true)}
            onSellConfirm={() => setShowSellConfirmModal(true)}
            selectedStock={selectedStock}
            portfolioData={portfolioData}
          />

          {!showPanel && (
            <RightPanel
              selectedStock={selectedStock}
              activeRightTab={activeRightTab}
              setActiveRightTab={setActiveRightTab}
              favoriteStocks={favoriteStocks}
              setFavoriteStocks={setFavoriteStocks}
              isLoggedIn={isLoggedIn}
            />
          )}
        </div>
      </div>

      <ProfileModal />
      <BuyConfirmModal
        open={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={() => {
          setShowConfirmModal(false);
          setShowPanel(false);
        }}
      />
      <SellConfirmModal
        open={showSellConfirmModal}
        onClose={() => setShowSellConfirmModal(false)}
        onConfirm={() => {
          setShowSellConfirmModal(false);
          setShowPanel(false);
        }}
      />
    </div>
  );
}