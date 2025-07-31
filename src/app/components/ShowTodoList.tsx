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

export const ShowTodoList: React.FC<RegisterTodoProps> = ({
  todoDataList,
  onSave,
  onDelete,
}) => {
  const [todoData, setTodoData] = useState<Todo[]>(todoDataList);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [checkItem, setCheckItem] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
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

  //チェックボックスにチェックを入れた日付の更新
  const editCheckedDate = (todo: Todo, date: Date | null) => {
    const newTodo = { ...todo, checked: date };
    onSave(newTodo);
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

  useEffect(() => {
    fetchTodoData();
    setTodoData(todoDataList);
  }, [todoDataList]);

  return (
    <>
      <table className="table">
        <thead>
          <tr>
            <th colSpan={3} className="text-center border-b border-gray-500">
              Name
            </th>
            <th className="text-center border-b border-gray-500">ToDo</th>
            <th className="text-center border-b border-gray-500">Time Limit</th>
            <th className="pr-2 text-center border-b border-gray-500">Edit</th>
            <th className="text-center border-b border-gray-500">Delete</th>
          </tr>
        </thead>
        <tbody>
          {todoData.map((todo, index) => (
            <tr
              key={index}
              className={`${
                checkItem.includes(String(todo.todoid))
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
              <td className="w-[10px] border-b border-gray-300">{todo.name}</td>
              <td className="text-center border-b border-gray-300">
                {todo.todo}
              </td>
              <td className="text-center border-b border-gray-300">
                {todo.deadline && new Date(todo.deadline).toLocaleDateString()}
              </td>
              <td className="w-10 border-b border-gray-300">
                <button
                  onClick={() => {
                    {
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
        onSave={(product: Todo) => {
          handleSave(product);
        }}
      />
      <DeleteTodoListDialog
        todoId={selectedTodo?.todoid}
        onDelete={(todoId: string) => {
          handleDelete(todoId);
          setSelectedTodo(null);
        }}
      />
    </>
  );
};
