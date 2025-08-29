// components/CartDialog.tsx

import { jpMoneyChange } from "@/app/lib/utils";
import { Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import {
  CartItem,
  Product,
  BuyProductList,
  userItemsType,
} from "@/app/types/type";
import { Plus, Minus, ShoppingBag, ClipboardList } from "lucide-react";
import { useEffect, useState, startTransition } from "react";
import { useSessionStorage } from "@/app/hooks/useSessionStorage";
import useStore from "@/app/store/useStore";
import { onAdd } from "@/app/components/cart/CustomerCart";

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
  const [items, setItems] = useState<CartItem[]>(cartItems);
  const [buyItems, setBuyItems] = useState<BuyProductList[]>([]);
  const [buyLaterList, setBuyLaterList] = useState<userItemsType[]>([]);

  const userId = useSessionStorage("staffId", "0");

  const setStoreCartItem = useStore((state) => state.setStoreCartItem);

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

  //後で買うリストに追加ボタン
  const handleAdd = (productId: string) => {
    startTransition(() => {
      onAdd(productId, userId, setBuyLaterList);
    });
    console.log(buyLaterList)
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

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center">
        <div className="bg-white p-5 lg:p-8 rounded-2xl w-full max-w-[700px] relative overflow-auto h-3/5 flex flex-col ">
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
                  <div className="flex flex-row lg:flex-col items-center justify-center">
                    <p className="font-semibold text-lg">{item.name}</p>
                    <p className=" text-gray-800 pl-3">
                      {jpMoneyChange(item.price)}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      <button
                        className="btn btn-sm lg:btn-sm btn-outline btn-circle"
                        onClick={() => handleDecrease(item.id)}
                      >
                        <Minus />
                      </button>
                      <label>{item.buyCount}</label>
                      <button
                        className="btn btn-sm lg:btn-sm btn-outline btn-circle"
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
                      onClick={() => onDelete(item.id)}
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
              onClick={() => {
                onClose();
                setStoreCartItem(items);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
