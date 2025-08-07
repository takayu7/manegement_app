import { Loading } from "@/app/components/Loading";
import React, { Suspense } from "react";
import { TopTodoMessage } from "@/app/components/top/TopTodoMessage";
import { CountDown } from "@/app/components/top/CountDown";
import Parameter from "@/app/components/top/Parameter";
import ProductBuyHistory from "@/app/components/top/ProductBuyHistory";
import { UserBuyParameter } from "@/app/components/top/UserBuyParameter";
import { ProductReviews } from "@/app/components/top/ProductReviews";

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
          <ProductReviews />
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
