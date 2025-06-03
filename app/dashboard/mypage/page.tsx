"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import ProfileModal from "@/components/common/ProfileModal"
import mockPortfolio from "@/lib/mock/mockportfolio"
import Header from "./components/Header"
import InterestStock from "./components/InterestStock"
import PurchasedStock from "./components/PurchasedStock"
import Portfolio from "./components/Portfolio"
import HoldingsTable from "./components/HoldingsTable"
import TradeHistory from "./components/TradeHistory"

export default function MyPage() {
  const router = useRouter()
  const [nickname, setNickname] = useState<string | null>(null)
  const [portfolioData, setPortfolioData] = useState(mockPortfolio)

  // const holdings = [
  //   { name: "테슬라", purchasePrice: 300, currentPrice: 344, Quantity: 2, gain: 44, returnRate: 14.67 },
  // ]

  const AvatarClick = () => {
    const url = new URL(window.location.href)
    url.searchParams.set("modal", "edit")
    router.push(url.toString())
  }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:4000/users/whoami", {
          credentials: "include",
        })
        if (res.ok) {
          const data = await res.json()
          setNickname(data.nick)
        } else {
          window.location.href = "/"
        }
      } catch (err) {
        console.error("유저 정보 불러오기 실패:", err)
        window.location.href = "/"
      }
    }

    fetchUser()
  }, [])

  return (
    <div className="min-h-screen bg-[#f5f7f9]">
      <Header nickname={nickname} onAvatarClick={AvatarClick} />
      <div className="flex flex-col lg:flex-row p-4 gap-4">
        <div className="lg:flex lg:w-64 flex-col">
          <InterestStock />
          <PurchasedStock />
        </div>

        <div className="flex-1 max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <span className="text-2xl font-bold text-[#1c2730] mb-2">
              {nickname ? `${nickname}님 자산현황 입니다.` : "자산현황 입니다."}
            </span>
          </div>

          <Portfolio data={portfolioData} />
          <HoldingsTable holdings={[]} />
          <TradeHistory trades={[]} />

        </div>
      </div>
      <ProfileModal />
    </div>
  )
}