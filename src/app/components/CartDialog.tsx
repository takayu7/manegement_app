// components/CartDialog.tsx

import { jpMoneyChange } from "@/app/lib/utils";
import { Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { CartItem, Product, BuyProductList } from "@/app/types/type";
import { Plus, Minus, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { useSessionStorage } from "@/app/hooks/useSessionStorage";

// import React, { useState, useTransition } from "react";

interface CartDialogProps {
  product: Product[];
  cartItems: CartItem[];
  onClose: () => void;
  onSave: (item: CartItem[], product: BuyProductList[]) => void; //buyボタン
  onDelete: (id: string) => void;
}

export const CartDialog: React.FC<CartDialogProps> = ({
  cartItems,
  onClose,
  onSave,
  onDelete,
}) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [buyItems, setBuyItems] = useState<BuyProductList[]>([]);

  const userId = useSessionStorage("staffId", "0");

  //カート内商品の合計金額
  const total = items.reduce(
    (sum, item) => sum + item.price * item.buyCount,
    0
  );

  //購入ボタン
  const handleBuy = (cart: CartItem[], product: BuyProductList[]) => {
    if (items.length === 0) return;

    onSave(cart, product);

    //トースト
    toast.error("Thank you for your purchase!!", {
      position: "bottom-right",
      autoClose: 4000, //4秒
      theme: "colored",
    });
  };

  useEffect(() => {
    // const newItmesList=cartItems.map((item)=>({...item, userId:userId}))
    const result: BuyProductList[] = cartItems.map((item) => ({
      id: item.id,
      userid: userId,
      name: item.name,
      // category: item.category,
      price: item.price,
      count: item.count,
      buyDate: null,
    }));
    console.log(result);
    setBuyItems(result);

    setItems(cartItems);
  }, [cartItems, userId]);

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

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center">
        <div className="bg-white p-5 lg:p-8 rounded-2xl w-full max-w-[600px] relative">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
            Cart
          </h2>
          {items.length === 0 ? (
            <p className="text-center text-gray-500 italic">
              Your cart is empty :(
            </p> //カートが空の場合
          ) : (
            <ul className="space-y-4 text-base text-gray-800">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex flex-col lg:flex-row items-center justify-between bg-pink-100 rounded-xl p-2 lg:p-3 shadow-sm relative gap-2"
                >
                  <div className="flex flex-row lg:flex-col items-center">
                    <p className="font-semibold text-lg">{item.name}</p>
                    <p className=" text-gray-600">
                      {jpMoneyChange(item.price)}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      <button
                        className="btn btn-sm lg:btn-md btn-outline btn-circle"
                        onClick={() => handleDecrease(item.id)}
                      >
                        <Minus />
                      </button>
                      <label>{item.buyCount}</label>
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

                  <div className="flex items-center gap-2 lg:gap-4">
                    <p className="text-blue-900 font-bold text-lg flex justify-center">
                      {jpMoneyChange(item.price * item.buyCount)}
                    </p>
                    <button
                      type="button"
                      className="btn btn-ghost btn-error btn-circle hover:text-white"
                      onClick={() => onDelete(item.id)}
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

          <div className="flex justify-center gap-4 mt-6">
            <button
              className="btn bg-pink-400 text-white hover:bg-pink-500 btn-lg px-6 py-2 font-semibold rounded-lg"
              onClick={() => handleBuy(items, buyItems)}
              disabled={items.length === 0}
            >
              <ShoppingBag />
              Buy
            </button>
            <button
              className="btn bg-blue-900 hover:bg-blue-800 btn-lg px-6 py-2 text-white font-semibold rounded-lg"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
