import React from "react";
import { fetchProductDatas } from "@/app/lib/api";
import { jpMoneyChange } from "@/app/lib/utils";

// const productDataList = [
//   {
//     id: "1",
//     name: "Sample Product",
//     category: 1,
//     supplier: 1,
//     count: 10,
//     orderCount: 20,
//     cost: 100,
//     price: 150,
//   },
//   {
//     id: "2",
//     name: "Sample Product 2",
//     category: 1,
//     supplier: 1,
//     count: 8,
//     orderCount: 10,
//     cost: 80,
//     price: 120,
//   },
//   {
//     id: "3",
//     name: "Sample Product 3",
//     category: 2,
//     supplier: 2,
//     count: 5,
//     orderCount: 15,
//     cost: 50,
//     price: 90,
//   },
// ];

export default async function Parameter() {
  const productDataList = await fetchProductDatas();
  const salesData = productDataList.reduce((acc, product) => {
    const { name, cost, price, count, orderCount } = product;
    const countPercent = Math.ceil(100 * (1 - count / orderCount));
    acc.push({
      name: name,
      cost: cost,
      price: price,
      count: count,
      orderCount: orderCount,
      countPercent: countPercent,
    });
    return acc;
  }, [] as { name: string; cost: number; price: number; count: number; orderCount: number; countPercent: number }[]);

  const salesCheck = (data: { price: number; orderCount: number; count: number; cost: number }) => {
    return data.price * (data.orderCount - data.count) -
           data.cost * data.orderCount;
  }

  return (
    <>
      <ul className="flex items-center gap-3">
        {salesData.map((data, index) => (
          <li
            key={index}
            className={`flex items-center gap-4  rounded-lg p-4 shadow-md ${
              data.countPercent >= 80 ? "bg-rose-200" : "bg-emerald-50"
            }`}
          >
            <div className="w-40">
              <span>{data.name}</span>
              <span className={`${salesCheck(data) < 0 ? "text-error" : "text-success"}`}>
                {jpMoneyChange(salesCheck(data))}
              </span>
            </div>
            <div
              className={`radial-progress w-24 h-24 ${
                data.countPercent >= 80 ? "text-error" : "text-success"
              }`}
              style={
                {
                  "--value": data.countPercent,
                  "--size": "96px",
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
    </>
  );
}
