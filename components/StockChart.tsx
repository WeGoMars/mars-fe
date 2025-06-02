"use client";

import { useEffect, useRef } from "react";
import type { StockChartData } from "@/lib/types";
import {
  createChart,
  CandlestickSeries,
  HistogramSeries,
} from "lightweight-charts";

// 주식 차트를 표시하는 컴포넌트
interface StockChartProps {
  symbol: string; // 종목 심볼
  period: "일" | "주" | "월" | "분"; // 차트 기간
  data?: StockChartData[];
}

// 상태 관리
export default function StockChart({ data, symbol, period }: StockChartProps) {
  


  const mainChartRef = useRef<HTMLDivElement>(null);
  const volumeChartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mainChartRef.current || !volumeChartRef.current) return;

    // 메인 차트(캔들)
    const mainChart = createChart(mainChartRef.current, {
      width: mainChartRef.current.clientWidth,
      height: mainChartRef.current.clientHeight,
      layout: {
        background: { color: "transparent" },
        textColor: "#333",
      },
      grid: {
        vertLines: { color: "#f0f0f0" },
        horzLines: { color: "#f0f0f0" },
      },
      rightPriceScale: {
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
      },
      leftPriceScale: {
        visible: false,
      },
      timeScale: {
        borderColor: "#eee",
      },
    });
    const candlestickSeries = mainChart.addSeries(CandlestickSeries, {
      upColor: "#ff6b6b",
      downColor: "#4dabf7",
      wickUpColor: "#ff6b6b",
      wickDownColor: "#4dabf7",
      borderVisible: false,
    });
    if (!data) return;
    candlestickSeries.setData(
      data.map(item => ({
        time: item.timestamp,
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
      }))
    );

    // 거래량 차트
    const volumeChart = createChart(volumeChartRef.current, {
      width: volumeChartRef.current.clientWidth,
      height: 120,
      layout: {
        background: { color: "transparent" },
        textColor: "#333",
      },
      grid: {
        vertLines: { color: "#f0f0f0" },
        horzLines: { color: "#f0f0f0" },
      },
      rightPriceScale: {
        scaleMargins: {
          top: 0.2,
          bottom: 0.1,
        },
      },
      leftPriceScale: {
        visible: false,
      },
      timeScale: {
        borderColor: "#eee",
      },
    });
    const volumeSeries = volumeChart.addSeries(HistogramSeries, {
      priceFormat: { type: "volume" },
      color: "#888",
    });
    const volumeData = data?.map((item) => ({
      time: item.timestamp,
      value: item.volume,
      color: item.close >= item.open ? "#ff6b6b" : "#4dabf7",
    }));
    volumeSeries.setData(volumeData);

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
      mainChart.applyOptions({
        width: mainChartRef.current?.clientWidth || 0,
        height: 400,
      });
      volumeChart.applyOptions({
        width: volumeChartRef.current?.clientWidth || 0,
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

  if (!data) return <div>차트 데이터가 없습니다.</div>;

  return (
    <div className="flex flex-col w-full h-full">
      <span
        style={{
          marginLeft: 8,
          marginBottom: 2,
          fontWeight: 600,
          color: "#333",
        }}
      >
        차트
      </span>
      {/* 중앙 차트 거래량 안보일 때 차트 높이 조절 코드 */}
      <div
        ref={mainChartRef}
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          zIndex: 1,
          margin: 0,
          marginTop: 0,
          marginBottom: 0,
          padding: 0,
        }}
      />
      <span
        style={{ marginLeft: 8, marginTop: 2, fontWeight: 600, color: "#333" }}
      >
        거래량
      </span>
      <div
        ref={volumeChartRef}
        style={{
          width: "100%",
          height: "120px",
          position: "relative",
          zIndex: 1,
          margin: 0,
          marginTop: 0,
          marginBottom: 0,
          padding: 0,
        }}
      />
    </div>
  );
}
