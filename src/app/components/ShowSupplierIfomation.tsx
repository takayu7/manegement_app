"use client";
import React, { useState, useEffect } from "react";
import { Supplier } from "@/app/types/type";
import { Trash2 } from "lucide-react";

export interface RegisterSupplierProps {
  onSave: (supplier: Supplier) => void;
}

export function ShowSupplierIfomation() {
  const [supplierData, setSupplierData] = useState<Supplier[]>([]);
  //ユーザー情報の取得
  async function fetchSupplierData() {
    const data = await fetch("/api/suppliers");
    const suppliers = await data.json();
    setSupplierData(suppliers);
    console.log(suppliers);
  }

  //ユーザー情報を削除する処理
  const handleDelete = async (supplierId: string) => {
    const response = await fetch("/api/deleteSupplier", {
      method: "POST",
      headers: {
        "Context-Type": "application/json",
      },
      body: JSON.stringify({ supplierId }),
    });
    fetchSupplierData();
    const result = await response.json();
    if (result.success) {
      alert("Deletion successful！");
    } else {
      alert("Delete failed...");
    }
  };

  //ユーザー情報を削除するかどうかの確認をする処理
  const showDeleteConfirmation = async (supplierId: string) => {
    const approval = confirm("Do you want to delete the supplier?");
    if (approval) {
      handleDelete(supplierId);
    }
  };

  useEffect(() => {
    fetchSupplierData();
  }, []);

  return (
    <>
      <ul className="p-7 w-60 mt-10 md:mt-0 md:ml-30 flex flex-col text-black gap-3 bg-[#FAFAFA] rounded-[16px] ">
        {supplierData.map((data, index) => (
          <li key={index}>
            <div className="flex flex-row justify-between">
              ID：{data.id}　name：{data.name}
              <Trash2 onClick={() => showDeleteConfirmation(String(data.id))} />
            </div>
            <hr className="border-gray-400" />
          </li>
        ))}
      </ul>
    </>
  );
}
