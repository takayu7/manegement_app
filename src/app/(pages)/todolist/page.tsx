import { fetchTodo } from "@/app/lib/api";
// import { createTodo, updateTodo , deleteTodo} from "@/app/lib/api";
import { Todo } from "@/app/types/type";
import { todoBgColor} from "@/app/lib/utils";
// import { revalidatePath } from "next/cache";

export default async function Page() {
  // データの取得
  const userTodoList = await fetchTodo();

  // // 登録
  // const handleCreate = async (todo: Todo) => {
  //   "use server";
  //   await createTodo(todo);
  //   revalidatePath("/todolist");
  // };
  // // 更新
  // const handleSave = async (todo: Todo) => {
  //   "use server";
  //   await updateTodo(todo);
  //   revalidatePath("/todolist");
  // };
  // // 削除
  // const handleDelete = async (todoId: string) => {
  //   "use server";
  //   await deleteTodo(todoId);
  //   revalidatePath("/todolist");
  // };

  return (
    <>
      <div className="space-y-6">
        <h1 className="text-xl">Todo List</h1>
        <ul>
          {userTodoList.map((todo: Todo, index: number) => (
            <li
              key={index}
              className={`space-x-3 ${todoBgColor(todo.deadline, todo.checked)}`}
            >
              <span>{todo.name}</span>
              <span>{todo.icon}</span>
              <span>{todo.todo}</span>
              <span>
                {todo.deadline && new Date(todo.deadline).toLocaleDateString()}
              </span>
              <span>
                {todo.checked && new Date(todo.checked).toLocaleDateString()}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
