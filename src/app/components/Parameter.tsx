"use client";
import React, { useState , useMemo} from "react";
import { jpMoneyChange, categories } from "@/app/lib/utils";
import { Product, Category } from "@/app/types/type";
import { ProductDetailDialog } from "@/app/components/ProductDetailDialog";

export type SalesData = {
  name: string;
  category: number;
  cost: number;
  price: number;
  count: number;
  order: number;
  countPercent: number;
};

// 商品の現状利益状態
export const salesCheck = (data: {
  price: number;
  order: number;
  count: number;
  cost: number;
}) => {
  return data.price * (data.order - data.count) - data.cost * data.order;
};

export default function Parameter({
  productDataList,
  categoryList,
}: {
  productDataList: Product[];
  categoryList: Category[];
}) {
  const [selectedProduct, setSelectedProduct] = useState<SalesData>({
    name: "",
    category: 1,
    count: 0,
    cost: 0,
    order: 0,
    price: 0,
    countPercent: 0,
  });

  const salesData = useMemo(() => {
    return productDataList.reduce((acc, product) => {
      const { name, category, cost, price } = product;
      let count = product.count;
      let order = product.order;

      // 未定義やnullやNaNやInfinityを0に矯正
      count = Number.isFinite(count) ? count : 0;
      order = Number.isFinite(order) ? order : 0;

      const countPercent =
        Number.isFinite(order) && Number.isFinite(count) && order > 0
          ? Math.ceil(100 * (count / order))
          : 0;

      // すべての数値フィールドをチェックしてNaNを0に変換
      const safeValue = (value: number) => (Number.isFinite(value) ? value : 0);

      acc.push({
        name: name || "",
        category: category,
        cost: safeValue(cost),
        price: safeValue(price),
        count: safeValue(count),
        order: safeValue(order),
        countPercent: safeValue(countPercent),
      });
      return acc;
    }, [] as SalesData[]);
  }, [productDataList]);

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
      <ul className="flex flex-wrap items-center justify-center gap-3">
        {salesData.map((data, index) => {
          // NaN対策: countPercentがNaNなら0にする
          const safeCountPercent = isNaN(data.countPercent)
            ? 0
            : data.countPercent;
          return (
            <button
              key={index}
              className={`btn flex items-center gap-4 h-32  rounded-lg p-4 shadow-md ${bgColor(
                safeCountPercent
              )}`}
              onClick={() => {
                setSelectedProduct(data);
                (
                  document.getElementById(
                    "ProductDetailDialog"
                  ) as HTMLDialogElement
                )?.showModal();
              }}
            >
              <div className="w-40 pl-3 flex flex-col items-start">
                <span>{data.name}</span>
                <span
                  className={`${
                    salesCheck(data) < 0 ? "text-error" : "text-success"
                  }`}
                >
                  {jpMoneyChange(salesCheck(data))}
                </span>
                {safeCountPercent == 0 && (
                  <span className="text-sm">sold out</span>
                )}
              </div>
              <div
                className={`radial-progress w-24 h-24 ${
                  safeCountPercent <= 20 ? "text-error" : "text-success"
                }`}
                style={
                  {
                    "--value": String(safeCountPercent),
                    "--size": safeCountPercent <= 0 ? "0px" : "96px",
                  } as React.CSSProperties
                }
                aria-valuenow={safeCountPercent}
                role="progressbar"
              >
                {safeCountPercent}%
              </div>
            </button>
          );
        })}
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
      <ProductDetailDialog
        product={selectedProduct}
        categoryList={categoryList}
      />
    </>
  );
}
