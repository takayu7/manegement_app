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
let IsShowingLoginUserTodo = false;
export const ShowTodoListForPc: React.FC<RegisterTodoProps> = ({
  todoDataList,
  onSave,
  onDelete,
}) => {
  const [todoData, setTodoData] = useState<Todo[]>(todoDataList);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [checkItem, setCheckItem] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const [isNotMobile, setIsMobile] = useState(false);
  const storedName = sessionStorage.getItem("userName");
  //ToDoリスト情報の取得
  async function fetchTodoData() {
    const data = await fetch("/api/todo");
    const todo = await data.json();
    if (IsShowingCheckedTodo) {
      setTodoData(
        todo.filter((todo: { checked: null }) => todo.checked === null)
      );
    } else {
      setTodoData(todo);
      console.log(todo);
    }
  }

  //チェックボックスの状態管理（チェックを入れたときの処理）
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setCheckItem(
      checked
        ? [...checkItem, value]
        : checkItem.filter((item) => item != value)
    );
  };

  //チェックボックスの状態管理（レンダリングしたときの処理）
  const setingCheckedItem = () => {
    const checkedTodoId = todoData
      .filter((todo) => todo.checked !== null)
      .map((checkedTodo) => {
        return String(checkedTodo.todoid);
      });
    setCheckItem(checkedTodoId);
  };

  // チェックボックスにチェックが入っているToDoリストの絞り込み
  const filterCheckedTodo = () => {
    IsShowingCheckedTodo = !IsShowingCheckedTodo;
    if (IsShowingCheckedTodo && IsShowingLoginUserTodo) {
      handleResize();
      setTodoData(
        todoData.filter(
          (todo) => todo.checked === null && todo.name === storedName
        )
      );
    } else if (IsShowingCheckedTodo) {
      handleResize();
      setTodoData(todoData.filter((todo) => todo.checked === null));
    } else {
      handleResize();
      fetchTodoData();
    }
  };

  //自分の名前とtodoリストのユーザー名が一致するtodoリストの絞り込み
  const filterLoginUserTodo = () => {
    IsShowingLoginUserTodo = !IsShowingLoginUserTodo;
    if (IsShowingLoginUserTodo && IsShowingCheckedTodo) {
      handleResize();
      setTodoData(
        todoData.filter(
          (todo) => todo.name === storedName && todo.checked === null
        )
      );
    } else if (IsShowingLoginUserTodo) {
      handleResize();
      setTodoData(todoData.filter((todo) => todo.name === storedName));
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
      console.log("Edit successful！");
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
    setIsMobile(window.innerWidth >= 768); // 768px以下をモバイルと判定
  };

  useEffect(() => {
    handleResize();
    fetchTodoData();
    setingCheckedItem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todoDataList]);

  return (
    <>
      {isNotMobile && (
        <div>
          {IsShowingCheckedTodo && IsShowingLoginUserTodo ? (
            <button
              className="btn btn-primary bg-white text-black w-70"
              onClick={() => {
                IsShowingCheckedTodo = false;
                IsShowingLoginUserTodo = false;
                handleResize();
                fetchTodoData();
                console.log(todoData);
              }}
            >
              All
            </button>
          ) : (
            <div>
              {/* チェックが入っているToDoリストを絞り込むボタン */}
              {IsShowingCheckedTodo ? (
                <button
                  className="btn btn-primary bg-white text-black w-30"
                  onClick={() => {
                    IsShowingLoginUserTodo = false;
                    filterCheckedTodo();
                    console.log(todoData);
                  }}
                >
                  All
                </button>
              ) : (
                <button
                  className="btn btn-primary bg-white text-black w-30"
                  onClick={() => {
                    filterCheckedTodo();
                    console.log(todoData);
                  }}
                >
                  Not Checked
                </button>
              )}
              {/* ログインユーザーのToDoリストを絞り込むボタン */}
              {IsShowingLoginUserTodo ? (
                <button
                  className="btn btn-primary ml-5  bg-white text-black w-30"
                  onClick={() => {
                    IsShowingCheckedTodo = false;
                    filterLoginUserTodo();
                    console.log(todoData);
                  }}
                >
                  All
                </button>
              ) : (
                <button
                  className="btn btn-primary ml-5  bg-white text-black w-30"
                  onClick={() => {
                    filterLoginUserTodo();
                    console.log(todoData);
                  }}
                >
                  My Todo
                </button>
              )}
            </div>
          )}
          {todoData.length !== 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th
                    colSpan={3}
                    className="text-center border-b border-gray-500"
                  >
                    Name
                  </th>
                  <th className="text-center border-b border-gray-500">ToDo</th>
                  <th className="text-center border-b border-gray-500">
                    Time Limit
                  </th>
                  <th className="pr-2 text-center border-b border-gray-500">
                    Edit
                  </th>
                  <th className="text-center border-b border-gray-500">
                    Delete
                  </th>
                </tr>
              </thead>
              <tbody>
                {todoData.map((todo, index) => (
                  <tr
                    key={index}
                    className={`${
                      todo.checked !== null
                        ? "bg-gray-400"
                        : (String(todo.deadline) === toDate(new Date()) &&
                            "bg-green-300") ||
                          (String(todo.deadline) < toDate(new Date()) &&
                            "bg-pink-200")
                    }
              `}
                  >
                    <td className="w-0.5">
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
                      />
                    </td>
                    <td className="w-20 text-center border-b border-gray-300">
                      <Image
                        src={`${SelectStaffIcon(String(todo.icon))}`}
                        alt="スタッフアイコン"
                        width={50}
                        height={50}
                        className="rounded-lg shadow-md"
                      />
                    </td>
                    <td className="border-b border-gray-300">{todo.name}</td>
                    <td className="text-center border-b border-gray-300">
                      {todo.todo}
                    </td>
                    <td className="text-center border-b border-gray-300">
                      {todo.deadline &&
                        new Date(todo.deadline).toLocaleDateString()}
                    </td>
                    <td className="w-10 border-b border-gray-300">
                      <button
                        onClick={() => {
                          {
                            console.log(selectedTodo);
                            setSelectedTodo(todo);
                            (
                              document.getElementById(
                                "TodoListEditDialog"
                              ) as HTMLDialogElement
                            )?.showModal();
                          }
                        }}
                        className="btn btn-ghost rounded-lg"
                      >
                        <SquarePen />
                      </button>
                    </td>
                    <td className="w-10 text-center border-b border-gray-300">
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
                        <Trash2 />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="mt-10 text-center text-orange-600 font-serif text-[30px]">
              Please register what you need to do
            </p>
          )}
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
