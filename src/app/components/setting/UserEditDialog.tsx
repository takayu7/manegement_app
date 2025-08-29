"use client";
import { User } from "@/app/types/type";
import { ListPlus } from "lucide-react";
import { z } from "zod";
import { formatMessage, MESSAGE_LIST } from "../../lib/messages";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconData } from "../../sampleDate/IconData";
import { useEffect } from "react";

// 型の定義
export type ProductFormValues = z.infer<typeof formSchema>;
export interface EditDialogProps {
  user: User | null;
  onSave: (User: User) => void;
}

const formSchema = z.object({
  id: z.string(),
  name: z
    .string()
    .min(1, MESSAGE_LIST.E010100)
    .max(20, formatMessage(MESSAGE_LIST.E010106, "20")),
  password: z
    .string()
    .min(1, MESSAGE_LIST.E010100)
    .max(10, formatMessage(MESSAGE_LIST.E010106, "10")),
  icon: z.number(),
});

export const UserEditDialog: React.FC<EditDialogProps> = ({ user, onSave }) => {
  //const [editUser, setEditUser] = useState<User>(defaultUserData);
  const defaultUserData: User = {
    id: String(user?.id),
    name: String(user?.name),
    password: String(user?.password),
    icon: Number(user?.icon),
  };
  const {
    register,
    getValues,
    setValue,
    handleSubmit,
    watch,
    clearErrors,
    formState: { errors, isValid },
  } = useForm<z.infer<typeof formSchema>>({
    defaultValues: defaultUserData,
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    setValue("id", String(user?.id));
    setValue("name", String(user?.name));
    setValue("password", String(user?.password));
    setValue("icon", Number(user?.icon));
  }, [setValue, user]);

  return (
    <dialog id="UserEditDialog" className="modal md:p-5">
      <form
        onSubmit={handleSubmit(onSave)}
        className="modal-box max-w-5xl p-10 lg:w-1/3"
      >
        <ul className="text-xl font-medium space-y-3 mb-5">
          {/* ユーザー名 */}
          <li className="flex flex-col gap-1 md:items-center md:gap-4 md:flex-row">
            <label className="w-40 text-black">NAME </label>
            <input
              {...register("name")}
              //id="name"
              className="input rounded-sm border-2 p-1 text-lg md:mx-5 text-black "
            />
          </li>
          <div className="text-red-300 mt-2">{errors.name?.message}</div>
          {/* パスワード */}
          <li className="flex flex-col gap-1 md:items-center md:gap-4 md:flex-row">
            <label className="w-40 text-black">PW </label>
            <input
              {...register("password")}
              type="password"
              //id="name"
              className="input rounded-sm border-2 p-1 text-lg md:mx-5 text-black "
            />
          </li>
          <div className="text-red-300 mt-2">{errors.password?.message}</div>
          {/* Icon */}
          <div className="flex flex-col mt-10 text-black">
            <p>Please select one icon</p>
            <div className="flex flex-row  flex-wrap md:w-[400px] ">
              {IconData.map((icon) => (
                <label key={icon.id} className="mr-[20px]">
                  <input
                    //{...register("icon", { valueAsNumber: true })}
                    type="radio"
                    name="icon"
                    value={icon.id}
                    checked={watch("icon") == icon.id}
                    onChange={(e) => {
                      setValue("icon", Number(e.target.value));
                    }}
                  />
                  <Image
                    src={icon.staffImage}
                    alt={icon.name}
                    width={100}
                    height={100}
                    className="w-[60px] h-[60px] lg:w-[100px] lg:h-[100px]"
                  />
                </label>
              ))}
            </div>
            <div className="text-red-300 mt-2">{errors.icon?.message}</div>
          </div>
        </ul>
        <div className="modal-action flex justify-center gap-2">
          <div className="flex justify-center gap-2">
            <button
              type="submit"
              className="btn btn-outline btn-success md:btn-wide"
              onClick={async () => {
                if (isValid) {
                  const newUserData: User = getValues();
                  onSave(newUserData);
                  (
                    document.getElementById(
                      "UserEditDialog"
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
                  document.getElementById("UserEditDialog") as HTMLDialogElement
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
