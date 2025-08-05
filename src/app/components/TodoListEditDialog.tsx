"use client";
import React, { useState, useEffect } from "react";
import { Todo, User } from "@/app/types/type";
import { ListPlus } from "lucide-react";

export interface EditDialogProps {
  todo: Todo | null;
  onSave: (todo: Todo) => void;
}

const defaultTodoData: Todo = {
  userid: "",
  name: "",
  todoid: 1,
  todo: "",
  deadline: null,
  icon: 0,
  checked: null,
};

export const TodoListEditDialog: React.FC<EditDialogProps> = ({
  todo,
  onSave,
}) => {
  const [editTodo, setEditTodo] = useState<Todo>(defaultTodoData);
  const [userData, setUserData] = useState<User[]>([]);

  //ユーザー情報の取得
  async function fetchUserData() {
    const data = await fetch("/api/users");
    const users = await data.json();
    setUserData(users);
    console.log(users);
  }

  //Idを基にユーザー情報の取得
  async function fetchUserDatasById(userId: string) {
    const data = await fetch("/api/oneUser", {
      method: "POST",
      headers: { "Context-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    const oneUser = await data.json();
    return oneUser;
  }

  const getToday = new Date(editTodo.deadline || "");
  const y = getToday.getFullYear();
  const m = getToday.getMonth() + 1;
  const d = getToday.getDate();
  const deadline =
    y +
    "-" +
    m.toString().padStart(2, "0") +
    "-" +
    d.toString().padStart(2, "0");

  useEffect(() => {
    setEditTodo(todo ? { ...todo } : defaultTodoData);
    fetchUserData();
  }, [todo]);

  return (
    <dialog id="TodoListEditDialog" className="modal md:p-5">
      <div className="modal-box max-w-5xl p-10 lg:w-1/3">
        <ul className="text-xl font-medium space-y-3 mb-5">
          {/* ユーザー名 */}
          <li className="flex flex-col gap-1 md:items-center md:gap-4 md:flex-row">
            <label className="w-40">name :</label>
            <select
              id="name"
              name="name"
              value={editTodo.userid}
              onChange={(e) => {
                console.log(e.target.value);
                setEditTodo({
                  ...editTodo,
                  userid: e.target.value,
                });
              }}
              className="select rounded-sm border-2 p-1 text-lg md:mx-5 "
            >
              {userData.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </li>
          {/* ToDo */}
          <li className="flex flex-col gap-1 md:items-center md:gap-4 md:flex-row">
            <label className="w-40">todo :</label>
            <textarea
              id="todo"
              name="todo"
              maxLength={100}
              value={editTodo.todo || undefined}
              required
              onChange={(e) =>
                setEditTodo({
                  ...editTodo,
                  todo: e.target.value,
                })
              }
              className="input rounded-sm  p-1 text-lg text-wrap md:mx-5"
            />
          </li>
          {/* TimeLimit */}
          <li className="flex flex-col gap-1 md:items-center md:gap-4 md:flex-row">
            <label className="w-40">Time Limit :</label>
            <input
              type="date"
              name="deadline"
              value={deadline}
              onChange={(e) =>
                setEditTodo({ ...editTodo, deadline: new Date(e.target.value) })
              }
              placeholder="explanation"
              className="rounded-sm border-2 p-1 text-lg textarea md:mx-5"
            />
          </li>
        </ul>
        <div className="modal-action flex justify-center gap-2">
          <form method="dialog" className="flex justify-center gap-2">
            <button
              type="submit"
              className="btn btn-outline btn-success md:btn-wide"
              onClick={async () => {
                const oneUser = await fetchUserDatasById(editTodo.userid);
                console.log(oneUser);
                const newTodo: Todo = {
                  ...editTodo,
                  name: oneUser[0].name,
                  icon: oneUser[0].icon,
                };
                console.log(newTodo);
                onSave(newTodo);
              }}
            >
              <ListPlus />
              OK
            </button>
            <button className="btn md:btn-wide">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  );
};
