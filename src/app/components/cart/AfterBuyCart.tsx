"use client";
import React, { startTransition, useEffect, useState } from "react";
// import useStore from "@/app/store/useStore";
import { userItemsType } from "@/app/types/type";
import { Player } from "@lottiefiles/react-lottie-player";
import { useSessionStorage } from "@/app/hooks/useSessionStorage";

type SetProductDatas = React.Dispatch<React.SetStateAction<userItemsType[]>>;

export const onSave = async (
  productId: string,
  userId: string,
  setBuyLaterList: SetProductDatas
) => {
  // 購入履歴の登録
  await fetch(`/api/userItems/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ productId, userId }),
    cache: "no-store",
  });

  // 商品一覧を再取得してstateを更新
  const updated = await fetch(`/api/userItems/${userId}`);
  const updatedData = await updated.json();
  setBuyLaterList(updatedData);
};

export const onDelete = async (
  productId: string,
  userId: string,
  setBuyLaterList: SetProductDatas
) => {
  // 購入履歴の削除
  await fetch(`/api/userItems/${userId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ productId, userId }),
    cache: "no-store",
  });

  // 商品一覧を再取得してstateを更新
  const updated = await fetch(`/api/userItems/${userId}`);
  const updatedData = await updated.json();
  setBuyLaterList(updatedData);
};

export const AfterBuyCart = () => {
  //store情報の取得
  const userId = useSessionStorage("staffId", "0");
  const [buyLaterList, setBuyLaterList] = useState<userItemsType[]>([]);
  //アニメーションの制御
  const [Loading, setLoading] = useState(false);

  console.log(userId);
  console.log(buyLaterList);

  //DBからデータの取得
  useEffect(() => {
    if (userId === "0") return;
    setLoading(true);
    fetch(`/api/userItems/${userId}`)
      .then((res) => res.json())
      .then((data) => setBuyLaterList(data))
      .finally(() => setLoading(false));
  }, [userId]);

  // buyボタン(購入)(CartDialog内)
  const handleAdd = (productId: string) => {
    startTransition(() => {
      onSave(productId, userId, setBuyLaterList);
    });
  };
  //削除ボタン
  const handleDelete = (productId: string) => {
    startTransition(() => {
      onDelete(productId, userId, setBuyLaterList);
    });
  };

  return (
    <>
      <div className="p-4 bg-gray-100 rounded-lg">
        <div className="flex">
          <h3 className="text-2xl font-bold mb-4 text-center text-gray-800">
            buy later list
          </h3>
        </div>
        {Loading ? (
          <Player
            autoplay
            loop
            src="/lottie/Loading.json"
            style={{
              height: "100px",
              width: "100px",
            }}
          />
        ) : buyLaterList.length <= 0 ? (
          <p className="text-center text-gray-500 italic">
            Your buy later list is empty :(
          </p> //後で買うが空
        ) : (
          <ul className="space-y-4 text-base text-gray-800">
            {buyLaterList.map((item, i) => (
              <li
                key={i}
                className="flex flex-col lg:flex-row items-center justify-between bg-pink-100 rounded-xl p-3 shadow-sm relative"
              >
                <div className="w-1/2 flex items-center">
                  <p className="w-3/4 font-semibold text-lg">
                    {item.productName}
                  </p>
                  <p className="w-1/4 text-gray-600">{item.productId}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="flex justify-center gap-4 mt-6">
        <button
          className="btn bg-pink-400 text-white hover:bg-pink-500 btn-lg px-6 py-2 font-semibold rounded-lg"
          onClick={() => handleAdd("u28943")}
        >
          add
        </button>
        <button
          className="btn bg-pink-400 text-white hover:bg-pink-500 btn-lg px-6 py-2 font-semibold rounded-lg"
          onClick={() => handleDelete("u28943")}
        >
          delete
        </button>
      </div>
    </>
  );
};
