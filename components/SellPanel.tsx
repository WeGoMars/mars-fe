import { X, Minus, Plus } from "lucide-react";
import { useEffect } from "react";

interface SellPanelProps {
  open: boolean;
  onClose: () => void;
  symbol: string;
  name: string;
  price: number;
  totalAssets: number;
  cashAsset: number;
  seedMoney: number;
  investmentAmount: number;
  profitLoss: number;
}

export default function SellPanel({ open, onClose, symbol, name, price, totalAssets, cashAsset, seedMoney, investmentAmount, profitLoss }: SellPanelProps) {
  useEffect(() => {
    if (open) {
      console.log('[매도 패널 진입] 선택된 종목:', { symbol, name, price });
    }
  }, [open, symbol, name, price]);

  return (
    <div
      className={`
        fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-lg
        transition-transform duration-300
        ${open ? "translate-x-0" : "translate-x-full"}
      `}
    >
      <div className="p-4 flex justify-between items-center">
        <div className="w-8"></div>
        <div className="text-center font-medium text-lg bg-[#f4f5f9] px-8 py-2 rounded-full mx-4">매도</div>
        <button onClick={onClose}>
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="p-6 space-y-6">
        {/* 종목 정보 */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center border">
            <div className="text-center">
              <div className="text-xs font-semibold">{symbol}</div>
            </div>
          </div>
          <h2 className="text-2xl font-bold">{name}</h2>
        </div>
        {/* 수량 선택 */}
        <div className="flex justify-between items-center mt-8">
          <div className="font-medium">수량</div>
          <div className="flex items-center gap-4">
            <button className="w-8 h-8 rounded-full bg-[#eaf2ff] flex items-center justify-center text-[#006ffd]">
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-xl font-medium">1</span>
            <button className="w-8 h-8 rounded-full bg-[#eaf2ff] flex items-center justify-center text-[#006ffd]">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="text-xl font-semibold">${price.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</div>
        </div>
        {/* 매도 버튼 */}
        <button className="w-full py-4 bg-[#b3c6e6] rounded-xl text-center font-medium mt-6">매도</button>
      </div>
      {/* 내 계좌 영역 */}
      <div>
        <div className="flex justify-center mb-6">
          <span className="px-8 py-2 rounded-full bg-[#f4f5f9] text-base font-semibold text-center">내 계좌</span>
        </div>
        <div className="bg-white rounded-3xl border border-gray-200 p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div className="font-bold text-base">총자산</div>
            <div>
              <span className="text-[#006ffd] text-xs mr-1">$</span>
              <span className="text-[#006ffd] text-xl font-bold">{totalAssets.toFixed(2)}</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="font-bold text-base">현금자산</div>
            <div>
              <span className="text-xs mr-1">$</span>
              <span className="text-xl font-bold">{cashAsset.toFixed(2)}</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="font-bold text-base">시드머니</div>
            <div>
              <span className="text-[#006ffd] text-xs mr-1">$</span>
              <span className="text-[#006ffd] text-xl font-bold">{seedMoney.toFixed(2)}</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="font-bold text-base">투자금액</div>
            <div>
              <span className="text-[#439a86] text-xs mr-1">$</span>
              <span className="text-[#439a86] text-xl font-bold">{investmentAmount.toFixed(2)}</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="font-bold text-base">평가손익</div>
            <div className="flex items-center">
              <span
                className={`text-xs mr-1 ${profitLoss >= 0 ? "text-[#e74c3c]" : "text-[#3498db]"}`}
              >
                $
              </span>
              <span
                className={`text-xl font-bold ${profitLoss >= 0 ? "text-[#e74c3c]" : "text-[#3498db]"}`}
              >
                {profitLoss >= 0 ? "+" : "-"}
                {Math.abs(profitLoss).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 