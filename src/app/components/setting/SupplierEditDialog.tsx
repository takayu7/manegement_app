"use client";
import { Supplier } from "@/app/types/type";
import { ListPlus } from "lucide-react";
import { z } from "zod";
import { formatMessage, MESSAGE_LIST } from "../../lib/messages";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

// 型の定義
export type ProductFormValues = z.infer<typeof formSchema>;
export interface EditDialogProps {
  supplier: Supplier | null;
  onSave: (Supplier: Supplier) => void;
}

const formSchema = z.object({
  id: z.number(),
  name: z
    .string()
    .min(1, MESSAGE_LIST.E010100)
    .max(20, formatMessage(MESSAGE_LIST.E010106, "20")),
});

export const SupplierEditDialog: React.FC<EditDialogProps> = ({
  supplier,
  onSave,
}) => {
  //const [editSupplier, setEditSupplier] = useState<Supplier>(defaultSupplierData);
  const defaultSupplierData: Supplier = {
    id: Number(supplier?.id),
    name: String(supplier?.name),
  };
  const {
    register,
    getValues,
    setValue,
    handleSubmit,
    clearErrors,
    formState: { errors, isValid },
  } = useForm<z.infer<typeof formSchema>>({
    defaultValues: defaultSupplierData,
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    setValue("id", Number(supplier?.id));
    setValue("name", String(supplier?.name));
  }, [setValue, supplier]);

  return (
    <dialog id="SupplierEditDialog" className="modal md:p-5">
      <form
        onSubmit={handleSubmit(onSave)}
        className="modal-box max-w-5xl p-10 lg:w-1/3"
      >
        <ul className="text-xl font-medium space-y-3 mb-5">
          {/* Supplier名 */}
          <li className="flex flex-col gap-1 md:items-center md:gap-4 md:flex-row">
            <label className="w-40 text-black">NAME </label>
            <input
              {...register("name")}
              id="name"
              className="input rounded-sm border-2 p-1 text-lg md:mx-5 text-black "
            />
          </li>
          <div className="text-red-300 mt-2">{errors.name?.message}</div>
        </ul>
        <div className="modal-action flex justify-center gap-2">
          <div className="flex justify-center gap-2">
            <button
              type="submit"
              className="btn btn-outline btn-success md:btn-wide"
              onClick={async () => {
                if (isValid) {
                  const newSupplierData: Supplier = getValues();
                  onSave(newSupplierData);
                  (
                    document.getElementById(
                      "SupplierEditDialog"
                    ) as HTMLDialogElement
                  )?.close();
                }
              }}
            >
              <ListPlus />
              OK
            </button>
            <button
              type="button"
              onClick={() => {
                console.log(getValues());
                clearErrors();
                (
                  document.getElementById(
                    "SupplierEditDialog"
                  ) as HTMLDialogElement
                )?.close();
              }}
              className="btn md:btn-wide"
            >
              Close
            </button>
          </div>
        </div>
      </form>
    </dialog>
  );
};
