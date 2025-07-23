import ProductList from "@/app/components/ProductList";
import { fetchCategoryList, fetchProductDatas, fetchSupplierList } from "@/app/lib/api";

export default async function ProductListPage() {
  const productDataList =  await fetchProductDatas();
  const categoryList = await fetchCategoryList();
  const supplierList= await fetchSupplierList();

  return (
    <div className="p-8">
      <ProductList 
      productDataList={productDataList}
      categoryList={categoryList}
      supplierList={supplierList}
      />
    </div>
  );
}
