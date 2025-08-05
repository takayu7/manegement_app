// ファイル名: EditDialog.tsx
"use client";
import React, { useEffect } from "react";
// import { Dispatch, SetStateAction } from "react";
import { Category, Supplier } from "@/app/types/type";
import { ListPlus } from "lucide-react";
import { z } from "zod";
import { MESSAGE_LIST, formatMessage } from "@/app/lib/messages";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// スキーマの作成
const formSchema = z.object({
  id: z.string(),
  name: z
    .string()
    .min(1, MESSAGE_LIST.E010100)
    .max(30, formatMessage(MESSAGE_LIST.E010106, "30")),
  category: z.number().min(1, MESSAGE_LIST.E010101),
  supplier: z.number(),
  count: z
    .string()
    .min(1, MESSAGE_LIST.E010100)
    .max(999, formatMessage(MESSAGE_LIST.E010106, "999"))
    .regex(/^[0-9]+$/, MESSAGE_LIST.E010110),
  cost: z
    .string()
    .min(1, MESSAGE_LIST.E010100)
    .max(10, formatMessage(MESSAGE_LIST.E010106, "10"))
    .regex(/^[0-9]+$/, MESSAGE_LIST.E010110),
  order: z
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
});
// 型の定義
export type ProductFormValues = z.infer<typeof formSchema>;

export interface EditDialogProps {
  product: ProductFormValues | null;
  categoryList: Category[];
  supplierList: Supplier[];
  onSave: (product: z.infer<typeof formSchema>) => void;
}

const defaultData = {
  id: "",
  name: "",
  category: 1,
  supplier: 1,
  count: "0",
  cost: "0",
  order: "0",
  price: "0",
  explanation: "",
};

