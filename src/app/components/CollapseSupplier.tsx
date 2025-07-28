import React from "react";
import { Supplier } from "@/app/types/type";
import { revalidatePath } from "next/cache";
import { RegisterSupplier } from "./RegisterSupplier";
import { createSupplier } from "@/app/lib/api";
import { ShowSupplierIfomation } from "@/app/components/ShowSupplierIfomation";

export const CollapseSupplier = () => {
  const handleSave = async (supplier: Supplier) => {
    "use server";
    console.log("supplier:", supplier);
    await createSupplier(supplier);
    // ページを再取得
    revalidatePath("/setting");
  };

  return (
    <>
      <div className="bg-base-100 border-base-300 collapse border">
        <input type="checkbox" className="peer" />
        <div className="collapse-title bg-[#6E6B41] text-[30px] text-primary-content text-center peer-checked:bg-[#3F9877] peer-checked:text-secondary-content">
          Supplier
        </div>
        <div
          className="collapse-content flex flex-row bg-[#6E6B41]
         text-primary-content peer-checked:bg-[#3F9877] peer-checked:text-secondary-content"
        >
          {/* Supplier登録 */}
          <RegisterSupplier onSave={handleSave} />
          {/* Supplier情報表示 */}
          <ShowSupplierIfomation />
        </div>
      </div>
    </>
  );
};
