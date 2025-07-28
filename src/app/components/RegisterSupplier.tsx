"use client";
import React, { useEffect, useState, useTransition } from "react";
import { List, ListPlus } from "lucide-react";
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
    setAddSupplier({ ...addSupplier, id: maxId + 1 });
    //IDが連番になっているかの確認
    for (const comparedSupplier of suppliers) {
      if (comparedSupplier.id === previousId + 1) {
        previousId += 1;
      } else {
        setAddSupplier({ ...addSupplier, id: previousId + 1 });
        break;
      }
    }
  }

  useEffect(() => {
    automaticNumbering();
  }, []);

  //addボタン
  const handleAdd = async () => {
    const result = confirm("Would you like to register?");
    if (result) {
      console.log("ID : " + addSupplier.id);
      console.log(addSupplier);
      startTransition(() => {
        onSave(addSupplier);
      });
      setAddSupplier(defaultData);
    }
  };

  const hanndleClick = async () => {
    await handleAdd();
    window.location.reload();
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
            placeholder="input"
            className="input input-bordered text-black w-[310px]"
          />
        </div>
        {/* Submit Button */}
        <div className="mt-6">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!isAllFilled}
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
