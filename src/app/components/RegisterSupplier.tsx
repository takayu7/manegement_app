"use client";
import React, { useTransition } from "react";
import { ListPlus } from "lucide-react";
import { Supplier } from "@/app/types/type";
import z from "zod";
import { formatMessage, MESSAGE_LIST } from "../lib/messages";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  id: z.number(),
  name: z
    .string()
    .min(1, MESSAGE_LIST.E010100)
    .max(20, formatMessage(MESSAGE_LIST.E010106, "20")),
});

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
  //const [addSupplier, setAddSupplier] = useState<Supplier>(defaultData);
  const {
    setValue,
    getValues,
    register,
    reset,
    formState: { errors, isDirty, isValid },
    handleSubmit,
  } = useForm<z.infer<typeof formSchema>>({
    defaultValues: defaultData,
    resolver: zodResolver(formSchema),
  });
  const [isPending, startTransition] = useTransition();

  // すべての入力が完了しているか
  //const isAllFilled = addSupplier.name !== "";

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
    if (result) {
      setValue("id", newId);
      console.log("ID : " + getValues().id);
      console.log(getValues());
      startTransition(() => {
        onSave(getValues());
      });
    }
  };

  const hanndleClick = async () => {
    const newId = await automaticNumbering();
    console.log(newId);
    await handleAdd(newId);
    if (!isPending) {
      console.log(getValues().id);
      reset();
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSave)}>
        {/* Name */}
        <div className="mb-[10px] flex flex-row ">
          <div className="mt-2">NAME：　</div>
          <input
            {...register("name")}
            type="text"
            id="name"
            // name="name"
            // value={addSupplier.name}
            // onChange={(e) =>
            //   setAddSupplier({ ...addSupplier, name: e.target.value })
            // }
            placeholder="name"
            className="input input-bordered text-black md:w-[310px]"
          />
        </div>
        <div className="text-red-300 mt-2">{errors.name?.message}</div>
        {/* Submit Button */}
        <div className="mt-6">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!isDirty || isPending}
            onClick={() => {
              if (isValid) {
                hanndleClick();
              }
            }}
          >
            <ListPlus />
            ADD
          </button>
        </div>
        {isPending && <span className="text-rose-500 text-end">update...</span>}
      </form>
    </>
  );
};
