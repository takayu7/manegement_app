"use client";
import React, { startTransition, useEffect, useState } from "react";
import { userItemsType, CartItem } from "@/app/types/type";
import dynamic from "next/dynamic";
const Player = dynamic(
  () => import("@lottiefiles/react-lottie-player").then((mod) => mod.Player),
  { ssr: false }
);
import { useSessionStorage } from "@/app/hooks/useSessionStorage";
import { Trash2, ShoppingCart } from "lucide-react";
import useStore from "@/app/store/useStore";

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

interface AfterBuyCartProps {
  buyLaterList: userItemsType[];
  setBuyLaterList: React.Dispatch<React.SetStateAction<userItemsType[]>>;
}

export const AfterBuyCart: React.FC<AfterBuyCartProps> = ({
  buyLaterList,
  setBuyLaterList,
}) => {
  //store情報の取得
  const userId = useSessionStorage("staffId", "0");
  // const [buyLaterList, setBuyLaterList] = useState<userItemsType[]>([]);
  //アニメーションの制御
  const [Loading, setLoading] = useState(false);
  const addStoreCartItem = useStore((state) => state.addStoreCartItem);
  const cartItems = useStore((state) => state.cartItem);

  //DBからデータの取得
  useEffect(() => {
    if (userId === "0") return;
    setLoading(true);
    fetch(`/api/userItems/${userId}`)
      .then((res) => res.json())
      .then((data) => setBuyLaterList(data))
      .finally(() => setLoading(false));
  }, [userId, setBuyLaterList]);

  // cartに追加ボタン
  const handleAdd = (productId: string) => {
    setLoading(true);
    fetch(`/api/product/${productId}`)
      .then((res) => res.json())
      .then((data) => {
        const newData = data[0];
        const newItem: CartItem = {
          id: newData.id,
          name: newData.name,
          buyCount: 1,
          price: newData.price,
          count: newData.count,
        };

        console.log(newData);
        console.log(newItem);
        if (!cartItems.some((i) => i.id === newItem.id)) {
          addStoreCartItem(newItem);
        }
        console.log(cartItems);
      })
      .finally(() => setLoading(false));
    //後で買うリストから削除
    startTransition(() => {
      onDelete(productId, userId, setBuyLaterList);
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
        ) : buyLaterList.length <= 0 ||
          buyLaterList.some((data) => data.productId === null) ? (
          <p className="text-center text-gray-500 italic">
            Your buy later list is empty :(
          </p> //後で買うが空
        ) : (
          <ul className="space-y-4 text-base text-gray-800">
            {buyLaterList.map((item, index) => (
              <li
                key={index}
                className="flex flex-col lg:flex-row items-center justify-between bg-pink-100 rounded-xl p-3 shadow-sm relative"
              >
                <div className="w-1/2 flex items-center">
                  <p className="w-3/4 font-semibold text-lg">
                    {item.productName}
                  </p>
                </div>

                <div className="w-1/4 flex items-center justify-end gap-2 lg:gap-4">
                  <button
                    type="button"
                    className="btn btn-ghost btn-success btn-circle hover:text-white group relative"
                    onClick={() => handleAdd(item.productId)}
                  >
                    <ShoppingCart />
                    <span
                      className="opacity-0 w-[70px] h-[20px] invisible rounded text-[12px]
                      font-bold text-white bg-slate-500 top-11 -left-4.5
           group-hover:visible group-hover:opacity-100 absolute "
                    >
                      cart
                    </span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost btn-error btn-circle hover:text-white group relative"
                    onClick={() => handleDelete(item.productId)}
                  >
                    <Trash2 />
                    <span
                      className="opacity-0 w-[70px] h-[20px ] invisible rounded text-[12px] 
          font-bold text-white bg-slate-500 top-11 -left-4.5
           group-hover:visible group-hover:opacity-100 absolute "
                    >
                      delete
                    </span>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};
