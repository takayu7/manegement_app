import { Loading } from "@/app/components/Loading";
import React, { Suspense } from "react";
import { TopTodoMessage } from "@/app/components/TopTodoMessage";
import { CountDown } from "@/app/components/CountDown";
import Parameter from "@/app/components/Parameter";
import { fetchTodo, fetchProductDatas } from "@/app/lib/api";
import { Todo, Product } from "@/app/types/type";

export default async function Page() {
  //DBからデータを取得
  const todoDataList: Todo[] = await fetchTodo();
  const productDataList: Product[] = await fetchProductDatas();

  return (
    <>
      <div className="space-y-6 relative">
        <h1 className="text-xl">TOP</h1>
        <div className="flex border-b-2 border-gray-300 items-center justify-between">
        <TopTodoMessage todoDataList={todoDataList} />
        <CountDown />
        </div>
        <div>
          <Suspense fallback={<Loading />}>
            <Parameter productDataList={productDataList} />
          </Suspense>
        </div>
      </div>
    </>
  );
}
