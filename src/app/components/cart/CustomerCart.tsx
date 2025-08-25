"use client";
import React, { startTransition, useEffect, useState } from "react";
import useStore from "@/app/store/useStore";
import { Product, CartItem, BuyProductList } from "@/app/types/type";
import { onSave } from "@/app/components/product/ProductList";
import { Player } from "@lottiefiles/react-lottie-player";
import { jpMoneyChange } from "@/app/lib/utils";
import { Plus, Minus, ShoppingBag, Trash2 } from "lucide-react";
import { useSessionStorage } from "@/app/hooks/useSessionStorage";

export const CustomerCart = () => {
  //store情報の取得
  const cartItems = useStore((state) => state.cartItem);
  const setStoreCartItem = useStore((state) => state.setStoreCartItem);
  const userId = useSessionStorage("staffId", "0");

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
    console.log(result);
    setBuyItems(result);
  }, [userId, items]);

  // buyボタン(購入)(CartDialog内)
  const handleBuy = (cart: CartItem[], product: BuyProductList[]) => {
    startTransition(() => {
      console.log(product);
      onSave(cart, product, setProductDatas);
    });
    setShowThanks(true);
    setTimeout(() => setShowThanks(false), 4000);
    setStoreCartItem([]);
  };

  //deleteボタン(削除)(CartDialog内)
  const handleDelete = (id: string) => {
    setStoreCartItem(cartItems.filter((item) => item.id !== id));
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
                  <p className="py-6 text-white">
                    Thank you so much for shopping with us! We’re excited for you
                    to receive your order and hope it brings you joy. Your support
                    means a lot to us!
                  </p>
                <Player
                  autoplay
                  loop={false}
                  src="/lottie/Thanks.json"
                  style={{ height: "20vh", width: "20vw" }}
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
                  className="btn btn-ghost btn-error btn-circle hover:text-white"
                  onClick={() => handleDelete(item.id)}
                >
                  <Trash2 />
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
