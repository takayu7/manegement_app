import React from "react";
import { fetchProductDatas } from "@/app/lib/api";
import { jpMoneyChange } from "@/app/lib/utils";


export default async function Parameter() {
  const productDataList = await fetchProductDatas();
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
  (total, product) => total + (product.price * (product.order - product.count) - product.cost * product.order),
  0
);

  const salesCheck = (data: {
    price: number;
    order: number;
    count: number;
    cost: number;
  }) => {
    return data.price * (data.order - data.count) - data.cost * data.order;
  };

  return (
    <>
      <ul className="flex flex-wrap items-center gap-3">
        {salesData.map((data, index) => (
          <li
            key={index}
            className={`flex items-center gap-4  rounded-lg p-4 shadow-md ${
              data.countPercent <= 20 ? "bg-rose-200" : "bg-emerald-50"
            }`}
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
      <div className={`flex justify-center mt-5 rounded-lg py-5 w-full ${totalSales < 0 ? "bg-rose-200" : "bg-emerald-50"}`}>Cost of goods sold: {jpMoneyChange(totalSales)}</div>
    </>
  );
}
