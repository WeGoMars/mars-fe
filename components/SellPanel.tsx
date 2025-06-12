import { X, Minus, Plus } from "lucide-react";
import { useEffect, useState } from "react";

interface SellPanelProps {
  open: boolean;
  onClose: () => void;
  symbol: string;
  name: string;
  price: number;
   // 포트폴리오 데이터들
  totalAssets: number;
  investmentAmount: number;
  profitLoss: number;
  returnRate: number;
  cyberDollar: number;
  onSellClick: (params: { symbol: string; name: string; price: number; quantity: number; fee: number; total: number }) => void;
}

export default function SellPanel({ open, onClose, symbol, name, price, totalAssets, cyberDollar, returnRate, investmentAmount, profitLoss, onSellClick }: SellPanelProps) {
  const [quantity, setQuantity] = useState(1);
  useEffect(() => {
    if (open) {
      console.log('[매도 패널 진입] 선택된 종목:', { symbol, name, price });
    }
  }, [open, symbol, name, price]);

  // 수수료 예시: 0.5% (원하는 비율로 조정)
  const fee = Math.round(price * quantity * 0.005 * 100) / 100;
  const total = Math.round((price * quantity - fee) * 100) / 100;

  return (
    <div
      className={`
        bg-white rounded-3xl border border-gray-200 p-6 w-full max-w-md md:max-w-md lg:max-w-md xl:max-w-lg flex flex-col fixed top-0 right-0 h-full z-50 shadow-lg transform transition-transform duration-500 animate-slide-in-right
        ${open ? "translate-x-0" : "translate-x-full"}
      `}
    >
      {/* 매도 영역 */}
      <div className="flex items-center justify-center mb-8 relative">
        <span className="px-8 py-2 rounded-full bg-[#f4f5f9] text-base font-semibold text-center">
          매도
        </span>
        <button onClick={onClose} className="absolute right-0 top-1/2 -translate-y-1/2">
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>
      <div className="bg-white rounded-3xl border border-gray-200 p-6 space-y-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center border border-gray-200 overflow-hidden">
            <img
              src={`/logos/${symbol}.png`}
              alt={symbol}
              className="w-10 h-10 object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  const fallback = document.createElement('div');
                  fallback.className = 'w-14 h-14 flex items-center justify-center';
                  fallback.innerHTML = `<span class='text-xs font-bold'>${symbol}</span>`;
                  parent.appendChild(fallback);
                }
              }}
            />
          </div>
          <h2 className="text-xl font-extrabold">{name}</h2>
        </div>
        <div className="flex items-center justify-between mt-6">
          <div className="font-bold text-base">수량</div>
          <div className="flex items-center gap-4">
            <button className="w-8 h-8 rounded-full bg-[#f4f7fd] flex items-center justify-center text-[#b3c6e6] text-lg font-bold" onClick={() => setQuantity(q => Math.max(1, q - 1))}>
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-lg font-bold">{quantity}</span>
            <button className="w-8 h-8 rounded-full bg-[#f4f7fd] flex items-center justify-center text-[#b3c6e6] text-lg font-bold" onClick={() => setQuantity(q => q + 1)}>
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="text-lg font-extrabold">${price.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</div>
        </div>
        <button
          className="w-full py-4 bg-[#b3c6e6] rounded-2xl text-center font-bold text-base text-black mt-6"
          onClick={() => onSellClick({ symbol, name, price, quantity, fee, total })}
        >
          매도
        </button>
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
            <div className="font-bold text-base">수익률</div>
            <div>
              <span className="text-xs mr-1">$</span>
              <span className="text-xl font-bold">{returnRate.toFixed(2)}%</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="font-bold text-base">시드머니</div>
            <div>
              <span className="text-[#006ffd] text-xs mr-1">$</span>
              <span className="text-[#006ffd] text-xl font-bold">{cyberDollar.toFixed(2)}</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="font-bold text-base">투자금액</div>
            <div>
              <span className="text-[#006ffd] text-xs mr-1">$</span>
              <span className="text-[#006ffd] text-xl font-bold">{investmentAmount.toFixed(2)}</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="font-bold text-base">평가손익</div>
            <div className="flex items-center">
              <span
                className={`text-xs mr-1 ${profitLoss >= 0 ? "text-[#439a86]" : "text-[#e74c3c]"}`}
              >
                $
              </span>
              <span
                className={`text-xl font-bold ${profitLoss >= 0 ? "text-[#439a86]" : "text-[#e74c3c]"}`}
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