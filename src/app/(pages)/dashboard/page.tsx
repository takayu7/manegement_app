"use client";
import { useEffect, useState } from "react";
import React from "react";
import PieChart from "@/app/components/dashboard/PieChart";
import LineGraph from "@/app/components/dashboard/LineGraph";
import { Product, Category, UserBuyParameterType } from "@/app/types/type";
import type { PieChartType } from "@/app/components/dashboard/PieChart";
import { DataType } from "@/app/components/dashboard/LineGraph";

export default function Page() {
  const [productDataList, setProductDataList] = useState<Product[]>([]);
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [categoryData, setCategoryData] = useState<PieChartType[]>([]);
  const [buyProductList, setBuyProductList] = useState<UserBuyParameterType[]>(
    []
  );
  const [changedDataList, setChangedDataList] = useState<DataType[]>([]);
  const [pieChartloading, setPieChartLoading] = useState(true);
  const [loading, setLoading] = useState(true);

    //商品情報の取得
  useEffect(() => {
    fetch(`/api/products`)
      .then((res) => res.json())
      .then((data) => setProductDataList(data))
      .finally(() => setPieChartLoading(false));
  }, []);

  //カテゴリ情報の取得
    useEffect(() => {
    fetch(`/api/categories`)
      .then((res) => res.json())
      .then((data) => setCategoryList(data))
  }, []);

  // 購入履歴取得
  useEffect(() => {
    fetch(`/api/userBuyHistory`)
      .then((res) => res.json())
      .then((data) => setBuyProductList(data))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const today = new Date();
    const lastDay = today.getDate(); // 今日の日付まで
    // 今月分のみ抽出
    const filteredBuyProductList = buyProductList.filter((item) => {
      const dateObj = new Date(item.date);
      return dateObj.getFullYear() === year && dateObj.getMonth() + 1 === month;
    });
    console.log(filteredBuyProductList);
    // 商品ごとに日付ごとの売上を集計
    const productMap: { [name: string]: number[] } = {};
    filteredBuyProductList.forEach((item) => {
      const dateObj = new Date(item.date);
      const day = dateObj.getDate(); // 1〜lastDay
      if (!productMap[item.name]) {
        // 初期化: 今日までの日数分の配列（0埋め）
        productMap[item.name] = Array(lastDay).fill(0);
      }
      // 売上をその日付のインデックスに加算（今日までのみ）
      if (day <= lastDay) {
        productMap[item.name][day - 1] += item.price * item.count;
      }
    });
    console.log(productMap);
    // 累積配列に変換
    const result: DataType[] = Object.entries(productMap).map(
      ([name, data]) => {
        const cumulative: number[] = [];
        data.reduce((sum, value, idx) => {
          const newSum = sum + value;
          cumulative[idx] = newSum;
          return newSum;
        }, 0);
        return { name, data: cumulative };
      }
    );
    setChangedDataList(result);
  }, [buyProductList]);

  // カテゴリごとの利益を計算
  useEffect(() => {
    const pieChartData = Object.entries(
      productDataList.reduce<Record<string, number>>((acc, product) => {
        const profit = product.price * (product.order - product.count);
        if (acc[product.category]) {
          acc[product.category] += profit;
        } else {
          acc[product.category] = profit;
        }
        return acc;
      }, {})
    ).map(([categoryId, profit]) => {
      const category = categoryList.find(
        (cat) => cat.id === Number(categoryId)
      );
      return {
        title: category ? category.name : "Unknown",
        value: profit,
      };
    });
    setCategoryData(pieChartData);
  }, [productDataList, categoryList]);
  console.log(categoryData);

  return (
    <>
      <div className="space-y-6">
        <h1 className="text-xl">Dashboard</h1>
        <div className="h-80 p-5  border border-gray-300 rounded-md overflow-y-auto">
          {pieChartloading ? (
          <div className="flex justify-center items-center h-80">
            <span className="loading loading-ring loading-xs"></span>
          </div>
        ) : (
          <PieChart pieChartData={categoryData} />
        )}
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-80">
            <span className="loading loading-ring loading-xs"></span>
          </div>
        ) : (
          <LineGraph data={changedDataList} />
        )}
      </div>
    </>
  );
}
