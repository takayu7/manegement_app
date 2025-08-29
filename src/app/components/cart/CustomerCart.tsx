"use client";
import React, { startTransition, useEffect, useState } from "react";
import useStore from "@/app/store/useStore";
import { Product, CartItem, BuyProductList } from "@/app/types/type";
import { onSave } from "@/app/components/product/ProductList";
import dynamic from "next/dynamic";
const Player = dynamic(() => import("@lottiefiles/react-lottie-player").then(mod => mod.Player), { ssr: false });
import { jpMoneyChange } from "@/app/lib/utils";
import { Plus, Minus, ShoppingBag, Trash2, ClipboardList } from "lucide-react";
import { useSessionStorage } from "@/app/hooks/useSessionStorage";
import { userItemsType } from "@/app/types/type";

type SetProductDatas = React.Dispatch<React.SetStateAction<userItemsType[]>>;

export const onAdd = async (
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

interface AfterBuyCartProps {
  setBuyLaterList: React.Dispatch<React.SetStateAction<userItemsType[]>>;
}


export const CustomerCart : React.FC<AfterBuyCartProps> = ({
  setBuyLaterList,
}) => {
  //store情報の取得
  const cartItems = useStore((state) => state.cartItem);
  const setStoreCartItem = useStore((state) => state.setStoreCartItem);
  const userId = useSessionStorage("staffId", "0");
  // const [buyLaterList, setBuyLaterList] = useState<userItemsType[]>([]);

  const [items, setItems] = useState<CartItem[]>(cartItems);
  const [buyItems, setBuyItems] = useState<BuyProductList[]>([]);
  const [productDatas, setProductDatas] = useState<Product[]>([]);
  //アニメーションの制御
  const [showThanks, setShowThanks] = useState(false);
  const [showAirplane, setShowAirplane] = useState(false);
  console.log(productDatas);

  //cartItemsをitemsにセット
  useEffect(() => {
    setItems(cartItems);
  }, [cartItems]);

  useEffect(() => {
    const result: BuyProductList[] = items.map((item) => ({
      id: item.id,
      userid: userId,
      name: item.name,
      price: item.price,
      count: item.buyCount,
      buyDate: null,
    }));
    setBuyItems(result);
  }, [userId, items]);

  // buyボタン(購入)
  const handleBuy = (cart: CartItem[], product: BuyProductList[]) => {
    startTransition(() => {
      onSave(cart, product, setProductDatas);
    });
    setShowThanks(true);
    setTimeout(() => setShowThanks(false), 5000);
    setStoreCartItem([]);
  };

  //deleteボタン(削除)
  const handleDelete = (id: string) => {
    setStoreCartItem(cartItems.filter((item) => item.id !== id));
  };

  //後で買うリストに追加ボタン
  const handleAdd = (productId: string) => {
    startTransition(() => {
      onAdd(productId, userId, setBuyLaterList);
    });
    //cartから削除
    setStoreCartItem(cartItems.filter((item) => item.id !== productId));
  };

  //購入数変更ボタン（プラス）
  const handleIncrease = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, buyCount: item.buyCount + 1 } : item
      )
    );
  };

  //購入数変更ボタン（マイナス）
  const handleDecrease = (id: string) => {
    setItems(
      (prev) =>
        prev
          .map((item) =>
            item.id === id ? { ...item, buyCount: item.buyCount - 1 } : item
          )
          .filter((item) => item.buyCount > 0) //数量が0の場合は削除
    );
  };

  //カート内商品の合計金額
  const total = items.reduce(
    (sum, item) => sum + item.price * item.buyCount,
    0
  );

  return (
    <>
      {showThanks && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="hero bg-gray-600/40 min-h-screen">
            <div className="hero-content text-center">
              <div className="max-w-md">
                <h1 className="text-5xl font-bold text-white">Thank You!!</h1>
                <div className="flex items-center justify-center">
                  <Player
                    autoplay
                    loop={false}
                    src="/lottie/success.json"
                    style={{ height: "30vh", width: "30vw" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {items.length === 0 ? (
        <p className="text-center text-gray-500 italic">
          Your cart is empty :(
        </p> //カートが空の場合
      ) : (
        <ul className="space-y-4 text-base text-gray-800">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex flex-col lg:flex-row items-center justify-between bg-pink-100 rounded-xl p-3 shadow-sm relative"
            >
              <div className="w-1/2 flex items-center">
                <p className="w-3/4 font-semibold text-lg">{item.name}</p>
                <p className="w-1/4 text-gray-600">
                  {jpMoneyChange(item.price)}
                </p>
              </div>

              <div className="w-1/4 flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <button
                    className="btn btn-sm lg:btn-md btn-outline btn-circle"
                    onClick={() => handleDecrease(item.id)}
                  >
                    <Minus />
                  </button>
                  <label className="w-5 text-center">{item.buyCount}</label>
                  <button
                    className="btn btn-sm lg:btn-md btn-outline btn-circle"
                    onClick={() => handleIncrease(item.id)}
                    disabled={item.count <= item.buyCount}
                  >
                    <Plus />
                  </button>
                </div>
                <p> items</p>
              </div>

              <div className="w-1/4 flex items-center justify-end gap-2 lg:gap-4">
                <p className="text-blue-900 font-bold text-lg flex justify-center">
                  {jpMoneyChange(item.price * item.buyCount)}
                </p>
                <button
                  type="button"
                  className="btn btn-ghost btn-success btn-circle hover:text-white group relative"
                  onClick={() => handleAdd(item.id)}
                >
                  <ClipboardList />
                  <span
                    className="opacity-0 w-[74px] invisible rounded text-[12px] 
          font-bold text-white py-1 bg-slate-500 top-11 -left-4.5
           group-hover:visible group-hover:opacity-100 absolute "
                  >
                    buy later
                  </span>
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn-error btn-circle hover:text-white group relative"
                  onClick={() => handleDelete(item.id)}
                >
                  <Trash2 />
                  <span
                    className="opacity-0 w-[74px] invisible rounded text-[12px] 
          font-bold text-white py-1 bg-slate-500 top-11 -left-4.5
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
      <p className="mt-8 font-bold flex justify-end text-xl text-gray-800">
        Total:{jpMoneyChange(total)}
      </p>
      <button
        className="btn btn-dash btn-info w-full rounded-lg mt-5 text-sky-400 font-semibold hover:bg-sky-400 hover:text-white"
        disabled={items.length === 0}
        onClick={() => {
          setStoreCartItem(items);
          setShowAirplane(true);
          setTimeout(() => setShowAirplane(false), 2000);
        }}
      >
        {showAirplane ? (
          <span className="loading loading-dots loading-md" />
        ) : (
          <p>UPDATE</p>
        )}
      </button>

      <div className="flex justify-center gap-4 mt-6">
        <button
          className="btn bg-pink-400 text-white hover:bg-pink-500 btn-lg px-6 py-2 font-semibold rounded-lg"
          onClick={() => handleBuy(items, buyItems)}
          disabled={items.length === 0}
        >
          <ShoppingBag />
          Buy
        </button>
      </div>
    </>
  );
};
