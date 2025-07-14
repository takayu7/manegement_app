import React from "react";
import { fetchUserDatas } from "@/app/lib/api";
import { sampleData } from "@/app/sampleDate/productSampleData";
import { categories } from "@/app/lib/utils";

export default async function Page() {
  const userData = await fetchUserDatas();

  const headerNames: string[] = [
    "Name",
    "Category",
    "Supplier",
    "Count",
    "Cost",
    "Price",
    "TotalCost",
    "TotalPrice",
    "",
  ];

  return (
    <>
      <h1 className="text-xl">inventory management</h1>
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              {headerNames.map((headerName, index) => (
                <th key={index}>{headerName}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sampleData.map((product, index) => (
              <tr key={index}>
                <td>{product.name}</td>
                <td>{categories(product.category)}</td>
                <td>{product.supplier}</td>
                <td>{product.count}</td>
                <td>{product.cost}</td>
                <td>{product.price}</td>
                <td>{product.cost * product.count}</td>
                <td>{product.price * product.count}</td>
                <td>
                  <button className="btn btn-ghost btn-xs">details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
