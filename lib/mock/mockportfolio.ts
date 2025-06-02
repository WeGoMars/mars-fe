
export type PortfolioData = {
  totalAssets: number;
  investmentAmount: number;
  profitLoss: number;
  returnRate: number;
  seedMoney: number;
};

// 계산 로직을 함수로 관리
export function createMockPortfolio(
  investmentAmount: number,
  profitLoss: number,
  seedMoney: number
): PortfolioData {
  const totalAssets = investmentAmount + profitLoss;
  const returnRate = parseFloat(((profitLoss / investmentAmount) * 100).toFixed(2));

  return {
    investmentAmount,
    profitLoss,
    totalAssets,
    returnRate,
    seedMoney,
  };
}

// 기본 mock 데이터
const mockPortfolio = createMockPortfolio(1000,120.5, 1550);

export default mockPortfolio;