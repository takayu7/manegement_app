import React from "react";
import { fetchTodo } from "@/app/lib/api";
import { SelectStaffIcon } from "@/app/lib/utils";
import Image from "next/image";
import { Todo } from "@/app/types/type";
import {compareDeadline , todoBgColor} from "@/app/lib/utils";

type TopTodoMessageProps = {
  staffIcon: string;
  staffId: string;
};

export default async function TopTodoMessage({ staffIcon, staffId }: TopTodoMessageProps) {
  const todoDataList : Todo[] = await fetchTodo();
  const today = new Date();

  console.log(today)

  return (
    <>
        <div className="flex items-center gap-1 border-b-2 border-gray-300 pb-2 mb-4">
          <Image
            src={`${SelectStaffIcon(staffIcon)}`}
            alt="スタッフ写真"
            width={50}
            height={50}
            className="rounded-lg shadow-md"
          />
          {todoDataList.length > 0 ? (
            todoDataList.map((todo: Todo, idx: number) => (
              <div className="chat chat-start" key={idx}>
                {todo.id === staffId && compareDeadline(todo.deadline) === 1 && (
                  <div className={`chat-bubble ${todoBgColor(todo.deadline, todo.checked)}`}>
                    {todo.todo}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="chat chat-start">
              <div className="chat-bubble">
                No tasks for today.
              </div>
            </div>
          )}
        </div>
    </>
  );
}
