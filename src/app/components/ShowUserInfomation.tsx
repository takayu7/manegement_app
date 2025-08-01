"use client";
import React, { useState, useEffect } from "react";
import { User } from "@/app/types/type";
import { Trash2 } from "lucide-react";

export interface RegisterUserProps {
  onSave: (user: User) => void;
}

export function ShowUserInfomation() {
  const [userData, setUserData] = useState<User[]>([]);
  //ユーザー情報の取得
  async function fetchUserData() {
    const data = await fetch("/api/users");
    const users = await data.json();
    setUserData(users);
    console.log(users);
  }

  //ユーザー情報を削除する処理
  const handleDelete = async (userId: string) => {
    const response = await fetch("/api/deleteUser", {
      method: "POST",
      headers: {
        "Context-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });
    fetchUserData();
    const result = await response.json();
    if (result.success) {
      alert("Deletion successful！");
    } else {
      alert("Delete failed...");
    }
  };

  //ユーザー情報を削除するかどうかの確認をする処理
  const showDeleteConfirmation = async (userId: string) => {
    const approval = confirm("Do you want to delete the user?");
    if (approval) {
      handleDelete(userId);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <>
      <ul className="p-7 mt-10 md:mt-0 md:ml-30 flex flex-col text-black gap-3 bg-[#FAFAFA] rounded-[16px] ">
        {userData.map((data, index) => (
          <li key={index}>
            <div className="flex flex-row justify-between">
              ID：{data.id}　name：{data.name}
              <Trash2 onClick={() => showDeleteConfirmation(data.id)} />
            </div>
            <hr className="border-gray-400" />
          </li>
        ))}
      </ul>
    </>
  );
}
