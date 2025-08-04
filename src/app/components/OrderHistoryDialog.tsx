"use client";
import React, { useEffect, useState } from "react";
import { BuyProductList, PurchaseHistoryList } from "@/app/types/type";
import { jpMoneyChange } from "@/app/lib/utils";
import { useSessionStorage } from "@/app/hooks/useSessionStorage";
import { Player } from "@lottiefiles/react-lottie-player";
import { Stamp, X, Calendar } from "lucide-react";

// 合計金額を計算する関数
const totalCost = (productList: BuyProductList[]) =>
  productList.reduce((total, item) => total + item.price * item.count, 0);

export interface OrderHistoryDialogProps {
  onSave: (buyProductList: BuyProductList[]) => void;
  onClose: () => void;
}

const OrderHistoryDialog: React.FC<OrderHistoryDialogProps> = ({ onClose }) => {
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
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center">
      <div className="bg-white p-5 lg:p-8 rounded-2xl w-full max-w-[600px] relative h-2/3 overflow-auto">
        {/* ヘッダー */}
        <div className="flex">
          <h3 className="text-3xl font-bold mb-6 text-center text-gray-800">
            OrderHistory
            <Stamp className="inline-block ml-1 size-8" />
          </h3>
        </div>
        {/* アニメーション */}
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
              className="bg-pink-50 border border-pink-200 rounded-xl p-5 mb-5 shadow-sm"
            >
              {item.productList.map((product, index) => (
                <React.Fragment key={index}>
                  {index === 0 && product.buyDate && (
                    <div className="flex items-center gap-2 mb-2 text-gray-800">
                      <Calendar className="size-5" />

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
                    className="flex flex-col lg:grid lg:grid-cols-4 bg-white px-4 py-3 border border-dashed border-pink-200"
                  >
                    <li className="font-semibold text-gray-900">
                      {product.name}
                    </li>
                    <li className=" text-gray-700">
                      {jpMoneyChange(product.price)}
                    </li>
                    <li className="flex">{product.count} set</li>
                    <li className="text-right  text-pink-600 font-bold">
                      {jpMoneyChange(product.price * product.count)}
                    </li>
                  </ul>
                </React.Fragment>
              ))}

              <div className="mt-4 border-t pt-3 border-pink-200 text-right text-pink-900 font-bold text-lg ">
                {jpMoneyChange(totalCost(item.productList))}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 italic">
            No Purchase History
          </p>
        )}

        <button
          onClick={onClose}
          className="absolute top-6 right-4 btn text-white btn-sm btn-circle bg-blue-900 hover:bg-blue-800"
        >
          <X className="size-5" />
        </button>
      </div>
    </div>
  );
};

export default OrderHistoryDialog;
