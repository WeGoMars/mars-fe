"use client";

import { useEffect, useRef, useState } from "react";
import { getStockChartData } from "@/lib/api";
import type { ChartDataResponse } from "@/lib/types";
import {
  createChart,
  CandlestickSeries,
  HistogramSeries,
} from "lightweight-charts";

interface StockChartProps {
  symbol: string;
  period: "일" | "주" | "월" | "분";
}

export default function StockChart({ symbol, period }: StockChartProps) {
  const [chartData, setChartData] = useState<ChartDataResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const mainChartRef = useRef<HTMLDivElement>(null);
  const volumeChartRef = useRef<HTMLDivElement>(null);

  // 캔들차트용 목데이터(API 나오면 대체)
  const mockData = Array.from({ length: 50 }, (_, i) => {
    const base = 210 + i * 2;
    const day = (i % 30) + 1;
    const month = i < 30 ? "06" : "07";
    return {
      time: `2024-${month}-${day.toString().padStart(2, "0")}`,
      open: base,
      high: base + 5,
      low: base - 2,
      close: base + Math.floor(Math.random() * 6) - 3,
      volume: 10 + Math.floor(Math.random() * 40),
    };
  });

  useEffect(() => {
    const fetchChartData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // 백엔드에 맞게 period 값 변환
        let periodParam = "daily";
        switch (period) {
          case "월":
            periodParam = "monthly";
            break;
          case "주":
            periodParam = "weekly";
            break;
          case "일":
            periodParam = "daily";
            break;
          case "분":
            periodParam = "minutes";
            break;
        }

        const data = await getStockChartData(symbol, periodParam);
        setChartData(data);
      } catch (err) {
        setError("차트 데이터를 불러오는 중 오류가 발생했습니다.");
        console.error("Failed to fetch chart data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChartData();
  }, [symbol, period]);

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
    candlestickSeries.setData(mockData);

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
    const volumeData = mockData.map((item) => ({
      time: item.time,
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
  }, [mockData]);

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
