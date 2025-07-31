// ファイル名: EditDialog.tsx
"use client";
import React, { useState, useEffect } from "react";
import { Category } from "@/app/types/type";
import { jpMoneyChange } from "@/app/lib/utils";
import { SalesData } from "@/app/components/Parameter";
import { salesCheck } from "@/app/components/Parameter";
import { Player } from "@lottiefiles/react-lottie-player";

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

  // 損益分岐点までの個数の割合を求める
  const breakEvenPointPercent = (editProduct: SalesData) => {
    return (
      ((editProduct.order - editProduct.count) /
        ((editProduct.cost * editProduct.order) / editProduct.price)) *
      100
    );
  };

  // 損益分岐までの達成度をイラストで表示
  const progressImageShow = (editProduct: SalesData) => {
    if (breakEvenPointPercent(editProduct) < 30) {
      return "/lottie/bad.json";
    } else if (breakEvenPointPercent(editProduct) < 99) {
      return "/lottie/middle.json";
    } else {
      return "/lottie/success.json";
    }
  };

  return (
    <dialog
      id="ProductDetailDialog"
      className="modal md:p-5"
      onClick={handleDialogClick}
    >
      <div
        className="modal-box flex flex-col max-w-5xl w-11/12 p-10 lg:w-2/3 md:flex-row"
        onClick={handleBoxClick}
      >
        <ul className="text-xl grid grid-cols-1 lg:grid-cols-2 md:w-2/3 font-medium space-y-3 mb-5">
          {/* 商品名 */}
          <li className="flex gap-1 md:items-center md:gap-4">
            <label className="w-30">name :</label>
            <label className="text-lg">{editProduct.name || "No Name"}</label>
          </li>
          {/* カテゴリ */}
          <li className="flex  gap-1 md:items-center md:gap-4 ">
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
            <label className="w-36">Break-even：</label>
            <label className="text-lg">
              {Math.floor(
                (editProduct.cost * editProduct.order) / editProduct.price
              )}
              set
            </label>
          </li>
        </ul>
        <div className="flex flex-col items-center justify-center">
          <Player
            autoplay
            loop
            src={progressImageShow(editProduct)}
            style={{ height: "250px", width: "250px" }}
          />
          {(() => {
            let percent = breakEvenPointPercent(editProduct);
            percent = Number.isFinite(percent) ? percent : 0;
            percent = Math.max(0, Math.min(100, percent));
            return (
              <progress
                className={`progress bg-gray-300 w-56 ${
                  percent < 100 ? "progress-error" : "progress-success"
                }`}
                value={percent}
                max="100"
              ></progress>
            );
          })()}
        </div>
      </div>
    </dialog>
  );
};
