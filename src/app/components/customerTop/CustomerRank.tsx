"use client";
import React, { useEffect, useState } from "react";
// import useStore from "@/app/store/useStore";
import { useSessionStorage } from "@/app/hooks/useSessionStorage";
import { BuyProductList } from "@/app/types/type";
import { PurchaseHistoryList } from "@/app/types/type";
import { Trophy } from "lucide-react";

export const CustomerRank = () => {
  // 購入履歴情報
  const [totalSales, setTotalSales] = useState<number>(0);
  // ローディング状態
  const [loading, setLoading] = useState(true);
  const [trigger, setTrigger] = useState(0);

  // ユーザーIDをセッションストレージから取得
  const userId = useSessionStorage("staffId", "0");

  // DBからデータ取得
  useEffect(() => {
    if (!userId || userId === "0") return;
    setLoading(true);
    fetch(`/api/purchaseHistory/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setTotalSales(
          data.reduce((acc: number, item: PurchaseHistoryList) => {
            item.productList.forEach((product: BuyProductList) => {
              acc += product.price * product.count;
            });
            return acc;
          }, 0)
        );
      })
      .finally(() => setLoading(false));
  }, [userId,trigger]);

  const rankColor = () => {
    if (totalSales > 1000000) return "bg-linear-to-r/hsl from-indigo-500 to-teal-400 text-white";
    if (totalSales > 600000) return "bg-yellow-400 border-2 border-yellow-500";
    if (totalSales > 300000) return "bg-gray-300 border-2 border-gray-400";
    return "bg-orange-700 border-2 border-orange-800";
  };

    const rankBar = () => {
    if (totalSales > 1000000) return 100;
    if (totalSales > 600000) return totalSales / 1000000 * 100;
    if (totalSales > 300000) return totalSales / 600000 * 100;
    return totalSales / 300000 * 100;
  };

  return (
    <>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="flex flex-col items-center gap-1">
          <div className={`flex items-center gap-3`}>
            <h2 className="text-lg font-semibold">Rank</h2>
            <button
              className={`rounded-full size-10 flex items-center justify-center hover:opacity-75 ${rankColor()}`}
              onClick={()=>setTrigger((data)=> data+1)}
            >
              <Trophy className="h-6 w-6 " />
            </button>
          </div>
          <progress className={`progress w-30 ${rankBar() === 100 && "progress-primary"}`} value={rankBar()} max="100" />
        </div>
      )}
    </>
  );
};
