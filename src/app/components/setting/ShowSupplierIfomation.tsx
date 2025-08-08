"use client";
import React, { useState, useEffect, useTransition } from "react";
import { Supplier } from "@/app/types/type";
import { SquarePen, Trash2 } from "lucide-react";
import { SupplierEditDialog } from "./SupplierEditDialog";
import { Player } from "@lottiefiles/react-lottie-player";
import { DeleteSupplierDialog } from "./DeleteSupplierDialog";

export interface RegisterSupplierProps {
  supplierDataList: Supplier[];
  onSave: (supplier: Supplier) => void;
  onDelete: (supplier: number) => void;
}

export const ShowSupplierIfomation: React.FC<RegisterSupplierProps> = ({
  supplierDataList,
  onSave,
  onDelete,
}) => {
  const [supplierData, setSupplierData] =
    useState<Supplier[]>(supplierDataList);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null
  );
  const [isPending, startTransition] = useTransition();
  //ユーザー情報の取得
  async function fetchSupplierData() {
    const data = await fetch("/api/suppliers");
    const suppliers = await data.json();
    setSupplierData(suppliers);
    console.log(suppliers);
  }

  // //ユーザー情報を削除する処理
  // const handleDelete = async (supplierId: string) => {
  //   const response = await fetch("/api/deleteSupplier", {
  //     method: "POST",
  //     headers: {
  //       "Context-Type": "application/json",
  //     },
  //     body: JSON.stringify({ supplierId }),
  //   });
  //   fetchSupplierData();
  //   const result = await response.json();
  //   if (result.success) {
  //     alert("Deletion successful！");
  //   } else {
  //     alert("Delete failed...");
  //   }
  // };

  //ユーザー情報を削除するかどうかの確認をする処理
  // const showDeleteConfirmation = async (supplierId: number) => {
  //   const approval = confirm("Do you want to delete the supplier?");
  //   if (approval) {
  //     handleDelete(supplierId);
  //   }
  // };

  // 編集ダイアログの保存処理
  const handleSave = (supplier: Supplier) => {
    startTransition(() => {
      onSave(supplier); // サーバーアクションを呼ぶ
    });
  };

  // 削除ダイアログの保存処理
  const handleDelete = (id: number) => {
    startTransition(() => {
      onDelete(id); // サーバーアクションを呼ぶ
    });
  };

  useEffect(() => {
    fetchSupplierData();
  }, [supplierDataList]);

  return (
    <>
      <ul className="table p-7 mt-10 md:mt-0 md:ml-30 flex flex-col text-black gap-3 bg-[#FAFAFA] rounded-[16px]">
        {supplierData.length != 0 ? (
          <div className="flex flex-col gap-3 rounded-[16px]">
            {supplierData.map((data, index) => (
              <li key={index}>
                <div className="flex flex-row justify-between">
                  <div>
                    <div>＜ID：{data.id}＞</div>
                    <div>{data.name}</div>
                  </div>
                  <div className="flex flex-row">
                    <button
                      onClick={() => {
                        {
                          console.log(selectedSupplier);
                          setSelectedSupplier(data);
                          (
                            document.getElementById(
                              "SupplierEditDialog"
                            ) as HTMLDialogElement
                          )?.showModal();
                        }
                      }}
                      className="btn btn-ghost rounded-lg"
                    >
                      <SquarePen />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedSupplier(data);
                        (
                          document.getElementById(
                            "DeleteSupplierDialog"
                          ) as HTMLDialogElement
                        )?.showModal();
                      }}
                      className="btn btn-ghost rounded-lg"
                    >
                      <Trash2 />
                    </button>
                  </div>
                </div>
                <hr className="border-gray-400" />
              </li>
            ))}
          </div>
        ) : (
          <li className="text-center mt-1.5 md:mt-3">No Data...</li>
        )}
        <SupplierEditDialog
          supplier={selectedSupplier}
          onSave={(supplier: Supplier) => {
            handleSave(supplier);
          }}
        />
        <DeleteSupplierDialog
          id={selectedSupplier?.id}
          onDelete={(id: number) => {
            handleDelete(id);
            setSelectedSupplier(null);
          }}
        />
      </ul>
      {isPending && (
        <Player
          autoplay
          loop
          src="/lottie/Loading.json"
          style={{
            height: "100px",
            width: "100px",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      )}
    </>
  );
};
