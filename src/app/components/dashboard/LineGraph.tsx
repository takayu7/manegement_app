"use client";
import React, { useState, useEffect } from "react";
import _ from "lodash";
import { VictoryTheme } from "victory-core";
import { VictoryChart, VictoryLine, VictoryScatter, VictoryGroup, VictoryAxis, VictoryLegend, VictoryLabel } from "victory";

const symbols = [
  "circle",
  "diamond",
  "plus",
  "square",
  "triangleUp",
  "star",
  "cross"
];

//色を生成する
function generateRandomColors(length: number): string[] {
  return Array.from({ length }, () => {
    // 6桁の16進数カラーコードを生成
    return "#" + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0");
  });
}

export type DataType = {
  name: string;
  data: number[];
}

export interface LineProps {
  data: DataType[];
};

const LineGraph: React.FC<LineProps> = ({ data }) => {
  const [dataList, setDataList] = useState<DataType[]>([]);

  useEffect(() => {
    setDataList(data);
  }, [data]);

  // 今月の1日～月末までの配列を作成
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-indexed
  const lastDay = new Date(year, month + 1, 0).getDate();
  const tickValues = Array.from({ length: lastDay }, (_, i) => i + 1);
  // 折れ線グラフの色を生成
  const colors = generateRandomColors(dataList.length);
  // 月名を取得
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const currentMonthName = monthNames[month];

  return (
    <VictoryChart
      padding={{
        top: 50,
        left: 70,
        right: 50,
        bottom: 100,
      }}
      theme={VictoryTheme.clean}
    >
      {/*タイトル1 */}
      <VictoryLabel
        text={`Sales Per User (${currentMonthName})`}
        style={{
          ...VictoryTheme.clean.label,
          fontSize: 10,
        }}
        dx={28}
        dy={18}
      />
      {/*タイトル2 */}
      <VictoryLabel
        text={`Sales by user chart (${year})`}
        style={{
          ...VictoryTheme.clean.label,
          fontSize: 8,
        }}
        dx={28}
        dy={30}
      />
      <VictoryAxis
        tickValues={tickValues}
        style={{
          tickLabels: {
            fontSize: 4,
          },
          ticks: {
            stroke: "#757575",
          },
        }}
      />
      {/*グラフの「Y軸（縦軸）」の設定 */}
      <VictoryAxis
        dependentAxis // Y軸（値軸）として表示する
        label="Total Sales"// Y軸のタイトル（ラベル）
        tickValues={_.range(0, 1000000, 100000)}// Y軸の目盛りの値
        tickFormat={(value) =>//目盛りのラベル
          `${value}`
        }
        style={{// 軸やラベル、目盛り、グリッド線の見た目
          axis: {
            stroke: "transparent",
          },
          axisLabel: {
            fontSize: 8,
            padding: 50,
          },
          tickLabels: {
            fontSize: 8,
          },
          grid: {
            stroke: "#d9d9d9",
          },
        }}
      />
      {dataList.map((s, i) => (
        // 折れ線グラフデータをまとめて表示するためのグループ化
        <VictoryGroup
          data={s.data.map((d, i) => ({
            x: i + 1,
            y: d,
          }))}
          key={s.name}
        >
          {/*折れ線グラフの各データ線（線）*/}
          <VictoryLine
            style={{
              data: {
                stroke:
                  colors[i],
                strokeWidth: 1,
              },
            }}
          />
          {/*折れ線グラフの各データ点（ドット）*/}
          <VictoryScatter
            size={2}
            symbol={symbols[i] as any} // 型アサーション
            style={{
              data: {
                fill: colors[i],
              },
            }}
          />
        </VictoryGroup>
      ))}
      {/* 凡例の設定 はグラフの下などに「色・シンボル・ラベル」を一覧表示します */}
      <VictoryLegend
        itemsPerRow={4} //1行に4つまで並べる
        x={50} //凡例の表示位置を指定
        y={220}
        data={dataList.map((s,i) => ({
          name: s.name,
          symbol: {
            fill: colors[i],
            type: symbols[i],
          },
        }))}
        style={{
          data: {
            fill: ({ datum }) =>
              datum.symbol.fill,
          },
          labels: {
            fontSize: 8,
          },
          border: {
            stroke: "transparent",
          },
        }}
      />
    </VictoryChart>
  );
};

export default LineGraph;
