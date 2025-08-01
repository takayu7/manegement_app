import { Loading } from "@/app/components/Loading";
import React, { Suspense } from "react";
import { TopTodoMessage } from "@/app/components/TopTodoMessage";
import { CountDown } from "@/app/components/CountDown";
import Parameter from "@/app/components/Parameter";
import { fetchTodo, fetchProductDatas, fetchCategoryList, createPurchaseHistory, fetchBuyAllHistory } from "@/app/lib/api";
import { Todo, Product, Category , BuyProductList, UserBuyParameterType} from "@/app/types/type";
import ProductBuyHistory from "@/app/components/ProductBuyHistory";
import { UserBuyParameter } from "@/app/components/UserBuyParameter";

export default async function Page() {
  //DBからデータを取得
  const todoDataList: Todo[] = await fetchTodo();
  const productDataList: Product[] = await fetchProductDatas();
  const categoryList: Category[] = await fetchCategoryList();
  const historyList: UserBuyParameterType[] = await fetchBuyAllHistory();

  const handleSave = async (product: BuyProductList[]) => {
    "use server";
    await createPurchaseHistory(product);
  };


  return (
    <>
      <div className="space-y-6 relative">
        <div className="flex  border-gray-300 items-center flex-col gap-2 lg:flex-row md:justify-between lg:border-b-2">
          <TopTodoMessage todoDataList={todoDataList} />
          <CountDown />
        </div>
        <div>
          <div className="h-50 bg-gray-100 border border-gray-300 rounded-md overflow-y-auto">
            <ProductBuyHistory onSave={handleSave} />
          </div>
          <UserBuyParameter buyProductList={historyList} />
        </div>
        <div>
          <Suspense fallback={<Loading />}>
            <Parameter
              productDataList={productDataList}
              categoryList={categoryList}
            />
          </Suspense>
        </div>
      </div>
    </>
  );
}
