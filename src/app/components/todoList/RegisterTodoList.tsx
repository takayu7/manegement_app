"use client";
import React, { useEffect, useState, useTransition } from "react";
import { ListPlus } from "lucide-react";
import { Todo, User } from "@/app/types/type";
import { Player } from "@lottiefiles/react-lottie-player";
import z from "zod";
import { formatMessage, MESSAGE_LIST } from "@/app/lib/messages";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const today = new Date();
const year = today.getFullYear();
const month = today.getMonth() + 1;
const day = today.getDate();
const todayToString = year + "/" + month + "/" + day;

const formSchema = z.object({
  userid: z.string().min(1, MESSAGE_LIST.E010100),
  todoid: z.number(),
  name: z.string(),
  icon: z.number(),
  todo: z
    .string()
    .min(1, MESSAGE_LIST.E010100)
    .max(100, formatMessage(MESSAGE_LIST.E010106, "100")),
  deadline: z
    .date()
    .min(
      new Date(year + "-" + month + "-" + day),
      `${todayToString}以降の日付を入力してください。`
    )
    .nullable(),
  checked: z.date().nullable(),
});

export interface RegisterTodoProps {
  onSave: (todo: Todo) => void;
}

const defaultData = {
  userid: "",
  todoid: 0,
  name: "",
  icon: 0,
  todo: "",
  deadline: null,
  checked: null,
};

export const RegisterTodoList: React.FC<RegisterTodoProps> = ({ onSave }) => {
  //const [addTodo, setAddTodo] = useState<Todo>(defaultData);
  const {
    register,
    getValues,
    setValue,
    formState: { errors, isDirty },
    handleSubmit,
  } = useForm<z.infer<typeof formSchema>>({
    defaultValues: defaultData,
    resolver: zodResolver(formSchema),
  });
  const [isPending, startTransition] = useTransition();

  // // すべての入力が完了しているか
  // const isAllFilled = addTodo.userid !== "" && addTodo.todo !== "";

  const [userData, setUserData] = useState<User[]>([]);
  //ユーザー情報の取得
  async function fetchUserData() {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setUserData(data))
      .then(() =>
        setUserData((users) => users.filter((user) => !user.id.startsWith("c")))
      );
    //const users = await data.json();
    //setUserData(users);
  }

  //ユーザーがlimit timeの値を変更した際に、その値を取得する処理
  const limitTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLimiTime = e.target.value;
    if (newLimiTime === "") {
      setValue("deadline", null);
      //setAddTodo({ ...addTodo, deadline: null });
    } else {
      setValue("deadline", new Date(newLimiTime));
      //setAddTodo({ ...addTodo, deadline: new Date(newLimiTime) });
    }
  };

  //ユーザーが入力した値をDBに登録する処理
  const handleAdd = async () => {
    //console.log("ID : " + addTodo.todoid);
    console.log(getValues());
    startTransition(() => {
      onSave(getValues());
    });
  };

  //addボタンをクリックしたときの処理
  const hanndleClick = async () => {
    const result = confirm("Would you like to register?");
    if (result) {
      await handleAdd();
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <form
      onSubmit={handleSubmit(hanndleClick)}
      className="space-x-5 flex flex-col lg:flex-row"
    >
      <div className="flex flex-col">
        name：
        <select
          {...register("userid")}
          className="border-1 border-gray-400 p-2 rounded h-[41.6px] w-50 lg:w-40"
          //onChange={(e) => setAddTodo({ ...addTodo, userid: e.target.value })}
        >
          <option value="">Please select</option>
          {userData.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
        <div className="text-red-300 mt-2">{errors.userid?.message}</div>
      </div>
      <div className="flex flex-col">
        todo：
        <textarea
          {...register("todo")}
          className="border-1 border-gray-400 p-2 rounded h-[41.6px] lg:w-80"
          //value={addTodo.todo !== null ? addTodo.todo : ""}
          maxLength={100}
          //onChange={(e) => setAddTodo({ ...addTodo, todo: e.target.value })}
          placeholder="todo"
        />
        <div className="text-red-300 mt-2">{errors.todo?.message}</div>
      </div>
      <div className="flex flex-col">
        limit date：
        <input
          className="border-1 border-gray-400 p-2 rounded"
          type="date"
          onChange={limitTimeChange}
          placeholder="limit date"
        />
        <div className="text-red-300 mt-2">{errors.deadline?.message}</div>
      </div>
      <div className="mt-6 ml-0 lg:ml-10">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={!isDirty || isPending}
          onClick={() => {
            console.log(getValues());
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
            zIndex: 10,
            transform: "translate(-50%, -50%)",
          }}
        />
      )}
    </form>
  );
};
