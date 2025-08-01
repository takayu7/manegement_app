import React from "react";
import { User } from "@/app/types/type";
import { revalidatePath } from "next/cache";
import { RegisterUser } from "./RegisterUser";
import { createUser } from "@/app/lib/api";
import { ShowUserInfomation } from "@/app/components/ShowUserInfomation";

export const CollapseUser = () => {
  const handleSave = async (user: User) => {
    "use server";
    console.log("user:", user);
    await createUser(user);
    // ページを再取得
    revalidatePath("/setting");
  };

  return (
    <>
      <div className="bg-base-100 border-base-300 collapse border">
        <input type="checkbox" className="peer" />
        <div className="px-[16px] collapse-title bg-[#6E6B41] text-[30px] text-primary-content text-center peer-checked:bg-[#3F9877] peer-checked:text-secondary-content">
          User
        </div>
        <div
          className="collapse-content flex flex-col md:flex-row bg-[#6E6B41]
         text-primary-content peer-checked:bg-[#3F9877] peer-checked:text-secondary-content"
        >
          {/* User登録 */}
          <RegisterUser onSave={handleSave} />
          {/* User情報表示 */}
          <ShowUserInfomation />
        </div>
      </div>
    </>
  );
};
