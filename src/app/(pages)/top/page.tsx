import { Loading } from "@/app/components/Loading";
import React, { Suspense } from "react";
import { TopTodoMessage } from "@/app/components/top/TopTodoMessage";
import { CountDown } from "@/app/components/top/CountDown";
import Parameter from "@/app/components/top/Parameter";
import { ParentCompForShift } from "@/app/components/top/ParentCompForShift";

export default async function Page() {
  return (
    <>
      <div className="space-y-6 relative">
        <ParentCompForShift />
        <div className=" border-gray-300 gap-1">
          <TopTodoMessage />
          <CountDown />
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
