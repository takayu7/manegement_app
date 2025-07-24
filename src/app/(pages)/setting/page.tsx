import React from "react";
import { Setting } from "@/app/components/Setting";
import { SettingUser } from "@/app/components/SettingUser";
import { SettingSupplier } from "@/app/components/SettingSupplier";
import { createUser } from "@/app/lib/api";
import { revalidatePath } from "next/cache";
import { User } from "@/app/types/type";

export default function Page() {
  const handleSave = async (user: User) => {
    "use server";
    console.log("user:", user);
    await createUser(user);
    // ページを再取得
    revalidatePath("/setting");
  };

  return (
    <>
      <Setting />
      <SettingUser onSave={handleSave} />
      <SettingSupplier onSave={handleSave} />
    </>
  );
}
