"use client";
import React, { useState, useEffect } from "react";
import { Todo, User } from "@/app/types/type";
import { ListPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import z from "zod";
import { formatMessage, MESSAGE_LIST } from "@/app/lib/messages";
import { zodResolver } from "@hookform/resolvers/zod";

// const today = new Date();
// const year = today.getFullYear();
// const date = today.getDate();
// const day = today.getDate();
// const todayToString = year + "/" + date + "/" + day;

const formSchema = z.object({
  userid: z.string().min(1, MESSAGE_LIST.E010100),
  todoid: z.number(),
  name: z.string(),
  icon: z.number(),
  todo: z
    .string()
    .min(1, MESSAGE_LIST.E010100)
    .max(100, formatMessage(MESSAGE_LIST.E010106, "100")),
  deadline: z.date().nullable(),
  checked: z.date().nullable(),
});

export interface EditDialogProps {
  todo: Todo | null;
  onSave: (todo: Todo) => void;
}

const defaultTodoData = {
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
  const {
    register,
    getValues,
    setValue,
    formState: { errors },
    handleSubmit,
  } = useForm<z.infer<typeof formSchema>>({
    defaultValues: defaultTodoData,
    resolver: zodResolver(formSchema),
  });
  //const [editTodo, setEditTodo] = useState<Todo>(defaultTodoData);
  const [timeLimit, setTimeLimit] = useState("");
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

  const getToday = new Date(getValues("deadline") || "");
  const y = getToday.getFullYear();
  const m = getToday.getMonth() + 1;
  const d = getToday.getDate();
  const deadline =
    y +
    "-" +
    m.toString().padStart(2, "0") +
    "-" +
    d.toString().padStart(2, "0");

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

  //handleSubmit内の処理
  async function handleFormSubmit() {
    const oneUser = await fetchUserDatasById(getValues("userid"));
    console.log(oneUser);
    setValue("name", oneUser[0].name);
    setValue("icon", oneUser[0].icon);
    console.log(getValues());
    onSave(getValues());
    (
      document.getElementById("TodoListEditDialog") as HTMLDialogElement
    ).close();
  }

  useEffect(() => {
    setValue("userid", String(todo?.userid));
    setValue("name", String(todo?.name));
    setValue("todoid", Number(todo?.todoid));
    setValue("todo", String(todo?.todo));
    setValue("icon", Number(todo?.icon));
    if (todo?.deadline !== undefined && todo?.deadline !== null) {
      setValue("deadline", new Date(todo?.deadline));
    }
    if (todo?.checked !== undefined && todo?.checked !== null) {
      setValue("checked", new Date(todo?.checked));
    }
  }, [
    setValue,
    todo?.checked,
    todo?.deadline,
    todo?.icon,
    todo?.name,
    todo?.todo,
    todo?.todoid,
    todo?.userid,
  ]);

  useEffect(() => {
    //setEditTodo(todo ? { ...todo } : defaultTodoData);
    setTimeLimit(deadline);
    fetchUserData();
  }, [deadline, todo]);

  return (
    <dialog id="TodoListEditDialog" className="modal md:p-5">
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="modal-box max-w-5xl p-10 lg:w-1/3"
      >
        <ul className="text-xl font-medium space-y-3 mb-5">
          {/* ユーザー名 */}
          <li className="flex flex-col gap-1 md:items-center md:gap-4 md:flex-row">
            <label className="w-40">name :</label>
            <select
              {...register("userid")}
              id="name"
              // name="name"
              // value={editTodo.userid}
              // onChange={(e) => {
              //   console.log(e.target.value);
              //   setEditTodo({
              //     ...editTodo,
              //     userid: e.target.value,
              //   });
              // }}
              className="select rounded-sm border-2 p-1 text-lg md:mx-5 "
            >
              {userData.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </li>
          <div className="text-red-300 mt-2">{errors.name?.message}</div>
          {/* ToDo */}
          <li className="flex flex-col gap-1 md:items-center md:gap-4 md:flex-row">
            <label className="w-40">todo :</label>
            <textarea
              {...register("todo")}
              id="todo"
              //name="todo"
              maxLength={100}
              //value={editTodo.todo || undefined}
              //required
              // onChange={(e) =>
              //   setEditTodo({
              //     ...editTodo,
              //     todo: e.target.value,
              //   })
              // }
              className="input rounded-sm  p-1 text-lg text-wrap md:mx-5"
            />
          </li>
          <div className="text-red-300 mt-2">{errors.todo?.message}</div>
          {/* TimeLimit */}
          <li className="flex flex-col gap-1 md:items-center md:gap-4 md:flex-row">
            <label className="w-40">Time Limit :</label>
            <input
              //{...register("deadline")}
              type="date"
              name="deadline"
              value={timeLimit}
              onChange={(e) => {
                console.log(new Date(e.target.value));
                setTimeLimit(e.target.value);
                limitTimeChange(e);
              }}
              // name="deadline"
              // value={deadline}
              // onChange={(e) =>
              //   setEditTodo({ ...editTodo, deadline: new Date(e.target.value) })
              // }
              // placeholder="explanation"
              className="rounded-sm border-2 p-1 text-lg textarea md:mx-5"
            />
          </li>
        </ul>
        <div className="text-red-300 mt-2">{errors.deadline?.message}</div>
        <div className="modal-action flex justify-center gap-2">
          <div className="flex justify-center gap-2">
            <button
              type="submit"
              className="btn btn-outline btn-success md:btn-wide"
              // onClick={async () => {
              //   const oneUser = await fetchUserDatasById(getValues("userid"));
              //   console.log(oneUser);
              //   const newTodo: Todo = {
              //     ...editTodo,
              //     name: oneUser[0].name,
              //     icon: oneUser[0].icon,
              //   };
              //   console.log(getValues());
              //   onSave(getValues());
              // }}
            >
              <ListPlus />
              OK
            </button>
            <button
              type="button"
              onClick={() => {
                console.log(getValues());
                (
                  document.getElementById(
                    "TodoListEditDialog"
                  ) as HTMLDialogElement
                ).close();
              }}
              className="btn md:btn-wide"
            >
              Close
            </button>
          </div>
        </div>
      </form>
    </dialog>
  );
};
