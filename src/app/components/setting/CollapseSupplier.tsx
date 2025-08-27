import React from "react";
import { Supplier } from "@/app/types/type";
import { revalidatePath } from "next/cache";
import { RegisterSupplier } from "@/app/components/setting/RegisterSupplier";
import {
  createSupplier,
  deleteSupplierList,
  fetchSupplierList,
  updateSupplierList,
} from "@/app/lib/api";
import { ShowSupplierIfomation } from "@/app/components/setting/ShowSupplierIfomation";

export const CollapseSupplier = async () => {
  const userDataList = await fetchSupplierList();
  const handleSave = async (supplier: Supplier) => {
    "use server";
    console.log("supplier:", supplier);
    await createSupplier(supplier);
    // ページを再取得
    revalidatePath("/setting");
  };

  // 更新
  const handleUpdateSupplier = async (supplier: Supplier) => {
    "use server";
    await updateSupplierList(supplier);
    revalidatePath("/setting");
  };

  //削除
  const handleDeleteSupplier = async (id: number) => {
    "use server";
    await deleteSupplierList(id);
    revalidatePath("/setting");
  };

  return (
    <>
      <div className="bg-base-100 border-base-300 collapse border">
        <input type="checkbox" className="peer" />
        <div className="px-[16px] collapse-title bg-[#6E6B41] text-[30px] text-primary-content text-center peer-checked:bg-[#3F9877] peer-checked:text-secondary-content">
          Supplier
        </div>
        <div
          className="collapse-content flex flex-col lg:flex-row bg-[#6E6B41]
         text-primary-content peer-checked:bg-[#3F9877] peer-checked:text-secondary-content"
        >
          {/* Supplier登録 */}
          <RegisterSupplier onSave={handleSave} />
          {/* Supplier情報表示 */}
          <ShowSupplierIfomation
            supplierDataList={userDataList}
            onSave={handleUpdateSupplier}
            onDelete={handleDeleteSupplier}
          />
        </div>
      </div>
    </>
  );
};
