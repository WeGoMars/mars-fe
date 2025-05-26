'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { getStockDetails, getStockNews } from '@/lib/api';
import type { StockDetails as StockDetailsType, NewsItem } from '@/lib/types';

interface StockDetailsProps {
  symbol: string;
  activeTab: '종목정보 상세' | '내 계좌' | 'AI 추천';
  onTabChange: (tab: '종목정보 상세' | '내 계좌' | 'AI 추천') => void;
}

export default function StockDetails({ symbol, activeTab, onTabChange }: StockDetailsProps) {
  const [details, setDetails] = useState<StockDetailsType | null>(null);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const detailsData = await getStockDetails(symbol);
        setDetails(detailsData);

        const newsData = await getStockNews(symbol);
        setNews(newsData);
      } catch (err) {
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
        console.error('Failed to fetch stock details:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [symbol]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-gray-400">데이터 로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  const handleTabClick = (tab: '종목정보 상세' | '내 계좌' | 'AI 추천') => {
    console.log('Tab clicked:', tab);
    onTabChange(tab);
  };

  return (
    <div className="flex-1 overflow-auto flex flex-col">
      {/* 종목정보 상세, 내 계좌, AI 추천 탭 */}
      <div className="flex justify-between gap-1 md:gap-2 mb-4 overflow-x-auto">
        {(['종목정보 상세', '내 계좌', 'AI 추천'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabClick(tab)}
            className={`px-2 md:px-4 py-2 rounded-xl font-medium text-xs md:text-sm whitespace-nowrap transition-colors ${
              activeTab === tab ? 'bg-[#f5f7f9]' : 'bg-[#f5f7f9] hover:bg-gray-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === '내 계좌' ? (
        <div className="flex-1 flex flex-col mt-12">
          {/* Financial Information */}
          <div className="space-y-8">
            {/* Total Assets */}
            <div className="flex justify-between py-3 md:py-5 px-3 md:px-4 border rounded-full">
              <span className="text-sm text-gray-500">총자산</span>
              <div>
                <span className="text-[#197bbd] text-xs mr-1">$</span>
                <span className="text-[#197bbd] text-sm font-medium">2850.75</span>
              </div>
            </div>

            {/* Investment Amount */}
            <div className="flex justify-between py-3 md:py-5 px-3 md:px-4 border rounded-full">
              <span className="text-sm text-gray-500">투자금액</span>
              <div>
                <span className="text-[#439a86] text-xs mr-1">$</span>
                <span className="text-[#439a86] text-sm font-medium">1500.50</span>
              </div>
            </div>

            {/* Unrealized P&L */}
            <div className="flex justify-between py-3 md:py-5 px-3 md:px-4 border rounded-full">
              <span className="text-sm text-gray-500">평가손익</span>
              <div className="flex items-center">
                <span className="text-[#bb4430] text-xs mr-1">$</span>
                <span className="text-[#bb4430] text-sm font-medium">350.60</span>
                <span className="text-[#bb4430] ml-2 text-xs">+5.5%</span>
              </div>
            </div>

            {/* Return Rate */}
            <div className="flex justify-between py-3 md:py-5 px-3 md:px-4 border rounded-full">
              <span className="text-sm text-gray-500">수익률</span>
              <span className="text-sm font-medium">+5.5%</span>
            </div>
          </div>
        </div>
      ) : activeTab === 'AI 추천' ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-400 text-center">
            <p>AI 추천 정보</p>
            <p className="text-sm">준비 중입니다</p>
          </div>
        </div>
      ) : (
        details && (
          <>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="bg-gray-200 w-8 h-8 flex items-center justify-center rounded text-xs">
                  <span className="text-[10px]">{symbol.substring(0, 2)}</span>
                  <span className="text-[10px]">{symbol.substring(2, 4)}</span>
                </div>
                <h3 className="text-lg md:text-xl font-bold">{details.name}</h3>
              </div>
              <div>
                <div className="font-bold text-right">{details.price}</div>
                <div
                  className={`text-xs text-right ${details.change.startsWith('+') ? 'text-[#41c3a9]' : 'text-red-500'}`}
                >
                  {details.change.startsWith('+') ? '↑' : '↓'} {details.changePercent}
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-500 mb-4">{details.description}</div>

            {/* Stock Details */}
            <div className="space-y-3 mb-4">
              <div className="flex justify-between py-2 md:py-3 px-3 md:px-4 border rounded-full">
                <span className="text-sm text-gray-500">시가총액</span>
                <span className="text-sm font-medium">{details.marketCap}</span>
              </div>
              <div className="flex justify-between py-2 md:py-3 px-3 md:px-4 border rounded-full">
                <span className="text-sm text-gray-500">운용사</span>
                <span className="text-sm font-medium">{details.company}</span>
              </div>
              <div className="flex justify-between py-2 md:py-3 px-3 md:px-4 border rounded-full">
                <span className="text-sm text-gray-500">상장일</span>
                <span className="text-sm font-medium">{details.listingDate}</span>
              </div>
              <div className="flex justify-between py-2 md:py-3 px-3 md:px-4 border rounded-full">
                <span className="text-sm text-gray-500">운용자산</span>
                <span className="text-sm font-medium">{details.assets}</span>
              </div>
              <div className="flex justify-between py-2 md:py-3 px-3 md:px-4 border rounded-full">
                <span className="text-sm text-gray-500">발행주수</span>
                <span className="text-sm font-medium">{details.shares}</span>
              </div>
            </div>

            {/* News */}
            <div className="mt-4 flex-1 flex flex-col">
              <div className="py-2 md:py-2.5 px-3 md:px-4 bg-[#f5f7f9] rounded-full mb-3">
                <h3 className="font-medium text-sm">주요 뉴스</h3>
              </div>
              <div className="space-y-5 flex-1">
                {news.length > 0 ? (
                  news.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-14 h-14 md:w-16 md:h-16 bg-[#f5f7f9] rounded-xl flex items-center justify-center">
                        <Image
                          src={
                            item.imageUrl ||
                            '/placeholder.svg?height=56&width=56&query=financial news'
                          }
                          alt="뉴스 이미지"
                          width={56}
                          height={56}
                          className="md:w-16 md:h-16 rounded-xl object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="text-xs md:text-sm font-medium">{item.title}</h4>
                        <div className="text-xs text-gray-500 mt-1">
                          {item.time} / {item.source}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-400 py-4">뉴스가 없습니다</div>
                )}
              </div>
            </div>
          </>
        )
      )}
    </div>
  );
}
