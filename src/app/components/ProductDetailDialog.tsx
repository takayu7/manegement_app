// ファイル名: EditDialog.tsx
"use client";
import React, { useState, useEffect } from "react";
import { Category } from "@/app/types/type";
import { jpMoneyChange } from "@/app/lib/utils";
import { SalesData } from "@/app/components/Parameter";
import { salesCheck } from "@/app/components/Parameter"

export interface EditDialogProps {
  product: SalesData;
  categoryList: Category[];
}

const defaultData: SalesData = {
  name: "",
  category: 1,
  cost: 0,
  price: 0,
  count: 0,
  order: 0,
  countPercent: 0,
};

export const ProductDetailDialog: React.FC<EditDialogProps> = ({
  product,
  categoryList,
}) => {
  const [editProduct, setEditProduct] = useState<SalesData>(defaultData);

  useEffect(() => {
    setEditProduct(product ? { ...product } : defaultData);
  }, [product]);

  // ダイアログの枠外クリックで閉じる
  const handleDialogClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === e.currentTarget) {
      e.currentTarget.close();
    }
  };
  // 枠内クリックは伝播を止める
  const handleBoxClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <dialog
      id="ProductDetailDialog"
      className="modal md:p-5"
      onClick={handleDialogClick}
    >
      <div
        className="modal-box max-w-5xl p-10 lg:w-1/2"
        onClick={handleBoxClick}
      >
        <ul className="text-xl grid grid-cols-2 font-medium space-y-3 mb-5">
          {/* 商品名 */}
          <li className="flex flex-col gap-1 md:items-center md:gap-4 md:flex-row">
            <label className="w-30">name :</label>
            <label className="text-lg">{editProduct.name || "No Name"}</label>
          </li>
          {/* カテゴリ */}
          <li className="flex flex-col gap-1 md:items-center md:gap-4 md:flex-row">
            <label className="w-30">category :</label>
            <label className="text-lg">
              {categoryList.find(
                (category) => category.id === editProduct.category
              )?.name || "No Category"}
            </label>
          </li>
          {/* 原価 */}
          <li className="flex items-center gap-4">
            <label className="w-30">cost：</label>
            <label className="text-lg">
              {editProduct.cost ? jpMoneyChange(editProduct.cost) : "0"}
            </label>
          </li>
          {/* 販売価格 */}
          <li className="flex items-center gap-4">
            <label className="w-30">price：</label>
            <label className="text-lg">
              {editProduct.price ? jpMoneyChange(editProduct.price) : "0"}
            </label>
          </li>
          {/* 個数 */}
          <li className="flex items-center gap-4">
            <label className="w-30">count：</label>
            <label className="text-lg">
              {editProduct.count ? editProduct.count : "0"} set
            </label>
          </li>
          {/* 発注数 */}
          <li className="flex items-center gap-4">
            <label className="w-30">order：</label>
            <label className="text-lg">
              {editProduct.order ? editProduct.order.toLocaleString() : "0"} set
            </label>
          </li>
          {/* 利益 */}
          <li className="flex items-center gap-4">
            <label className="w-30">profit：</label>
            <label className="text-lg">
              {jpMoneyChange(editProduct.price - editProduct.cost)}
            </label>
          </li>
          {/* 利益率 */}
          <li className="flex items-center gap-4">
            <label className="w-30">intRate：</label>
            <label className="text-lg">
              {Math.floor((1 - editProduct.cost / editProduct.price) * 100)}%
            </label>
          </li>
           {/* 現状利益 */}
          <li className="flex items-center gap-4">
            <label className="w-30">totalProfit：</label>
            <label className="text-lg">
              {jpMoneyChange(salesCheck(editProduct))}
            </label>
          </li>
          {/* 何個売れば利益でるか */}
          <li className="flex items-center gap-4">
            <label className="w-30">Break-even：</label>
            <label className="text-lg">
              {Math.floor((editProduct.cost * editProduct.order) / editProduct.price)}set
            </label>
          </li>
        </ul>
      </div>
    </dialog>
  );
};
