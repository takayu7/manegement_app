import React from "react";
import  ProductTable from "@/app/components/ProductTable";

export default async function Page() {

  return (
    <>
      <div className="space-y-6">
        <h1 className="text-xl">inventory management</h1>
        <ProductTable />
      </div>
    </>
  );
}
