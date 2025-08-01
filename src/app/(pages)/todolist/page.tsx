import { createTodo, deleteTodo, fetchTodo, updateTodo } from "@/app/lib/api";
import { Todo } from "@/app/types/type";
import { revalidatePath } from "next/cache";
//import { todoBgColor } from "@/app/lib/utils";
import { RegisterTodoList } from "@/app/components/RegisterTodoList";
import { ShowTodoListForPc } from "@/app/components/ShowTodoListForPc";
import { ShowTodoForSmallDevice } from "@/app/components/ShowTodoForSmallDevice";
// import { revalidatePath } from "next/cache";

export default async function Page() {
  const todoDataList = await fetchTodo();
  const handleSave = async (todo: Todo) => {
    "use server";
    console.log("supplier:", todo);
    await createTodo(todo);
    // ページを再取得
    //revalidatePath("/setting");
  };
  // データの取得
  //const userTodoList = await fetchTodo();

  // // 登録
  // const handleCreate = async (todo: Todo) => {
  //   "use server";
  //   await createTodo(todo);
  //   revalidatePath("/todolist");
  // };
  // 更新
  const handleUpdate = async (todo: Todo) => {
    "use server";
    await updateTodo(todo);
    revalidatePath("/todolist");
  };
  // 削除
  const handleDelete = async (todoId: string) => {
    "use server";
    await deleteTodo(todoId);
    revalidatePath("/todolist");
  };

  return (
    <>
      <div className="space-y-6">
        <h1 className="text-xl md:text-4xl font-bold">Todo List</h1>
        <RegisterTodoList onSave={handleSave} />
        <div>
          <ShowTodoListForPc
            todoDataList={todoDataList}
            onSave={handleUpdate}
            onDelete={handleDelete}
          />
        </div>
        <div>
          <ShowTodoForSmallDevice
            todoDataList={todoDataList}
            onSave={handleUpdate}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </>
  );
}
