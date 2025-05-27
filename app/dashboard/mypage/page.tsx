"use client"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, ChevronRight, Menu } from "lucide-react"
import Image from "next/image";
import { useRouter } from "next/navigation" 
import { useEffect, useState } from "react"



export default function MyPage() {
  const portfolioData = {
    totalAssets: 2850.75,
    investmentAmount: 1500.5,
    profitLoss: 350.6,
    returnRate: 5.5,
  }

  const watchlistStocks = [
    {
      symbol: "MSFT",
      company: "Microsoft Corp.",
      price: 213.1,
      change: 2.5,
      logo: "/placeholder.svg?height=32&width=32&query=microsoft+logo",
    },
    {
      symbol: "GOOGL",
      company: "Alphabet Inc.",
      price: 213.1,
      change: 1.1,
      logo: "/placeholder.svg?height=32&width=32&query=google+logo",
    },
    {
      symbol: "SPOT",
      company: "Spotify Corp.",
      price: 213.1,
      change: 2.5,
      logo: "/placeholder.svg?height=32&width=32&query=spotify+logo",
    },
  ]

  const myStocks = [
    {
      symbol: "MSFT",
      company: "Microsoft Corp.",
      price: 213.1,
      change: 2.5,
      logo: "/placeholder.svg?height=32&width=32&query=microsoft+logo",
    },
    {
      symbol: "GOOGL",
      company: "Alphabet Inc.",
      price: 213.1,
      change: 1.1,
      logo: "/placeholder.svg?height=32&width=32&query=google+logo",
    },
    {
      symbol: "SPOT",
      company: "Spotify Corp.",
      price: 213.1,
      change: 2.5,
      logo: "/placeholder.svg?height=32&width=32&query=spotify+logo",
    },
  ]

  const holdings = [{ name: "테슬라", purchasePrice: 300, currentPrice: 344, gain: 44, returnRate: 14.67 }]

  const router = useRouter()
  const [nickname, setNickname] = useState<string | null>(null)

  useEffect(() => {
  const storedUser = localStorage.getItem("logInUser")
  if (storedUser) {
    try {
      const user = JSON.parse(storedUser)
      setNickname(user.nickname)
    } catch (err) {
      console.error("유저 정보 파싱 실패:", err)
    }
  }
}, [])
  
  return (
    <div className="min-h-screen bg-[#f5f7f9]">
      <header className="bg-white border-b">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Link href="/dashboard">
            <Image
              src="/marslogo.png"
              alt="Mars 로고"
              width={30}
              height={30}
              className="rounded-full cursor-pointer"
            />
            </Link>
            <span className="text-lg font-medium">Mars</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-[#747480]">
              {nickname ? `${nickname}님 환영합니다` : "mars 모투에 오신걸 환영합니다"}
            </span>
            <Link href="/profile" className="hover:opacity-80 transition-opacity">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32&query=user+avatar" />
                <AvatarFallback className="bg-[#5f80f8] text-white">M</AvatarFallback>
              </Avatar>
            </Link>
            <Button variant="default" size="sm" className="bg-[#5f80f8] hover:bg-[#4c6ef5] text-white"
             onClick={() => {
                localStorage.removeItem("logInUser")
                alert("로그아웃 되었습니다.")
                router.push("/")
              }}
            >
              로그아웃
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          {/* Left Sidebar - Watchlist */}
          <div className="lg:col-span-1">
            <Card className="bg-white border-[#e8e8e8]">
              <CardHeader className="pb-3">
                <CardTitle className="text-[#1c2730] text-lg">관심 종목</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {watchlistStocks.map((stock, index) => (
                  <Link
                    key={index}
                    href={`/stocks/${stock.symbol.toLowerCase()}`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-[#f5f7f9] transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <img src={stock.logo || "/placeholder.svg"} alt={stock.company} className="w-8 h-8 rounded" />
                      <div>
                        <div className="font-semibold text-[#1c2730] text-sm">{stock.symbol}</div>
                        <div className="text-xs text-[#8f9098]">{stock.company}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-[#1c2730]">${stock.price}</div>
                      <div
                        className={`text-xs flex items-center gap-1 ${stock.change > 0 ? "text-[#63c89b]" : "text-[#bb4430]"}`}
                      >
                        {stock.change > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {stock.change > 0 ? "+" : ""}
                        {stock.change}%
                      </div>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>

            {/* My Stocks */}
            <Card className="bg-white border-[#e8e8e8] mt-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-[#1c2730] text-lg">내가 구매한 종목</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {myStocks.map((stock, index) => (
                  <Link
                    key={index}
                    href={`/portfolio/${stock.symbol.toLowerCase()}`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-[#f5f7f9] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <img src={stock.logo || "/placeholder.svg"} alt={stock.company} className="w-8 h-8 rounded" />
                      <div>
                        <div className="font-semibold text-[#1c2730] text-sm">{stock.symbol}</div>
                        <div className="text-xs text-[#8f9098]">{stock.company}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-[#1c2730]">${stock.price}</div>
                      <div
                        className={`text-xs flex items-center gap-1 ${stock.change > 0 ? "text-[#63c89b]" : "text-[#bb4430]"}`}
                      >
                        {stock.change > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {stock.change > 0 ? "+" : ""}
                        {stock.change}%
                      </div>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Welcome Message */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-[#1c2730] mb-2">오늘의 자산 현황 입니다.</h2>
            </div>

            {/* Integrated Portfolio Overview Block */}
            <Card className="bg-white border-[#e8e8e8] mb-8 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-[#1c2730] text-xl font-semibold">포트폴리오 현황</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* 총자산 */}
                  <Link href="/portfolio/total" className="group">
                    <div className="p-4 rounded-lg border border-[#e8e8e8] hover:border-[#197bbd] hover:shadow-md transition-all duration-200 cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-medium text-[#8f9098]">총자산</div>
                        <ChevronRight className="h-4 w-4 text-[#8f9098] group-hover:text-[#197bbd] transition-colors" />
                      </div>
                      <div className="text-2xl font-bold text-[#197bbd] group-hover:text-[#1565a0] transition-colors">
                        ${" "}
                        {portfolioData.totalAssets.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </div>
                      <div className="text-xs text-[#8f9098] mt-1">Total Assets</div>
                    </div>
                  </Link>

                  {/* 투자금액 */}
                  <Link href="/portfolio/investment" className="group">
                    <div className="p-4 rounded-lg border border-[#e8e8e8] hover:border-[#197bbd] hover:shadow-md transition-all duration-200 cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-medium text-[#8f9098]">투자금액</div>
                        <ChevronRight className="h-4 w-4 text-[#8f9098] group-hover:text-[#197bbd] transition-colors" />
                      </div>
                      <div className="text-2xl font-bold text-[#197bbd] group-hover:text-[#1565a0] transition-colors">
                        ${" "}
                        {portfolioData.investmentAmount.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </div>
                      <div className="text-xs text-[#8f9098] mt-1">Investment Amount</div>
                    </div>
                  </Link>

                  {/* 평가손익 */}
                  <Link href="/portfolio/profit-loss" className="group">
                    <div className="p-4 rounded-lg border border-[#e8e8e8] hover:border-[#bb4430] hover:shadow-md transition-all duration-200 cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-medium text-[#8f9 করলো98]">평가손익</div>
                        <ChevronRight className="h-4 w-4 text-[#8f9098] group-hover:text-[#bb4430] transition-colors" />
                      </div>
                      <div className="text-2xl font-bold text-[#bb4430] group-hover:text-[#a73d2a] transition-colors flex items-center gap-1">
                        <TrendingUp className="h-5 w-5" />${" "}
                        {portfolioData.profitLoss.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </div>
                      <div className="text-xs text-[#8f9098] mt-1">Profit & Loss</div>
                    </div>
                  </Link>

                  {/* 수익률 */}
                  <Link href="/portfolio/returns" className="group">
                    <div className="p-4 rounded-lg border border-[#e8e8e8] hover:border-[#63c89b] hover:shadow-md transition-all duration-200 cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-medium text-[#8f9098]">수익률</div>
                        <ChevronRight className="h-4 w-4 text-[#8f9098] group-hover:text-[#63c89b] transition-colors" />
                      </div>
                      <div className="text-2xl font-bold text-[#63c89b] group-hover:text-[#4caf50] transition-colors flex items-center gap-1">
                        <TrendingUp className="h-5 w-5" />+{portfolioData.returnRate}%
                      </div>
                      <div className="text-xs text-[#8f9098] mt-1">Return Rate</div>
                    </div>
                  </Link>

                  {/* 제공시드머니 */}
                  <Link href="/portfolio/seed-money" className="group">
                    <div className="p-4 rounded-lg border border-[#e8e8e8] hover:border-[#197bbd] hover:shadow-md transition-all duration-200 cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-medium text-[#8f9098]">제공시드머니</div>
                        <ChevronRight className="h-4 w-4 text-[#8f9098] group-hover:text-[#197bbd] transition-colors" />
                      </div>
                      <div className="text-2xl font-bold text-[#197bbd] group-hover:text-[#1565a0] transition-colors">
                        $ 4,000
                      </div>
                      <div className="text-xs text-[#8f9098] mt-1">Provided Seed Money</div>
                    </div>
                  </Link>

                  {/* 시드머니 문의 */}
                  <Link href="/support/seed-money" className="group">
                    <div className="p-4 rounded-lg border border-[#e8e8e8] hover:border-[#f99f01] hover:shadow-md transition-all duration-200 cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-medium text-[#8f9098]">시드머니 문의</div>
                        <ChevronRight className="h-4 w-4 text-[#8f9098] group-hover:text-[#f99f01] transition-colors" />
                      </div>
                      <div className="text-lg font-semibold text-[#1c2730] group-hover:text-[#f99f01] transition-colors">
                        문의하기
                      </div>
                      <div className="text-xs text-[#8f9098] mt-1">Seed Money Inquiry</div>
                    </div>
                  </Link>
                </div>

                {/* Summary Bar */}
                <div className="mt-6 pt-6 border-t border-[#e8e8e8]">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-xs text-[#8f9098] mb-1">총 투자 비율</div>
                        <div className="text-lg font-semibold text-[#1c2730]">
                          {((portfolioData.investmentAmount / 4000) * 100).toFixed(1)}%
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-[#8f9098] mb-1">가용 자금</div>
                        <div className="text-lg font-semibold text-[#197bbd]">
                          ${" "}
                          {(4000 - portfolioData.investmentAmount).toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-[#63c89b] rounded-full"></div>
                      <span className="text-sm text-[#8f9098]">수익 상태</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Holdings Table */}
            <Card className="bg-white border-[#e8e8e8] mb-6">
              <CardHeader>
                <CardTitle className="text-[#1c2730]">보유종목/상품현황</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#e8e8e8]">
                        <th className="text-left py-3 text-sm font-medium text-[#8f9098]">상품/종목명</th>
                        <th className="text-right py-3 text-sm font-medium text-[#8f9098]">매수금액</th>
                        <th className="text-right py-3 text-sm font-medium text-[#8f9098]">평가금액</th>
                        <th className="text-right py-3 text-sm font-medium text-[#8f9098]">평가손익</th>
                        <th className="text-right py-3 text-sm font-medium text-[#8f9098]">수익률</th>
                      </tr>
                    </thead>
                    <tbody>
                      {holdings.map((holding, index) => (
                        <tr key={index} className="border-b border-[#f5f7f9] hover:bg-[#f5f7f9] transition-colors">
                          <td className="py-4">
                            <Link
                              href={`/holdings/${holding.name}`}
                              className="flex items-center gap-3 hover:text-[#197bbd] transition-colors"
                            >
                              <div className="w-8 h-8 bg-[#f99f01] rounded-full flex items-center justify-center text-white text-sm font-bold">
                                테
                              </div>
                              <span className="font-medium text-[#1c2730]">{holding.name}</span>
                            </Link>
                          </td>
                          <td className="text-right py-4 text-[#1c2730]">${holding.purchasePrice}</td>
                          <td className="text-right py-4 text-[#1c2730]">${holding.currentPrice}</td>
                          <td className="text-right py-4 text-[#63c89b]">+${holding.gain}</td>
                          <td className="text-right py-4 text-[#63c89b]">+{holding.returnRate}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Stock Performance Table */}
            <Card className="bg-white border-[#e8e8e8]">
              <CardHeader>
                <CardTitle className="text-[#1c2730]">주식 거래내역</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#e8e8e8]">
                        <th className="text-left py-3 text-sm font-medium text-[#8f9098]">일자</th>
                        <th className="text-left py-3 text-sm font-medium text-[#8f9098]">상품/종목명</th>
                        <th className="text-right py-3 text-sm font-medium text-[#8f9098]">거래단가</th>
                        <th className="text-right py-3 text-sm font-medium text-[#8f9098]">체결수량</th>
                        <th className="text-right py-3 text-sm font-medium text-[#8f9098]">수익률</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="text-center py-8">
                        <td colSpan={5} className="py-8 text-[#8f9098]">
                          거래 내역이 없습니다.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
