"use client";
import React, { useState, useEffect } from "react";
import { Todo } from "@/app/types/type";
import { compareDeadline, todoBgColor } from "@/app/lib/utils";
import { Player } from "@lottiefiles/react-lottie-player";

export interface TopTodoMessageProps {
  todoDataList: Todo[];
}

export const TopTodoMessage: React.FC<TopTodoMessageProps> = ({
  todoDataList,
}) => {
  const [userId, setUserId] = useState<string>("0");

  // セッションストレージからユーザーIDを取得して状態を更新する関数
  const updateHeaderInfo = () => {
    const storedId = sessionStorage.getItem("staffId") || "0";
    setUserId(storedId);
  };

  //再ログイン時にuserIdの値を更新する
  useEffect(() => {
    updateHeaderInfo();
    const handler = () => updateHeaderInfo();
    window.addEventListener("headerUpdate", handler);
    return () => {
      window.removeEventListener("headerUpdate", handler);
    };
  }, []);

  return (
    <>
      <div className="flex items-center gap-1 border-b-2 border-gray-300 pb-2 mb-4">
        <Player
          autoplay
          loop
          src="/lottie/PcCat.json"
          style={{ height: "300px", width: "300px" }}
        />
        <div>
          {(() => {
            const filteredTodos = todoDataList.filter(
              (todo: Todo) =>
                todo.id === userId && compareDeadline(todo.deadline) === 1
            );
            if (filteredTodos.length === 0) {
              return (
                <div className="text-gray-500 font-bold">NO TODO</div>
              );
            }
            return filteredTodos.map((todo: Todo, idx: number) => (
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
            ));
          })()}
        </div>
      </div>
    </>
  );
};
