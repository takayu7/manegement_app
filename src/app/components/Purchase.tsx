"use client";
import React, { useState } from "react";
import { Download, ListRestart, ListPlus } from "lucide-react";
import { Category, Product, Supplier } from "@/app/types/type";
import { jpMoneyChange } from "@/app/lib/utils";
// import { categories } from "../lib/utils";

export interface PurchaseProductProps {
  categoryList: Category[];
  supplierList: Supplier[];
}

const defaultData: Product = {
  id: "",
  name: "",
  category: 1,
  supplier: 1,
  count: 0,
  orderCount: 0,
  cost: 0,
  price: 0,
  explanation: "",
};

// const [isInputChecked, setIsInputChecked] = useState(true);

export const Purchase: React.FC<PurchaseProductProps> = ({
  categoryList,
  supplierList,
}) => {
  const [addProduct, setAddProduct] = useState<Product>(defaultData);

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

  // 自動採番（ID）
  function id(latestId: string | null): string {
    const letters = "abcdefghijklmnopqrstuvwxyz";
    const maxNumber = 99999;

    if (latestId === null) {
      return "a00000";
    }

    const letterPart = latestId[0];
    const numberPart = parseInt(latestId.slice(1), 10);

    let nextLetterIndex = letters.indexOf(letterPart);
    let nextNumber = numberPart;

    if (nextNumber < maxNumber) {
      nextNumber += 1;
    } else {
      nextNumber = 0;
      nextLetterIndex += 1;
    }

    const newLetter = letters[nextLetterIndex];
    const newNumber = nextNumber.toString().padStart(5, "0");

    return `${newLetter}${newNumber}`;
  }

  const [latestId, setLatestId] = useState<string>(id(null));

  //addボタン
  const handleAdd = () => {
    const newId = id(latestId);
    const productWithId = { ...addProduct, id: newId };
    setLatestId(newId);
    setAddProduct(defaultData);
    alert("input contents: " + JSON.stringify(productWithId, null, 2));
  };

  //resetボタン
  const handleReset = () => {
    setAddProduct(defaultData);
  };

  return (
    <main>
      <div className="flex">
        <h1 className="mb-10 text-xl md:text-4xl font-bold">
          <Download className="inline-block mr-2.5 size-8.5" />
          Purchase
        </h1>
      </div>

      {/* 商品名 */}
      <ul className="text-xl font-medium space-y-15 mb-20">
        <li className="flex items-center gap-4">
          <label className="w-40">name :</label>
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
        <li className="flex items-center gap-4">
          <label className="w-40">category :</label>
          <select
            id="category"
            name="category"
            value={addProduct.category}
            required
            onChange={(e) =>
              setAddProduct({ ...addProduct, category: Number(e.target.value) })
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
        <li className="flex items-center gap-4">
          <label className="w-40">explanation :</label>
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
        <li className="flex items-center gap-4">
          <label className="w-40">count :</label>
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
                });
              }
            }}
            placeholder="count"
            className="input rounded-sm mx-5 border-2 p-1 text-lg input-success"
          />
        </li>

        {/* 仕入れ先 */}
        <li className="flex items-center gap-4">
          <label className="w-40">supplier：</label>
          <div className="flex gap-4">
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
        <li className="flex items-center gap-4">
          <label className="w-40">cost：</label>
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
        <li className="flex items-center gap-4">
          <label className="w-40">price：</label>
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

        <li className="flex items-center gap-4">
          <label className="w-40">total：</label>
          <span className="mx-10 p-1 font-bold mr-1 w-1xl text-1xl">
            {jpMoneyChange(total)}
          </span>
        </li>
      </ul>

      <div className="flex gap-3 mt-2 justify-end">
        <button
          type="reset"
          className="btn btn-outline btn-xl btn-wide"
          onClick={handleReset}
        >
          <ListRestart />
          reset
        </button>
        <button
          type="button"
          className="btn btn-outline btn-success btn-xl btn-wide"
          onClick={handleAdd}
          disabled={!isAllFilled}
        >
          <ListPlus />
          add
        </button>
      </div>
    </main>
  );
};
