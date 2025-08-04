"use client";
import React, { useEffect, useState } from "react";
import { BuyProductList, PurchaseHistoryList } from "@/app/types/type";
import { jpMoneyChange } from "@/app/lib/utils";
import { useSessionStorage } from "@/app/hooks/useSessionStorage";
import { Player } from "@lottiefiles/react-lottie-player";
import { Stamp, Calendar } from "lucide-react";

// 合計金額を計算する関数
const totalCost = (productList: BuyProductList[]) =>
  productList.reduce((total, item) => total + item.price * item.count, 0);

export interface ProductBuyHistoryProps {
  onSave: (buyProductList: BuyProductList[]) => void;
}

const ProductBuyHistory: React.FC<ProductBuyHistoryProps> = ({}) => {
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
    <div className="p-4 bg-gray-100 rounded-lg">
      <div className="flex">
        <h3 className="text-2xl font-bold mb-4 text-center text-gray-800">
          OrderHistory
          <Stamp className="inline-block ml-1 size-8" />
        </h3>
      </div>
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
          <div
            key={item.buyGroupId}
            className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-4 shadow-sm"
          >
            {item.productList.map((product, index) => (
              <React.Fragment key={index}>
                {index === 0 && product.buyDate && (
                  <div className="flex items-center gap-2 mb-1 text-gray-800">
                    <Calendar className="size-4.5" />

                    {product.buyDate
                      .toLocaleString("ja-JP", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })
                      .split("-")
                      .join(".")
                      .slice(0, 10)}
                  </div>
                )}
                <ul
                  key={`ul-${product.id || index}`}
                  className="flex flex-col lg:grid lg:grid-cols-4 bg-white  px-3 py-2 border border-yellow-100 border-dashed"
                >
                  <li className="font-semibold text-gray-900">
                    {product.name}
                  </li>
                  <li className=" text-gray-700">
                    {jpMoneyChange(product.price)}
                  </li>
                  <li className="flex">{product.count} set</li>
                  <li className="text-right  text-yellow-600 font-bold">
                    {jpMoneyChange(product.price * product.count)}
                  </li>
                </ul>
              </React.Fragment>
            ))}
            <div className="mt-3 border-t pt-2 border-yellow-300 text-right text-orange-800 font-bold text-lg">
              {jpMoneyChange(totalCost(item.productList))}
            </div>
          </div>
        ))
      ) : (
        <p>No Purchase History</p>
      )}
    </div>
  );
};

export default ProductBuyHistory;
