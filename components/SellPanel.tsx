import { X, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { useSellStockMutation } from "@/lib/api"; // 매도 RTK 훅

interface SellPanelProps {
  open: boolean;
  onClose: () => void;
  symbol: string;
  name: string;
  price: number;
}

export default function SellPanel({ open, onClose, symbol, name, price }: SellPanelProps) {
  const [quantity, setQuantity] = useState(1);
  const [sellStock, { isLoading }] = useSellStockMutation();

  const handleSell = async () => {
    try {
      const body = {
        symbol,
        quantity,
        price,
      };
      await sellStock(body).unwrap();
      alert("매도 주문이 완료되었습니다.");
      onClose(); // 닫기
    } catch (err) {
      console.error("매도 주문 오류:", err);
      alert("매도 주문에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

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
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center border">
            <div className="text-center">
              <div className="text-xs font-semibold">{symbol}</div>
            </div>
          </div>
          <h2 className="text-2xl font-bold">{name}</h2>
        </div>

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

        <button
          onClick={handleSell}
          disabled={isLoading}
          className="w-full py-4 bg-[#b3c6e6] rounded-xl text-center font-medium mt-6"
        >
          {isLoading ? "처리 중..." : "매도"}
        </button>
      </div>
    </div>
  );
}