"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface TradeHistory {
  date: string
  name: string
  price: number
  quantity: number
  returnRate: number
}

export default function TradeHistoryTable({ trades }: { trades: TradeHistory[] }) {
  return (
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
              {trades.length === 0 ? (
                <tr className="text-center py-8">
                  <td colSpan={5} className="py-8 text-[#8f9098]">
                    거래 내역이 없습니다.
                  </td>
                </tr>
              ) : (
                trades.map((trade, index) => (
                  <tr key={index} className="border-b border-[#f5f7f9] hover:bg-[#f5f7f9] transition-colors">
                    <td className="py-4 text-left">{trade.date}</td>
                    <td className="py-4 text-left">{trade.name}</td>
                    <td className="py-4 text-right">${trade.price.toFixed(2)}</td>
                    <td className="py-4 text-right">{trade.quantity}</td>
                    <td className="py-4 text-right">
                      {trade.returnRate >= 0 ? "+" : "-"}
                      {Math.abs(trade.returnRate)}%
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}