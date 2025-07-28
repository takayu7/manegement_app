// ファイル名: EditDialog.tsx
"use client";
import React, { useState, useEffect } from "react";
// import { Dispatch, SetStateAction } from "react";
import { Product } from "@/app/types/type";
import { ListPlus, Plus, Minus } from "lucide-react";

export interface EditDialogProps {
  product: Product | null;
  onSave: (product: Product) => void;
}

const defaultData: Product = {
  id: "",
  name: "",
  category: 1,
  supplier: 1,
  count: 0,
  cost: 0,
  order: 0,
  price: 0,
  explanation: "",
};
export const OrderDialog: React.FC<EditDialogProps> = ({ product, onSave }) => {
  const [editProduct, setEditProduct] = useState<Product>(defaultData);

  useEffect(() => {
    setEditProduct(product ? { ...product } : defaultData);
  }, [product]);

  const stock = product?.count || 0;

  return (
    <dialog id="OrderDialog" className="modal md:p-5">
      <div className="modal-box max-w-5xl p-10 lg:w-1/3">
        <ul className="text-xl font-medium space-y-5 mb-5">
          {/* 商品名 */}
          <li className="flex items-center justify-center">
            <span>{editProduct.name || "No Name"}</span>
          </li>
          <li className="flex items-center flex-col md:flex-row md:justify-between">
            <label>count：</label>
            <div className="flex items-center justify-center gap-4">
              <label>{stock}</label>
              <label>→</label>
              <label>{editProduct.count}</label>
            </div>
            <div className="flex items-center gap-4 mt-3 md:mt-0">
              <button
                className="btn btn-outline btn-success btn-sm"
                onClick={() => {
                  setEditProduct({
                    ...editProduct,
                    count: editProduct.count + 1,
                    order: editProduct.order + 1,
                  });
                }}
              >
                <Plus />
              </button>
              <button
                className="btn btn-outline btn-error btn-sm"
                onClick={() => {
                  if (stock < editProduct.count) {
                    setEditProduct({
                      ...editProduct,
                      count: editProduct.count - 1,
                      order: editProduct.order - 1,
                    });
                  }
                }}
              >
                <Minus />
              </button>
            </div>
          </li>
        </ul>
        <div className="modal-action flex justify-center gap-2">
          <form method="dialog" className="flex justify-center gap-2">
            <button
              type="submit"
              className="btn btn-outline btn-success md:btn-wide"
              onClick={() => onSave(editProduct)}
            >
              <ListPlus />
              OK
            </button>
            <button className="btn md:btn-wide">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  );
};
