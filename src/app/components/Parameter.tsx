"use client";
import React from "react";
import { jpMoneyChange, categories } from "@/app/lib/utils";
import { Product } from "@/app/types/type";

export default function Parameter({ productDataList }: { productDataList: Product[] }) {

  const salesData = productDataList.reduce((acc, product) => {
    const { name, cost, price, count, order } = product;
    const countPercent = Math.ceil(100 * (count / order));
    acc.push({
      name: name,
      cost: cost,
      price: price,
      count: count,
      order: order,
      countPercent: countPercent,
    });
    return acc;
  }, [] as { name: string; cost: number; price: number; count: number; order: number; countPercent: number }[]);

  const totalSales = productDataList.reduce(
    (total, product) =>
      total +
      (product.price * (product.order - product.count) -
        product.cost * product.order),
    0
  );

  // カテゴリごとの利益を計算
  const categoryProfitMap = productDataList.reduce<Record<string, number>>(
    (acc, product) => {
      const profit =
        product.price * (product.order - product.count) -
        product.cost * product.order;

      if (acc[product.category]) {
        acc[product.category] += profit;
      } else {
        acc[product.category] = profit;
      }

      return acc;
    },
    {}
  );

  const salesCheck = (data: {
    price: number;
    order: number;
    count: number;
    cost: number;
  }) => {
    return data.price * (data.order - data.count) - data.cost * data.order;
  };

  const bgColor = (countPercent: number) => {
    if (countPercent >= 1 && countPercent <= 20) {
      return "bg-rose-200";
    } else if (countPercent >= 21 && countPercent <= 100) {
      return "bg-emerald-50";
    }
    return "bg-gray-200";
  };

  return (
    <>
      <ul className="flex flex-wrap items-center gap-3">
        {salesData.map((data, index) => (
          <li
            key={index}
            className={`flex items-center gap-4  rounded-lg p-4 shadow-md ${bgColor(
              data.countPercent
            )}`}
          >
            <div className="w-40">
              <span>{data.name}</span>
              <span
                className={`${
                  salesCheck(data) < 0 ? "text-error" : "text-success"
                }`}
              >
                {jpMoneyChange(salesCheck(data))}
              </span>
              {data.countPercent == 0 && (
                <span className="text-sm">sold out</span>
              )}
            </div>
            <div
              className={`radial-progress w-24 h-24 ${
                data.countPercent <= 20 ? "text-error" : "text-success"
              }`}
              style={
                {
                  "--value": data.countPercent,
                  "--size": "94px",
                } as React.CSSProperties
              }
              aria-valuenow={data.countPercent}
              role="progressbar"
            >
              {data.countPercent}%
            </div>
          </li>
        ))}
      </ul>
      <ul className="flex items-center flex-wrap justify-between gap-1 mt-5">
        {Object.entries(categoryProfitMap).map(([category, profit]) => (
          <li
            key={category}
            className={`p-5 flex items-center gap-4 rounded-lg shadow-md ${
              profit < 0 ? "bg-rose-200" : "bg-sky-200"
            }`}
          >
            <span>{categories(Number(category))}</span>
            <span>{jpMoneyChange(profit)}</span>
          </li>
        ))}
      </ul>
      <div
        className={`flex justify-center mt-5 rounded-lg py-5 w-full ${
          totalSales < 0 ? "bg-rose-200" : "bg-sky-200"
        }`}
      >
        Cost of goods sold: {jpMoneyChange(totalSales)}
      </div>
    </>
  );
}
