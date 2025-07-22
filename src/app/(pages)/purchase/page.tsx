import React from "react";
// import { fetchPurchaseProducts, fetchCategoryList, fetchSupplierList } from "@/app/lib/api";

import { Purchase } from "@/app/components/Purchase";

export default function PurchasePage() {
  const categoryList = [
    { id: 1, name: "clothes" },
    { id: 2, name: "cap" },
    { id: 3, name: "plants" },
    { id: 4, name: "plates" },
    { id: 5, name: "cup" },
    { id: 6, name: "pet goods" },
    { id: 7, name: "shoes" },
  ];
  const supplierList = [
    { id: 1, name: "China" },
    { id: 2, name: "Korea" },
    { id: 3, name: "NewYork" },
  ];

  return (
    <div className="p-8">
      <Purchase categoryList={categoryList} supplierList={supplierList} />
    </div>
  );
}
