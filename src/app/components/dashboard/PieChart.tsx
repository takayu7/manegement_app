"use client";
import React, { useState, useEffect } from "react";
import { VictoryPie } from "victory";
import { VictoryTheme } from "victory-core";

export type PieChartType = {
  title: string;
  value: number;
};

export interface PieChartProps {
  pieChartData: PieChartType[];
}

const PieChart: React.FC<PieChartProps> = ({ pieChartData }) => {
  const [datas, setDatas] = useState<PieChartType[]>([]);
  const [opacity, setOpacity] = useState(0.2);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setOpacity(1), 500); // 0.5秒後に濃く
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setDatas(pieChartData);
  }, [pieChartData]);

  return (
    <>
      <VictoryPie
        innerRadius={50}
        data={datas
          .slice()
          .sort((a, b) => b.value - a.value)
          .map((item) => ({ x: item.title, y: item.value }))}
        theme={VictoryTheme.clean}
        radius={({ index }) => (activeIndex === index ? 130 : 120)}
        labelRadius={({ index }) => (activeIndex === index ? 150 : 140)} // ←追加
        style={{
          data: {
            opacity: opacity,
            transition: "opacity 1s, radius 0.2s, labelRadius 0.2s",
            cursor: "pointer",
          },
        }}
        events={[
          {
            target: "data",
            eventHandlers: {
              onMouseOver: (_, props) => {
                setActiveIndex(props.index);
                return null;
              },
              onMouseOut: () => {
                setActiveIndex(null);
                return null;
              },
            },
          },
        ]}
      />
    </>
  );
};

export default PieChart;
