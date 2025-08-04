"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Todo } from "@/app/types/type";
import { compareDeadline, todoBgColor } from "@/app/lib/utils";
import { Player } from "@lottiefiles/react-lottie-player";

export const TopTodoMessage = () => {
  const [userId, setUserId] = useState<string>("0");
  const [todoDataList, setTodoDataList] = useState<Todo[]>([]);

  //TODO情報の取得
async function fetchTodo() {
  const data = await fetch("/api/todo");
  const todos = await data.json();
  // deadlineをDate型に変換
  const todosWithDate = todos.map((todo: Todo) => ({
    ...todo,
    deadline: todo.deadline ? new Date(todo.deadline) : null,
  }));
  setTodoDataList(todosWithDate);
  console.log(todosWithDate);
}

  useEffect(() => {
    fetchTodo();
  }, []);

  // セッションストレージからユーザーIDを取得して状態を更新する関数
  const updateHeaderInfo = useCallback(() => {
    const storedId = sessionStorage.getItem("staffId") || "0";
    setUserId(storedId);
  }, []);

  //再ログイン時にuserIdの値を更新する
  useEffect(() => {
    updateHeaderInfo();
    const handler = () => updateHeaderInfo();
    window.addEventListener("headerUpdate", handler);
    return () => {
      window.removeEventListener("headerUpdate", handler);
    };
  }, [updateHeaderInfo]);

  const newTodoList = useMemo(() => {
    return todoDataList.filter(
      (todo: Todo) =>
        todo.userid === userId && compareDeadline(todo.deadline) === 1
    );
  }, [userId, todoDataList]);

  return (
    <>
      <div className="flex items-center flex-col gap-1 pb-2 mb-4 lg:flex-row">
        <Player
          autoplay
          loop
          src="/lottie/PcCat.json"
          style={{ height: "250px", width: "250px" }}
        />
        <div>
          {newTodoList.length === 0 ? (
            <div className="text-gray-500 font-bold">NO TODO</div>
          ) : (
            newTodoList.map((todo: Todo, idx: number) => (
              <div className="chat chat-start" key={idx}>
                <div
                  className={`chat-bubble min-w-fit max-w-xs break-words shadow ${todoBgColor(
                    todo.deadline,
                    todo.checked
                  )}`}
                >
                  {todo.todo}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};