export const ProductEditDialog: React.FC<EditDialogProps> = ({
  product,
  categoryList,
  supplierList,
  onSave,
}) => {
  //フォームの設定
  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onChange",
    resolver: zodResolver(formSchema), //zodとuseHooksを連携するためのライブラリ
    defaultValues: defaultData, // 初期値を設定
  });
  // モードの種類
  // "onSubmit"	フォームの送信時（handleSubmit時）	デフォルト。最もシンプル
  // "onBlur"	各フィールドからフォーカスが外れた時	入力後に即バリデーションしたいとき
  // "onChange"	各フィールドの入力値が変化するたび	リアルタイムでチェックしたいとき
  // "onTouched"	初回のフォーカスが当たってから（blur後）	使い勝手が自然なモード（推奨される場面多い）
  // "all"	onChange + onBlur + onSubmit すべて	フルリアルタイムでチェック

  //フォームの各機能を取得
  const {
    register, //入力フィールドとフォーム管理をつなぐため
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    watch, //フォーム内の値を随時取得できる
    reset, //フォーム内の値をリセット
  } = form;

  useEffect(() => {
    const formData = product ? { ...product } : defaultData;
    console.log("フォームにセットするデータ:", formData);
    reset(formData); // フォームの値を更新
  }, [product, reset]);

  return (
    <dialog id="ProductEditDialog" className="modal md:p-5">
      <div className="modal-box max-w-5xl p-10 h-4/5 lg:w-3/4">
        <form onSubmit={handleSubmit(onSave)}>
          <ul className="text-xl font-medium space-y-3 mb-5">
            {/* 商品名 */}
            <li className="flex flex-col gap-1 md:items-center md:gap-4 md:flex-row">
              <label className="w-40">name :</label>
              <input
                {...register("name")}
                id="name"
                name="name"
                value={watch("name")}
                placeholder="name"
                className={`input rounded-sm border-2 p-1 text-lg md:mx-5 ${
                  watch("name") ? "input-secondary" : ""
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.name.message}
                </p>
              )}
            </li>
            {/* カテゴリ */}
            <li className="flex flex-col gap-1 md:items-center md:gap-4 md:flex-row">
              <label className="w-40">category :</label>
              <select
                {...register("category", { valueAsNumber: true })}
                id="category"
                name="category"
                value={watch("category")}
                required
                className={`select rounded-sm border-2 p-1 text-lg md:mx-5 ${
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
            {/* 説明 */}
            <li className="flex flex-col gap-1 md:items-center md:gap-4 md:flex-row">
              <label className="min-w-40">explanation :</label>
              <textarea
                {...register("explanation")}
                name="explanation"
                value={watch("explanation")}
                placeholder="explanation"
                className={`w-full resize h-32 rounded-sm border-2 p-1 text-lg textarea md:mx-5 ${
                  watch("explanation") ? "textarea-secondary" : ""
                }`}
              />
              {errors.explanation && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.explanation.message}
                </p>
              )}
            </li>
            {/* 仕入れ先 */}
            <li className="flex flex-col gap-1 md:items-center md:gap-4 md:flex-row">
              <label className="min-w-40">supplier：</label>
              {typeof watch("supplier") === "undefined" ? (
                <div>Loading...</div>
              ) : (
                <div className="flex flex-col lg:grid grid-cols-3 gap-2 md:mx-5">
                  {supplierList.map((supplier) => (
                    <div key={supplier.id} className="flex items-center">
                      <input
                        {...register("supplier", { valueAsNumber: true })}
                        type="radio"
                        value={Number(supplier.id)}
                        checked={Number(watch("supplier")) === supplier.id}
                        onChange={(e) => {
                          form.setValue("supplier", Number(e.target.value));
                        }}
                        className="mr-2 radio radio-secondary"
                      />
                      <span className="text-sm">{supplier.name}</span>
                    </div>
                  ))}
                </div>
              )}
              {errors.supplier && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.supplier.message}
                </p>
              )}
            </li>
            {/* 原価 */}
            <li className="flex flex-col md:items-center md:gap-4 md:flex-row">
              <label className="min-w-40">cost：</label>
              <input
                {...register("cost")}
                id="cost"
                min={0}
                name="cost"
                type="text"
                value={watch("cost")}
                placeholder="cost"
                className={`input rounded-sm md:mx-5 p-1 text-lg ${
                  watch("cost") ? "input-secondary" : ""
                }`}
              />
              {errors.cost && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.cost.message}
                </p>
              )}
            </li>
            {/* 販売価格 */}
            <li className="flex flex-col md:items-center md:gap-4 md:flex-row">
              <label className="min-w-40">price：</label>
              <input
                {...register("price")}
                id="price"
                name="price"
                type="text"
                value={watch("price")}
                placeholder="price"
                className={`input rounded-sm md:mx-5 p-1 text-lg ${
                  watch("price") ? "input-secondary" : ""
                }`}
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.price.message}
                </p>
              )}
            </li>
            {/* 個数 */}
            <li className="flex flex-col md:items-center md:gap-4 md:flex-row">
              <label className="min-w-40">count：</label>
              <input
                {...register("count")}
                id="count"
                name="count"
                type="text"
                value={watch("count")}
                placeholder="count"
                className={`input rounded-sm md:mx-5 p-1 text-lg ${
                  watch("count") ? "input-secondary" : ""
                }`}
              />
              {errors.count && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.count.message}
                </p>
              )}
            </li>
            {/* 発注数 */}
            <li className="flex flex-col md:items-center md:gap-4 md:flex-row">
              <label className="min-w-40">order：</label>
              <input
                {...register("order")}
                id="order"
                name="order"
                type="text"
                value={watch("order")}
                placeholder="order"
                className={`input rounded-sm md:mx-5 p-1 text-lg ${
                  watch("order") ? "input-secondary" : ""
                }`}
              />
              {errors.order && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.order.message}
                </p>
              )}
            </li>
          </ul>
          <div className="modal-action flex justify-center gap-2">
            <button
              type="submit"
              onClick={() => {
                const dialog = document.getElementById(
                  "ProductEditDialog"
                ) as HTMLDialogElement | null;
                if (dialog) dialog.close();
              }}
              disabled={!isValid || isSubmitting}
              className="btn btn-outline btn-secondary md:btn-wide"
            >
              <ListPlus />
              Save
            </button>
            <button
              type="button"
              onClick={() => {
                const dialog = document.getElementById(
                  "ProductEditDialog"
                ) as HTMLDialogElement | null;
                if (dialog) dialog.close();
              }}
              className="btn md:btn-wide"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};
