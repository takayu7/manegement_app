import React from "react";
// import { fetchPurchaseProducts, fetchCategoryList, fetchSupplierList } from "@/app/lib/api";

import { Purchase } from "@/app/components/Purchase";
import {
  createProduct,
  fetchCategoryList,
  fetchSupplierList,
} from "@/app/lib/api";
import { revalidatePath } from "next/cache";
import { Product } from "@/app/types/type";

export default async function PurchasePage() {
  const categoryList = await fetchCategoryList();
  const supplierList = await fetchSupplierList();

  const handleSave = async (product: Product) => {
    "use server";
    console.log("product:", product);
    await createProduct(product);
    // ページを再取得
    revalidatePath("/purchase");
  };

  return (
    <div className="p-8">
      <Purchase
        categoryList={categoryList}
        supplierList={supplierList}
        onSave={handleSave}
      />
    </div>
  );
}
