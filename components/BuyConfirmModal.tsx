import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

// 매수, 매도 모달 컴포넌트
interface BuyConfirmModalProps {
  open: boolean; // 모달 표시 여부
  onClose: () => void; // 모달 닫기 함수
  onConfirm: () => void; // 매수 확인 함수
  symbol: string;
  name: string;
  price: number;
  quantity: number;
  fee: number;
  total: number;
}

export default function BuyConfirmModal({ open, onClose, onConfirm, symbol, name, price, quantity, fee, total }: BuyConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="w-[400px] h-[400px] bg-gray-100 p-4 mx-auto rounded-3xl">

        {/* 매수 클릭 시 "1주당 희망 가격..." 모달 창 */}
        {/* Header - 분리된 회색 박스 */}
        <div className="bg-[#eeeeee] rounded-3xl px-6 py-6 text-center mb-4">
          <div className="flex items-center justify-center gap-3">
            <div className="bg-white rounded-lg px-3 py-2">
              {/* 로고 */}
              <img
                src={`/logos/${symbol}.png`}
                alt={symbol}
                className="w-8 h-8 object-contain mx-auto"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    const fallback = document.createElement('div');
                    fallback.className = 'w-8 h-8 flex items-center justify-center';
                    fallback.innerHTML = `<span class='text-xs font-bold'>${symbol}</span>`;
                    parent.appendChild(fallback);
                  }
                }}
              />
            </div>
            <h1 className="text-2xl font-bold text-[#2f3036]">{name}</h1>
          </div>
        </div>

        {/* 메인 흰색 컨테이너 박스 - 버튼까지 포함 */}
        <div className="bg-white rounded-3xl px-4 py-4 flex-1">
          {/* Content Cards */}
          <div className="space-y-3">
            {/* Target Price Per Share */}
            <Card className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
              <div className="flex justify-between items-center">
                <span className="text-[#8f9098] font-medium text-sm">1주당 희망 가격</span>
                <span className="text-[#2f3036] font-semibold">${price.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</span>
              </div>
            </Card>

            {/* Expected Commission */}
            <Card className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
              <div className="flex justify-between items-center">
                <span className="text-[#8f9098] font-medium text-sm">예상 수수료</span>
                <span className="text-[#2f3036] font-semibold">${fee.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</span>
              </div>
            </Card>

            {/* Total Order Amount */}
            <Card className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
              <div className="flex justify-between items-center">
                <span className="text-[#8f9098] font-medium text-sm">총 주문 금액</span>
                <span className="text-[#2f3036] font-semibold">${total.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</span>
              </div>
            </Card>
          </div>

          {/* Bottom Buttons */}
          <div className="mt-4">
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-[1.2] bg-[#f4f5f9] border-0 text-[#8f9098] font-medium py-4 rounded-2xl hover:bg-[#eeeeee]"
                onClick={onClose}
              >
                취소
              </Button>
              <Button
                className="flex-1 bg-[#f4f5f9] border-0 text-[#2f3036] font-medium py-4 rounded-2xl hover:bg-[#eeeeee]"
                variant="outline"
                onClick={onConfirm}
              >
                확인
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 