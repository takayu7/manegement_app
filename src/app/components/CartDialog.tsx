// components/CartDialog.tsx

import React from "react";
import { jpMoneyChange } from "@/app/lib/utils";
import { Trash2 } from "lucide-react";

type CartItem = {
  id: string;
  name: string;
  count: number;
  price: number;
};

interface CartDialogProps {
  cartItems: CartItem[];
  onClose: () => void;
  onDelete: (productId: string) => void;
}

export const CartDialog: React.FC<CartDialogProps> = ({
  cartItems,
  onClose,
  onDelete,
}) => {
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.count,
    0
  );

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl shadow-lg w-[500px] ">
        <h2 className="text-2xl font-bold mb-4 flex justify-center">Cart</h2>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <ul className="space-y-4 text-lg">
            {cartItems.map((item) => (
              <li key={item.id} className="flex justify-between items-center">
                <label>{item.name}</label>
                <p>
                  ¥{item.price} × {item.count}set = ¥{item.count * item.price}
                </p>
                {/* <p>{jpMoneyChange(item.price)} × {item.count}set = {jpMoneyChange(item.price * item.count)}</p> */}
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
          <button className="btn btn-success mt-4">Buy</button>
          <button className="btn btn-error mt-4" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
