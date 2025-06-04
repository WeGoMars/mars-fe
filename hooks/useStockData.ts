// 주식 데이터를 관리하는 로직을 캡슐화한 파일(주식 목록 관리)
"use client"

import { useState, useEffect } from "react"
import { getStockList } from "@/lib/api"
import type { Stock } from "@/lib/types"

export function useStockData() {
  const [stocks, setStocks] = useState<Stock[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedStock, setSelectedStock] = useState<string>("")

  useEffect(() => {
    const fetchStocks = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await getStockList()
        setStocks(data)
        if (data.length > 0 && !selectedStock) {
          setSelectedStock(data[0].symbol)
        }
      } catch (err) {
        setError("종목 목록을 불러오는 중 오류가 발생했습니다.")
        console.error("Failed to fetch stocks:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStocks()
  }, [])

  const selectStock = (symbol: string) => {
    setSelectedStock(symbol)
  }

  return {
    stocks,
    isLoading,
    error,
    selectedStock,
    selectStock,
  }
}
