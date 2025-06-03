import { X, Minus, Plus } from "lucide-react";

interface BuyPanelProps {
  open: boolean; // 패널 표시 여부
  onClose: () => void; // 패널 닫기 함수
}

export default function BuyPanel({ open, onClose }: BuyPanelProps) {
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
        <div className="text-center font-medium text-lg bg-[#f4f5f9] px-8 py-2 rounded-full mx-4">매수</div>
        <button onClick={onClose}>
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="p-6 space-y-6">
        {/* S&P Info */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center border">
            <div className="text-center">
              <div className="text-xs font-semibold">S&P</div>
              <div className="text-xs">500</div>
            </div>
          </div>
          <h2 className="text-2xl font-bold">S&P 500</h2>
        </div>
        {/* Description */}
        <p className="text-gray-500 text-center">S&P 500에 투자하여 배당금을 재투자하는 ETF</p>
        {/* Quantity Selector */}
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
          <div className="text-xl font-semibold">$ 12.00</div>
        </div>
        {/* Purchase Button */}
        <button className="w-full py-4 bg-[#f9e0de] rounded-xl text-center font-medium mt-6">구매</button>
      </div>
    </div>
  );
} 