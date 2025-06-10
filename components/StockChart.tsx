"use client";

import { useEffect, useRef } from "react";
import type { GetStockChartDataResponse } from "@/lib/types";
import {
  createChart,
  CandlestickSeries,
  HistogramSeries,
  Time,
} from "lightweight-charts";

// 주식 차트를 표시하는 컴포넌트(lightweight-chars 라이브러리 사용)
interface StockChartProps {
  symbol: string; // 종목 심볼
  period: "일" | "주" | "월" | "1시간"; // 차트 기간
  data?: GetStockChartDataResponse[];
}

// 상태 관리
export default function StockChart({ data, symbol, period }: StockChartProps) {
  const mainChartRef = useRef<HTMLDivElement>(null);
  const volumeChartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mainChartRef.current || !volumeChartRef.current || !data || data.length === 0) return;
    if (!data || data.length === 0 || data.some(item =>
      !item.timestamp ||
      item.open == null ||
      item.close == null ||
      item.high == null ||
      item.low == null ||
      item.volume == null
    )) {

    }
    // 메인 차트(캔들)
    const mainChart = createChart(mainChartRef.current, {
      width: mainChartRef.current.clientWidth,
      height: mainChartRef.current.clientHeight,
      layout: {
        background: { color: 'white' },
        textColor: '#333',
      },
      grid: {
        vertLines: { color: '#f0f0f0' },
        horzLines: { color: '#f0f0f0' },
      },
      rightPriceScale: {
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
        borderColor: '#eee',
      },
      leftPriceScale: {
        visible: false,
      },
      timeScale: {
        borderColor: '#eee',
        timeVisible: true,
        secondsVisible: false,
      },
    });

    const candlestickSeries = mainChart.addSeries(CandlestickSeries, {
      upColor: '#26a69a',
      downColor: '#ef5350',
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
      borderVisible: false,
    });

    // 데이터 오름차순 정렬
    const sortedData = [...data].sort((a, b) => a.timestamp.localeCompare(b.timestamp));

    // 데이터 변환 및 설정
    const chartData = sortedData.map(item => ({
      time: Math.floor(new Date(item.timestamp).getTime() / 1000) as Time,
      open: Number(item.open),
      high: Number(item.high),
      low: Number(item.low),
      close: Number(item.close),
    }));

    candlestickSeries.setData(chartData);

    // 거래량 차트
    const volumeChart = createChart(volumeChartRef.current, {
      width: volumeChartRef.current.clientWidth,
      height: 120,
      layout: {
        background: { color: 'white' },
        textColor: '#333',
      },
      grid: {
        vertLines: { color: '#f0f0f0' },
        horzLines: { color: '#f0f0f0' },
      },
      rightPriceScale: {
        scaleMargins: {
          top: 0.2,
          bottom: 0.1,
        },
        borderColor: '#eee',
      },
      leftPriceScale: {
        visible: false,
      },
      timeScale: {
        borderColor: '#eee',
        timeVisible: true,
        secondsVisible: false,
      },
    });

    const volumeSeries = volumeChart.addSeries(HistogramSeries, {
      priceFormat: { type: "volume" },
      color: '#26a69a',
    });

    const volumeData = sortedData.map((item) => ({
      time: Math.floor(new Date(item.timestamp).getTime() / 1000) as Time,
      value: Number(item.volume),
      color: Number(item.close) >= Number(item.open) ? '#26a69a' : '#ef5350',
    }));

    volumeSeries.setData(volumeData);

    // 차트 내용 맞추기
    mainChart.timeScale().fitContent();
    volumeChart.timeScale().fitContent();

    // === x축(시간축) 동기화 ===
    const mainTimeScale = mainChart.timeScale();
    const volumeTimeScale = volumeChart.timeScale();
    let isSyncing = false;

    mainTimeScale.subscribeVisibleLogicalRangeChange((range) => {
      if (isSyncing || !range) return;
      isSyncing = true;
      volumeTimeScale.setVisibleLogicalRange(range);
      isSyncing = false;
    });

    volumeTimeScale.subscribeVisibleLogicalRangeChange((range) => {
      if (isSyncing || !range) return;
      isSyncing = true;
      mainTimeScale.setVisibleLogicalRange(range);
      isSyncing = false;
    });

    // 리사이즈 이벤트
    const handleResize = () => {
      if (!mainChartRef.current || !volumeChartRef.current) return;
      
      mainChart.applyOptions({
        width: mainChartRef.current.clientWidth,
        height: 400,
      });
      volumeChart.applyOptions({
        width: volumeChartRef.current.clientWidth,
        height: 120,
      });
    };

    window.addEventListener("resize", handleResize);

    // cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      mainChart.remove();
      volumeChart.remove();
    };
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-400">차트 데이터를 불러오는 중입니다...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full">
      <span className="ml-2 mb-2 font-semibold text-gray-700">
        {symbol} 차트
      </span>
      <div
        ref={mainChartRef}
        className="w-full h-[400px] relative z-1 m-0 p-0"
      />
      <span className="ml-2 mt-2 font-semibold text-gray-700">
        거래량
      </span>
      <div
        ref={volumeChartRef}
        className="w-full h-[120px] relative z-1 m-0 p-0"
      />
    </div>
  );
}
