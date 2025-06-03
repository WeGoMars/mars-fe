"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"

interface PortfolioData {
  totalAssets: number
  investmentAmount: number
  profitLoss: number
  returnRate: number
  seedMoney: number
}

export default function PortfolioOverview({ data }: { data: PortfolioData }) {
  const availableCash = 4000 - data.investmentAmount
  const currentCash = data.seedMoney - data.investmentAmount

  return (
    <Card className="bg-white border-[#e8e8e8] mb-8 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-[#1c2730] text-xl font-semibold">포트폴리오 현황</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 총자산 */}
          <InfoCard title="총자산" value={data.totalAssets} color="#197bbd" subtitle="Total Assets" />

          {/* 투자금액 */}
          <InfoCard title="투자금액" value={data.investmentAmount} subtitle="Investment Amount" />

          {/* 평가손익 */}
          <InfoCard
            title="평가손익"
            value={data.profitLoss}
            subtitle="Profit & Loss"
            color={data.profitLoss >= 0 ? "#e74c3c" : "#3498db"}
          />

          {/* 수익률 */}
          <div className="p-4 rounded-lg border border-[#e8e8e8] hover:border-[#63c89b] hover:shadow-md transition-all duration-200 cursor-pointer">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-[#8f9098]">수익률</div>
            </div>
            <div
              className={`text-2xl font-bold transition-colors flex items-center gap-1 
                ${data.returnRate >= 0 
                  ? "text-[#e74c3c] group-hover:text-[#4caf50]" 
                  : "text-[#3498db] group-hover:text-[#a73d2a]"}
              `}
            >
              {data.returnRate >= 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
              {data.returnRate >= 0 ? "+" : "-"}
              {Math.abs(data.returnRate).toFixed(2)}%
            </div>
            <div className="text-xs text-[#8f9098] mt-1">Return Rate</div>
          </div>

          {/* 제공시드머니 */}
          <InfoCard title="제공시드머니" value={data.seedMoney} color="#197bbd" subtitle="Provided Seed Money" />

          {/* 시드머니 문의 */}
          <div className="p-4 rounded-lg border border-[#e8e8e8] hover:border-[#f99f01] hover:shadow-md transition-all duration-200 cursor-pointer">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-[#8f9098]">시드머니 문의</div>
            </div>
            <div className="text-lg font-semibold text-[#1c2730] group-hover:text-[#f99f01] transition-colors">
              챗봇에게 문의하기
            </div>
            <div className="text-xs text-[#8f9098] mt-1">Seed Money Inquiry</div>
          </div>
        </div>

        {/* Summary Bar */}
        <div className="mt-6 pt-6 border-t border-[#e8e8e8]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-6">
              <SummaryBox label="총 투자 비율" value={`${((data.investmentAmount / 4000) * 100).toFixed(1)}%`} />
              <SummaryBox label="현금 자산" value={`$${currentCash.toFixed(2)}`} />
            </div>
            
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function InfoCard({
  title,
  value,
  subtitle,
  color = "#1c2730",
}: {
  title: string
  value: number
  subtitle: string
  color?: string
}) {
  return (
    <div className="p-4 rounded-lg border border-[#e8e8e8] hover:shadow-md transition-all duration-200 cursor-pointer hover:border-[#197bbd]">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium text-[#8f9098]">{title}</div>
      </div>
      <div className="text-2xl font-bold transition-colors" style={{ color }}>
        ${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </div>
      <div className="text-xs text-[#8f9098] mt-1">{subtitle}</div>
    </div>
  )
}

function SummaryBox({
  label,
  value,
  color = "#1c2730",
}: {
  label: string
  value: string
  color?: string
}) {
  return (
    <div className="text-center">
      <div className="text-xs text-[#8f9098] mb-1">{label}</div>
      <div className="text-lg font-semibold" style={{ color }}>{value}</div>
    </div>
  )
}