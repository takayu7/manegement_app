import { Loading } from "@/app/components/Loading";
import React, { Suspense } from "react";
import TopTodoMessage from "@/app/components/TopTodoMessage";

export default function Page({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const Parameter = React.lazy(() => import("@/app/components/Parameter"));

  const staffIcon = (searchParams?.staff as string) || "0";
  const staffId = (searchParams?.id as string) || "0";

  return (
    <>
      <div className="space-y-6 relative">
        <h1 className="text-xl">TOP</h1>
        <TopTodoMessage staffIcon={staffIcon} staffId={staffId} />
        <div>
          <Suspense fallback={<Loading />}>
            <Parameter />
          </Suspense>
        </div>
      </div>
    </>
  );
}
