"use client";
import React, { useState, useEffect, useTransition } from "react";
import { Download, ListRestart, ListCheck } from "lucide-react";
import { Category, Product, Supplier } from "@/app/types/type";
import { jpMoneyChange } from "@/app/lib/utils";
import { Player } from "@lottiefiles/react-lottie-player";
import { PurchaseCheckDialog } from "@/app/components/purchase/CheckPurchaseDialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { MESSAGE_LIST, formatMessage } from "@/app/lib/messages";

const productNumTypeChange = (product: ProductFormValues) => {
  const changedProduct: Product = {
    id: product.id,
    name: product.name,
    category: product.category,
    supplier: Number(product.supplier),
    count: Number(product.count), // 数値に変換
    cost: Number(product.cost), // 数値に変換
    price: Number(product.price), // 数値に変換
    explanation: product.explanation,
    order: Number(product.order),
  };
  return changedProduct;
};

//スキーマの作成
const formSchema = z.object({
  id: z.string(),
  name: z
    .string()
    .min(1, MESSAGE_LIST.E010100)
    .max(30, formatMessage(MESSAGE_LIST.E010106, "30")),
  category: z.number().min(1, MESSAGE_LIST.E010101),
  supplier: z.string(),
  count: z
    .string()
    .min(1, MESSAGE_LIST.E010100)
    .max(3, formatMessage(MESSAGE_LIST.E010106, "3"))
    .regex(/^[0-9]+$/, MESSAGE_LIST.E010110),
  cost: z
    .string()
    .min(1, MESSAGE_LIST.E010100)
    .max(10, formatMessage(MESSAGE_LIST.E010106, "10"))
    .regex(/^[0-9]+$/, MESSAGE_LIST.E010110),
  price: z
    .string()
    .min(1, MESSAGE_LIST.E010100)
    .max(10, formatMessage(MESSAGE_LIST.E010106, "10"))
    .regex(/^[0-9]+$/, MESSAGE_LIST.E010110),
  explanation: z
    .string()
    .min(1, MESSAGE_LIST.E010100)
    .max(300, formatMessage(MESSAGE_LIST.E010106, "300")),
  order: z.string(),
});

//初期値
const defaultData = {
  id: "a11111",
  name: "",
  category: 1,
  supplier: "",
  count: "",
  order: "",
  cost: "",
  price: "",
  explanation: "",
};

// 型の定義
export type ProductFormValues = z.infer<typeof formSchema>;

