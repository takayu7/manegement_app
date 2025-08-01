"use client";
import React, { useState, useTransition, useEffect } from "react";
import { Todo } from "@/app/types/type";
import { SelectStaffIcon } from "@/app/lib/utils";
import Image from "next/image";
import { SquarePen, Trash2 } from "lucide-react";
import { TodoListEditDialog } from "@/app/components/TodoListEditDialog";
import { Player } from "@lottiefiles/react-lottie-player";
import { DeleteTodoListDialog } from "./DeleteTodoListDialog";

export interface RegisterTodoProps {
  todoDataList: Todo[];
  onSave: (todo: Todo) => void;
  onDelete: (todo: string) => void;
}

let IsShowingCheckedTodo = false;
export const ShowTodoForSmallDevice: React.FC<RegisterTodoProps> = ({
  todoDataList,
  onSave,
  onDelete,
}) => {
  const [todoData, setTodoData] = useState<Todo[]>(todoDataList);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [checkItem, setCheckItem] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const [isMobile, setIsMobile] = useState(false);
  //ToDoリスト情報の取得
  async function fetchTodoData() {
    const data = await fetch("/api/todo");
    const todo = await data.json();
    setTodoData(todo);
    console.log(todo);
  }

  //チェックボックスの状態管理
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setCheckItem(
      checked
        ? [...checkItem, value]
        : checkItem.filter((item) => item != value)
    );
  };

  // チェックボックスにチェックが入っているToDoリストの絞り込み
  const filterCheckedTodo = () => {
    IsShowingCheckedTodo = !IsShowingCheckedTodo;
    if (IsShowingCheckedTodo) {
      handleResize();
      setTodoData(todoData.filter((todo) => todo.checked === null));
    } else {
      handleResize();
      fetchTodoData();
    }
  };

  //チェックボックスにチェックを入れた日付の更新
  const editCheckedDate = async (todo: Todo, date: Date | null) => {
    const newTodo = { ...todo, checked: date };
    const response = await fetch("/api/editTodo", {
      method: "POST",
      headers: {
        "Context-Type": "application/json",
      },
      body: JSON.stringify({ newTodo }),
    });
    fetchTodoData();
    const result = await response.json();
    if (result.success) {
      console.log("Edit successful!");
    } else {
      console.log("Edit failed...");
    }
  };

  //今日の日付の表示の仕方を変更する処理
  const toDate = (dateInfo: Date): string => {
    const year = dateInfo.getFullYear();
    const month = dateInfo.getMonth() + 1;
    const date = ("00" + dateInfo.getDate()).slice(-2);

    return (year + "-0" + month + "-" + date + "T00:00:00.000Z").toString();
  };

  // 編集ダイアログの保存処理
  const handleSave = (todo: Todo) => {
    startTransition(() => {
      onSave(todo); // サーバーアクションを呼ぶ
    });
  };
  // 削除ダイアログの保存処理
  const handleDelete = (todoId: string) => {
    startTransition(() => {
      onDelete(todoId); // サーバーアクションを呼ぶ
    });
  };

  //モバイルかどうかを判定する処理
  const handleResize = () => {
    setIsMobile(window.innerWidth < 768); // 768px以下をモバイルと判定
  };

  useEffect(() => {
    handleResize();
    fetchTodoData();
    setTodoData(todoDataList);
  }, [todoDataList]);

  return (
    <>
      {isMobile && (
        <div>
          {IsShowingCheckedTodo ? (
            <button
              className="btn btn-primary bg-white text-black"
              onClick={() => {
                filterCheckedTodo();
                console.log(todoData);
              }}
            >
              Undo
            </button>
          ) : (
            <button
              className="w-70 btn btn-primary bg-white text-black"
              onClick={() => {
                filterCheckedTodo();
                console.log(todoData);
              }}
            >
              Show only unchecked Todo items
            </button>
          )}
          {todoData.map((todo, index) => (
            <table
              key={index}
              className={`m-3 w-20 border border-gray-800 ${
                checkItem.includes(String(todo.todoid))
                  ? "bg-gray-400"
                  : (String(todo.deadline) === toDate(new Date()) &&
                      "bg-green-300") ||
                    (String(todo.deadline) < toDate(new Date()) &&
                      "bg-pink-200")
              }`}
            >
              <tbody>
                <tr>
                  <th
                    colSpan={2}
                    className="relative bg-gray-600 text-center border-b border-gray-800"
                  >
                    <div className="flex flex-row">
                      {/* チェックボックス */}
                      <input
                        type="checkbox"
                        value={todo.todoid}
                        checked={checkItem.includes(String(todo.todoid))}
                        onChange={(e) => {
                          handleChange(e);
                          {
                            if (checkItem.includes(String(todo.todoid))) {
                              editCheckedDate(todo, null);
                            } else {
                              editCheckedDate(todo, new Date());
                            }
                          }
                        }}
                        className="ml-2"
                      />
                      {/* アイコン */}
                      <Image
                        src={`${SelectStaffIcon(String(todo.icon))}`}
                        alt="スタッフアイコン"
                        width={40}
                        height={40}
                        className="mt-[10px] ml-[10px] mb-[10px] w-auto h-auto rounded-lg shadow-md"
                      />
                      {/* 名前 */}
                      <div className="absolute text-white left-25 bottom-7">
                        {todo.name}
                      </div>
                    </div>
                  </th>
                </tr>
                <tr>
                  <th className="text-center border-r border-b border-r-gray-400 border-b-gray-800">
                    Todo
                  </th>
                  <td className="text-center border-b border-b-gray-800">
                    {todo.todo}
                  </td>
                </tr>
                <tr>
                  <th className="text-center border-r border-b border-r-gray-400 border-b-gray-800">
                    Time Limit
                  </th>
                  <td className="text-center border-b border-gray-800">
                    {todo.deadline &&
                      new Date(todo.deadline).toLocaleDateString()}
                  </td>
                </tr>
                <tr>
                  <td>
                    <button
                      onClick={() => {
                        console.log(selectedTodo);
                        setSelectedTodo(todo);
                        (
                          document.getElementById(
                            "TodoListEditDialog"
                          ) as HTMLDialogElement
                        )?.showModal();
                      }}
                      className="btn btn-ghost rounded-lg"
                    >
                      　Edit
                      <SquarePen />
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={() => {
                        setSelectedTodo(todo);
                        (
                          document.getElementById(
                            "DeleteTodoListDialog"
                          ) as HTMLDialogElement
                        )?.showModal();
                      }}
                      className="btn btn-ghost rounded-lg"
                    >
                      Delete
                      <Trash2 />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          ))}
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
          <TodoListEditDialog
            todo={selectedTodo}
            onSave={(todo: Todo) => {
              handleSave(todo);
            }}
          />
          <DeleteTodoListDialog
            todoId={selectedTodo?.todoid}
            onDelete={(todoId: string) => {
              handleDelete(todoId);
              setSelectedTodo(null);
            }}
          />
        </div>
      )}
    </>
  );
};
