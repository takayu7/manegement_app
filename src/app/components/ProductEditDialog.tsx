// ファイル名: EditDialog.tsx
"use client";
import React, { useState, useEffect } from "react";
// import { Dispatch, SetStateAction } from "react";
import { Product, Category, Supplier } from "@/app/types/type";
import { ListPlus } from "lucide-react";

export interface EditDialogProps {
  product: Product | null;
  categoryList: Category[];
  supplierList: Supplier[];
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

export const ProductEditDialog: React.FC<EditDialogProps> = ({
  product,
  categoryList,
  supplierList,
  onSave,
}) => {
  const [editProduct, setEditProduct] = useState<Product>(defaultData);

  useEffect(() => {
    setEditProduct(product ? { ...product } : defaultData);
  }, [product]);

  return (
    <dialog id="ProductEditDialog" className="modal md:p-5">
      <div className="modal-box max-w-5xl p-10 lg:w-1/3">
        <ul className="text-xl font-medium space-y-3 mb-5">
          {/* 商品名 */}
          <li className="flex flex-col gap-1 md:items-center md:gap-4 md:flex-row">
            <label className="w-40">name :</label>
            <input
              id="name"
              name="name"
              value={editProduct.name}
              onChange={(e) =>
                setEditProduct({ ...editProduct, name: e.target.value })
              }
              placeholder="name"
              className="input rounded-sm border-2 p-1 text-lg md:mx-5 "
            />
          </li>
          {/* カテゴリ */}
          <li className="flex flex-col gap-1 md:items-center md:gap-4 md:flex-row">
            <label className="w-40">category :</label>
            <select
              id="category"
              name="category"
              value={editProduct.category}
              required
              onChange={(e) =>
                setEditProduct({
                  ...editProduct,
                  category: Number(e.target.value),
                })
              }
              className="select rounded-sm border-2 p-1 text-lg md:mx-5"
            >
              {categoryList.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </li>
          {/* 説明 */}
          <li className="flex flex-col gap-1 md:items-center md:gap-4 md:flex-row">
            <label className="w-40">explanation :</label>
            <textarea
              name="explanation"
              value={editProduct.explanation}
              onChange={(e) =>
                setEditProduct({ ...editProduct, explanation: e.target.value })
              }
              placeholder="explanation"
              className="rounded-sm border-2 p-1 text-lg textarea md:mx-5"
            />
          </li>
          {/* 仕入れ先 */}
          <li className="flex flex-col gap-1 md:items-center md:gap-4 md:flex-row">
            <label className="w-40">supplier：</label>
            <div className="flex flex-wrap gap-2 md:mx-5">
              {supplierList.map((supplier) => (
                <div key={supplier.id} className="flex items-center">
                  <input
                    type="radio"
                    name="supplier"
                    value={supplier.id}
                    checked={editProduct.supplier === supplier.id}
                    onChange={(e) =>
                      setEditProduct({
                        ...editProduct,
                        supplier: Number(e.target.value),
                      })
                    }
                    className="ml-5 mr-2 radio radio-success"
                  />
                  <span className="text-sm">{supplier.name}</span>
                </div>
              ))}
            </div>
          </li>
          {/* 原価 */}
          <li className="flex items-center gap-4">
            <label className="w-40">cost：</label>
            <input
              id="cost"
              name="cost"
              type="text"
              value={editProduct.cost}
              onChange={(e) => {
                const v = e.target.value;
                if (/^\d*$/.test(v)) {
                  setEditProduct({
                    ...editProduct,
                    cost: v === "" ? 0 : Number(v),
                  });
                }
              }}
              placeholder="cost"
              className="input rounded-sm mx-5 p-1 text-lg"
            />
          </li>
          {/* 販売価格 */}
          <li className="flex items-center gap-4">
            <label className="w-40">price：</label>
            <input
              id="price"
              name="price"
              type="text"
              value={editProduct.price}
              onChange={(e) => {
                const v = e.target.value;
                if (/^\d*$/.test(v)) {
                  setEditProduct({
                    ...editProduct,
                    price: v === "" ? 0 : Number(v),
                  });
                }
              }}
              placeholder="price"
              className="input rounded-sm mx-5 p-1 text-lg"
            />
          </li>
          {/* 個数 */}
          <li className="flex items-center gap-4">
            <label className="w-40">count：</label>
            <input
              id="count"
              name="count"
              type="text"
              value={editProduct.count}
              onChange={(e) => {
                const v = e.target.value;
                if (/^\d*$/.test(v)) {
                  setEditProduct({
                    ...editProduct,
                    count: v === "" ? 0 : Number(v),
                  });
                }
              }}
              placeholder="count"
              className="input rounded-sm mx-5 p-1 text-lg"
            />
          </li>
          {/* 発注数 */}
          <li className="flex items-center gap-4">
            <label className="w-40">order：</label>
            <input
              id="order"
              name="order"
              type="text"
              value={editProduct.order}
              onChange={(e) => {
                const v = e.target.value;
                if (/^\d*$/.test(v)) {
                  setEditProduct({
                    ...editProduct,
                    order: v === "" ? 0 : Number(v),
                  });
                }
              }}
              placeholder="order"
              className="input rounded-sm mx-5 p-1 text-lg"
            />
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
