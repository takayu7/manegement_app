import { Loading } from "@/app/components/Loading";
import React, { Suspense } from "react";
import { TopTodoMessage } from "@/app/components/TopTodoMessage";
import { CountDown } from "@/app/components/CountDown";
import Parameter from "@/app/components/Parameter";
import ProductBuyHistory from "@/app/components/ProductBuyHistory";
import { UserBuyParameter } from "@/app/components/UserBuyParameter";

export default async function Page() {


  return (
    <>
      <div className="space-y-6 relative">
        <div className="flex  border-gray-300 items-center flex-col gap-2 lg:flex-row md:justify-between lg:border-b-2">
          <TopTodoMessage />
          <CountDown />
        </div>
        <div>
          <div className="h-80 bg-gray-100 border border-gray-300 rounded-md overflow-y-auto">
            <ProductBuyHistory />
          </div>
          <UserBuyParameter />
        </div>
        <div>
          <Suspense fallback={<Loading />}>
            <Parameter />
          </Suspense>
        </div>
      </div>
    </>
  );
}
