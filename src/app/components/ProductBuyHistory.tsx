"use client";
import React, { useEffect, useState } from "react";
import { buyProductList, PurchaseHistoryList } from "@/app/types/type";
import { jpMoneyChange } from "@/app/lib/utils";
import { useSessionStorage } from "@/app/hooks/useSessionStorage";
import { Player } from "@lottiefiles/react-lottie-player";

const totalCost = (productList: buyProductList[]) =>
  productList.reduce((total, item) => total + item.price * item.count, 0);

const ProductBuyHistory = () => {
  // 購入履歴情報
  const [history, setHistory] = useState<PurchaseHistoryList[]>([]);
  // ローディング状態
  const [loading, setLoading] = useState(true);

  // ユーザーIDをセッションストレージから取得
  const userId = useSessionStorage("staffId", "0");

  // DBからデータ取得
  useEffect(() => {
    if (!userId || userId === "0") return;
    setLoading(true);
    fetch(`/api/purchaseHistory/${userId}`)
      .then((res) => res.json())
      .then((data) => setHistory(data))
      .finally(() => setLoading(false));
  }, [userId]);

  return (
    <div>
      <h3 className={`${loading ? "text-red" : ""}`}>ProductBuyHistory</h3>
      {loading ? (
        <Player
          autoplay
          loop
          src="/lottie/Loading.json"
          style={{
            height: "100px",
            width: "100px",
          }}
        />
      ) : history.length > 0 ? (
        history.map((item) => (
          <div key={item.buyGroupId} className="bg-gray-100 rounded-lg p-4 mb-2">
            {item.productList.map((product) => (
              <ul key={product.id} className=" grid grid-cols-4 gap-2 border-b-2 border-gray-300">
                <li>{product.name}</li>
                <li>{jpMoneyChange(product.price)}</li>
                <li>{product.count} set</li>
                <li>{jpMoneyChange(product.price * product.count)}</li>
              </ul>
            ))}
            <div className="font-bold text-end">{jpMoneyChange(totalCost(item.productList))}</div>
          </div>
        ))
      ) : (
        <p>No Purchase History</p>
      )}
    </div>
  );
};

export default ProductBuyHistory;