export const Purchase = () => {
  const [addProduct, setAddProduct] = useState<ProductFormValues>(defaultData);
  const [isPending, startTransition] = useTransition();
  const [showAirplane, setShowAirplane] = useState(false);
  const [isCheckOpen, setIsCheckOpen] = useState(false);
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [supplierList, setSupplierList] = useState<Supplier[]>([]);

  //仕入れ情報の取得
  async function fetchSuppliers() {
    const data = await fetch("/api/suppliers");
    const suppliers = await data.json();
    setSupplierList(suppliers);
  }
  //カテゴリ情報の取得
  async function fetchCategory() {
    const data = await fetch("/api/categories");
    const categories = await data.json();
    setCategoryList(categories);
  }

  useEffect(() => {
    fetchSuppliers();
    fetchCategory();
  }, []);

  const onSave = async (product: Product) => {
    console.log("product:", product);
    const response = await fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
      cache: "no-store",
    });
    const responseText = await response.text();
    console.log("Response text:", responseText);
  };

  const {
    getValues,
    setValue,
    register,
    formState: { errors, isValid },
    watch,
    reset,
  } = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: defaultData,
  });

  // useEffect(() => {
  //   reset();
  // }, [reset]);

  // すべての入力が完了しているか
  const isAllFilled =
    watch("name") !== "" &&
    watch("category") !== undefined &&
    watch("explanation") !== "" &&
    watch("count") !== "" &&
    watch("supplier") !== undefined &&
    watch("cost") !== "" &&
    watch("price") !== "";

  // 自動採番（ID）ランダム
  function id(): string {
    const letters = "abcdefghijklmnopqrstuvwxyz";
    const randomLetter = letters[Math.floor(Math.random() * letters.length)];
    const randomNumber = Math.floor(Math.random() * 100000)
      .toString()
      .padStart(5, "0");
    return randomLetter + randomNumber;
  }

  //checkボタン
  const handleCheck = () => {
    const newId = id();
    const newProduct = watch();
    const productWithId = { ...newProduct, id: newId };
    console.log(productWithId);
    setAddProduct(productWithId);
    setIsCheckOpen(true);
  };

  //addボタン(ダイアログ)
  const handleAdd = (product: ProductFormValues) => {
    startTransition(() => {
      onSave(productNumTypeChange(product));
    });
    setIsCheckOpen(false);
    setShowAirplane(true);
    setTimeout(() => setShowAirplane(false), 3000);
    reset();
  };

  //resetボタン
  const handleReset = () => {
    reset();
  };

  const itmeProduct = watch("count");

  useEffect(() => {
    setValue("order", itmeProduct);
  }, [itmeProduct, setValue]);

  console.log(watch());
  console.log(isValid);

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
          <li className="flex flex-col gap-1 lg:flex-row lg:gap-4 ">
            <label className=" font-semibold text-gray-700 w-43 ">name :</label>
            <input
              {...register("name")}
              id="name"
              name="name"
              value={watch("name")}
              placeholder="name"
              className={`input rounded-sm mx-5 border-2 p-1 text-lg border-gray-500 focus:border-pink-500 focus:input-secondary${
                watch("name") ? "input-secondary" : ""
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-sm font-bold text-red-600">
                {errors.name.message}
              </p>
            )}
          </li>

          {/* カテゴリ */}
          <li className="flex flex-col gap-1 lg:flex-row lg:gap-4">
            <label className="font-semibold text-gray-700 w-43">
              category :
            </label>
            <select
              {...register("category", { valueAsNumber: true })}
              id="category"
              name="category"
              value={watch("category")}
              required
              className={`select rounded-sm mx-5 border-2 p-1 text-lg border-gray-500 focus:border-pink-500 focus:input-secondary ${
                watch("category") ? "select-secondary" : ""
              }`}
            >
              {categoryList.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">
                {errors.category.message}
              </p>
            )}
          </li>

          {/* 商品説明 */}
          <li className="flex flex-col gap-1 lg:flex-row lg:gap-4">
            <label className="font-semibold text-gray-700 w-43">
              explanation :
            </label>
            <textarea
              {...register("explanation")}
              name="explanation"
              value={watch("explanation")}
              placeholder="explanation"
              className={`rounded-sm mx-5 border-2 p-1 text-lg textarea border-gray-500 focus:border-pink-500 focus:input-secondary lg:w-120 h-50 resize ${
                watch("explanation") ? "textarea-secondary" : ""
              }`}
            />
            {errors.explanation && (
              <p className="mt-1 text-sm font-bold text-red-600 flex flex-col">
                {errors.explanation.message}
              </p>
            )}
          </li>

          {/* 発注数 */}
          <li className="flex flex-col gap-1 lg:flex-row lg:gap-4">
            <label className="font-semibold text-gray-700 w-43">count :</label>
            <input
              {...register("count")}
              name="count"
              type="text"
              value={watch("count")}
              placeholder="count"
              className={`input rounded-sm mx-5 border-2 p-1 text-lg border-gray-500 focus:border-pink-500 focus:input-secondary ${
                watch("count") ? "input-secondary" : ""
              }`}
            />
            {errors.count && (
              <p className="mt-1 text-sm text-red-600 font-bold">
                {errors.count.message}
              </p>
            )}
          </li>

          {/* 仕入れ先 */}
          <li className="flex flex-col gap-1 lg:flex-row lg:gap-4">
            <label className=" font-semibold text-gray-700 w-43">
              supplier：
            </label>
            <div className="flex gap-4 flex-col">
              {supplierList.map((supplier) => (
                <label
                  key={supplier.id}
                  className="flex items-center font-bold hover:text-pink-500 hover:underline"
                >
                  <input
                    {...register("supplier", { valueAsNumber: true })}
                    id={`supplier-${supplier.id}`}
                    type="radio"
                    name="supplier"
                    value={supplier.id}
                    className="ml-5 mr-2 radio border-gray-500 focus:radio-secondary "
                    checked={Number(watch("supplier")) === Number(supplier.id)}
                    onChange={(e) => {
                      setValue("supplier", (e.target.value));
                    }}
                  />
                  <span className="text-lg focus:text-pink-300">
                    {supplier.name}
                  </span>
                </label>
              ))}
            </div>
            {errors.supplier && (
              <p className="mt-1 text-sm text-red-600 font-bold">
                {errors.supplier.message}
              </p>
            )}
          </li>

          {/* 原価 */}
          <li className="flex flex-col gap-1 lg:flex-row lg:gap-4">
            <label className="font-semibold text-gray-700 w-43">cost：</label>
            <input
              {...register("cost")}
              id="cost"
              name="cost"
              type="text"
              value={watch("cost")}
              placeholder="cost"
              className={`input rounded-sm mx-5 border-2 p-1 text-lg border-gray-500 focus:border-pink-500 focus:input-secondary ${
                watch("cost") ? "input-secondary" : ""
              }`}
            />
            {errors.cost && (
              <p className="mt-1 text-sm text-red-600 font-bold">
                {errors.cost.message}
              </p>
            )}
          </li>

          {/* 販売価格 */}
          <li className="flex flex-col gap-1 lg:flex-row lg:gap-4">
            <label className="font-semibold text-gray-700 w-43">price：</label>
            <input
              {...register("price")}
              id="price"
              name="price"
              type="text"
              value={watch("price")}
              placeholder="price"
              className={`input rounded-sm mx-5 border-2 p-1 text-lg border-gray-500 focus:border-pink-500 focus:input-secondary${
                watch("price") ? "input-secondary" : ""
              }`}
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-600 font-bold">
                {errors.price.message}
              </p>
            )}
          </li>

          <li className="flex flex-col gap-1 lg:flex-row lg:items-center lg:gap-4">
            <label className="font-semibold text-gray-700 w-43">total：</label>
            <span className="mx-10 p-1 font-bold mr-1 w-1xl text-1xl">
              {jpMoneyChange(
                Number(getValues("cost")) * Number(getValues("count"))
              )}
            </span>
          </li>
        </ul>

        <div className="flex flex-col items-center lg:flex-row gap-3 lg:justify-end">
          <button
            type="button"
            className="btn bg-pink-400 text-white btn-xl btn-wide hover:bg-pink-500 "
            onClick={handleCheck}
            disabled={!isValid || !isAllFilled}
          >
            <ListCheck />
            check
            {isPending && (
              <span className="loading loading-dots loading-xl text-secondary ">
                loading
              </span>
            )}
          </button>
          <button
            type="reset"
            className="btn bg-blue-900 text-white btn-xl btn-wide hover:bg-blue-800"
            onClick={handleReset}
          >
            <ListRestart />
            reset
          </button>
        </div>
      </main>
      {isCheckOpen && (
        <PurchaseCheckDialog
          product={addProduct}
          categoryList={categoryList}
          supplierList={supplierList}
          onSave={handleAdd}
          onClose={() => setIsCheckOpen(false)}
        />
      )}
    </>
  );
};
