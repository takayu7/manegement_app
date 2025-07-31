"use client";
import React, { useState, useTransition } from "react";
import { Download, ListRestart, ListPlus } from "lucide-react";
import { Category, Product, Supplier } from "@/app/types/type";
import { jpMoneyChange } from "@/app/lib/utils";
import { Player } from "@lottiefiles/react-lottie-player";
import { PurchaseCheckDialog } from "@/app/components/PurchaseCheckDialog";
// import { categories } from "../lib/utils";

export interface PurchaseProductProps {
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
  order: 0,
  cost: 0,
  price: 0,
  explanation: "",
};

// const [isInputChecked, setIsInputChecked] = useState(true);

export const Purchase: React.FC<PurchaseProductProps> = ({
  categoryList,
  supplierList,
  onSave,
}) => {
  const [addProduct, setAddProduct] = useState<Product>(defaultData);
  const [isPending, startTransition] = useTransition();
  const [showAirplane, setShowAirplane] = useState(false);

  // 合計金額
  const total = addProduct.cost * addProduct.count;

  // すべての入力が完了しているか
  const isAllFilled =
    addProduct.name !== "" &&
    addProduct.category !== undefined &&
    addProduct.explanation !== "" &&
    addProduct.count > 0 &&
    addProduct.supplier !== undefined &&
    addProduct.cost > 0 &&
    addProduct.price > 0;

  // 自動採番（ID）ランダム
  function id(): string {
    const letters = "abcdefghijklmnopqrstuvwxyz";
    const randomLetter = letters[Math.floor(Math.random() * letters.length)];
    const randomNumber = Math.floor(Math.random() * 100000)
      .toString()
      .padStart(5, "0");
    return randomLetter + randomNumber;
  }

  //addボタン
  const handleAdd = () => {
    // const newId = id(latestId);
    const newId = id();
    const productWithId = { ...addProduct, id: newId };
    setAddProduct(productWithId);

    console.log(productWithId);
    startTransition(() => {
      onSave(productWithId);
    });

    setShowAirplane(true);
    setTimeout(() => setShowAirplane(false), 5500);
    setAddProduct(defaultData);
    alert(JSON.stringify(productWithId, null, 2));
  };

  //resetボタン
  const handleReset = () => {
    setAddProduct(defaultData);
  };

  return (
    <>
      {showAirplane && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <Player
            autoplay
            loop={false}
            src="/lottie/Airplane.json"
            style={{ height: "100vh", width: "100vw" }}
          />
        </div>
      )}
      <main>
        <div className="flex">
          <h1 className="mb-8 lg:mb-15 text-xl md:text-4xl font-bold">
            <Download className="inline-block mr-2.5 size-8.5" />
            Purchase
          </h1>
        </div>

        {/* 商品名 */}
        <ul className="text-xl space-y-8 mb-8 lg:space-y-12 lg:mb-15">
          <li className="flex flex-col gap-1 lg:flex-row lg:items-center lg:gap-4">
            <label className=" font-semibold text-gray-700 w-43">name :</label>
            <input
              id="name"
              name="name"
              value={addProduct.name}
              onChange={(e) =>
                setAddProduct({ ...addProduct, name: e.target.value })
              }
              placeholder="name"
              className="input rounded-sm mx-5 border-2 p-1 text-lg input-success"
            />
          </li>

          {/* カテゴリ */}
          <li className="flex flex-col gap-1 lg:flex-row lg:items-center lg:gap-4">
            <label className="font-semibold text-gray-700 w-43">
              category :
            </label>
            <select
              id="category"
              name="category"
              value={addProduct.category}
              required
              onChange={(e) =>
                setAddProduct({
                  ...addProduct,
                  category: Number(e.target.value),
                })
              }
              className="select rounded-sm mx-5 border-2 p-1 text-lg select-success"
            >
              {categoryList.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </li>

          {/* 商品説明 */}
          <li className="flex flex-col gap-1 lg:flex-row lg:items-center lg:gap-4">
            <label className="font-semibold text-gray-700 w-43">
              explanation :
            </label>
            <textarea
              name="explanation"
              value={addProduct.explanation}
              onChange={(e) =>
                setAddProduct({ ...addProduct, explanation: e.target.value })
              }
              placeholder="explanation"
              className="rounded-sm mx-5 border-2 p-1 text-lg textarea textarea-success"
            />
          </li>

          {/* 仕入れ数 */}
          <li className="flex flex-col gap-1 lg:flex-row lg:items-center lg:gap-4">
            <label className="font-semibold text-gray-700 w-43">count :</label>
            <input
              name="count"
              type="text"
              value={addProduct.count === null ? "" : addProduct.count}
              onChange={(e) => {
                const v = e.target.value;
                if (/^\d*$/.test(v)) {
                  setAddProduct({
                    ...addProduct,
                    count: v === "" ? 0 : Number(v),
                    order: v === "" ? 0 : Number(v),
                  });
                }
              }}
              placeholder="count"
              className="input rounded-sm mx-5 border-2 p-1 text-lg input-success"
            />
          </li>

          {/* 仕入れ先 */}
          <li className="flex flex-col gap-1 lg:flex-row lg:items-center lg:gap-4">
            <label className=" font-semibold text-gray-700 w-43">
              supplier：
            </label>
            <div
              className="flex gap-4 flex-col lg:flex-row
          "
            >
              {supplierList.map((supplier) => (
                <label key={supplier.id} className="flex items-center">
                  <input
                    type="radio"
                    name="supplier"
                    value={supplier.id}
                    checked={addProduct.supplier === supplier.id}
                    onChange={(e) =>
                      setAddProduct({
                        ...addProduct,
                        supplier: Number(e.target.value),
                      })
                    }
                    className="ml-5 mr-2 radio radio-success"
                  />
                  <span className="text-sm">{supplier.name}</span>
                </label>
              ))}
            </div>
          </li>

          {/* 原価 */}
          <li className="flex flex-col gap-1 lg:flex-row lg:items-center lg:gap-4">
            <label className="font-semibold text-gray-700 w-43">cost：</label>
            <input
              id="cost"
              name="cost"
              type="text"
              value={addProduct.cost === null ? "" : addProduct.cost}
              onChange={(e) => {
                const v = e.target.value;
                if (/^\d*$/.test(v)) {
                  setAddProduct({
                    ...addProduct,
                    cost: v === "" ? 0 : Number(v),
                  });
                }
              }}
              placeholder="cost"
              className="input rounded-sm mx-5 border-2 p-1 text-lg input-success"
            />
          </li>

          {/* 販売価格 */}
          <li className="flex flex-col gap-1 lg:flex-row lg:items-center lg:gap-4">
            <label className="font-semibold text-gray-700 w-43">price：</label>
            <input
              id="price"
              name="price"
              type="text"
              value={addProduct.price === null ? "" : addProduct.price}
              onChange={(e) => {
                const v = e.target.value;
                if (/^\d*$/.test(v)) {
                  setAddProduct({
                    ...addProduct,
                    price: v === "" ? 0 : Number(v),
                  });
                }
              }}
              placeholder="price"
              className="input rounded-sm mx-5 border-2 p-1 text-lg input-success"
            ></input>
            {/* <span className="">
            {formatCurrency(addProduct.price)}
          </span> */}
          </li>

          <li className="flex flex-col gap-1 lg:flex-row lg:items-center lg:gap-4">
            <label className="font-semibold text-gray-700 w-43">total：</label>
            <span className="mx-10 p-1 font-bold mr-1 w-1xl text-1xl">
              {jpMoneyChange(total)}
            </span>
          </li>
        </ul>

        <div className="flex flex-col items-center lg:flex-row gap-3 lg:justify-end">
          <button
            type="button"
            className="btn btn-outline btn-success btn-xl btn-wide"
            onClick={handleAdd}
            disabled={!isAllFilled}
          >
            <ListPlus />
            add
            {isPending && (
              <span className="loading loading-dots loading-xl text-success ">
                loading
              </span>
            )}
          </button>
          <button
            type="reset"
            className="btn btn-outline btn-xl btn-wide"
            onClick={handleReset}
          >
            <ListRestart />
            reset
          </button>
        </div>
      </main>
      {/* <PurchaseCheckDialog
        product={addProduct}
        categoryList={categoryList}
        supplierList={supplierList}
        onSave={(product: Product) => {
          handleSave(product);
        }}
      /> */}
    </>
  );
};
