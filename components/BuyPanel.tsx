import { X, Minus, Plus } from "lucide-react";
import { useState } from "react";

interface BuyPanelProps {
  open: boolean;
  onClose: () => void;
  symbol: string;
  name: string;
  price: number;
  onConfirm: (quantity: number) => void; // 확인 버튼 클릭 시 호출될 함수
}

export default function BuyPanel({ open, onClose, symbol, name, price, onConfirm }: BuyPanelProps) {
  const [quantity, setQuantity] = useState(1);

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleProceedToConfirm = () => {
    onConfirm(quantity); // 모달 띄우기 위해 quantity 전달
  };

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
        {/* Symbol Info */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center border">
            <div className="text-center">
              <div className="text-xs font-semibold">{symbol}</div>
            </div>
          </div>
          <h2 className="text-2xl font-bold">{name}</h2>
        </div>

        {/* Quantity Selector */}
        <div className="flex justify-between items-center mt-8">
          <div className="font-medium">수량</div>
          <div className="flex items-center gap-4">
            <button
              className="w-8 h-8 rounded-full bg-[#eaf2ff] flex items-center justify-center text-[#006ffd]"
              onClick={decreaseQuantity}
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-xl font-medium">{quantity}</span>
            <button
              className="w-8 h-8 rounded-full bg-[#eaf2ff] flex items-center justify-center text-[#006ffd]"
              onClick={increaseQuantity}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="text-xl font-semibold">${(price * quantity).toFixed(2)}</div>
        </div>

        {/* Next Step Button */}
        <button
          onClick={handleProceedToConfirm}
          className="w-full py-4 bg-[#f9e0de] rounded-xl text-center font-medium mt-6"
        >
          다음
        </button>
      </div>
    </div>
  );
}