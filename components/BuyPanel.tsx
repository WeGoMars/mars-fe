import { X, Minus, Plus } from "lucide-react";
import { useEffect } from "react";

// 매수, 매도 슬라이드 컴포넌트
interface BuyPanelProps {
  open: boolean; // 패널 표시 여부
  onClose: () => void; // 패널 닫기 함수
  symbol: string;
  name: string;
  price: number;
}

export default function BuyPanel({ open, onClose, symbol, name, price }: BuyPanelProps) {
  useEffect(() => {
    if (open) {
      console.log('[매수 패널 진입] 선택된 종목:', { symbol, name, price });
    }
  }, [open, symbol, name, price]);

  return (
    <div
      className={`
        bg-white rounded-3xl border border-gray-200 p-6 w-full max-w-md md:max-w-md lg:max-w-md xl:max-w-lg flex flex-col fixed top-0 right-0 h-full z-50 shadow-lg transform transition-transform duration-500 animate-slide-in-right
        ${open ? "translate-x-0" : "translate-x-full"}
      `}
    >
      {/* 매수/매도 영역 */}
      <div className="flex items-center justify-center mb-8 relative">
        <span className="px-8 py-2 rounded-full bg-[#f4f5f9] text-base font-semibold text-center">
          매수
        </span>
        <button onClick={onClose} className="absolute right-0 top-1/2 -translate-y-1/2">
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>
      <div className="bg-white rounded-3xl border border-gray-200 p-6 space-y-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center border border-gray-200">
            <div className="text-center">
              <div className="text-xs font-bold">{symbol}</div>
            </div>
          </div>
          <h2 className="text-xl font-extrabold">{name}</h2>
        </div>
        <p className="text-gray-400 text-center text-base font-semibold">{name}에 투자하여 배당금을 재투자하는 ETF</p>
        <div className="flex items-center justify-between mt-6">
          <div className="font-bold text-base">수량</div>
          <div className="flex items-center gap-4">
            <button className="w-8 h-8 rounded-full bg-[#f4f7fd] flex items-center justify-center text-[#b3c6e6] text-lg font-bold">
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-lg font-bold">1</span>
            <button className="w-8 h-8 rounded-full bg-[#f4f7fd] flex items-center justify-center text-[#b3c6e6] text-lg font-bold">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="text-lg font-extrabold">${price.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</div>
        </div>
        <button
          className="w-full py-4 bg-[#f9e0de] rounded-2xl text-center font-bold text-base text-black mt-6"
          // onClick={() => setShowConfirmModal(true)}
        >
          매수
        </button>
      </div>
    </div>
  );
} 