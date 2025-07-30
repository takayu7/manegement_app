"use client";
import React, { useEffect, useState } from "react";
import { BuyProductList, PurchaseHistoryList } from "@/app/types/type";
import { jpMoneyChange } from "@/app/lib/utils";
import { useSessionStorage } from "@/app/hooks/useSessionStorage";
import { Player } from "@lottiefiles/react-lottie-player";

// 合計金額を計算する関数
const totalCost = (productList: BuyProductList[]) =>
  productList.reduce((total, item) => total + item.price * item.count, 0);

export interface ProductBuyHistoryProps {
  onSave: (buyProductList: BuyProductList[]) => void;
}

const ProductBuyHistory: React.FC<ProductBuyHistoryProps> = ({ onSave }) => {
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

  const testData: BuyProductList[] = [
    {
      id: "a11111",
      userid: userId,
      name: "cap",
      category: 3,
      price: 80,
      count: 2,
      buyDate: new Date(),
    },
    {
      id: "a11112",
      userid: userId,
      name: "boots",
      category: 7,
      price: 500,
      count: 1,
      buyDate: new Date(),
    },
  ];

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
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
          <div key={item.buyGroupId} className="bg-gray-50 rounded-lg p-4 mb-2">
            {item.productList.map((product, index) => (
              <>
                <div>
                  {index === 0 && product.buyDate
                    ? product.buyDate
                        .toLocaleString("ja-JP", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        })
                        .split("-")
                        .join("/")
                        .slice(0, 10)
                    : null}
                </div>
                <ul
                  key={product.id}
                  className=" grid grid-cols-4 gap-2 border-b-2 border-gray-300"
                >
                  <li>{product.name}</li>
                  <li>{jpMoneyChange(product.price)}</li>
                  <li>{product.count} set</li>
                  <li>{jpMoneyChange(product.price * product.count)}</li>
                </ul>
              </>
            ))}
            <div className="font-bold text-end">
              {jpMoneyChange(totalCost(item.productList))}
            </div>
          </div>
        ))
      ) : (
        <p>No Purchase History</p>
      )}
      <button className="btn btn-info mt-4" onClick={() => onSave(testData)}>
        BuyTestData
      </button>
    </div>
  );
};

export default ProductBuyHistory;
