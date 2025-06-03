"use client"

import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface Holding {
  name: string
  purchasePrice: number
  currentPrice: number
  Quantity: number
  gain: number
  returnRate: number
}

export default function HoldingsTable({ holdings }: { holdings: Holding[] }) {
  return (
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
                <th className="text-right py-3 text-sm font-medium text-[#8f9098]">보유수량</th>
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
                        {/* 로고나 심볼 대신 첫 글자 등 가능 */}
                        {holding.name.charAt(0)}
                      </div>
                      <span className="font-medium text-[#1c2730]">{holding.name}</span>
                    </Link>
                  </td>
                  <td className="text-right py-4 text-[#1c2730]">${holding.purchasePrice}</td>
                  <td className="text-right py-4 text-[#63c89b]">{holding.Quantity}</td>
                  <td className="text-right py-4 text-[#1c2730]">${holding.currentPrice}</td>
                  <td className="text-right py-4 text-[#63c89b]">
                    {holding.gain >= 0 ? "+" : "-"}${Math.abs(holding.gain)}
                  </td>
                  <td className="text-right py-4 text-[#63c89b]">
                    {holding.returnRate >= 0 ? "+" : "-"}{Math.abs(holding.returnRate)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}