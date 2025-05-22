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

  const chartContainerRef = useRef<HTMLDivElement>(null);
  const volumeContainerRef = useRef<HTMLDivElement>(null);

  // 캔들차트용 목데이터(API 나오면 대체)
  const mockData = [
    {
      time: "2024-06-01",
      open: 210,
      high: 215,
      low: 208,
      close: 213,
      volume: 1000,
    },
    {
      time: "2024-06-02",
      open: 213,
      high: 218,
      low: 212,
      close: 217,
      volume: 1200,
    },
    {
      time: "2024-06-03",
      open: 217,
      high: 220,
      low: 215,
      close: 218,
      volume: 1500,
    },
    {
      time: "2024-06-04",
      open: 218,
      high: 222,
      low: 216,
      close: 221,
      volume: 1300,
    },
    {
      time: "2024-06-05",
      open: 221,
      high: 225,
      low: 220,
      close: 224,
      volume: 1400,
    },
    {
      time: "2024-06-06",
      open: 224,
      high: 228,
      low: 223,
      close: 227,
      volume: 1600,
    },
    {
      time: "2024-06-07",
      open: 227,
      high: 230,
      low: 225,
      close: 229,
      volume: 1700,
    },
    {
      time: "2024-06-08",
      open: 227,
      high: 230,
      low: 225,
      close: 229,
      volume: 1800,
    },
    {
      time: "2024-06-09",
      open: 227,
      high: 230,
      low: 225,
      close: 229,
      volume: 1900,
    },
    {
      time: "2024-06-10",
      open: 227,
      high: 230,
      low: 225,
      close: 229,
      volume: 2000,
    },
    {
      time: "2024-06-11",
      open: 227,
      high: 230,
      low: 225,
      close: 229,
      volume: 2100,
    },
    {
      time: "2024-06-12",
      open: 227,
      high: 230,
      low: 225,
      close: 229,
      volume: 2200,
    },
    {
      time: "2024-06-13",
      open: 227,
      high: 230,
      low: 225,
      close: 229,
      volume: 2300,
    },
    {
      time: "2024-06-14",
      open: 227,
      high: 230,
      low: 225,
      close: 229,
      volume: 2400,
    },
    {
      time: "2024-06-15",
      open: 227,
      high: 230,
      low: 225,
      close: 229,
      volume: 2500,
    },
    {
      time: "2024-06-16",
      open: 227,
      high: 230,
      low: 225,
      close: 229,
      volume: 2600,
    },
    {
      time: "2024-06-17",
      open: 227,
      high: 230,
      low: 225,
      close: 229,
      volume: 2700,
    },
    {
      time: "2024-06-18",
      open: 227,
      high: 230,
      low: 225,
      close: 229,
      volume: 2800,
    },
    {
      time: "2024-06-19",
      open: 227,
      high: 230,
      low: 225,
      close: 229,
      volume: 2900,
    },
    {
      time: "2024-06-20",
      open: 227,
      high: 230,
      low: 225,
      close: 229,
      volume: 3000,
    },
    {
      time: "2024-06-21",
      open: 227,
      high: 230,
      low: 225,
      close: 229,
      volume: 3100,
    },
    {
      time: "2024-06-22",
      open: 227,
      high: 230,
      low: 225,
      close: 229,
      volume: 3200,
    },
  ];

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
    if (!chartContainerRef.current || !volumeContainerRef.current) return;

    const container = chartContainerRef.current;
    const volumeContainer = volumeContainerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;
    const volumeHeight = 150; // 거래량 차트 높이

    // 캔들스틱 차트 생성
    const chart = createChart(container, {
      width: width,
      height: height,
      layout: {
        background: { color: "#ffffff" },
        textColor: "#333",
      },
      grid: {
        vertLines: { color: "#f0f0f0" },
        horzLines: { color: "#f0f0f0" },
      },
    });

    // 거래량 차트 생성
    const volumeChart = createChart(volumeContainer, {
      width: width,
      height: volumeHeight,
      layout: {
        background: { color: "#ffffff" },
        textColor: "#333",
      },
      grid: {
        vertLines: { color: "#f0f0f0" },
        horzLines: { color: "#f0f0f0" },
      },
    });

    // 캔들스틱 차트 추가
    const candlestickSeries = chart.addSeries(CandlestickSeries);
    candlestickSeries.setData(mockData);

    // 거래량 차트 추가
    const volumeSeries = volumeChart.addSeries(HistogramSeries, {
      priceFormat: {
        type: "volume",
      },
      priceScaleId: "",
    });

    // 거래량 데이터 설정
    const volumeData = mockData.map((item) => ({
      time: item.time,
      value: item.volume,
      // 거래량(캔들 차트 색상 변경하는 곳)
      color: item.close >= item.open ? "#ff6b6b" : "#4dabf7", // 상한가는 빨간색, 하한가는 파란색으로 변경
    }));
    volumeSeries.setData(volumeData);

    // 스타일 설정(캔들 차트 색상 변경하는 곳)
    candlestickSeries.applyOptions({
      upColor: "#ff6b6b",
      downColor: "#4dabf7",
      wickUpColor: "#ff6b6b",
      wickDownColor: "#4dabf7",
      borderVisible: false,
    });

    // 차트 크기 조정 이벤트 리스너
    const handleResize = () => {
      chart.applyOptions({
        width: container.clientWidth,
        height: container.clientHeight,
      });
      volumeChart.applyOptions({
        width: volumeContainer.clientWidth,
        height: volumeHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    // cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
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
    <div className="flex flex-col w-full">
      <div
        ref={chartContainerRef}
        style={{
          width: "100%",
          height: "400px",
          position: "relative",
          zIndex: 1,
        }}
      />
      <div
        ref={volumeContainerRef}
        style={{
          width: "100%",
          height: "150px",
          position: "relative",
          zIndex: 1,
        }}
      />
    </div>
  );
}
