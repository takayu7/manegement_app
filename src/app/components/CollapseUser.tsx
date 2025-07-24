import React from "react";
import { User } from "@/app/types/type";
import { revalidatePath } from "next/cache";
import { SettingUser } from "./SettingUser";
import { createUser } from "@/app/lib/api";

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
        <div className="collapse-title bg-[#6E6B41] text-[30px] text-primary-content text-center peer-checked:bg-[#3F9877] peer-checked:text-secondary-content">
          User
        </div>
        {/* User登録（ここから） */}
        <SettingUser onSave={handleSave} />
        {/* User登録（ここまで） */}

        {/* User情報表示 */}
      </div>
    </>
  );
};
