import React from "react";
import {
  fetchProductDatas,
  fetchCategoryList,
  fetchSupplierList,
  updateProduct,
  deleteProduct,
} from "@/app/lib/api";
import  ProductTable from "@/app/components/ProductTable";
import { Product } from "@/app/types/type";
import { revalidatePath } from "next/cache";

export default async function Page() {
  const productDataList = await fetchProductDatas();
  const categoryList = await fetchCategoryList();
  const supplierList = await fetchSupplierList();

  const handleSave = async (product: Product) => {
    "use server";
    console.log("product:", product);
    await updateProduct(product);
     // ページを再取得
    revalidatePath("/inventory");
  };
  const handleDelete = async (productId: string) => {
    "use server";
    await deleteProduct(productId);
     // ページを再取得
    revalidatePath("/inventory");
  };

  return (
    <>
      <div className="space-y-6">
        <h1 className="text-xl">inventory management</h1>
        <ProductTable
          productDataList={productDataList}
          categoryList={categoryList}
          supplierList={supplierList}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      </div>
    </>
  );
}
