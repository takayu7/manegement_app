import { fetchTodo } from "@/app/lib/api";
// import { createTodo, updateTodo , deleteTodo} from "@/app/lib/api";
import { Todo } from "@/app/types/type";
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

  // 今日の日付とdeadlineの日付を見比べ値を返す
  function compareDeadline(deadline: Date | null): 0 | 1 | 2 {
    const today = new Date();
    const tY = today.getFullYear(),
      tM = today.getMonth(),
      tD = today.getDate();
    const dY = deadline?.getFullYear(),
      dM = deadline?.getMonth(),
      dD = deadline?.getDate();

    if (dY === tY && dM === tM && dD === tD) return 1; // 今日
    if (deadline && deadline < new Date(tY, tM, tD)) return 2; // 期限切れ
    return 0; // まだ
  }
  // 値に応じて背景色を返す
  function bgColor(deadline: Date | null, checked: Date | null) {
    const compare = compareDeadline(deadline);
    if (checked) {
      return "bg-gray-200"; // チェック済み
    } else if (compare === 1) {
      return "bg-emerald-50"; // 今日
    } else if (compare === 2) {
      return "bg-rose-200"; // 期限切れ
    }
    return "";
  }

  return (
    <>
      <div className="space-y-6">
        <h1 className="text-xl">Todo List</h1>
        <ul>
          {userTodoList.map((todo: Todo, index: number) => (
            <li
              key={index}
              className={`space-x-3 ${bgColor(todo.deadline, todo.checked)}`}
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
