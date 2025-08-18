"use client";
import React, { useTransition } from "react";
import Image from "next/image";
import { ListPlus } from "lucide-react";
import { User } from "@/app/types/type";
import { IconData } from "../../sampleDate/IconData";
import z from "zod";
import { useForm } from "react-hook-form";
import { formatMessage, MESSAGE_LIST } from "../../lib/messages";
import { zodResolver } from "@hookform/resolvers/zod";
import { Player } from "@lottiefiles/react-lottie-player";

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
  icon: z.number().min(1, MESSAGE_LIST.E010100),
  userType: z
    .enum(["staff", "customer"])
    .refine((val) => val === "staff" || val === "customer", {
      message: MESSAGE_LIST.E010100,
    }),
});

export interface RegisterUserProps {
  onSave: (user: User) => void;
}

const defaultValues = {
  id: "",
  name: "",
  password: "",
  icon: 0,
  userType: "staff" as "staff" | "customer",
};

export const RegisterUser: React.FC<RegisterUserProps> = ({ onSave }) => {
  const {
    register,
    watch,
    reset,
    getValues,
    setValue,
    formState: { errors, isDirty },
    handleSubmit,
  } = useForm<z.infer<typeof formSchema>>({
    defaultValues,
    resolver: zodResolver(formSchema),
  });
  //const [addUser, setAddUser] = useState<User>(defaultData);
  const [isPending, startTransition] = useTransition();

  // //すべての入力が完了しているか
  // const isAllFilled =
  //   addUser.name !== "" && addUser.password !== "" && addUser.icon > 0;

  // 自動採番（ID）
  function getRandomNumFromServer(userType: "staff" | "customer") {
    const randomNumber = Math.floor(Math.random() * 999_999)
      .toString()
      .padStart(6, "0");
    if (userType === "customer") {
      return "c" + randomNumber;
    }
    return randomNumber;
  }
  async function automaticNumbering() {
    const data = await fetch("/api/users");
    const users = await data.json();
    const userType = getValues("userType") as "staff" | "customer";
    let randomNum = getRandomNumFromServer(userType);
    const existingIds = new Set(users.map((user: { id: string }) => user.id));
    while (existingIds.has(randomNum)) {
      randomNum = getRandomNumFromServer(userType);
    }
    const id = randomNum;
    setValue("id", id);
    //setAddUser({ ...addUser, id: id });
  }
  // useEffect(() => {
  //   automaticNumbering();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  //addボタン
  const handleAdd = async () => {
    await automaticNumbering();
    const values: User = getValues();
    console.log("ID : " + values.id);
    console.log(values);
    startTransition(() => {
      onSave(values);
    });
    //setAddUser(defaultData);
  };

  const hanndleClick = async () => {
    const result = confirm("Would you like to register?");
    if (result) {
      await handleAdd();
      reset();
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(hanndleClick)}>
        {/* Name */}
        <div className="mb-[10px]">
          NAME：　
          <input
            {...register("name")}
            type="text"
            id="name"
            placeholder="name"
            className="input input-bordered text-black"
          />
          <div className="text-red-300 mt-2">{errors.name?.message}</div>
        </div>
        {/* Password */}
        <div className="mb-[20px]">
          PW： 　　
          <input
            {...register("password")}
            type="text"
            id="password"
            placeholder="password"
            className="input input-bordered text-black"
          />
          <div className="text-red-300 mt-2">{errors.password?.message}</div>
        </div>
        <div className="mb-[20px] flex items-center gap-7">
          USER TYPE： 　　
          <div className="flex items-center gap-3">
            <input
              type="radio"
              id="userTypeStaff"
              value="staff"
              checked={watch("userType") == "staff"}
              onChange={(e) => {
                setValue("userType", e.target.value as "staff" | "customer");
              }}
            />
            <label htmlFor="userTypeStaff">Staff</label>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="radio"
              id="userTypeCustomer"
              value="customer"
              checked={watch("userType") == "customer"}
              onChange={(e) => {
                setValue("userType", e.target.value as "staff" | "customer");
              }}
            />
            <label htmlFor="userTypeCustomer">Customer</label>
          </div>
          <div className="text-red-300 mt-2">{errors.userType?.message}</div>
        </div>
        {/* Icon */}
        <div className="flex flex-col">
          <p>Please select one icon</p>
          <div className="flex flex-row  flex-wrap md:w-[400px] ">
            {IconData.map((icon) => (
              <label key={icon.id} className="mr-[20px]">
                <input
                  //{...register("icon", { valueAsNumber: true })}
                  type="radio"
                  value={icon.id}
                  //name="icon"
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
        {/* Submit Button */}
        <div className="mt-6 mb-5">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!isDirty || isPending}
            // onClick={() => {
            //   if (isValid) {
            //     hanndleClick();
            //     console.log(getValues());
            //   }
            // }}
          >
            <ListPlus />
            ADD
          </button>
        </div>
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
      </form>
    </>
  );
};
