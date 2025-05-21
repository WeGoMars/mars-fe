"use client"

import { useEffect, useState } from "react"
import { getStockChartData } from "@/lib/api"
import type { ChartDataResponse } from "@/lib/types"

interface StockChartProps {
  symbol: string
  period: "일" | "주" | "월" | "분"
}

export default function StockChart({ symbol, period }: StockChartProps) {
  const [chartData, setChartData] = useState<ChartDataResponse | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchChartData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        // 백엔드에 맞게 period 값 변환
        let periodParam = "daily"
        switch (period) {
          case "월":
            periodParam = "monthly"
            break
          case "주":
            periodParam = "weekly"
            break
          case "일":
            periodParam = "daily"
            break
          case "분":
            periodParam = "minutes"
            break
        }

        const data = await getStockChartData(symbol, periodParam)
        setChartData(data)
      } catch (err) {
        setError("차트 데이터를 불러오는 중 오류가 발생했습니다.")
        console.error("Failed to fetch chart data:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchChartData()
  }, [symbol, period])

  if (isLoading) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="text-gray-400">차트 데이터 로딩 중...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    )
  }

  // 실제 차트 구현은 여기에 추가
  // 예: Chart.js, Recharts 등의 라이브러리 사용
  return (
    <div className="h-80 flex items-center justify-center">
      <div className="text-gray-400 text-center">
        <p>차트 영역</p>
        <p className="text-sm">이 부분에 차트를 직접 추가하세요</p>
        <p className="text-xs mt-2">
          {symbol} / {period} 데이터 로드 완료 ({chartData?.prices.length || 0}개 데이터 포인트)
        </p>
      </div>
    </div>
  )
}
