import ProductList from "@/app/components/ProductList";
import { fetchProductDatas, updateBuyProduct, createPurchaseHistory } from "@/app/lib/api";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import type { CartItem, BuyProductList } from "@/app/types/type";
import { revalidatePath } from "next/cache";

export default async function ProductListPage() {
  const productDataList = await fetchProductDatas();

  const handleBuy = async (cart: CartItem[], product: BuyProductList[]) => {
    "use server";

     await createPurchaseHistory(product);
    await updateBuyProduct(cart);
   
    // ページを再取得
    revalidatePath("/product");
  };

  return (
    <div className="p-8">
      <ProductList
        productDataList={productDataList}
        onSave={handleBuy}

      />
      <ToastContainer />
    </div>
  );
};