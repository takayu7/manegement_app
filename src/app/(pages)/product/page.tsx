import ProductList from "@/app/components/ProductList";
import { fetchProductDatas, updateProduct, deleteProduct } from "@/app/lib/api";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import type { Product } from "@/app/types/type";

export default async function ProductListPage() {
  const productDataList = await fetchProductDatas();

  const handleBuy = async (product: Product) => {
    "use server";
    await updateProduct(product);
  };
  const handleDelete = async (productId: string) => {
    "use server";
    await deleteProduct(productId);
  };

  return (
    <div className="p-8">
      <ProductList
        productDataList={productDataList}
        onSave={handleBuy}
        onDelete={handleDelete}
      />
      <ToastContainer />
    </div>
  );
}
