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
      {userData.length != 0 ? (
        <ul className="table p-7 mt-10 lg:mt-0 lg:ml-30 flex flex-col text-black gap-3 bg-[#FAFAFA] rounded-[16px] ">
          {userData.map((data, index) => (
            <li key={index}>
              <div className="flex flex-row justify-between">
                <div>
                  <div>＜ID：{data.id}＞</div>
                  <div>{data.name}</div>
                </div>
                <Trash2
                  className="mt-2 ml-1"
                  onClick={() => showDeleteConfirmation(data.id)}
                />
              </div>
              <hr className="border-gray-400 mb-3" />
            </li>
          ))}
        </ul>
      ) : (
        <ul className="table h-10 p-7 pt-2 lg:ml-30 text-black gap-3 bg-[#FAFAFA] rounded-[16px] ">
          <li className="text-center mb-[-100px] md:mt-5 md:mb-0">
            No Data...
          </li>
        </ul>
      )}
    </>
  );
}
