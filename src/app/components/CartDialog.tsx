// components/CartDialog.tsx

import { jpMoneyChange } from "@/app/lib/utils";
import { Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { CartItem, Product } from "@/app/types/type";
// import React, { useState, useTransition } from "react";

interface CartDialogProps {
  product: Product[];
  cartItems: CartItem[];
  onClose: () => void;
  onSave: (item: CartItem[]) => void; //buyボタン
  onDelete: (id: string) => void;
}

export const CartDialog: React.FC<CartDialogProps> = ({
  cartItems,
  onClose,
  onSave,
  onDelete,
}) => {
  // const [deleteCartItem, setDeleteCartItem] = useState<string | null>(null);
  // const [itemsInCart, setItemsInCart] = useState(0);
  // const [isPending, startTransition] = useTransition();

  //カート内商品の合計金額
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.buyCount,
    0
  );

  //購入ボタン
  const handleBuy = (cart: CartItem[]) => {
    if (cartItems.length === 0) return;

    onSave(cart);

    //トースト
    toast.success("Thank you for your purchase!!", {
      position: "bottom-right",
      autoClose: 4000, //4秒
      theme: "colored",
    });
  };


  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl shadow-lg w-[500px] ">
        <h2 className="text-2xl font-bold mb-4 flex justify-center">Cart</h2>
        {cartItems.length === 0 ? (
          <p>Your cart is empty :( </p> //カートが空の場合
        ) : (
          <ul className="space-y-4 text-lg">
            {cartItems.map((item) => (
              <li key={item.id} className="flex justify-between items-center">
                <label>{item.name}</label>
                <p>
                  ¥{item.price} × {item.buyCount}set = ¥
                  {item.buyCount * item.price}
                </p>
                {/* <p>{jpMoneyChange(item.price)} × {item.buyCount}set = {jpMoneyChange(item.price * item.buyCount)}</p> */}
                <button
                  type="submit"
                  className="btn btn-ghost rounded-lg"
                  onClick={() => onDelete(item.id)}
                >
                  <Trash2 />
                </button>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-8 font-bold flex justify-end">
          Total:{jpMoneyChange(total)}
        </p>
        <div className="flex justify-center gap-3">
          <button className="btn btn-success mt-4" onClick={() => handleBuy(cartItems)} disabled={cartItems.length === 0}>
            Buy
          </button>
          <button className="btn btn-error mt-4" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
