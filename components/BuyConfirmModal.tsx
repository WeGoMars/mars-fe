import { X } from "lucide-react";
import { useBuyStockMutation } from "@/lib/api";
import { useGetOverallPortfolioQuery, useGetWalletQuery } from "@/lib/api";

interface BuyConfirmModalProps {
  open: boolean;
  onClose: () => void;
  symbol: string;
  name: string;
  price: number;
  quantity: number;
  fee: number;
  onConfirm?: () => void;
}

export default function BuyConfirmModal({ 
  open, 
  onClose, 
  symbol, 
  name, 
  price, 
  quantity,
  fee,
}: BuyConfirmModalProps) {
  // RTK Query 훅 사용
  const [buyStock, { isLoading, error }] = useBuyStockMutation();
  
  const stockAmount = price * quantity;
  const totalAmount = stockAmount + fee;
  const { refetch: refetchPortfolio } = useGetOverallPortfolioQuery();
  const { refetch: refetchWallet } = useGetWalletQuery();

  const handleConfirmPurchase = async () => {
    try {
      const result = await buyStock({
        symbol,
        quantity,
        price
      }).unwrap();
      
      console.log('매수 성공:', result);
      onClose(); // 성공 시 모달 닫기
      
       refetchPortfolio();
       refetchWallet();
    } catch (err) {
      console.error('매수 실패:', err);
      // 에러는 UI에 표시하고 모달은 열어둠
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 m-4 max-w-sm w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">매수 확인</h3>
          <button onClick={onClose} disabled={isLoading}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stock Info */}
        <div className="space-y-4 mb-6">
          <div className="flex justify-between">
            <span className="text-gray-600">종목</span>
            <span className="font-medium">{symbol} - {name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">가격</span>
            <span className="font-medium">${price.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">수량</span>
            <span className="font-medium">{quantity}주</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">주식 금액</span>
            <span className="font-medium">${stockAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">수수료 (0.25%)</span>
            <span className="font-medium">${fee.toFixed(2)}</span>
          </div>
          <hr />
          <div className="flex justify-between text-lg font-semibold">
            <span>총 결제 금액</span>
            <span className="text-blue-600">${totalAmount.toFixed(2)}</span>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm mb-4">
            매수 중 오류가 발생했습니다. 다시 시도해주세요.
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-3 border border-gray-300 rounded-lg font-medium disabled:opacity-50"
          >
            취소
          </button>
          <button
            onClick={handleConfirmPurchase}
            disabled={isLoading}
            className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium disabled:opacity-50"
          >
            {isLoading ? '매수 중...' : '매수 확정'}
          </button>
        </div>
      </div>
    </div>
  );
}