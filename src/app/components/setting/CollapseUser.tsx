import React from "react";
import { User } from "@/app/types/type";
import { revalidatePath } from "next/cache";
import { RegisterUser } from "./RegisterUser";
import {
  createUser,
  deleteUser,
  fetchUserDatas,
  updateUser,
} from "@/app/lib/api";
import { ShowUserInfomation } from "@/app/components/setting/ShowUserInfomation";

export const CollapseUser = async () => {
  const userDataList = await fetchUserDatas();
  const handleSave = async (user: User) => {
    "use server";
    console.log("user:", user);
    await createUser(user);
    // ページを再取得
    revalidatePath("/setting");
  };

  // 更新
  const handleUpdateUser = async (user: User) => {
    "use server";
    await updateUser(user);
    revalidatePath("/setting");
  };

  //削除
  const handleDeleteUser = async (id: string) => {
    "use server";
    await deleteUser(id);
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
          className="collapse-content flex flex-col lg:flex-row bg-[#6E6B41]
         text-primary-content peer-checked:bg-[#3F9877] peer-checked:text-secondary-content"
        >
          {/* User登録 */}
          <RegisterUser onSave={handleSave} />
          {/* User情報表示 */}
          <ShowUserInfomation
            userDataList={userDataList}
            onSave={handleUpdateUser}
            onDelete={handleDeleteUser}
          />
        </div>
      </div>
    </>
  );
};
