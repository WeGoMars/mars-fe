// const investmentAmount = 1500.5;
// const profitLoss = 350.6;
// const seedMoney = 2000; 

// const mockPortfolio = {
//   totalAssets: investmentAmount+profitLoss,   //총자산
//   investmentAmount: 1500.5,   //투자금액
//   profitLoss: 350.6,     //평가손익
//   returnRate: parseFloat(((profitLoss / investmentAmount) * 100).toFixed(2)), //수익률
//   seedMoney,    //시드머니
// };

// export default mockPortfolio;
// lib/mock/mockportfolio.ts

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
const mockPortfolio = createMockPortfolio(1000,-120.5, 2000);

export default mockPortfolio;