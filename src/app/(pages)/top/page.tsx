import { Loading } from "@/app/components/Loading";
import React, { Suspense } from "react";
import { TopTodoMessage } from "@/app/components/TopTodoMessage";
import { CountDown } from "@/app/components/CountDown";
import Parameter from "@/app/components/Parameter";
import { fetchTodo, fetchProductDatas, fetchCategoryList } from "@/app/lib/api";
import { Todo, Product, Category } from "@/app/types/type";
import ProductBuyHistory from "@/app/components/ProductBuyHistory";

export default async function Page() {
  //DBからデータを取得
  const todoDataList: Todo[] = await fetchTodo();
  const productDataList: Product[] = await fetchProductDatas();
  const categoryList: Category[] = await fetchCategoryList();

  return (
    <>
      <div className="space-y-6 relative">
        <div className="flex  border-gray-300 items-center flex-col gap-2 lg:flex-row md:justify-between lg:border-b-2">
          <TopTodoMessage todoDataList={todoDataList} />
          <CountDown />
        </div>
        <div>
          <ProductBuyHistory />
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
