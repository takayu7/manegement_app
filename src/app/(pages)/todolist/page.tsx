import { createUser, deleteUser , fetchUserDatas } from "@/app/lib/api";
import { User } from "@/app/types/type";
import { revalidatePath } from "next/cache";

export default async function Page() {

  // ユーザーデータの取得
  const userDataList = await fetchUserDatas();

  const handleSave = async (user: User) => {
    "use server";
    console.log("user:", user);
    await createUser(user);
    // ページを再取得
    revalidatePath("/setting");
  };

  const handleDelete = async (userId: string) => {
    "use server";
    await deleteUser(userId);
    // ページを再取得
    revalidatePath("/setting");
  };

  return (
    <>
      <h1 className="text-xl">todolist</h1>
    </>
  );
}
