"use client";
import React, { useEffect, useState, useTransition } from "react";
import { ListPlus } from "lucide-react";
import { Todo, User } from "@/app/types/type";
import { Player } from "@lottiefiles/react-lottie-player";

export interface RegisterTodoProps {
  onSave: (todo: Todo) => void;
}

const defaultData: Todo = {
  userid: "",
  todoid: 0,
  name: "",
  icon: 0,
  todo: "",
  deadline: null,
  checked: null,
};

export const RegisterTodoList: React.FC<RegisterTodoProps> = ({ onSave }) => {
  const [addTodo, setAddTodo] = useState<Todo>(defaultData);
  const [isPending, startTransition] = useTransition();

  // すべての入力が完了しているか
  const isAllFilled = addTodo.userid !== "" && addTodo.todo !== "";

  const [userData, setUserData] = useState<User[]>([]);
  //ユーザー情報の取得
  async function fetchUserData() {
    const data = await fetch("/api/users");
    const users = await data.json();
    setUserData(users);
    console.log(users);
  }

  //ユーザーがlimit timeの値を変更した際に、その値を取得する処理
  const limitTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLimiTime = e.target.value;
    if (newLimiTime === "") {
      setAddTodo({ ...addTodo, deadline: null });
    } else {
      setAddTodo({ ...addTodo, deadline: new Date(newLimiTime) });
    }
  };

  //addボタン
  const handleAdd = async () => {
    const result = confirm("Would you like to register?");
    if (result) {
      console.log("ID : " + addTodo.todoid);
      console.log(addTodo);
      startTransition(() => {
        onSave(addTodo);
      });
      setAddTodo(defaultData);
    }
  };

  const hanndleClick = async () => {
    await handleAdd();
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div className="space-x-5 flex flex-col lg:flex-row">
      <div className="flex flex-col">
        name：
        <select
          className="border-1 border-gray-400 p-2 rounded h-[41.6px] w-50 lg:w-40"
          onChange={(e) => setAddTodo({ ...addTodo, userid: e.target.value })}
        >
          <option value="">Please select</option>
          {userData.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col">
        todo：
        <textarea
          className="border-1 border-gray-400 p-2 rounded h-[41.6px] lg:w-80"
          value={addTodo.todo !== null ? addTodo.todo : ""}
          maxLength={100}
          onChange={(e) => setAddTodo({ ...addTodo, todo: e.target.value })}
          placeholder="todo"
        />
      </div>
      <div className="flex flex-col">
        limit date：
        <input
          className="border-1 border-gray-400 p-2 rounded"
          type="date"
          onChange={limitTimeChange}
          placeholder="limit date"
        />
      </div>
      <div className="mt-6 ml-0 lg:ml-10">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={!isAllFilled || isPending}
          onClick={() => {
            hanndleClick();
            console.log(addTodo);
          }}
        >
          <ListPlus />
          ADD
        </button>
      </div>
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
    </div>
  );
};
