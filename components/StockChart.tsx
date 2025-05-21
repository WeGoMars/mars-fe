'use client';

import { useEffect, useRef, useState } from 'react';
import { getStockChartData } from '@/lib/api';
import type { ChartDataResponse } from '@/lib/types';
import { createChart, CandlestickSeries } from 'lightweight-charts';

interface StockChartProps {
  symbol: string;
  period: '일' | '주' | '월' | '분';
}

export default function StockChart({ symbol, period }: StockChartProps) {
  const [chartData, setChartData] = useState<ChartDataResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const chartContainerRef = useRef<HTMLDivElement>(null);

  // 캔들차트용 목데이터
  const mockData = [
    { time: '2024-06-01', open: 210, high: 215, low: 208, close: 213 },
    { time: '2024-06-02', open: 213, high: 218, low: 212, close: 217 },
    { time: '2024-06-03', open: 217, high: 220, low: 215, close: 218 },
    { time: '2024-06-04', open: 218, high: 222, low: 216, close: 221 },
    { time: '2024-06-05', open: 221, high: 225, low: 220, close: 224 },
    { time: '2024-06-06', open: 224, high: 228, low: 223, close: 227 },
    { time: '2024-06-07', open: 227, high: 230, low: 225, close: 229 },
  ];

  useEffect(() => {
    const fetchChartData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // 백엔드에 맞게 period 값 변환
        let periodParam = 'daily';
        switch (period) {
          case '월':
            periodParam = 'monthly';
            break;
          case '주':
            periodParam = 'weekly';
            break;
          case '일':
            periodParam = 'daily';
            break;
          case '분':
            periodParam = 'minutes';
            break;
        }

        const data = await getStockChartData(symbol, periodParam);
        setChartData(data);
      } catch (err) {
        setError('차트 데이터를 불러오는 중 오류가 발생했습니다.');
        console.error('Failed to fetch chart data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChartData();
  }, [symbol, period]);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const container = chartContainerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Lightweight Chart 생성
    const chart = createChart(container, {
      width: width,
      height: height,
      layout: {
        background: { color: '#ffffff' },
        textColor: '#333',
      },
      grid: {
        vertLines: { color: '#f0f0f0' },
        horzLines: { color: '#f0f0f0' },
      },
    });

    const candlestickSeries = chart.addSeries(CandlestickSeries);
    candlestickSeries.setData(mockData);

    // 스타일 설정
    candlestickSeries.applyOptions({
      upColor: '#41c3a9',
      downColor: '#ff6b6b',
      wickUpColor: '#41c3a9',
      wickDownColor: '#ff6b6b',
      borderVisible: false,
    });

    // 차트 크기 조정 이벤트 리스너
    const handleResize = () => {
      chart.applyOptions({
        width: container.clientWidth,
        height: container.clientHeight,
      });
    };

    window.addEventListener('resize', handleResize);

    // cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [mockData]); // mockData가 변경될 때마다 차트 다시 그리기

  if (isLoading) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="text-gray-400">차트 데이터 로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div
      ref={chartContainerRef}
      style={{
        width: '100%',
        height: '100%',
        minHeight: '400px',
        position: 'relative',
        zIndex: 1,
      }}
    />
  );
}
