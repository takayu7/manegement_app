"use client";
import React, { useState, useTransition } from "react";
import { ListPlus } from "lucide-react";
import { Supplier } from "@/app/types/type";

export interface RegisterSupplierProps {
  onSave: (supplier: Supplier) => void;
}

const defaultData: Supplier = {
  id: 0,
  name: "",
};

export const RegisterSupplier: React.FC<RegisterSupplierProps> = ({
  onSave,
}) => {
  const [addSupplier, setAddSupplier] = useState<Supplier>(defaultData);
  const [isPending, startTransition] = useTransition();

  // すべての入力が完了しているか
  const isAllFilled = addSupplier.name !== "";

  // 自動採番（ID）
  async function automaticNumbering() {
    const data = await fetch("/api/suppliers");
    const suppliers = await data.json();
    let previousId = 0;
    const maxId = Math.max(
      ...suppliers.map((supplier: { id: number }) => supplier.id)
    );
    let newId = maxId + 1;
    //setAddSupplier({ ...addSupplier, id: maxId + 1 });
    //IDが連番になっているかの確認
    for (const comparedSupplier of suppliers) {
      if (comparedSupplier.id === previousId + 1) {
        previousId += 1;
      } else {
        newId = previousId + 1;
        //setAddSupplier({ ...addSupplier, id: previousId + 1 });
        break;
      }
    }
    return newId;
  }

  //addボタン
  const handleAdd = async (newId: number) => {
    const result = confirm("Would you like to register?");
    const newSupplier = { ...addSupplier, id: newId };
    if (result) {
      console.log("ID : " + newSupplier.id);
      console.log(newSupplier);
      startTransition(() => {
        onSave(newSupplier);
      });
      setAddSupplier(defaultData);
    }
  };

  const hanndleClick = async () => {
    const newId = await automaticNumbering();
    console.log(newId);
    await handleAdd(newId);
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  return (
    <>
      <div>
        {/* Name */}
        <div className="mb-[10px] flex flex-row ">
          <div className="mt-2">NAME：　</div>
          <input
            type="text"
            id="name"
            name="name"
            value={addSupplier.name}
            onChange={(e) =>
              setAddSupplier({ ...addSupplier, name: e.target.value })
            }
            placeholder="name"
            className="input input-bordered text-black md:w-[310px]"
          />
        </div>
        {/* Submit Button */}
        <div className="mt-6">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!isAllFilled || isPending}
            onClick={() => {
              hanndleClick();
            }}
          >
            <ListPlus />
            ADD
          </button>
        </div>
        {isPending && <span className="text-rose-500 text-end">update...</span>}
      </div>
    </>
  );
};
